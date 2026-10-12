"""Durable media jobs. Never participates in the learner reward ledger."""
import json
import sqlite3
import uuid
from contextlib import contextmanager
from pathlib import Path

class VideoCache:
    def __init__(self,path):
        self.path=Path(path);self.path.parent.mkdir(parents=True,exist_ok=True)
        with self.db() as db:
            db.execute('PRAGMA journal_mode=WAL')
            db.execute('''CREATE TABLE IF NOT EXISTS generated_videos (
                id INTEGER PRIMARY KEY, concept_key TEXT NOT NULL, prompt_version TEXT NOT NULL,
                provider TEXT NOT NULL, model TEXT NOT NULL, status TEXT NOT NULL,
                job_id TEXT, video_location TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, error_state TEXT,
                provider_data TEXT NOT NULL DEFAULT '{}', reservation TEXT NOT NULL,
                UNIQUE(concept_key,prompt_version,provider,model))''')
    @contextmanager
    def db(self):
        db=sqlite3.connect(self.path,timeout=15);db.row_factory=sqlite3.Row
        try:
            with db:yield db
        finally:db.close()
    def get(self,key,version,provider,model):
        with self.db() as db:
            row=db.execute('SELECT * FROM generated_videos WHERE concept_key=? AND prompt_version=? AND provider=? AND model=?',(key,version,provider,model)).fetchone()
            return dict(row) if row else None
    def reserve(self,key,version,provider,model,*,retry=False):
        """Single transactional owner, including across processes/restarts."""
        token=uuid.uuid4().hex
        with self.db() as db:
            db.execute('BEGIN IMMEDIATE')
            changed=db.execute("INSERT OR IGNORE INTO generated_videos(concept_key,prompt_version,provider,model,status,reservation) VALUES(?,?,?,?, 'submitting',?)",(key,version,provider,model,token)).rowcount
            if not changed and retry:
                changed=db.execute("UPDATE generated_videos SET status='submitting',reservation=?,error_state=NULL,updated_at=CURRENT_TIMESTAMP WHERE concept_key=? AND prompt_version=? AND provider=? AND model=? AND status='submission_error' AND job_id IS NULL",(token,key,version,provider,model)).rowcount
        return bool(changed),self.get(key,version,provider,model)
    def update(self,row,**values):
        allowed={'status','job_id','video_location','error_state','provider_data'}
        if not values or set(values)-allowed:raise ValueError('Invalid cache update.')
        if 'provider_data' in values:values['provider_data']=json.dumps(values['provider_data'])
        with self.db() as db:
            db.execute('UPDATE generated_videos SET '+','.join(f'{name}=?' for name in values)+',updated_at=CURRENT_TIMESTAMP WHERE id=? AND reservation=?',(*values.values(),row['id'],row['reservation']))
        return self.get(row['concept_key'],row['prompt_version'],row['provider'],row['model'])
