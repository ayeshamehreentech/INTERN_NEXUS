"""Real SQLite LangGraph checkpoints with short-lived connection ownership.

The wrapper compiles against the official saver for each operation, closing the
connection afterwards (including failures). Business tables are never touched.
"""
import logging
import sqlite3
import threading
from langgraph.checkpoint.sqlite import SqliteSaver


# Fixed lock stripes bound memory and serialize same-thread operations in this
# server process, including separate engine instances. Not a distributed lock.
_LOCKS = [threading.RLock() for _ in range(64)]


def thread_lock(path, thread_id):
    return _LOCKS[hash((str(path), thread_id)) % len(_LOCKS)]


class CheckpointUnavailable(ValueError):
    pass


class PersistentGraph:
    def __init__(self, builder, path):
        self.builder, self.path = builder, path

    def _call(self, method, config, *args, **kwargs):
        configurable = config.get('configurable') if isinstance(config, dict) else None
        thread_id = configurable.get('thread_id') if isinstance(configurable, dict) else None
        if not isinstance(thread_id, str) or not thread_id.strip():
            raise ValueError('A valid subtopic and stable thread_id configuration are required.')
        try:
            with thread_lock(self.path, thread_id):
                with SqliteSaver.from_conn_string(str(self.path)) as saver:
                    graph = self.builder.compile(checkpointer=saver)
                    result = getattr(graph, method)(*args, config=config, **kwargs)
                    if method == 'get_state_history':
                        result = list(result)
                    logging.info('graph_checkpoint_operation method=%s', method)
                    return result
        except sqlite3.Error as exc:
            logging.warning('graph_checkpoint_error category=%s', type(exc).__name__)
            raise CheckpointUnavailable('Workflow storage is unavailable. Please retry.') from None

    def invoke(self, state, config=None, **kwargs):
        return self._call('invoke', config, state, **kwargs)

    def get_state(self, config):
        return self._call('get_state', config)

    def get_state_history(self, config):
        return self._call('get_state_history', config)
