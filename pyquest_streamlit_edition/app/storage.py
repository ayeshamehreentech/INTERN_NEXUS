import json
import sqlite3
import uuid
from contextlib import contextmanager
from pathlib import Path

from app.characters import normalize_character

DEFAULT_SETTINGS = {
    'selected_character': 'byte',
    'companion': 'byte',
    'music_enabled': False,
    'music_volume': 0.15,
    'sound_effects_enabled': True,
    'sound_effect_volume': 0.2,
    'reduced_motion': False,
    'character_outfits': {},
}


class Store:
    def __init__(self, path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.db() as db:
            db.executescript("""
            PRAGMA foreign_keys = ON;
            CREATE TABLE IF NOT EXISTS learners(id TEXT PRIMARY KEY, settings TEXT NOT NULL DEFAULT '{}');
            CREATE TABLE IF NOT EXISTS concept_progress(
                learner TEXT NOT NULL REFERENCES learners(id), topic TEXT NOT NULL,
                version INTEGER NOT NULL, completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY(learner, topic));
            CREATE TABLE IF NOT EXISTS user_preferences(
                learner_id TEXT PRIMARY KEY,
                selected_character TEXT NOT NULL DEFAULT 'byte',
                music_enabled INTEGER NOT NULL DEFAULT 0,
                music_volume REAL NOT NULL DEFAULT .15,
                sound_effects_enabled INTEGER NOT NULL DEFAULT 1,
                sound_effect_volume REAL NOT NULL DEFAULT .2,
                reduced_motion INTEGER NOT NULL DEFAULT 0,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(learner_id) REFERENCES learners(id)
            );
            CREATE TABLE IF NOT EXISTS learner_progress(
                learner_id TEXT PRIMARY KEY,
                total_attempts INTEGER NOT NULL DEFAULT 0,
                correct_attempts INTEGER NOT NULL DEFAULT 0,
                xp INTEGER NOT NULL DEFAULT 0,
                coins INTEGER NOT NULL DEFAULT 0,
                current_streak INTEGER NOT NULL DEFAULT 0,
                topics_practiced INTEGER NOT NULL DEFAULT 0,
                worlds_practiced INTEGER NOT NULL DEFAULT 0,
                last_activity TEXT,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(learner_id) REFERENCES learners(id)
            );
            CREATE TABLE IF NOT EXISTS topic_progress(
                id TEXT PRIMARY KEY,
                learner_id TEXT NOT NULL,
                world_id TEXT NOT NULL,
                subtopic_id TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'NOT_STARTED',
                mastery_score REAL NOT NULL DEFAULT 0,
                attempts INTEGER NOT NULL DEFAULT 0,
                correct_attempts INTEGER NOT NULL DEFAULT 0,
                independent_successes INTEGER NOT NULL DEFAULT 0,
                recent_accuracy REAL NOT NULL DEFAULT 0,
                highest_difficulty_completed TEXT,
                hints_used INTEGER NOT NULL DEFAULT 0,
                solutions_revealed INTEGER NOT NULL DEFAULT 0,
                last_practiced_at TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(learner_id) REFERENCES learners(id)
            );
            CREATE TABLE IF NOT EXISTS world_progress(
                id TEXT PRIMARY KEY,
                learner_id TEXT NOT NULL,
                world_id TEXT NOT NULL,
                topics_started INTEGER NOT NULL DEFAULT 0,
                topics_mastered INTEGER NOT NULL DEFAULT 0,
                world_mastery_percentage REAL NOT NULL DEFAULT 0,
                status TEXT NOT NULL DEFAULT 'NOT_STARTED',
                last_practiced_at TEXT,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(learner_id) REFERENCES learners(id)
            );
            CREATE TABLE IF NOT EXISTS story_sessions(
                id TEXT PRIMARY KEY,
                story_id TEXT NOT NULL,
                learner_id TEXT NOT NULL,
                world_id TEXT,
                active_character TEXT,
                story_title TEXT,
                setting TEXT,
                goal TEXT,
                story_summary TEXT,
                continuity_summary TEXT,
                current_stage TEXT,
                status TEXT NOT NULL DEFAULT 'ACTIVE',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(learner_id) REFERENCES learners(id)
            );
            CREATE TABLE IF NOT EXISTS generated_quests(
                id TEXT PRIMARY KEY,
                learner_id TEXT NOT NULL,
                world_id TEXT NOT NULL,
                subtopic_id TEXT NOT NULL,
                quest_json TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(learner_id) REFERENCES learners(id)
            );
            CREATE TABLE IF NOT EXISTS active_quests(
                id TEXT PRIMARY KEY,
                learner_id TEXT NOT NULL,
                world_id TEXT NOT NULL,
                subtopic_id TEXT NOT NULL,
                quest_id TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'ACTIVE',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(learner_id) REFERENCES learners(id)
            );
            CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY, learner TEXT NOT NULL, topic TEXT NOT NULL, question TEXT NOT NULL, draft TEXT NOT NULL DEFAULT '', hints INTEGER NOT NULL DEFAULT 0, revealed INTEGER NOT NULL DEFAULT 0);
            CREATE TABLE IF NOT EXISTS attempts(id TEXT PRIMARY KEY, learner TEXT NOT NULL, session TEXT NOT NULL, question TEXT NOT NULL, topic TEXT NOT NULL, correct INTEGER NOT NULL, result TEXT NOT NULL, created TEXT DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS rewards(learner TEXT NOT NULL, question TEXT NOT NULL, points INTEGER NOT NULL, coins INTEGER NOT NULL, PRIMARY KEY(learner,question));
            CREATE TABLE IF NOT EXISTS mastery(learner TEXT NOT NULL, topic TEXT NOT NULL, value REAL NOT NULL, PRIMARY KEY(learner,topic));
            CREATE TABLE IF NOT EXISTS purchases(learner TEXT NOT NULL, question TEXT NOT NULL, PRIMARY KEY(learner,question));
            CREATE TABLE IF NOT EXISTS history(learner TEXT NOT NULL, topic TEXT NOT NULL, question TEXT NOT NULL, created TEXT DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS quest_evidence(learner TEXT NOT NULL, question TEXT NOT NULL, topic TEXT NOT NULL, evidence TEXT NOT NULL, PRIMARY KEY(learner,question));
            CREATE TABLE IF NOT EXISTS question_fingerprints(
                id TEXT PRIMARY KEY,
                learner_id TEXT NOT NULL,
                quest_id TEXT NOT NULL,
                world_id TEXT NOT NULL,
                subtopic_id TEXT NOT NULL,
                fingerprint TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(learner_id) REFERENCES learners(id)
            );
            CREATE TABLE IF NOT EXISTS attempt_evidence(attempt TEXT PRIMARY KEY, evidence TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS schema_migrations(version INTEGER PRIMARY KEY);
            CREATE TABLE IF NOT EXISTS reward_transactions(transaction_id TEXT PRIMARY KEY,learner_id TEXT NOT NULL,quest_id TEXT NOT NULL,type TEXT NOT NULL,amount INTEGER NOT NULL,balance_before INTEGER NOT NULL,balance_after INTEGER NOT NULL,reason TEXT NOT NULL,created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS ui_events(event_id TEXT PRIMARY KEY,learner TEXT NOT NULL,event TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS hint_history(id INTEGER PRIMARY KEY,learner TEXT NOT NULL,quest TEXT NOT NULL,number INTEGER NOT NULL,text TEXT NOT NULL,created TEXT DEFAULT CURRENT_TIMESTAMP);
            CREATE TABLE IF NOT EXISTS solution_purchases(
                learner_id TEXT NOT NULL,
                question_id TEXT NOT NULL,
                amount INTEGER NOT NULL DEFAULT 0,
                purchased_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY(learner_id, question_id),
                FOREIGN KEY(learner_id) REFERENCES learners(id)
            );
            CREATE TABLE IF NOT EXISTS level_completions(learner TEXT NOT NULL,world TEXT NOT NULL,result TEXT NOT NULL,created TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(learner,world));
            CREATE INDEX IF NOT EXISTS idx_learners_selected_char ON learners(id);
            CREATE INDEX IF NOT EXISTS idx_sessions_learner_topic ON sessions(learner, topic);
            CREATE INDEX IF NOT EXISTS idx_attempts_learner_question ON attempts(learner, question);
            CREATE INDEX IF NOT EXISTS idx_history_learner_topic ON history(learner, topic);
            CREATE INDEX IF NOT EXISTS idx_quest_evidence_learner_topic ON quest_evidence(learner, topic);
            CREATE INDEX IF NOT EXISTS idx_reward_transactions_learner ON reward_transactions(learner_id);
            CREATE INDEX IF NOT EXISTS idx_topic_progress_learner_world ON topic_progress(learner_id, world_id);
            CREATE INDEX IF NOT EXISTS idx_world_progress_learner_world ON world_progress(learner_id, world_id);
            CREATE INDEX IF NOT EXISTS idx_story_sessions_learner ON story_sessions(learner_id);
            CREATE INDEX IF NOT EXISTS idx_active_quests_learner ON active_quests(learner_id);
            CREATE INDEX IF NOT EXISTS idx_question_fingerprints_learner ON question_fingerprints(learner_id, quest_id);
            """)
            db.execute('BEGIN IMMEDIATE')
            if not db.execute('SELECT 1 FROM schema_migrations WHERE version=1').fetchone():
                from app.rewards import transact
                for r in db.execute('SELECT * FROM rewards').fetchall():
                    transact(db, r['learner'], r['question'], 'MIGRATED_REWARD', r['coins'], 'legacy-reward:' + r['learner'] + ':' + r['question'], 'Imported pre-ledger reward')
                for r in db.execute('SELECT * FROM purchases').fetchall():
                    transact(db, r['learner'], r['question'], 'MIGRATED_PURCHASE', -1, 'legacy-purchase:' + r['learner'] + ':' + r['question'], 'Imported historical one-coin purchase')
                db.execute('INSERT INTO schema_migrations VALUES(1)')
            if not db.execute('SELECT 1 FROM schema_migrations WHERE version=2').fetchone():
                db.execute('INSERT INTO schema_migrations VALUES(2)')
    @contextmanager
    def db(self):
        db = sqlite3.connect(self.path, timeout=20)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA foreign_keys = ON')
        try:
            db.execute('BEGIN IMMEDIATE')
            yield db
            db.commit()
        except Exception:
            db.rollback(); raise
        finally:
            db.close()

    def learner(self, identity):
        with self.db() as db:
            db.execute('INSERT OR IGNORE INTO learners(id,settings) VALUES(?,?)',
                       (identity, json.dumps(DEFAULT_SETTINGS)))
            row = db.execute('SELECT settings FROM learners WHERE id=?', (identity,)).fetchone()
            stored = json.loads(row[0] or '{}')
            settings = DEFAULT_SETTINGS | stored
            selected = normalize_character(stored.get('selected_character') or stored.get('companion'))
            settings['selected_character'] = selected
            settings['companion'] = selected
            db.execute('UPDATE learners SET settings=? WHERE id=?', (json.dumps(settings), identity))
            db.execute("""INSERT INTO user_preferences
                (learner_id,selected_character,music_enabled,music_volume,sound_effects_enabled,
                 sound_effect_volume,reduced_motion)
                VALUES(?,?,?,?,?,?,?)
                ON CONFLICT(learner_id) DO UPDATE SET
                selected_character=excluded.selected_character,
                music_enabled=excluded.music_enabled,
                music_volume=excluded.music_volume,
                sound_effects_enabled=excluded.sound_effects_enabled,
                sound_effect_volume=excluded.sound_effect_volume,
                reduced_motion=excluded.reduced_motion,
                updated_at=CURRENT_TIMESTAMP""",
                (identity, selected, int(settings['music_enabled']), settings['music_volume'],
                 int(settings['sound_effects_enabled']), settings['sound_effect_volume'],
                 int(settings['reduced_motion'])))
            db.execute("""INSERT INTO learner_progress(learner_id,total_attempts,correct_attempts,xp,coins,current_streak,topics_practiced,worlds_practiced,last_activity)
                VALUES(?,?,?,?,?,?,?,?,?)
                ON CONFLICT(learner_id) DO NOTHING""",
                (identity, 0, 0, 0, 0, 0, 0, 0, None))

    def session(self, identity, sid):
        with self.db() as db:
            row = db.execute('SELECT * FROM sessions WHERE id=? AND learner=?', (sid, identity)).fetchone()
        if not row:
            raise ValueError('Learning session not found.')
        return dict(row)

    def concept(self, identity, topic, complete=False):
        from app.concepts import LESSONS
        if topic not in LESSONS:
            raise ValueError('Unknown topic.')
        lesson = LESSONS[topic]
        with self.db() as db:
            if complete:
                db.execute('INSERT INTO concept_progress(learner,topic,version) VALUES(?,?,?) ON CONFLICT(learner,topic) DO UPDATE SET version=excluded.version',
                           (identity, topic, lesson['version']))
            row = db.execute('SELECT version FROM concept_progress WHERE learner=? AND topic=?', (identity, topic)).fetchone()
            active = db.execute('SELECT id,question FROM sessions WHERE learner=? AND topic=? ORDER BY rowid DESC LIMIT 1', (identity, topic)).fetchone()
        sid = active['id'] if active and json.loads(active['question']).get('generation_source') == 'generated' else None
        return dict(lesson=lesson, completed=bool(row and row['version'] == lesson['version']), session_id=sid)

    def progress(self, identity):
        from app.catalog import WORLDS, TOPICS
        from app.mastery import MasteryPolicy, evidence_for
        with self.db() as db:
            rows = db.execute('SELECT * FROM attempts WHERE learner=? ORDER BY rowid DESC', (identity,)).fetchall()
            mastery = {r['topic']: r['value'] for r in db.execute('SELECT * FROM mastery WHERE learner=?', (identity,))}
            score, coins = db.execute('SELECT COALESCE(SUM(points),0),COALESCE(SUM(coins),0) FROM rewards WHERE learner=?', (identity,)).fetchone()
            from app.rewards import balance
            coins = balance(db, identity)
            stored = json.loads(db.execute('SELECT settings FROM learners WHERE id=?', (identity,)).fetchone()[0] or '{}')
            settings = DEFAULT_SETTINGS | stored
            settings['selected_character'] = normalize_character(stored.get('selected_character') or stored.get('companion'))
            settings['companion'] = settings['selected_character']
            statuses = {topic: MasteryPolicy().evaluate(mastery.get(topic, 0), evidence_for(db, identity, topic)) for topic in TOPICS}
        return dict(attempts=len(rows), correct=len({r['question'] for r in rows if r['correct']}), score=score, xp=score,
                    topic_statuses=statuses,
                    coins=coins, topics_practiced=len({r['topic'] for r in rows}), mastery=mastery,
                    overall=sum(mastery.get(t, 0) for t in TOPICS)/len(TOPICS), settings=settings,
                    worlds={w['id']: sum(mastery.get(t['id'], 0) for t in w['topics'])/len(w['topics']) for w in WORLDS},
                    recent=[dict(topic=r['topic'], correct=bool(r['correct']), date=r['created']) for r in rows[:5]])

    def upsert_learner_progress(self, learner_id, **values):
        with self.db() as db:
            row = db.execute('SELECT * FROM learner_progress WHERE learner_id=?', (learner_id,)).fetchone()
            if row is None:
                db.execute('INSERT INTO learner_progress(learner_id,total_attempts,correct_attempts,xp,coins,current_streak,topics_practiced,worlds_practiced,last_activity) VALUES(?,?,?,?,?,?,?,?,?)',
                           (learner_id, values.get('total_attempts', 0), values.get('correct_attempts', 0), values.get('xp', 0), values.get('coins', 0), values.get('current_streak', 0), values.get('topics_practiced', 0), values.get('worlds_practiced', 0), values.get('last_activity')))
            else:
                update = {'total_attempts': values.get('total_attempts', row['total_attempts']),
                          'correct_attempts': values.get('correct_attempts', row['correct_attempts']),
                          'xp': values.get('xp', row['xp']),
                          'coins': values.get('coins', row['coins']),
                          'current_streak': values.get('current_streak', row['current_streak']),
                          'topics_practiced': values.get('topics_practiced', row['topics_practiced']),
                          'worlds_practiced': values.get('worlds_practiced', row['worlds_practiced']),
                          'last_activity': values.get('last_activity', row['last_activity'])}
                assignments = ', '.join(f'{k}=?' for k in update)
                values_sql = [*update.values(), learner_id]
                db.execute(f'UPDATE learner_progress SET {assignments}, updated_at=CURRENT_TIMESTAMP WHERE learner_id=?', values_sql + [learner_id])
            return dict(db.execute('SELECT * FROM learner_progress WHERE learner_id=?', (learner_id,)).fetchone())

    def upsert_topic_progress(self, learner_id, world_id, subtopic_id, **values):
        record_id = f'{learner_id}:{world_id}:{subtopic_id}'
        with self.db() as db:
            row = db.execute('SELECT * FROM topic_progress WHERE id=?', (record_id,)).fetchone()
            payload = {
                'id': record_id,
                'learner_id': learner_id,
                'world_id': world_id,
                'subtopic_id': subtopic_id,
                'status': values.get('status', row['status'] if row else 'NOT_STARTED'),
                'mastery_score': values.get('mastery_score', row['mastery_score'] if row else 0),
                'attempts': values.get('attempts', row['attempts'] if row else 0),
                'correct_attempts': values.get('correct_attempts', row['correct_attempts'] if row else 0),
                'independent_successes': values.get('independent_successes', row['independent_successes'] if row else 0),
                'recent_accuracy': values.get('recent_accuracy', row['recent_accuracy'] if row else 0),
                'highest_difficulty_completed': values.get('highest_difficulty_completed', row['highest_difficulty_completed'] if row else None),
                'hints_used': values.get('hints_used', row['hints_used'] if row else 0),
                'solutions_revealed': values.get('solutions_revealed', row['solutions_revealed'] if row else 0),
                'last_practiced_at': values.get('last_practiced_at', row['last_practiced_at'] if row else None),
            }
            if row is None:
                db.execute('INSERT INTO topic_progress(id,learner_id,world_id,subtopic_id,status,mastery_score,attempts,correct_attempts,independent_successes,recent_accuracy,highest_difficulty_completed,hints_used,solutions_revealed,last_practiced_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                           (payload['id'], payload['learner_id'], payload['world_id'], payload['subtopic_id'], payload['status'], payload['mastery_score'], payload['attempts'], payload['correct_attempts'], payload['independent_successes'], payload['recent_accuracy'], payload['highest_difficulty_completed'], payload['hints_used'], payload['solutions_revealed'], payload['last_practiced_at']))
            else:
                db.execute('UPDATE topic_progress SET status=?,mastery_score=?,attempts=?,correct_attempts=?,independent_successes=?,recent_accuracy=?,highest_difficulty_completed=?,hints_used=?,solutions_revealed=?,last_practiced_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',
                           (payload['status'], payload['mastery_score'], payload['attempts'], payload['correct_attempts'], payload['independent_successes'], payload['recent_accuracy'], payload['highest_difficulty_completed'], payload['hints_used'], payload['solutions_revealed'], payload['last_practiced_at'], record_id))
            return dict(db.execute('SELECT * FROM topic_progress WHERE id=?', (record_id,)).fetchone())

    def upsert_world_progress(self, learner_id, world_id, **values):
        record_id = f'{learner_id}:{world_id}'
        with self.db() as db:
            row = db.execute('SELECT * FROM world_progress WHERE id=?', (record_id,)).fetchone()
            payload = {
                'id': record_id,
                'learner_id': learner_id,
                'world_id': world_id,
                'topics_started': values.get('topics_started', row['topics_started'] if row else 0),
                'topics_mastered': values.get('topics_mastered', row['topics_mastered'] if row else 0),
                'world_mastery_percentage': values.get('world_mastery_percentage', row['world_mastery_percentage'] if row else 0),
                'status': values.get('status', row['status'] if row else 'NOT_STARTED'),
                'last_practiced_at': values.get('last_practiced_at', row['last_practiced_at'] if row else None),
            }
            if row is None:
                db.execute('INSERT INTO world_progress(id,learner_id,world_id,topics_started,topics_mastered,world_mastery_percentage,status,last_practiced_at) VALUES(?,?,?,?,?,?,?,?)',
                           (payload['id'], payload['learner_id'], payload['world_id'], payload['topics_started'], payload['topics_mastered'], payload['world_mastery_percentage'], payload['status'], payload['last_practiced_at']))
            else:
                db.execute('UPDATE world_progress SET topics_started=?,topics_mastered=?,world_mastery_percentage=?,status=?,last_practiced_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',
                           (payload['topics_started'], payload['topics_mastered'], payload['world_mastery_percentage'], payload['status'], payload['last_practiced_at'], record_id))
            return dict(db.execute('SELECT * FROM world_progress WHERE id=?', (record_id,)).fetchone())

    def save_story_session(self, learner_id, story_id, world_id=None, active_character=None, story_title=None, setting=None, goal=None, story_summary=None, continuity_summary=None, current_stage=None, status='ACTIVE'):
        with self.db() as db:
            row = db.execute('SELECT * FROM story_sessions WHERE learner_id=? AND story_id=?', (learner_id, story_id)).fetchone()
            if row is None:
                session_id = uuid.uuid4().hex
                db.execute('INSERT INTO story_sessions(id,story_id,learner_id,world_id,active_character,story_title,setting,goal,story_summary,continuity_summary,current_stage,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
                           (session_id, story_id, learner_id, world_id, active_character, story_title, setting, goal, story_summary, continuity_summary, current_stage, status))
            else:
                db.execute('UPDATE story_sessions SET world_id=?,active_character=?,story_title=?,setting=?,goal=?,story_summary=?,continuity_summary=?,current_stage=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE learner_id=? AND story_id=?',
                           (world_id, active_character, story_title, setting, goal, story_summary, continuity_summary, current_stage, status, learner_id, story_id))
            return dict(db.execute('SELECT * FROM story_sessions WHERE learner_id=? AND story_id=?', (learner_id, story_id)).fetchone())

    def get_story_session(self, learner_id, story_id=None):
        with self.db() as db:
            if story_id is None:
                row = db.execute('SELECT * FROM story_sessions WHERE learner_id=? ORDER BY updated_at DESC LIMIT 1', (learner_id,)).fetchone()
            else:
                row = db.execute('SELECT * FROM story_sessions WHERE learner_id=? AND story_id=?', (learner_id, story_id)).fetchone()
        return dict(row) if row else None

    def save_active_quest(self, learner_id, world_id, subtopic_id, quest_id, status='ACTIVE'):
        with self.db() as db:
            row = db.execute('SELECT * FROM active_quests WHERE learner_id=?', (learner_id,)).fetchone()
            if row is None:
                record_id = uuid.uuid4().hex
                db.execute('INSERT INTO active_quests(id,learner_id,world_id,subtopic_id,quest_id,status) VALUES(?,?,?,?,?,?)',
                           (record_id, learner_id, world_id, subtopic_id, quest_id, status))
            else:
                db.execute('UPDATE active_quests SET world_id=?,subtopic_id=?,quest_id=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE learner_id=?',
                           (world_id, subtopic_id, quest_id, status, learner_id))
            return dict(db.execute('SELECT * FROM active_quests WHERE learner_id=?', (learner_id,)).fetchone())

    def get_active_quest(self, learner_id):
        with self.db() as db:
            row = db.execute('SELECT * FROM active_quests WHERE learner_id=? ORDER BY updated_at DESC LIMIT 1', (learner_id,)).fetchone()
        return dict(row) if row else None

    def save_question_fingerprint(self, learner_id, quest_id, world_id, subtopic_id, fingerprint):
        with self.db() as db:
            rec_id = f'{learner_id}:{quest_id}'
            db.execute('INSERT OR REPLACE INTO question_fingerprints(id,learner_id,quest_id,world_id,subtopic_id,fingerprint) VALUES(?,?,?,?,?,?)',
                       (rec_id, learner_id, quest_id, world_id, subtopic_id, fingerprint))

    def record_solution_purchase(self, learner_id, question_id, amount=0):
        with self.db() as db:
            db.execute('INSERT OR IGNORE INTO solution_purchases(learner_id,question_id,amount) VALUES(?,?,?)',
                       (learner_id, question_id, amount))
            db.execute('UPDATE solution_purchases SET amount=?,purchased_at=CURRENT_TIMESTAMP WHERE learner_id=? AND question_id=?',
                       (amount, learner_id, question_id))

    def save_attempt_record(self, attempt_id, learner_id, session_id, question_id, topic, correct, result_json, created_at=None):
        with self.db() as db:
            db.execute('INSERT OR REPLACE INTO attempts(id,learner,session,question,topic,correct,result,created) VALUES(?,?,?,?,?,?,?,?)',
                       (attempt_id, learner_id, session_id, question_id, topic, int(bool(correct)), result_json, created_at or sqlite3.datetime.date.today().isoformat()))

    def get_attempts(self, learner_id):
        with self.db() as db:
            return [dict(r) for r in db.execute('SELECT * FROM attempts WHERE learner=? ORDER BY rowid DESC', (learner_id,)).fetchall()]
