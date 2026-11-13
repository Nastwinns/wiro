import json,sys
j=json.load(open('wm.json'));d="".join(f'<path d="{p}"/>' for p in j['paths'])
open('wmtest.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {j["w"]} 256" width="{j["w"]*2}" height="512"><rect width="100%" height="100%" fill="#fff"/><g fill="#111">{d}</g></svg>')
