#!/usr/bin/env bash
# usage: penpot_call.sh <file.js>  — runs JS in Penpot plugin context through the MCP (needs PENPOT_MCP_URL in .env)
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a
python3 - "$1" <<'PY'
import sys,json,os,urllib.request,fcntl
lib=open("tools/penpot/lib.js").read()
code="(async()=>{\n"+lib+"\n"+open(sys.argv[1]).read()+"\n})()" if False else lib+"\n"+open(sys.argv[1]).read()
body=json.dumps({"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"execute_code","arguments":{"code":code}}}).encode()
req=urllib.request.Request(os.environ["PENPOT_MCP_URL"],body,{"Content-Type":"application/json","Accept":"application/json, text/event-stream","User-Agent":"curl/8"})
# serialise all callers: the plugin has ONE active page, so concurrent calls from several agents race on it
lk=open("/tmp/wiro-penpot.lock","w"); fcntl.flock(lk,fcntl.LOCK_EX)
raw=urllib.request.urlopen(req,timeout=170).read().decode()
for l in raw.splitlines():
    if l.startswith("data: "):
        d=json.loads(l[6:])
        if "error" in d: print("ERROR",d["error"]); break
        for c in d["result"]["content"]: print(c["text"])
PY
