import json
import uuid
from app.catalog import WORLDS

from app.agents.adaptive_agent import adaptive_agent
from app.agents.feedback_agent import feedback_agent
from app.characters import result_card
from app.execution_router import ExecutionRouter
from app.sandbox_execution import INFRASTRUCTURE_FAILURES
from app.mastery import LevelCompletionService, MasteryPolicy, evidence_for, next_topic
from app.models import GeneratedQuestion
from app.rewards import QUESTION_COINS, transact
from app.scoring import EvaluationAgent, ScoreAgent, SuggestionAgent
from app.validation import required_concepts


class CheckAnswerService:
    """Authoritative backend pipeline for checking answers and persisting results."""

    def __init__(self, store, score_agent=None, mastery_policy=None, reward_engine=None, level_completion_service=None):
        self.store = store
        self.score_agent = score_agent or ScoreAgent()
        self.mastery_policy = mastery_policy or MasteryPolicy()
        self.reward_engine = reward_engine
        self.level_completion_service = level_completion_service or LevelCompletionService()
        self.suggestion_agent = SuggestionAgent()

    def check_answer(self, identity, session_id, question_id, code, operation=None, *, run=False, inputs=None):
        row = self.store.session(identity, session_id)
        question = GeneratedQuestion.model_validate_json(row['question'])
        if question.generation_source != 'generated':
            raise ValueError('Legacy quest archived. Generate a fresh quest for this topic.')
        if question.question_id != question_id:
            raise ValueError('Question changed. Reload the session.')

        fixtures = [fixture.model_dump() for fixture in question.test_cases]
        if run:
            fixtures = [dict(inputs=list(inputs) if inputs is not None else question.test_cases[0].inputs, expected=question.test_cases[0].expected)]

        execution = ExecutionRouter().execute(question, code, fixtures)
        if run or execution.get('status') in INFRASTRUCTURE_FAILURES or execution.get('infrastructure_failure'):
            return execution

        required = required_concepts(question)
        evaluation = EvaluationAgent.evaluate(code, fixtures, requirement={
            'must_use_input': 'input' in required,
            'must_use_for': 'for' in required,
            'must_use_while': 'while' in required,
            'must_use_if': 'if' in required,
            'must_use_print': 'print' in required,
        } if required else None, execution=execution)
        correct = bool(evaluation['correct']) and required <= set(execution.get('concepts', []))
        attempt_id = operation or uuid.uuid4().hex

        with self.store.db() as db:
            cached = db.execute('SELECT result,session,question FROM attempts WHERE id=? AND learner=?', (attempt_id, identity)).fetchone()
            if cached:
                if cached['session'] != session_id or cached['question'] != question_id:
                    raise ValueError('Operation belongs to another question. Please retry with a new operation.')
                return json.loads(cached[0])

            active = db.execute('SELECT question,hints,revealed FROM sessions WHERE id=? AND learner=?', (session_id, identity)).fetchone()
            if not active or json.loads(active['question'])['question_id'] != question_id:
                raise ValueError('Stale question.')

            old_mastery = db.execute('SELECT value FROM mastery WHERE learner=? AND topic=?', (identity, row['topic'])).fetchone()
            mastery_before = float(old_mastery[0]) if old_mastery else 0.0
            rewarded = db.execute('SELECT 1 FROM rewards WHERE learner=? AND question=?', (identity, question_id)).fetchone()
            attempt_count = db.execute('SELECT COUNT(*) FROM attempts WHERE learner=? AND question=?', (identity, question_id)).fetchone()[0] + 1

            eligible = bool(correct and not rewarded and not active['revealed'])
            points = (100 if attempt_count == 1 else 75 if attempt_count == 2 else 50) if eligible else 0
            mastery_after = mastery_before
            if eligible:
                mastery_after = min(1.0, mastery_before + (0.15 / attempt_count) * (0.7 if active['hints'] else 1))
            else:
                mastery_after = mastery_before

            result = execution | dict(
                correct=bool(correct),
                marks_awarded=points,
                marks_possible=100,
                xp_awarded=points,
                coins_awarded=QUESTION_COINS.get(question.difficulty, 0) if eligible else 0,
                previous_mastery=mastery_before,
                new_mastery=mastery_after,
                message=feedback_agent(correct, execution),
            )

            detail = dict(
                quest_id=question_id,
                world_id=question.world_id,
                subtopic_id=question.subtopic_id,
                difficulty=question.difficulty,
                student_code=code,
                correct=bool(correct),
                tests_passed=sum(1 for output, fixture in zip(execution.get('outputs', []), fixtures) if output == fixture.get('expected')),
                tests_total=len(fixtures),
                attempt_number=attempt_count,
                hints_used=active['hints'],
                solution_used=bool(active['revealed']),
                mastery_before=mastery_before,
                mastery_after=mastery_after,
            )

            assessment = self.score_agent.evaluate(
                correct=correct,
                passed=detail['tests_passed'],
                total=detail['tests_total'],
                attempt=attempt_count,
                hints=active['hints'],
                revealed=bool(active['revealed']),
                compliant=required <= set(execution.get('concepts', [])),
            )
            result.update(assessment)

            settings = json.loads(db.execute('SELECT settings FROM learners WHERE id=?', (identity,)).fetchone()[0] or '{}')
            result['character_result_card'] = result_card(
                settings.get('selected_character') or settings.get('companion'), result['result_tier']
            )
            result['suggestion'] = self.suggestion_agent.suggest(code, correct)
            detail.update(assessment)
            detail.update(stdout=execution.get('outputs', []), execution_status=execution['status'], xp_awarded=points, coins_awarded=result['coins_awarded'])

            db.execute('INSERT INTO attempt_evidence VALUES(?,?)', (attempt_id, json.dumps(detail)))
            if not rewarded:
                db.execute('INSERT OR REPLACE INTO quest_evidence VALUES(?,?,?,?)',
                           (identity, question_id, row['topic'], json.dumps(detail)))

            policy = self.mastery_policy.evaluate(mastery_after, evidence_for(db, identity, row['topic']))
            result.update(policy)
            result['tests_passed'] = detail['tests_passed']
            result['tests_total'] = detail['tests_total']
            result['outputs'] = execution.get('outputs', [])[:1]
            result['recommended_next_action'] = 'next_topic' if policy['topic_mastered'] else 'continue_current_topic'
            result['next_subtopic_id'] = next_topic(row['topic']) if policy['topic_mastered'] else None
            result['adaptive_action'] = adaptive_agent(dict(
                world_id=question.world_id,
                subtopic_id=question.subtopic_id,
                mastery_score=mastery_after,
                recent_attempts=evidence_for(db, identity, row['topic']),
            ))['next_action']
            result['events'] = []
            if eligible:
                result['events'].append(transact(db, identity, question_id, 'QUESTION_REWARD', result['coins_awarded'],
                    'reward:' + identity + ':' + question_id, 'First independent correct completion'))

            db.execute('INSERT INTO attempts(id,learner,session,question,topic,correct,result) VALUES(?,?,?,?,?,?,?)',
                       (attempt_id, identity, session_id, question_id, row['topic'], int(correct), json.dumps(result)))
            db.execute('INSERT OR REPLACE INTO mastery VALUES(?,?,?)', (identity, row['topic'], mastery_after))
            if eligible:
                db.execute('INSERT INTO rewards VALUES(?,?,?,?)', (identity, question_id, points, result['coins_awarded']))

            mastery_by_topic = {row['topic']: float(row['value']) for row in db.execute('SELECT topic, value FROM mastery WHERE learner=?', (identity,))}
            world_completion = self.level_completion_service.evaluate(
                identity,
                question.world_id,
                mastery_by_topic,
                settings.get('selected_character') or settings.get('companion') or 'byte',
            )
            result['world_completion'] = {
                'completed': world_completion.completed,
                'final_score': world_completion.final_score,
                'result_tier': world_completion.result_tier,
                'topics_mastered': world_completion.topics_mastered,
                'topics_total': world_completion.topics_total,
                'xp_gained': world_completion.xp_gained,
                'coins_gained': world_completion.coins_gained,
            }
            if world_completion.completed:
                # Stable identity, including databases with historical tier-only records.
                result['world_completion']['completion_id'] = str(uuid.uuid5(uuid.NAMESPACE_URL, identity + ':' + question.world_id))
            world = next(w for w in WORLDS if w['id'] == question.world_id)
            index = WORLDS.index(world)
            totals = db.execute('''SELECT COALESCE(SUM(points),0),COALESCE(SUM(coins),0)
                FROM rewards r WHERE r.learner=? AND EXISTS
                (SELECT 1 FROM attempts a WHERE a.learner=r.learner AND a.question=r.question
                 AND a.topic IN (%s))''' % ','.join('?' for _ in world['topics']),
                [identity] + [t['id'] for t in world['topics']]).fetchone()
            # Display already credited rewards; never award the service's projected bonus.
            result['world_completion'].update(
                world_id=world['id'], world_name=world['name'],
                next_world_id=WORLDS[index+1]['id'] if index+1 < len(WORLDS) else None,
                xp_gained=totals[0], coins_gained=totals[1],
                mastery={t['id']: mastery_by_topic.get(t['id'], 0) for t in world['topics']})
            if world_completion.completed:
                db.execute('INSERT OR IGNORE INTO level_completions(learner,world,result) VALUES(?,?,?)',
                           (identity, question.world_id, json.dumps(result['world_completion'])))
            result['xp_total'] = db.execute('SELECT COALESCE(SUM(points),0) FROM rewards WHERE learner=?', (identity,)).fetchone()[0]
            # Replay must include the same authoritative completion envelope.
            db.execute('UPDATE attempts SET result=? WHERE id=?', (json.dumps(result), attempt_id))

        return result
