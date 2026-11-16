// Moteur de montage Finance : construit une composition HyperFrames (HTML + timeline GSAP)
// à partir d'une liste de scènes calées sur le timing mot à mot de la voix.
const fs = require('fs');
const path = require('path');

const RACINE = path.resolve(__dirname, '..');
const DEPOT = path.resolve(RACINE, '..');

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9'-]/g, '');

class Video {
  constructor({ id, mots, duree, largeur = 1080, hauteur = 1920 }) {
    this.id = id;
    this.mots = mots; // [{text,start,end,punct}]
    this.duree = duree;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.html = [];
    this.js = [];
    this.css = [];
    this.audio = [];
    this.n = 0;
    this.curseur = 0; // position de recherche dans les mots
    this.scenes = [];
  }

  uid(p = 'e') {
    return `${p}${++this.n}`;
  }

  // Temps de début du passage `phrase` (cherché après le passage précédent).
  t(phrase, { fin = false, depuis = null } = {}) {
    const cible = phrase.split(/\s+/).map(norm).filter(Boolean);
    const d0 = depuis ?? this.curseur;
    for (let i = d0; i <= this.mots.length - cible.length; i++) {
      if (cible.every((c, k) => norm(this.mots[i + k].text) === c)) {
        if (depuis === null) this.curseur = i;
        const m = fin ? this.mots[i + cible.length - 1] : this.mots[i];
        return fin ? m.end : m.start;
      }
    }
    throw new Error(`Passage introuvable dans la voix : « ${phrase} » (après le mot ${d0})`);
  }

  // Temps d'un mot à l'intérieur de la scène courante (ne déplace pas le curseur).
  tm(phrase, fin = false) {
    return this.t(phrase, { fin, depuis: this.curseur });
  }

  add(h) {
    this.html.push(h);
  }

  anim(code) {
    this.js.push(code);
  }

  sfx(nom, t, volume = 0.5) {
    if (t < 0 || t >= this.duree) return;
    this.audio.push({ nom, t: +t.toFixed(3), volume });
  }

  // Élément positionné (centre en x,y) ; l'enfant .a reçoit les animations.
  pos(x, y, contenu, { id = this.uid(), cls = '', style = '', w = null } = {}) {
    return `<div class="pos" style="left:${x}px;top:${y}px;${w ? `width:${w}px;` : ''}${style}"><div id="${id}" class="a ${cls}">${contenu}</div></div>`;
  }

  // ---------- Animations d'entrée réutilisables ----------
  entree(sel, t, type = 'pop', d = null) {
    const s = JSON.stringify(sel);
    const T = t.toFixed(3);
    const types = {
      pop: `tl.fromTo(${s},{scale:0,opacity:0},{scale:1,opacity:1,duration:${d ?? 0.35},ease:'back.out(2.2)'},${T});`,
      gauche: `tl.fromTo(${s},{x:-700,opacity:0},{x:0,opacity:1,duration:${d ?? 0.35},ease:'power3.out'},${T});`,
      droite: `tl.fromTo(${s},{x:700,opacity:0},{x:0,opacity:1,duration:${d ?? 0.35},ease:'power3.out'},${T});`,
      haut: `tl.fromTo(${s},{y:-600,opacity:0},{y:0,opacity:1,duration:${d ?? 0.45},ease:'bounce.out'},${T});`,
      bas: `tl.fromTo(${s},{y:500,opacity:0},{y:0,opacity:1,duration:${d ?? 0.35},ease:'back.out(1.6)'},${T});`,
      tampon: `tl.fromTo(${s},{scale:3.2,rotation:-18,opacity:0},{scale:1,rotation:-8,opacity:1,duration:${d ?? 0.22},ease:'power4.in'},${T});`,
      fondu: `tl.fromTo(${s},{opacity:0},{opacity:1,duration:${d ?? 0.2}},${T});`,
      zoom: `tl.fromTo(${s},{scale:1.8,opacity:0},{scale:1,opacity:1,duration:${d ?? 0.3},ease:'power3.out'},${T});`,
    };
    this.anim(types[type]);
    if (type === 'tampon') this.sfx('impact', t + 0.18, 0.35);
    else if (type === 'pop' || type === 'bas') this.sfx('pop', t, 0.4);
  }

  // Petit mouvement permanent (flottement) pour qu'aucun élément ne soit figé.
  flotte(sel, t0, t1, amp = 12, periode = 1.6) {
    const n = Math.max(1, Math.floor((t1 - t0) / periode));
    this.anim(`tl.fromTo(${JSON.stringify(sel)},{y:0},{y:${-amp},duration:${(periode / 2).toFixed(2)},ease:'sine.inOut',yoyo:true,repeat:${n * 2 - 1}},${t0.toFixed(3)});`);
  }

