// Processus / schéma : étapes reliées par des flèches qui apparaissent dans l'ordre de la voix.
const { I } = require('./icones');
module.exports = function processus(v, { etapes, y = 640, ecart = 330, taille = 220 }) {
  // etapes : [{icone, label, t}]  disposées en ligne (2 ou 3) avec flèches entre elles
  const n = etapes.length, x0 = 540 - ((n - 1) * ecart) / 2;
  let html = '';
  etapes.forEach((e, k) => {
    const id = v.uid('pr');
    html += v.pos(x0 + k * ecart, y, `${e.icone}${e.label ? `<div class="etiq" style="margin-top:16px;font-size:36px">${e.label}</div>` : ''}`, { id });
    v.entree(`#${id}`, e.t, 'pop');
    if (k < n - 1) {
      const fid = v.uid('pf');
      html += v.pos(x0 + k * ecart + ecart / 2, y - 30, I.fleche(110), { id: fid });
      v.entree(`#${fid}`, etapes[k + 1].t - 0.15, 'gauche', 0.2);
    }
  });
  return html;
};
