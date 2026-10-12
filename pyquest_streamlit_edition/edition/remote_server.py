"""Authenticated external learning service; deploy behind HTTPS on durable disk."""
import json
import logging
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from dotenv import load_dotenv
from edition.client import verify_token, BackendUnavailable
from edition.service import LearningService
from app.question_generation_service import QuestionGenerationUnavailable


def create_remote_server(service,secret,port=8770):
    if len(secret)<32: raise ValueError('Backend signing secret must be at least 32 characters.')
    class Handler(BaseHTTPRequestHandler):
        def setup(self):
            super().setup();self.connection.settimeout(75)
        def reply(self,value,status=200):
            data=json.dumps(value,allow_nan=False).encode()
            self.send_response(status);self.send_header('Content-Type','application/json')
            self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff')
            self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
        def do_GET(self):
            self.reply({'status':'ok'} if self.path=='/healthz' else {'error':'Not found'},200 if self.path=='/healthz' else 404)
        def do_POST(self):
            if self.path!='/v1/action': return self.reply({'error':'Not found'},404)
            try:
                bearer=self.headers.get('Authorization','')
                if not bearer.startswith('Bearer '): raise BackendUnavailable('Authentication failed.')
                identity=verify_token(bearer[7:],secret)
            except BackendUnavailable as exc:return self.reply({'error':str(exc)},401)
            try:
                if self.headers.get_content_type()!='application/json' or self.headers.get('Transfer-Encoding'):raise ValueError('Use a bounded JSON request.')
                size=int(self.headers.get('Content-Length','0'))
                if not 0<size<=16000:raise ValueError('Invalid request size.')
                def invalid(value):raise ValueError('Non-finite JSON is unsupported.')
                value=json.loads(self.rfile.read(size),parse_constant=invalid)
                if not isinstance(value,dict) or set(value)!={'action','payload'}:raise ValueError('Invalid action request.')
                result=service.call(identity,value['action'],value['payload'])
                self.reply({'result':result})
            except QuestionGenerationUnavailable as exc:self.reply({'error':str(exc),'code':exc.code,'retryable':True},503)
            except (ValueError,TypeError,KeyError) as exc:self.reply({'error':str(exc)},400)
            except Exception:
                logging.exception('backend_request_failed');self.reply({'error':'The learning service failed. Retry later.'},500)
    # Loopback ingress only. A trusted TLS reverse proxy forwards traffic here.
    return ThreadingHTTPServer(('127.0.0.1',port),Handler)


if __name__=='__main__':
    load_dotenv()
    directory=os.environ.get('PYQUEST_DATA_DIR')
    if not directory:raise SystemExit('PYQUEST_DATA_DIR must point at a durable external volume.')
    service=LearningService(directory).initialize()
    server=create_remote_server(service,os.environ.get('PYQUEST_BACKEND_SECRET',''),int(os.environ.get('PYQUEST_BACKEND_PORT','8770')))
    logging.basicConfig(level=logging.INFO)
    print('Authenticated PyQuest backend listening on loopback port',server.server_port,flush=True)
    try:server.serve_forever()
    except KeyboardInterrupt:pass
    finally:server.server_close()
