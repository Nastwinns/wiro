#!/usr/bin/env bash
# usage: penpot_dump.sh "<page name>" [outfile.json]
# One MCP call per page: dumps the full shape tree (absolute coords, text characters)
# as compact JSON. Read-only. Agents then analyse the JSON locally instead of re-scanning
# Penpot — only fixes need new plugin calls. See tools/penpot_group.sh to batch fixes.
# Output default: cache/penpot/dump/<page-slug>.json
set -euo pipefail
cd "$(dirname "$0")/.."
PAGE="${1:?usage: penpot_dump.sh \"<page name>\" [outfile.json]}"
OUT="${2:-}"
mkdir -p cache/penpot/dump
[ -z "$OUT" ] && OUT="cache/penpot/dump/$(echo "$PAGE" | tr -cs '[:alnum:]' '-' | sed 's/^-\|-$//g').json"
TMP="$(mktemp -t penpot_dump).js"
trap 'rm -f "$TMP"' EXIT
python3 - "$PAGE" > "$TMP" <<'PY'
import sys, json
page = sys.argv[1]
js = '''
const pageName = %s;
const p = await openPage(pageName);
const walk = (s, ax, ay) => {
  const o = { n: s.name, t: s.type, x: Math.round(ax), y: Math.round(ay), w: Math.round(s.width), h: Math.round(s.height) };
  if (s.visible === false) o.hid = 1;
  if (s.type === "text") o.c = s.characters;
  if (s.children && s.children.length) o.k = s.children.map(k => walk(k, ax + k.x, ay + k.y));
  return o;
};
return JSON.stringify({ page: pageName, at: Date.now(),
  frames: p.root.children.map(f => walk(f, f.x, f.y)) });
''' % json.dumps(page)
print(js)
PY
raw=""
for i in $(seq 1 15); do
  raw="$(tools/penpot_call.sh "$TMP")" && ok=1 || ok=0
  if [ $ok = 1 ] && ! echo "$raw" | grep -qiE "suspended|frozen|No Penpot instance|ECONN|refused|timed out"; then break; fi
  sleep 25; raw=""
done
[ -z "$raw" ] && { echo "DUMP_FAIL: Penpot injoignable après retries" >&2; exit 1; }
echo "$raw" | python3 -c '
import sys, json
raw = sys.stdin.read()
d = json.loads(raw)
if isinstance(d, dict) and "result" in d: d = d["result"]
if isinstance(d, str): d = json.loads(d)
out = sys.argv[1]
s = json.dumps(d, ensure_ascii=False, separators=(",", ":"))
open(out, "w").write(s)
nf = len(d["frames"])
ns = s.count(chr(34) + "n" + chr(34) + ":")
print("dumped %s — %d frames, ~%d shapes, %d KB" % (out, nf, ns, round(len(s) / 1024)))
' "$OUT"
