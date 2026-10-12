"""Coin ledger helpers must be called inside the caller's SQLite transaction."""
import json
from datetime import datetime,timezone

SOLUTION_PRICES={'foundation':1,'easy':2,'normal':3,'medium':3,'hard':5,'challenge':7}
QUESTION_COINS={'easy':2,'normal':3,'hard':5}


class RewardEngine:
    """Deterministic reward calculation from trusted evaluation and mastery evidence."""
    def __init__(self, coin_map=None):
        self.coin_map = coin_map or QUESTION_COINS

    def calculate(self, *, evaluation_result, score_result=None, mastery_result=None, difficulty='easy'):
        coins = self.coin_map.get(difficulty, 0)
        xp = 0
        if evaluation_result and evaluation_result.get('correct'):
            xp = max(10, int((score_result or {}).get('score', 0) if score_result else 50))
        return {'xp': xp, 'coins': coins if evaluation_result and evaluation_result.get('correct') else 0}


def balance(db,learner):
    return db.execute('SELECT COALESCE(SUM(amount),0) FROM reward_transactions WHERE learner_id=?',(learner,)).fetchone()[0]


def transact(db,learner,quest,kind,amount,event_id,reason):
    old=db.execute('SELECT * FROM reward_transactions WHERE transaction_id=?',(event_id,)).fetchone()
    if old:return dict(old)
    before=balance(db,learner);after=before+amount
    if after<0:raise ValueError('Not enough coins for this solution.')
    timestamp=datetime.now(timezone.utc).isoformat()
    db.execute('INSERT INTO reward_transactions VALUES(?,?,?,?,?,?,?,?,?)',
        (event_id,learner,quest,kind,amount,before,after,reason,timestamp))
    event=dict(event_id=event_id,learner_id=learner,timestamp=timestamp,type='CoinRewardEvent' if amount>0 else 'CoinSpentEvent',
               payload=dict(quest_id=quest,coins_awarded=max(0,amount),amount=amount,balance_before=before,balance_after=after))
    db.execute('INSERT INTO ui_events VALUES(?,?,?)',(event_id,learner,json.dumps(event)))
    return event
