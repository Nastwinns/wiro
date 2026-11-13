#!/usr/bin/env python3
"""Spec IDs (docs/ux/screens) vs Penpot inventory JSON ({"result": "## page\n- name [type] WxH @x,y ch=n"}). usage: design_matrix.py inv.txt"""
import re,json,glob,collections,sys
inv=json.loads(open(sys.argv[1]).read())["result"]
page=None; pen=collections.defaultdict(list); empty=[]
for l in inv.splitlines():
    if l.startswith("## "): page=l[3:]
    elif "[board]" in l:
        ch=int(re.search(r"ch=(\d+)",l).group(1))
        if ch==0 and not l.startswith("- _") and "Board [" not in l: empty.append((page.split(" ")[0],l[2:70]))
        for s in re.findall(r"S-\d+\.\d+",l):
            if ch>0: pen[s].append(page.split(" ")[0])
spec={}
for f in sorted(glob.glob("docs/ux/screens/*.md")):
    for l in open(f):
        m=re.match(r"\s*(?:[#|*\-]+\s*)*\**(S-\d+\.\d+)\**",l)
        if m: spec.setdefault(m.group(1),1)
key=lambda x:[int(n) for n in re.findall(r"\d+",x)]
done=sorted([k for k in spec if k in pen],key=key); miss=sorted([k for k in spec if k not in pen],key=key)
print(f"{len(done)}/{len(spec)} = {100*len(done)//len(spec)}%")
print("RESTE ("+str(len(miss))+"):",", ".join(miss))
print("frames vides:",empty)
