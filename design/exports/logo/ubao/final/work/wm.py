import math
def f(n): return ('%.1f'%n).rstrip('0').rstrip('.')
def ring(cx,cy,rx,ry,ix,iy):
    return (f"M{f(cx-rx)} {f(cy)}A{f(rx)} {f(ry)} 0 1 0 {f(cx+rx)} {f(cy)}A{f(rx)} {f(ry)} 0 1 0 {f(cx-rx)} {f(cy)}Z"
            f"M{f(cx-ix)} {f(cy)}A{f(ix)} {f(iy)} 0 1 1 {f(cx+ix)} {f(cy)}A{f(ix)} {f(iy)} 0 1 1 {f(cx-ix)} {f(cy)}Z")
def rect(x,y,w,h): return f"M{f(x)} {f(y)}H{f(x+w)}V{f(y+h)}H{f(x)}Z"
BL=200; XT=80; AS=20; R=66; CY=140; S=26; ix=40; iy=42
def build():
    P=[]; x=24; W=100; cx=x+W/2
    # u : one outline, symmetric bowl (cy=150, ry 52), right stem flush; foot meets bowl exactly at baseline
    cyu=152; ryu=52; rxu=50
    dx=W/2-S  # 24 -> x=98 offset from centre
    yj=cyu+ryu*math.sqrt(1-(dx/rxu)**2)
    iyu=ryu-26  # bottom thickness 24
    P.append(f"M{x} {XT}V{cyu}A{rxu} {ryu} 0 0 0 {f(x+W-S)} {f(yj)}V{BL}H{x+W}V{XT}H{x+W-S}V{cyu}A{rxu-S} {iyu} 0 0 1 {x+S} {cyu}V{XT}Z")
    ur=x+W
    bx=ur+36
    # b : flat top, small 45deg chamfer (10) on the left
    P.append(rect(bx,AS,S,BL-AS))
    bcx=bx+R; P.append(ring(bcx,CY,R,R,ix,iy)); br=bcx+R
    acx=br+14+R; P.append(ring(acx,CY,R,R,ix,iy)); ar=acx+R
    P.append(rect(ar-S,XT,S,BL-XT))
    ocx=ar+18+R; P.append(ring(ocx,CY,R,R,ix,iy))
    return P, ocx+R+24
P,w=build(); w=int(round(w))
import json; json.dump({'w':w,'paths':P},open('wm.json','w'))
print(w)
