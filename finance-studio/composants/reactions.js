// Réactions comiques courtes pour les passages [rire] / [ironique].
module.exports = {
  secousse(v, sel, t, d = 0.5) {
    v.anim(`tl.fromTo(${JSON.stringify(sel)},{x:-22,rotation:-6},{x:22,rotation:6,duration:0.06,yoyo:true,repeat:${Math.round(d / 0.06)},ease:'none'},${t.toFixed(3)});`);
    v.anim(`tl.to(${JSON.stringify(sel)},{x:0,rotation:0,duration:0.08},${(t + d + 0.07).toFixed(3)});`);
  },
  boing(v, sel, t) {
    v.anim(`tl.fromTo(${JSON.stringify(sel)},{scaleX:1.35,scaleY:0.6},{scaleX:1,scaleY:1,duration:0.7,ease:'elastic.out(1.2,0.25)'},${t.toFixed(3)});`);
    v.sfx('gag-boing', t, 0.5);
  },
  zoomComique(v, sel, t) {
    v.anim(`tl.fromTo(${JSON.stringify(sel)},{scale:1},{scale:1.5,duration:0.12,yoyo:true,repeat:1,ease:'power2.out'},${t.toFixed(3)});`);
    v.sfx('gag-boing', t, 0.4);
  },
};
