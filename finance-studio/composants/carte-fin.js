// Carte de fin (5 dernières secondes) : ENREGISTRE + ABONNE-TOI, teaser de la vidéo suivante.
const { I } = require('./icones');
module.exports = function carteFin(v, { t, teaser }) {
  const id = v.uid('fin');
  const d = v.duree - t;
  v.add(`<div class="clip fin" data-start="${t.toFixed(3)}" data-duration="${d.toFixed(3)}" data-track-index="4"><div class="kb" id="${id}">
    ${v.pos(540, 330, I.signet(210), { id: id + 's' })}
    ${v.pos(540, 640, '<div class="bouton bleu">ENREGISTRE</div>', { id: id + 'b1' })}
    ${v.pos(540, 790, '<div class="txt" style="font-size:90px">+</div>', { id: id + 'p' })}
    ${v.pos(540, 940, '<div class="bouton">ABONNE-TOI</div>', { id: id + 'b2' })}
    ${v.pos(540, 1330, `<div class="teaser"><div class="k">PROCHAINE VIDÉO</div><div class="v">${teaser}</div></div>`, { id: id + 't' })}
  </div></div>`);
  v.anim(`tl.fromTo('#${id}',{scale:1.25},{scale:1,duration:0.3,ease:'power3.out'},${t.toFixed(3)});`);
  v.anim(`tl.to('#${id}',{scale:1.04,duration:${(d - 0.3).toFixed(3)},ease:'none'},${(t + 0.3).toFixed(3)});`);
  v.entree(`#${id}s`, t + 0.1, 'haut');
  v.entree(`#${id}b1`, t + 0.35, 'pop');
  v.entree(`#${id}p`, t + 0.6, 'pop');
  v.entree(`#${id}b2`, t + 0.8, 'pop');
  v.entree(`#${id}t`, t + 1.3, 'bas');
  const n = Math.floor((d - 1.3) / 0.8);
  v.anim(`tl.to('#${id}b2',{scale:1.09,duration:0.4,yoyo:true,repeat:${Math.max(1, n * 2 - 1)},ease:'sine.inOut'},${(t + 1.2).toFixed(3)});`);
  v.anim(`tl.fromTo('#${id}s',{rotation:-6},{rotation:6,duration:0.5,yoyo:true,repeat:${Math.max(1, Math.floor(d / 0.5) - 1)},ease:'sine.inOut'},${(t + 0.6).toFixed(3)});`);
  v.sfx('whoosh', t - 0.12, 0.5);
  v.sfx('impact', t + 0.8, 0.3);
};
