// Fond animé permanent : dégradé bleu nuit -> noir, halo lumineux, grille, anneaux et particules or qui bougent.
module.exports = function fond(v) {
  const D = v.duree;
  const parts = [];
  // pseudo-aléatoire déterministe
  let s = 12345;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let k = 0; k < 26; k++) {
    const x = Math.round(rnd() * 1080), y = Math.round(200 + rnd() * 1700), r = Math.round(6 + rnd() * 12);
    parts.push({ k, x, y, r, dy: Math.round(300 + rnd() * 500), o: (0.35 + rnd() * 0.5).toFixed(2) });
  }
  v.add(`<div class="fond" data-track-index="0">
        <div class="rayon" id="fd-rayon"></div>
        <div class="grille" id="fd-grille"></div>
        <div class="halo" id="fd-halo"></div>
        <div class="anneau" id="fd-a1" style="left:-260px;top:120px;width:620px;height:620px"></div>
        <div class="anneau" id="fd-a2" style="left:700px;top:980px;width:560px;height:560px;border-color:rgba(255,255,255,.28)"></div>
        ${parts.map((p) => `<div class="particule" id="fd-p${p.k}" style="left:${p.x}px;top:${p.y}px;width:${p.r}px;height:${p.r}px;opacity:${p.o}"></div>`).join('')}
      </div>`);
  v.anim(`tl.to('#fd-rayon',{rotation:60,duration:${D},ease:'none'},0);`);
  v.anim(`tl.to('#fd-grille',{x:120,y:-240,duration:${D},ease:'none'},0);`);
  v.anim(`tl.to('#fd-a1',{rotation:180,duration:${D},ease:'none'},0);`);
  v.anim(`tl.to('#fd-a2',{rotation:-160,duration:${D},ease:'none'},0);`);
  const n = Math.floor(D / 3);
  v.anim(`tl.fromTo('#fd-halo',{scale:0.94,opacity:.85},{scale:1.06,opacity:1,duration:1.5,ease:'sine.inOut',yoyo:true,repeat:${n * 2 - 1}},0);`);
  parts.forEach((p) => v.anim(`tl.to('#fd-p${p.k}',{y:${-p.dy},x:${p.k % 2 ? 40 : -40},duration:${D},ease:'none'},0);`));
};
