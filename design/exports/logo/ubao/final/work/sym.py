# generates joint variants. centerline = list of (x0,x1,y) segments; band thickness g
def build(segs,g=20,r=24,lo=32,hi=224):
    h=g/2; top=[];bot=[]
    # top boundary points left->right, bottom likewise
    T=[(lo,segs[0][2]-h)];B=[(lo,segs[0][2]+h)]
    for i in range(1,len(segs)):
        c=segs[i][0]; a=segs[i-1][2]; b=segs[i][2]
        if b>a: # step down
            T+= [(c+h,a-h),(c+h,b-h)]; B+=[(c-h,a+h),(c-h,b+h)]
        else:
            T+= [(c-h,a-h),(c-h,b-h)]; B+=[(c+h,a+h),(c+h,b+h)]
    T.append((hi,segs[-1][2]-h));B.append((hi,segs[-1][2]+h))
    f=lambda v:('%g'%v)
    def poly(P): 
        s=""
        for (x,y) in P[1:]: s+=f"L{f(x)} {f(y)}"
        return s
    # top plank: start top-left arc, go along top, down right side to T[-1], back along T reversed
    t=(f"M{lo} {f(T[0][1])}V{lo+r}A{r} {r} 0 0 1 {lo+r} {lo}H{hi-r}A{r} {r} 0 0 1 {hi} {lo+r}V{f(T[-1][1])}"
       + "".join(f"L{f(x)} {f(y)}" for x,y in reversed(T[:-1]))+"Z")
    b_=(f"M{lo} {f(B[0][1])}"+"".join(f"L{f(x)} {f(y)}" for x,y in B[1:])+f"V{hi-r}A{r} {r} 0 0 1 {hi-r} {hi}H{lo+r}A{r} {r} 0 0 1 {lo} {hi-r}Z")
    return t+b_
V={
 'a-tenon':[(32,96,104),(96,160,152),(160,224,104)],
 'b-weave':[(32,80,104),(80,128,152),(128,176,104),(176,224,152)],
 'c-stair':[(32,96,96),(96,160,128),(160,224,160)],
}
if __name__=="__main__":
    for k,s in V.items():
        d=build(s)
        open(f"sym-{k}.svg","w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256"><path fill="#000" d="{d}"/></svg>')
        print(k,d)
