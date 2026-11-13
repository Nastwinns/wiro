import json,sys
sys.path.insert(0,'work')
from sym import build
D=build([(32,96,96),(96,160,128),(160,224,160)],g=20,r=24)
DS=build([(32,96,92),(96,160,128),(160,224,164)],g=26,r=28)
j=json.load(open('work/wm.json')); WM="".join(f'<path d="{p}"/>' for p in j['paths']); WW=j['w']
INK,MAL,GOLD,PAPER,MINT='#0F1211','#0B5D49','#B08A2E','#FAFAF7','#3FBF95'
def svg(vb,title,body,fill):
    w,h=vb
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img"><title>{title}</title><g fill="{fill}">{body}</g></svg>\n'
def w(n,s): open(n,'w').write(s)
SY=f'<path d="{D}"/>'; SS=f'<path d="{DS}"/>'
for k,c in [('color',MAL),('black',INK),('white','#FFFFFF'),('gold',GOLD),('dark',MINT)]:
    w(f'ubao-symbol-{k}.svg',svg((256,256),'Ubao symbol',SY,c))
w('ubao-symbol-small.svg',svg((256,256),'Ubao symbol, small size',SS,MAL))
for k,c in [('color',INK),('black',INK),('white','#FFFFFF'),('dark',PAPER)]:
    w(f'ubao-wordmark-{k}.svg',svg((WW,256),'Ubao wordmark',WM,c))
TX=264; LW=TX+WW
for k,(sc,tc) in {'color':(MAL,INK),'black':(INK,INK),'white':('#FFFFFF','#FFFFFF'),'dark':(MINT,PAPER)}.items():
    body=f'<g fill="{sc}">{SY}</g><g fill="{tc}" transform="translate({TX} 15)">{WM}</g>'
    w(f'ubao-lockup-horizontal-{k}.svg',svg((LW,256),'Ubao logo',body,'none'))
    body=f'<g fill="{sc}" transform="translate(132 -8)">{SY}</g><g fill="{tc}" transform="translate(30 249) scale(.75)">{WM}</g>'
    if k in('color','dark'): w(f'ubao-lockup-stacked-{k}.svg',svg((520,428),'Ubao logo, stacked',body,'none'))
T="translate(128 128) scale(.78) translate(-128 -128)"
w('ubao-app-icon.svg',f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256" role="img"><title>Ubao app icon</title><rect width="256" height="256" rx="56" fill="{MAL}"/><g fill="#FFFFFF" transform="{T}">{SY}</g></svg>\n')
print(D);print(DS)
