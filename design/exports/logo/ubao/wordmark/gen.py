import sys
V=sys.argv[1]
def f(n): return ('%.1f'%n).rstrip('0').rstrip('.')
def ring(cx,cy,rx,ry,ix,iy):
    return (f"M{f(cx-rx)} {f(cy)}A{f(rx)} {f(ry)} 0 1 0 {f(cx+rx)} {f(cy)}A{f(rx)} {f(ry)} 0 1 0 {f(cx-rx)} {f(cy)}Z"
            f"M{f(cx-ix)} {f(cy)}A{f(ix)} {f(iy)} 0 1 1 {f(cx+ix)} {f(cy)}A{f(ix)} {f(iy)} 0 1 1 {f(cx-ix)} {f(cy)}Z")
def rect(x,y,w,h): return f"M{f(x)} {f(y)}H{f(x+w)}V{f(y+h)}H{f(x)}Z"
BL=200; XT=80; AS=20; R=66; CY=140; ov=3
def build(kind):
    P=[]; 
    if kind=='W1': S=26; ix=40; iy=42; ux=24; gaps=(42,14,18)
    if kind=='W2': S=26; ix=40; iy=42; ux=24; gaps=(42,14,18)
    if kind=='W3': S=30; ix=34; iy=56; gaps=(40,12,16)
    x=24
    # ---- u
    W=100; rr=50
    if kind!='W3':
        iw=rr-S
        P.append(f"M{x} {XT}V{CY+12}A{rr} {rr+2} 0 0 0 {x+W} {CY+12}V{XT}H{x+W-S}V{CY+12}A{iw} {iw} 0 0 1 {x+S} {CY+12}V{XT}Z")
        P.append(rect(x+W-S,XT,S,BL-XT)); ux_r=x+W
    else:
        P.append(f"M{x} {XT}V{CY+12}A{rr} {rr+2} 0 0 0 {x+W} {CY+12}V{XT}H{x+W-S} V{CY+12}A{rr-S} 43 0 0 1 {x+S} {CY+12}V{XT}Z")
        P.append(rect(x+W-S,XT,S,BL-XT))
        P.append(rect(x-14,XT,S+14,8)); P.append(rect(x+W-S-14,XT,S+14,8))
        P.append(f"M{x+W-S} {BL-8}H{x+W}C{x+W+2} {BL} {x+W+8} {BL} {x+W+15} {BL-9}L{x+W+17} {BL-6}C{x+W+11} {BL+5} {x+W-S+8} {BL+4} {x+W-S} {BL}Z")
        ux_r=x+W+17
    # ---- b
    bx=ux_r+gaps[0]
    if kind=='W2':
        bx=ux_r+gaps[0]
        P.append(rect(ux_r-S+ 0,BL-S+2,gaps[0]+S,S-2))  # foot plank u->b (overlaps stems)
    top = AS
    if kind=='W1': P.append(f"M{bx} {AS+26}L{bx+S} {AS}V{BL}H{bx}Z")
    elif kind=='W2': P.append(rect(bx,AS,S,BL-AS))
    else:
        P.append(rect(bx,AS,S,BL-AS)); P.append(f"M{bx-18} {AS+24}L{bx} {AS}V{AS+24}Z")
    bcx=bx+R
    P.append(ring(bcx,CY,R,R,ix,iy)); 
    bright=bcx+R
    # ---- a
    acx=bright+gaps[1]+R
    P.append(ring(acx,CY,R,R,ix,iy))
    ar=acx+R
    P.append(rect(ar-S,XT,S,BL-XT))
    if kind=='W3':
        P.append(rect(ar-S-12,XT,S+12,8))
        P.append(f"M{ar-S} {BL-8}H{ar}C{ar+2} {BL} {ar+8} {BL} {ar+15} {BL-9}L{ar+17} {BL-6}C{ar+11} {BL+5} {ar-S+8} {BL+4} {ar-S} {BL}Z")
        ar+=17
    ocx=ar+gaps[2]+R
    P.append(ring(ocx,CY,R,R,ix,iy))
    return P, ocx+R+24
def out(kind,name,idea):
    P,w=build(kind)
    w=int(round(w))
    d="".join(f'<path d="{p}"/>' for p in P)
    open(f"ubao-wordmark-{name}-{V}.svg","w").write(
f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} 256" width="{w}" height="256" role="img" aria-labelledby="t"><title id="t">ubao — wordmark {name} ({idea})</title><rect width="{w}" height="256" fill="#fff"/><g fill="#111">{d}</g></svg>\n')
out('W1','w1-calm','geometric calm, slanted plank-cut ascender')
out('W2','w2-planche','u and b joined by a shared baseline plank')
out('W3','w3-editorial','soft-contrast editorial with spur tails')
