// #finance 1 — La machine à laver qui travaille pour toi
const { I } = require('../composants/icones');
const hook = require('../composants/hook');
const compteur = require('../composants/compteur');
const splitScreen = require('../composants/split-screen');
const R = require('../composants/reactions');

module.exports = {
  titre: 'La machine à laver qui travaille pour toi',
  teaser: 'Pourquoi ton salaire ne te rendra jamais riche',
  motsCles: ['téléphone', 'machine', 'laverie', 'buanderie', 'semi-pro', 'moitié', 'toujours', 'garanti', 'monnayeur', 'employé', 'bouche-à-oreille', 'salaire', 'réseau', 'rien', 'sèche-linge'],
  remplacements: [
    ['deux et quatre euros', '2 ET 4 €'],
    ['mille deux cents euros', '1 200 €'],
    ['un an', '1 AN'],
    ['huit lavages', '8 LAVAGES'],
    ['trois euros', '3 €'],
    ['vingt-quatre euros', '24 €'],
    ['sept cents euros', '700 €'],
    ['dix mètres carrés', '10 M²'],
    ['deux machines', '2 MACHINES'],
    ['vingt-quatre heures sur vingt-quatre', '24H/24'],
  ],

  construire(v) {
    // ---- HOOK 0-3 s ----
    const finHook = v.t('qui pourrait');
    v.curseur = 0;
    hook(v, {
      fin: finHook,
      or: [3, 4, 5],
      mots: [
        { texte: 'IL', t: 0.05 }, { texte: 'Y', t: v.tm('y') }, { texte: 'A', t: v.tm('a') },
        { texte: 'UN', t: v.tm('un') }, { texte: 'OBJET', t: v.tm('objet') },
        { texte: 'CHEZ TOI', t: v.tm('chez') },
      ],
    });

    const S = [
      ['qui pourrait', (t0, t1) => {
        // Téléphone qui fond (gauche) vs machine à laver qui brille (droite)
        const h = v.pos(280, 560, `<div style="position:relative">${I.telephone(250)}<div id="b1f" style="position:absolute;left:-10px;bottom:-40px">${I.flaque(270)}</div></div>`, { id: 'b1' }) +
          v.pos(280, 880, '<div class="etiq rouge">FOND</div>', { id: 'b1l' }) +
          v.pos(540, 580, '<div class="txt" style="font-size:90px">VS</div>', { id: 'b2' }) +
          v.pos(800, 560, `<div style="position:relative"><div id="b3g" style="position:absolute;left:50%;top:50%;width:520px;height:520px;margin:-260px 0 0 -260px;border-radius:50%;background:radial-gradient(circle,rgba(255,236,150,.95) 0%,rgba(245,197,66,.55) 35%,rgba(245,197,66,0) 70%)"></div><div style="position:relative">${I.machine(270)}</div></div>`, { id: 'b3' }) +
          v.pos(800, 880, '<div class="etiq vert">BRILLE</div>', { id: 'b3l' }) +
          [[650, 330], [960, 380], [680, 790], [950, 760]].map(([x, y], k) => v.pos(x, y, I.etoile(60), { id: `b3s${k}` })).join('');
        v.entree('#b1', t0, 'gauche');
        v.entree('#b3', t0 + 0.1, 'droite');
        v.entree('#b2', t0 + 0.3, 'pop');
        // le téléphone fond : il s'écrase vers le bas, la flaque s'étale
        v.anim(`tl.fromTo('#b1',{scaleY:1,scaleX:1,transformOrigin:'50% 100%'},{scaleY:0.55,scaleX:1.15,duration:${(t1 - t0 - 0.6).toFixed(2)},ease:'power1.in'},${t0 + 0.5});`);
        v.anim(`tl.fromTo('#b1f',{scaleX:0.2,opacity:0},{scaleX:1.3,opacity:1,duration:${(t1 - t0 - 0.6).toFixed(2)},ease:'power1.out'},${t0 + 0.5});`);
        v.entree('#b1l', v.tm('plus'), 'tampon');
        // la machine brille : halo qui pulse + étoiles
        v.anim(`tl.fromTo('#b3g',{scale:0.8,opacity:0.6},{scale:1.15,opacity:1,duration:0.45,yoyo:true,repeat:7,ease:'sine.inOut'},${t0 + 0.2});`);
        [0, 1, 2, 3].forEach((k) => v.entree(`#b3s${k}`, t0 + 0.4 + k * 0.15, 'pop'));
        v.entree('#b3l', v.tm('téléphone'), 'tampon');
        return h;
      }],
      ['Et tu l\'utilises', (t0, t1) => {
        const h = v.pos(540, 600, I.chaussette(380), { id: 'c1' }) +
          v.pos(250, 360, I.etoile(70), { id: 'c2' }) + v.pos(840, 820, I.etoile(60), { id: 'c3' });
        v.entree('#c1', t0, 'haut', 0.6);
        v.anim(`tl.fromTo('#c1',{rotation:-10},{rotation:10,duration:0.5,yoyo:true,repeat:5,ease:'sine.inOut'},${t0 + 0.5});`);
        v.entree('#c2', t0 + 0.4, 'pop'); v.entree('#c3', t0 + 0.6, 'pop');
        R.zoomComique(v, '#c1', v.tm('chaussettes'));
        return h;
      }],
      ['La machine à laver', (t0, t1) => {
        const h = v.pos(540, 610, I.machine(450), { id: 'm1' }) +
          [[200, 330], [880, 380], [170, 860], [900, 900]].map(([x, y], k) => v.pos(x, y, I.etoile(80 - k * 6), { id: `m1s${k}` })).join('');
        v.entree('#m1', t0, 'zoom');
        v.anim(`tl.to('#m1 .tambour',{rotation:720,svgOrigin:'100 134',duration:${t1 - t0},ease:'power1.in'},${t0});`);
        [0, 1, 2, 3].forEach((k) => v.entree(`#m1s${k}`, t0 + 0.2 + k * 0.12, 'pop'));
        return h;
      }, { flash: true }],
      ['Dans les quartiers', (t0) => {
        const h = v.pos(230, 640, I.immeuble(240, { h: 420 }), { id: 'q1' }) +
          v.pos(540, 590, I.immeuble(260, { h: 520, couleur: '#FFF3D1' }), { id: 'q2' }) +
          v.pos(850, 660, I.immeuble(230, { h: 380 }), { id: 'q3' }) +
          v.pos(540, 990, `<div style="display:flex;align-items:center;gap:20px">${I.croix(110)}<div class="etiq rouge">SANS BUANDERIE</div></div>`, { id: 'q4' });
        v.entree('#q1', v.tm('quartiers'), 'bas');
        v.entree('#q2', v.tm('étudiants'), 'bas');
        v.entree('#q3', v.tm('immeubles'), 'bas');
        v.entree('#q4', v.tm('sans'), 'tampon');
        return h;
      }],
      ['les gens paient', (t0, t1) => {
        const c1 = compteur(v, { x: 290, y: 600, de: 0, a: 2, t: v.tm('deux'), d: 0.4, suffixe: '€', taille: 230, son: false });
        const c2 = compteur(v, { x: 790, y: 600, de: 0, a: 4, t: v.tm('quatre'), d: 0.4, suffixe: '€', taille: 230 });
        const h = c1.html + c2.html +
          v.pos(540, 600, '<div class="txt" style="font-size:120px">À</div>', { id: 'g1' }) +
          v.pos(540, 330, `<div style="display:flex;gap:30px">${I.personne(130)}${I.personne(130, '#FFB547')}${I.personne(130, '#2ED47A')}</div>`, { id: 'g0' }) +
          v.pos(540, 880, `<div style="display:flex;align-items:center;gap:20px">${I.machine(120)}<div class="etiq">PAR MACHINE</div></div>`, { id: 'g2' });
        v.entree('#g0', t0, 'bas');
        v.entree('#g1', v.tm('quatre') - 0.15, 'pop');
        v.entree('#g2', v.tm('laver'), 'bas');
        return h;
      }],
      ['Une seule machine', (t0) => {
        const h = v.pos(540, 570, I.machine(420), { id: 'u1' }) +
          v.pos(540, 940, '<div class="etiq">SEMI-PRO</div>', { id: 'u2' }) +
          v.pos(830, 300, '<div class="chiffre" style="font-size:150px">×1</div>', { id: 'u3' });
        v.entree('#u1', t0, 'pop');
        v.entree('#u3', v.tm('seule'), 'zoom');
        v.entree('#u2', v.tm('semi-pro'), 'tampon');
        return h;
      }],
      ['c\'est environ', (t0) => {
        const c = compteur(v, { x: 540, y: 620, de: 0, a: 1200, t: v.tm('mille'), d: 0.9, suffixe: '€', taille: 250 });
        const h = v.pos(540, 330, I.machine(200), { id: 'e1' }) + c.html +
          v.pos(540, 900, '<div class="etiq" style="font-size:64px">UNE FOIS</div>', { id: 'e2' });
        v.entree('#e1', t0, 'pop');
        v.entree('#e2', v.tm('une fois'), 'tampon');
        return h;
      }],
      ['Un téléphone au même prix', (t0, t1) => {
        const c = compteur(v, { x: 750, y: 520, de: 1200, a: 600, t: v.tm('moitié'), d: 0.8, suffixe: '€', taille: 170, couleur: 'rouge', son: false });
        const h = v.pos(290, 600, `<div style="position:relative">${I.telephone(300)}<div id="t1f" style="position:absolute;left:0;top:0">${I.fissure(300)}</div></div>`, { id: 't1' }) +
          v.pos(180, 330, I.goutte(60), { id: 't2' }) + v.pos(410, 300, I.goutte(50), { id: 't3' }) +
          c.html +
          v.pos(750, 760, '<div class="etiq rouge" style="font-size:80px">-50 %</div>', { id: 't4' }) +
          v.pos(750, 940, `<div style="display:flex;align-items:center;gap:16px">${I.calendrier(150, ['', '', '', '', '', '', ''])}<div class="etiq blanc">DANS 1 AN</div></div>`, { id: 't5' });
        v.entree('#t1', t0, 'gauche');
        v.anim(`tl.fromTo('#t1f',{opacity:0},{opacity:1,duration:0.1},${v.tm('moitié')});`);
        v.entree('#t4', v.tm('moitié') + 0.5, 'tampon');
        v.entree('#t5', v.tm('dans un an'), 'bas');
        // [ironique] : le téléphone tremble et transpire
        R.secousse(v, '#t1', v.tm('vaut'), 0.5);
        v.entree('#t2', v.tm('vaut'), 'pop'); v.entree('#t3', v.tm('vaut') + 0.15, 'pop');
        v.anim(`tl.to(['#t2','#t3'],{y:120,opacity:0,duration:0.8,ease:'power1.in'},${v.tm('vaut') + 0.5});`);
        // [rire] : zoom comique sur le téléphone fissuré
        R.zoomComique(v, '#t1', v.tm('an', true) + 0.6);
        return h;
      }],
      ['La machine elle lave toujours', (t0, t1) => {
        const sp = splitScreen(v, {
          t: t0,
          tDroite: v.tm('machine') - 0.1,
          gauche: { titre: 'TÉLÉPHONE', icone: I.telephone(200, { ecran: '#55606E' }), valeur: '-50 %', couleur: 'rouge', taille: 110, label: 'EN 1 AN', labelCls: 'blanc' },
          droite: { titre: 'MACHINE', icone: I.machine(250), valeur: '+0 %', couleur: 'vert', taille: 110, label: 'LAVE TOUJOURS', labelCls: 'vert' },
        });
        // [rire] : « boing » sur la machine qui tient le coup
        R.boing(v, `#${sp.id}di`, v.tm('lave'));
        v.anim(`tl.to('#${sp.id}gi',{rotation:-14,y:30,duration:0.4,ease:'power2.in'},${v.tm('toujours')});`);
        return sp.html;
      }, { entree: 'cut' }],
      ['Mettons huit lavages', (t0) => {
        let h = v.pos(540, 300, '<div class="etiq" style="font-size:60px">8 LAVAGES / JOUR</div>', { id: 'h0' });
        for (let k = 0; k < 8; k++) {
          const x = 180 + (k % 4) * 240, y = 600 + Math.floor(k / 4) * 290;
          h += v.pos(x, y, I.machine(200), { id: `h${k + 1}` });
          v.entree(`#h${k + 1}`, v.tm('huit') + k * 0.08, 'pop');
        }
        v.entree('#h0', v.tm('par jour'), 'tampon');
        return h;
      }],
      ['à trois euros', (t0) => {
        const c = compteur(v, { x: 540, y: 820, de: 0, a: 24, t: v.tm('Vingt-quatre'), d: 0.6, prefixe: '=', suffixe: '€', taille: 260, legende: 'PAR JOUR', legendeT: v.tm('par jour') });
        const h = v.pos(540, 470, `<div style="display:flex;align-items:center;gap:30px"><span class="chiffre" style="font-size:170px">3€</span><span class="chiffre" style="font-size:150px" id="x2">× 8</span>${I.machine(130)}</div>`, { id: 'x1' }) + c.html;
        v.entree('#x1', v.tm('trois'), 'pop');
        return h;
      }],
      ['environ sept cents', (t0) => {
        const c = compteur(v, { x: 540, y: 620, de: 0, a: 700, t: v.tm('sept'), d: 0.9, suffixe: '€', taille: 260, legende: 'PAR MOIS', legendeT: v.tm('mois') });
        const h = v.pos(540, 290, I.calendrier(280), { id: 'p1' }) + c.html +
          v.pos(540, 1010, `<div style="display:flex;align-items:center;gap:20px">${I.machine(140)}<div class="etiq vert">1 SEULE MACHINE</div></div>`, { id: 'p2' });
        v.entree('#p1', t0, 'haut');
        v.entree('#p2', v.tm('avec'), 'bas');
        return h;
      }],
      ['Tu ne vends rien', (t0) => {
        const h = v.pos(290, 600, `<div style="position:relative">${I.etiquette(300)}<div id="r1x" style="position:absolute;right:-30px;top:-40px">${I.croix(130)}</div></div><div class="etiq blanc" style="margin-top:40px">VENDRE</div>`, { id: 'r1' }) +
          v.pos(790, 600, `<div style="position:relative">${I.megaphone(300)}<div id="r2x" style="position:absolute;right:-30px;top:-40px">${I.croix(130)}</div></div><div class="etiq blanc" style="margin-top:40px">CONVAINCRE</div>`, { id: 'r2' });
        v.entree('#r1', t0, 'gauche');
        v.entree('#r1x', v.tm('rien'), 'tampon');
        v.entree('#r2', v.tm('tu ne convaincs') , 'droite');
        v.entree('#r2x', v.tm('personne'), 'tampon');
        return h;
      }],
      ['le linge sale', (t0, t1) => {
        const h = v.pos(540, 470, I.panier(400), { id: 'l1' }) +
          v.pos(540, 730, '<div class="etiq vert" style="font-size:70px">GARANTI</div>', { id: 'l2' }) +
          v.pos(540, 990, I.calendrier(460), { id: 'l3' });
        v.entree('#l1', t0, 'haut');
        v.anim(`tl.fromTo('#l1 .odeur',{y:0,opacity:.4},{y:-14,opacity:1,duration:0.35,yoyo:true,repeat:7,ease:'sine.inOut'},${t0 + 0.3});`);
        v.entree('#l2', v.tm('garanti'), 'tampon');
        v.entree('#l3', v.tm('chaque') - 0.2, 'bas');
        for (let k = 0; k < 7; k++) v.entree(`#l3 .coche-${k}`, v.tm('semaine') + k * 0.08, 'pop');
        return h;
      }],
      ['Un local de', (t0) => {
        const c = compteur(v, { x: 540, y: 400, de: 0, a: 10, t: v.tm('dix'), d: 0.5, suffixe: 'm²', taille: 170, son: false });
        const h = v.pos(540, 700, '<div class="carte" style="width:900px;height:760px;background:#EAF1FB;border-style:solid"><div style="position:absolute;inset:28px;border:6px dashed #0B1F3A;border-radius:24px;opacity:.5"></div></div>', { id: 'z0' }) +
          c.html +
          v.pos(220, 760, I.machine(180), { id: 'z1' }) + v.pos(420, 760, I.machine(180), { id: 'z2' }) +
          v.pos(630, 760, I.secheLinge(180), { id: 'z3' }) + v.pos(850, 760, I.monnayeur(150), { id: 'z4' }) +
          v.pos(540, 975, '<div class="etiq" style="font-size:40px">2 MACHINES + 1 SÈCHE-LINGE + 1 MONNAYEUR</div>', { id: 'z5' });
        v.entree('#z0', t0, 'pop');
        v.entree('#z1', v.tm('deux machines'), 'haut');
        v.entree('#z2', v.tm('deux machines') + 0.15, 'haut');
        v.entree('#z3', v.tm('sèche-linge'), 'haut');
        v.entree('#z4', v.tm('monnayeur'), 'haut');
        v.anim(`tl.fromTo('#z4 .piece-in',{y:-60},{y:0,duration:0.4,ease:'bounce.out'},${v.tm('monnayeur') + 0.35});`);
        v.entree('#z5', v.tm('monnayeur') + 0.4, 'bas');
        return h;
      }],
      ['Ouvert vingt-quatre', (t0, t1) => {
        const h = v.pos(540, 540, I.horloge(430), { id: 'o1' }) +
          v.pos(540, 880, '<div class="chiffre" style="font-size:170px">24H/24</div>', { id: 'o2' }) +
          v.pos(860, 300, `<div style="position:relative">${I.personne(170)}<div id="o3x" style="position:absolute;right:-40px;top:-30px">${I.croix(110)}</div></div>`, { id: 'o3' });
        v.entree('#o1', t0, 'pop');
        v.anim(`tl.to('#o1 .aiguille-m',{rotation:360*8,svgOrigin:'100 100',duration:${t1 - t0},ease:'none'},${t0});`);
        v.anim(`tl.to('#o1 .aiguille-h',{rotation:360*2/3*2,svgOrigin:'100 100',duration:${t1 - t0},ease:'none'},${t0});`);
        v.entree('#o2', v.tm('vingt-quatre'), 'zoom');
        v.entree('#o3', v.tm('sans employé'), 'pop');
        v.entree('#o3x', v.tm('employé'), 'tampon');
        return h;
      }],
      ['Le bouche-à-oreille', (t0) => {
        const pts = [[220, 380], [860, 380], [200, 860], [880, 860]];
        let h = v.pos(540, 620, I.personne(220, '#F5C542'), { id: 'w0' }) + v.pos(700, 420, I.bulle(170), { id: 'wb' });
        pts.forEach(([x, y], k) => { h += v.pos(x, y, I.personne(150, ['#5B9BE6', '#2ED47A', '#FF8A5B', '#B98CFF'][k]), { id: `w${k + 1}` }); });
        v.entree('#w0', t0, 'pop');
        v.entree('#wb', t0 + 0.15, 'pop');
        pts.forEach((_, k) => v.entree(`#w${k + 1}`, t0 + 0.35 + k * 0.2, 'pop'));
        return h;
      }],
      ['parce que personne', (t0, t1) => {
        const h = v.pos(540, 560, I.laverie(520), { id: 'f1' }) +
          [[190, 330], [890, 360], [180, 820], [900, 800]].map(([x, y], k) => v.pos(x, y, I.coeur(100), { id: `f2${k}` })).join('') +
          v.pos(540, 960, '<div class="etiq vert" style="font-size:60px">CLIENTS FIDÈLES</div>', { id: 'f3' });
        v.entree('#f1', t0, 'pop');
        [0, 1, 2, 3].forEach((k) => v.entree(`#f2${k}`, v.tm('change') + k * 0.12, 'pop'));
        v.entree('#f3', v.tm('marche'), 'tampon');
        return h;
      }],
      ['Enregistre cette vidéo', (t0) => {
        const h = v.pos(540, 600, I.signet(330), { id: 'n1' }) +
          [[250, 400], [830, 420], [300, 850], [800, 860]].map(([x, y], k) => v.pos(x, y, I.etoile(70), { id: `n2${k}` })).join('');
        v.entree('#n1', t0, 'haut');
        [0, 1, 2, 3].forEach((k) => v.entree(`#n2${k}`, t0 + 0.2 + k * 0.08, 'pop'));
        return h;
      }, { flash: true }],
      ['et calcule combien', (t0) => {
        const h = v.pos(540, 450, I.calculatrice(280), { id: 'k1' }) +
          v.pos(540, 810, `<div style="display:flex;align-items:center;gap:24px"><span class="chiffre" style="font-size:150px">? ×</span>${I.machine(170)}</div>`, { id: 'k2' }) +
          v.pos(540, 1030, '<div class="etiq blanc" style="font-size:60px">= TON SALAIRE</div>', { id: 'k3' });
        v.entree('#k1', t0, 'pop');
        v.anim(`tl.fromTo('#k1',{rotation:-4},{rotation:4,duration:0.2,yoyo:true,repeat:5,ease:'sine.inOut'},${t0 + 0.35});`);
        v.entree('#k2', v.tm('machines'), 'pop');
        v.entree('#k3', v.tm('salaire') - 0.1, 'tampon');
        return h;
      }],
      ['Un jour', (t0, t1) => {
        const h = v.pos(540, 600, I.laverie(520), { id: 'j1' });
        v.entree('#j1', t0, 'pop');
        v.anim(`tl.to('#j1',{scale:0.55,duration:0.4,ease:'power2.inOut'},${v.tm('laverie')});`);
        return h;
      }],
      ['Ce sera ton réseau', (t0) => {
        const pts = [[540, 620], [220, 380], [860, 380], [180, 830], [900, 830], [540, 1010], [540, 270]];
        let lignes = '';
        pts.slice(1).forEach(([x, y]) => { lignes += `<line x1="540" y1="620" x2="${x}" y2="${y}" stroke="#F5C542" stroke-width="12" stroke-linecap="round" stroke-dasharray="4 26"/>`; });
        let h = `<svg id="rz" width="1080" height="1300" style="position:absolute;left:0;top:0">${lignes}</svg>`;
        pts.forEach(([x, y], k) => { h += v.pos(x, y, I.laverie(k ? 190 : 290), { id: `rs${k}` }); });
        v.entree('#rz', t0 + 0.1, 'fondu');
        pts.forEach((_, k) => v.entree(`#rs${k}`, t0 + k * 0.1, 'pop'));
        return h;
      }, { entree: 'dezoom' }],
    ];

    // ancrages (dans l'ordre de la voix)
    v.curseur = 0;
    const ancres = S.map(([phrase]) => { const t = v.t(phrase); return { t, idx: v.curseur }; });
    S.forEach(([, f, o = {}], k) => {
      const t0 = ancres[k].t - 0.06;
      const t1 = k + 1 < S.length ? ancres[k + 1].t - 0.06 : v.debutFin;
      v.curseur = ancres[k].idx;
      const html = f(t0, t1);
      v.scene(t0, t1, html, o);
    });
    return { finHook };
  },
};
