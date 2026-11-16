// Sous-titres : MAJUSCULES, Montserrat ExtraBold, contour noir, 3 à 5 mots, apparition mot à mot.
// Mots-clés et chiffres en or. Les balises [..] ne sont jamais dans `mots` (retirées à l'alignement).
const { norm } = require('./studio');

function fusionner(mots, remplacements) {
  const out = [];
  for (let i = 0; i < mots.length; ) {
    let fait = false;
    for (const [phrase, affiche] of remplacements) {
      const c = phrase.split(/\s+/).map(norm);
      if (c.every((x, k) => mots[i + k] && norm(mots[i + k].text) === x)) {
        const der = mots[i + c.length - 1];
        out.push({ text: affiche, start: mots[i].start, end: der.end, punct: der.punct, or: true });
        i += c.length; fait = true; break;
      }
    }
    if (!fait) { out.push({ ...mots[i] }); i++; }
  }
  return out;
}

function groupes(mots) {
  // phrases coupées sur la ponctuation, puis paquets équilibrés de 4 mots max
  const phrases = []; let cur = [];
  mots.forEach((m) => { cur.push(m); if (m.punct) { phrases.push(cur); cur = []; } });
  if (cur.length) phrases.push(cur);
  let gs = [];
  phrases.forEach((p) => {
    const n = Math.ceil(p.length / 4), taille = Math.ceil(p.length / n);
    for (let k = 0; k < p.length; k += taille) gs.push(p.slice(k, k + taille));
  });
  // fusion des paquets trop courts (< 3 mots) avec le voisin si proche dans le temps
  let change = true;
  while (change) {
    change = false;
    for (let k = 0; k < gs.length; k++) {
      const g = gs[k];
      if (g.length >= 3) continue;
      const fin = g[g.length - 1];
      const suiv = gs[k + 1], prec = gs[k - 1];
      const len = (x) => x.reduce((a, m) => a + m.text.length, 0);
      if (suiv && g.length + suiv.length <= 5 && suiv[0].start - fin.end < 0.75 && fin.punct < 2 && len(g) + len(suiv) <= 34) {
        gs.splice(k, 2, g.concat(suiv)); change = true; break;
      }
      if (prec && g.length + prec.length <= 5 && g[0].start - prec[prec.length - 1].end < 0.75 && prec[prec.length - 1].punct < 2 && len(g) + len(prec) <= 34) {
        gs.splice(k - 1, 2, prec.concat(g)); change = true; break;
      }
    }
  }
  return gs;
}

module.exports = function sousTitres(v, { motsCles = [], remplacements = [], cacher = [] }) {
  const cles = new Set(motsCles.map(norm));
  const mots = fusionner(v.mots, remplacements).filter((m) => !cacher.some(([a, b]) => m.start >= a - 0.01 && m.start < b));
  const gs = groupes(mots);
  gs.forEach((g, k) => {
    const id = v.uid('st');
    const debut = Math.max(0, g[0].start - 0.04);
    const suiv = gs[k + 1];
    let fin = g[g.length - 1].end + 0.35;
    if (suiv && suiv[0].start - 0.04 < fin + 0.4) fin = suiv[0].start - 0.04;
    for (const [a, b] of cacher) if (a > debut && a < fin) fin = a;
    const spans = g.map((m, j) => `<span class="m${m.or || cles.has(norm(m.text)) || /\d/.test(m.text) ? ' or' : ''}" id="${id}w${j}">${m.text.toUpperCase()}</span>`).join('');
    v.add(`<div class="clip st" data-start="${debut.toFixed(3)}" data-duration="${(fin - debut).toFixed(3)}" data-track-index="8"><div class="ligne">${spans}</div></div>`);
    g.forEach((m, j) => {
      v.anim(`tl.fromTo('#${id}w${j}',{opacity:0,scale:0.4,y:24},{opacity:1,scale:1.07,y:0,duration:0.12,ease:'back.out(3)'},${m.start.toFixed(3)});`);
      v.anim(`tl.to('#${id}w${j}',{scale:1,duration:0.12,ease:'power1.out'},${Math.max(m.start + 0.12, m.end - 0.05).toFixed(3)});`);
    });
  });
  return gs.length;
};
