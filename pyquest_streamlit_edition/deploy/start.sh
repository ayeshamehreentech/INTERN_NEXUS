#!/bin/sh
set -eu
python -m edition.remote_server &
backend_pid=$!
nginx -g 'daemon off;' &
ingress_pid=$!
trap 'kill "$backend_pid" "$ingress_pid" 2>/dev/null || true' EXIT INT TERM
while kill -0 "$backend_pid" 2>/dev/null && kill -0 "$ingress_pid" 2>/dev/null; do
    sleep 2
done
exit 1
