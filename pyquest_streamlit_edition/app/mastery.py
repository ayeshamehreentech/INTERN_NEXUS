"""Deterministic, configurable multi-quest mastery policy."""
from dataclasses import dataclass
import json
import uuid

from app.characters import normalize_character


@dataclass(frozen=True)
class MasteryPolicy:
    threshold: float = .85
    minimum_independent: int = 6
    recent_window: int = 5
    minimum_recent_rate: float = .8

    def evaluate(self, score, evidence):
        # One row per fresh quest: repeated checks do not create new evidence.
        independent=[e for e in evidence if e['correct'] and not e['hints_used'] and not e['solution_used']]
        recent=evidence[:self.recent_window]
        rate=sum(bool(e['correct']) for e in recent)/len(recent) if recent else 0
        transfer=any(e['difficulty'] in ('normal','hard') for e in independent)
        mastered=(score>=self.threshold and len(independent)>=self.minimum_independent
                  and rate>=self.minimum_recent_rate and transfer
                  and bool(recent) and recent[0]['correct'])
        status=('MASTERED' if mastered else 'PROFICIENT' if score>=.6 else
                'PRACTICING' if score>0 else 'LEARNING' if evidence else 'NOT_STARTED')
        return dict(topic_status=status,topic_mastered=bool(mastered),
                    independent_successes=len(independent),recent_success_rate=rate)


@dataclass(frozen=True)
class LevelCompletionResult:
    learner_id: str
    world_id: str
    completed: bool
    final_score: int
    result_tier: str
    topics_mastered: int
    topics_total: int
    xp_gained: int
    coins_gained: int
    selected_character: str = 'byte'
    character_expression: str = 'celebrating'
    result_card_asset: str = 'excellent'
    message: str = ''
    completion_id: str = ''


class LevelCompletionService:
    """Evaluate world completion using canonical topic mastery evidence."""

    def __init__(self, threshold: float = 0.85):
        self.threshold = threshold

    def evaluate(self, learner_id: str, world_id: str, mastery_by_topic: dict, character: str = 'byte') -> LevelCompletionResult:
        from app.catalog import WORLDS

        world = next((w for w in WORLDS if w['id'] == world_id), None)
        if world is None:
            raise ValueError(f'Unknown world: {world_id}')

        topics = [t['id'] for t in world['topics']]
        topics_total = len(topics)
        topics_mastered = sum(1 for topic_id in topics if float(mastery_by_topic.get(topic_id, 0) or 0) >= self.threshold)
        completed = topics_total > 0 and topics_mastered == topics_total
        final_score = 100 if completed else max(0, min(99, int(round((topics_mastered / topics_total) * 100))) if topics_total else 0)

        if final_score >= 90:
            tier = 'EXCELLENT'
            expression = 'celebrating'
            message = 'Perfect score! You mastered this level!'
        elif final_score >= 70:
            tier = 'GREAT'
            expression = 'happy'
            message = 'Nice effort! Keep practicing, you can do it!'
        elif final_score >= 45:
            tier = 'GOOD_TRY'
            expression = 'motivating'
            message = 'You are making progress. Keep going!'
        else:
            tier = 'TRY_AGAIN'
            expression = 'thinking'
            message = 'Mistakes help you learn. You can try again!'

        character = normalize_character(character)
        completion_id = uuid.uuid4().hex
        result = LevelCompletionResult(
            learner_id=learner_id,
            world_id=world_id,
            completed=completed,
            final_score=final_score,
            result_tier=tier,
            topics_mastered=topics_mastered,
            topics_total=topics_total,
            xp_gained=final_score if completed else 0,
            coins_gained=5 if completed else 0,
            selected_character=character,
            character_expression=expression,
            result_card_asset=f'{character.lower()}_{tier.lower()}',
            message=message,
            completion_id=completion_id,
        )
        return result


class MasteryEngine:
    """Deterministic mastery progression from persisted evidence."""
    def __init__(self, policy=None):
        self.policy = policy or MasteryPolicy()

    def evaluate(self, learner_id, topic, mastery_value, evidence, *, world_id=None):
        policy_result = self.policy.evaluate(mastery_value, evidence)
        return {
            'learner_id': learner_id,
            'topic': topic,
            'world_id': world_id,
            'mastery_value': mastery_value,
            'topic_status': policy_result['topic_status'],
            'topic_mastered': policy_result['topic_mastered'],
            'independent_successes': policy_result['independent_successes'],
            'recent_success_rate': policy_result['recent_success_rate'],
            'evidence_count': len(evidence),
            'eligible_for_level_completion': bool(policy_result['topic_mastered']),
        }


def evidence_for(db,learner,topic):
    return [json.loads(r[0]) for r in db.execute(
        'SELECT evidence FROM quest_evidence WHERE learner=? AND topic=? ORDER BY rowid DESC',
        (learner,topic))]


def next_topic(topic):
    from app.catalog import WORLDS
    sequence=[t['id'] for w in WORLDS for t in w['topics']]
    index=sequence.index(topic)
    return sequence[index+1] if index+1<len(sequence) else None
