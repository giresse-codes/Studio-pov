// Compteur animé en gros au centre (chiffre, prix, pourcentage, durée).
module.exports = function compteur(v, { x = 540, y = 620, de = 0, a, t, d = 0.9, dec = 0, prefixe = '', suffixe = '', taille = 230, couleur = '', legende = '', legendeT = null, son = true }) {
  const id = v.uid('cpt');
  const html = v.pos(x, y, `<div style="display:flex;align-items:baseline;gap:10px"><span class="chiffre ${couleur}" style="font-size:${taille * 0.62}px">${prefixe}</span><span class="chiffre ${couleur}" id="${id}n" style="font-size:${taille}px">${de}</span><span class="chiffre ${couleur}" style="font-size:${taille * 0.62}px">${suffixe}</span></div>${legende ? `<div class="etiq blanc" id="${id}l" style="margin-top:24px">${legende}</div>` : ''}`, { id });
  v.anim(`compte('#${id}n',${de},${a},${t.toFixed(3)},${d},${dec});`);
  v.anim(`tl.fromTo('#${id}',{scale:0.3,opacity:0},{scale:1,opacity:1,duration:0.3,ease:'back.out(2.5)'},${(t - 0.05).toFixed(3)});`);
  v.anim(`tl.fromTo('#${id}',{scale:1},{scale:1.08,duration:0.12,yoyo:true,repeat:1,ease:'power1.inOut'},${(t + d).toFixed(3)});`);
  if (legende) v.entree(`#${id}l`, legendeT ?? t + 0.25, 'bas');
  if (son) v.sfx('caisse', t + d - 0.1, 0.35);
  return { html, id };
};
