// Comparaison gauche / droite avec icônes, valeurs et badge VS.
module.exports = function splitScreen(v, { t, gauche, droite, tDroite = null }) {
  const id = v.uid('sp');
  const cote = (c, cls, k) => `<div class="cote ${cls}" id="${id}${k}">
      ${c.titre ? `<div class="etiq blanc" style="font-size:40px">${c.titre}</div>` : ''}
      <div id="${id}${k}i" class="a">${c.icone}</div>
      ${c.valeur ? `<div class="chiffre ${c.couleur || ''}" id="${id}${k}v" style="font-size:${c.taille || 120}px">${c.valeur}</div>` : ''}
      ${c.label ? `<div class="etiq ${c.labelCls || ''}" style="font-size:40px">${c.label}</div>` : ''}
    </div>`;
  const html = `<div class="split">${cote(gauche, 'g', 'g')}${cote(droite, 'd', 'd')}<div class="vs" id="${id}vs">VS</div></div>`;
  v.entree(`#${id}g`, t, 'gauche');
  v.entree(`#${id}d`, tDroite ?? t + 0.15, 'droite');
  v.entree(`#${id}vs`, (tDroite ?? t + 0.15) + 0.2, 'pop');
  return { html, id };
};
