// Hook 0-3 s : texte géant plein écran, mot par mot calé sur la voix, son d'impact.
module.exports = function hook(v, { mots, fin, or = [] }) {
  // mots : [{texte, t}]
  const id = v.uid('hook');
  const spans = mots.map((m, k) => `<span id="${id}m${k}" class="${or.includes(k) ? 'or' : ''}">${m.texte}</span>`).join('');
  v.add(`<div class="clip hook" data-start="0" data-duration="${fin.toFixed(3)}" data-track-index="3"><div class="kb" id="${id}"><div class="hk">${spans}</div></div></div>`);
  mots.forEach((m, k) => v.anim(`tl.fromTo('#${id}m${k}',{scale:2.6,opacity:0,rotation:${k % 2 ? 6 : -6}},{scale:1,opacity:1,rotation:0,duration:0.2,ease:'power4.in'},${Math.max(0, m.t - 0.1).toFixed(3)});`));
  v.anim(`tl.to('#${id}',{scale:1.06,duration:${fin.toFixed(3)},ease:'none'},0);`);
  // secousse d'impact
  v.anim(`tl.fromTo('#${id}',{x:-18,y:10},{x:0,y:0,duration:0.35,ease:'elastic.out(1,0.3)'},0.12);`);
  v.sfx('impact', 0.05, 0.6);
};
