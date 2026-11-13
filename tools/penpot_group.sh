#!/usr/bin/env bash
# usage: penpot_group.sh <manifest.json> [outdir]
# Batches pending plugin jobs so each MCP call = ONE openPage + all its scripts, run in
# order in the same plugin call (scan + fix + verify in one round-trip). Resumable: a
# group writes <outdir>/<name>.json and <outdir>/<name>.done; rerunning skips done groups.
#
# manifest.json = [ { "name": "b09", "page": "B09 · Board", "files": ["a.js", "fix_b09.js"] }, ... ]
# Each file is plain JS appended after `await openPage(page)` (lib.js helpers available);
# it may set `out` (string|object) to report; results are collected per file.
# Sizing rule: keep a group under ~60 s of plugin work (MCP hard limit ~100 s).
set -euo pipefail
cd "$(dirname "$0")/.."
MANIFEST="${1:?usage: penpot_group.sh <manifest.json> [outdir]}"
OUTDIR="${2:-cache/penpot/group}"
mkdir -p "$OUTDIR"
python3 - "$MANIFEST" "$OUTDIR" <<'PY'
import sys, json, os, subprocess, re
manifest, outdir = sys.argv[1], sys.argv[2]
groups = json.load(open(manifest))
for g in groups:
    name, page, files = g["name"], g["page"], g["files"]
    safe = re.sub(r"[^A-Za-z0-9._-]+", "_", name)
    done, res = os.path.join(outdir, safe + ".done"), os.path.join(outdir, safe + ".json")
    if os.path.exists(done):
        print(f"SKIP {name} (done)"); continue
    parts = [f'await openPage({json.dumps(page)});', "const results = {};"]
    for f in files:
        body = open(f).read()
        parts.append(
            "{ let out = []; try { await (async () => { %s })().then(o => { if (o !== undefined) out = o; }); }"
            " catch (e) { out = \"ERR \" + e.message } results[%s] = out; }"
            % (body, json.dumps(os.path.basename(f))))
    merged = "\n".join(parts) + "\nreturn results;"
    tmp = os.path.join(outdir, safe + ".merged.js")
    open(tmp, "w").write(merged)
    transient = ("suspended", "frozen", "No Penpot instance", "ECONN", "refused", "timed out")
    r = None
    for attempt in range(15):
        try:
            r = subprocess.run(["tools/penpot_call.sh", tmp], capture_output=True, text=True, timeout=180)
        except subprocess.TimeoutExpired:
            r = None
        out_txt = (r.stdout + r.stderr) if r else "timeout"
        if r and r.returncode == 0 and "ERROR" not in r.stdout and "Tool execution failed" not in r.stdout:
            break
        if not any(t.lower() in out_txt.lower() for t in transient):
            print(f"FAIL {name}: " + out_txt[:300]); sys.exit(1)  # erreur réelle, pas la peine de retry
        print(f"retry {attempt + 1} {name}: {out_txt[:80]}")
        time.sleep(25)
    else:
        print(f"FAIL {name} après 15 retries: " + out_txt[:300]); sys.exit(1)
    open(res, "w").write(r.stdout)
    open(done, "w").write("ok")
    os.remove(tmp)
    print(f"OK {name} -> {res}")
PY