  // ---------- Scène : coupe franche ou zoom rapide 0,3 s, puis Ken Burns ----------
  scene(debut, fin, contenu, { entree = 'zoom', kb = 1.045, son = true, flash = false, fond = '' } = {}) {
    const id = this.uid('sc');
    const d = fin - debut;
    this.scenes.push({ id, debut, fin });
    this.add(`<div class="clip scene" data-start="${debut.toFixed(3)}" data-duration="${d.toFixed(3)}" data-track-index="2" style="${fond}"><div class="kb" id="${id}">${contenu}</div></div>`);
    const dx = this.scenes.length % 2 ? 14 : -14;
    if (entree === 'zoom') {
      this.anim(`tl.fromTo('#${id}',{scale:1.22,rotation:${dx > 0 ? 1.5 : -1.5}},{scale:1,rotation:0,duration:0.3,ease:'power3.out'},${debut.toFixed(3)});`);
      this.anim(`tl.to('#${id}',{scale:${kb},x:${dx},duration:${Math.max(0.1, d - 0.3).toFixed(3)},ease:'none'},${(debut + 0.3).toFixed(3)});`);
    } else if (entree === 'dezoom') {
      this.anim(`tl.fromTo('#${id}',{scale:0.82},{scale:1,duration:0.3,ease:'back.out(1.8)'},${debut.toFixed(3)});`);
      this.anim(`tl.to('#${id}',{scale:${kb},x:${dx},duration:${Math.max(0.1, d - 0.3).toFixed(3)},ease:'none'},${(debut + 0.3).toFixed(3)});`);
    } else {
      // coupe franche : Ken Burns seul
      this.anim(`tl.fromTo('#${id}',{scale:1},{scale:${kb},x:${dx},duration:${d.toFixed(3)},ease:'none'},${debut.toFixed(3)});`);
    }
    if (son) this.sfx('whoosh', Math.max(0, debut - 0.12), 0.45);
    if (flash) {
      const f = this.uid('fl');
      this.add(`<div id="${f}" class="clip flash" data-start="${debut.toFixed(3)}" data-duration="0.2" data-track-index="9"></div>`);
      this.anim(`tl.fromTo('#${f}',{opacity:0.55},{opacity:0,duration:0.18,ease:'power2.out'},${debut.toFixed(3)});`);
    }
    return id;
  }

  // ---------- Page HyperFrames ----------
  page({ titre = 'Finance', chaine = 'FINANCE' } = {}) {
    const audios = this.audio
      .map((a, k) => `<audio id="sfx${k}" class="clip" src="assets/sons/${a.nom}.wav" data-start="${a.t}" data-duration="${Math.min(this.dureeSon(a.nom), this.duree - a.t).toFixed(3)}" data-volume="${a.volume}" data-track-index="${20 + ['whoosh', 'pop', 'impact', 'gag-boing', 'caisse'].indexOf(a.nom) * 3 + (k % 3)}"></audio>`)
      .join('\n      ');
    return `<!doctype html>
<html lang="fr" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${this.largeur}, height=${this.hauteur}" />
    <title>${titre}</title>
    <script src="assets/gsap.min.js"></script>
    <style>
      @font-face { font-family: 'Montserrat'; font-weight: 700; src: url('assets/fonts/montserrat-latin-700-normal.woff2') format('woff2'); }
      @font-face { font-family: 'Montserrat'; font-weight: 800; src: url('assets/fonts/montserrat-latin-800-normal.woff2') format('woff2'); }
      @font-face { font-family: 'Montserrat'; font-weight: 900; src: url('assets/fonts/montserrat-latin-900-normal.woff2') format('woff2'); }
      ${fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8')}
      ${this.css.join('\n')}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${this.duree.toFixed(3)}" data-width="${this.largeur}" data-height="${this.hauteur}">
      ${this.html.join('\n      ')}
      <div class="logo">${chaine}</div>
      <audio id="voix" class="clip" src="assets/voix.wav" data-start="0" data-duration="${this.dureeVoix.toFixed(3)}" data-volume="1" data-track-index="10"></audio>
      <audio id="musique" class="clip" src="assets/musique.wav" data-start="0" data-duration="${this.duree.toFixed(3)}" data-volume="1" data-track-index="11"></audio>
      ${audios}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      const fmt = (v, dec, sep) => { const s = v.toFixed(dec).replace('.', ','); const [e, f] = s.split(','); return e.replace(/\\B(?=(\\d{3})+(?!\\d))/g, sep) + (f ? ',' + f : ''); };
      function compte(sel, a, b, t, d, dec = 0, sep = '\\u202f', ease = 'power2.out') {
        const el = document.querySelector(sel); const o = { v: a };
        el.textContent = fmt(a, dec, sep);
        tl.to(o, { v: b, duration: d, ease, onUpdate: () => { el.textContent = fmt(o.v, dec, sep); } }, t);
      }
      ${this.js.join('\n      ')}
      tl.set({}, {}, ${this.duree.toFixed(3)});
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
  }

  dureeSon(nom) {
    return { whoosh: 0.45, impact: 1.4, 'gag-boing': 0.6, pop: 0.12, caisse: 0.9 }[nom] ?? 1;
  }
}

module.exports = { Video, norm, RACINE, DEPOT };
