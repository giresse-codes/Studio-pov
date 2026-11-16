#!/usr/bin/env node
// Construit le projet HyperFrames d'une vidéo Finance : node outils/build.js 01
// -> rendu/finance-NN/index.html + assets (voix, musique duckée, effets, polices, gsap)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { Video, RACINE, DEPOT } = require('../composants/studio');
const fond = require('../composants/fond');
const sousTitres = require('../composants/sous-titres');
const carteFin = require('../composants/carte-fin');

const NN = String(process.argv[2] || '').padStart(2, '0');
if (!/^\d\d$/.test(NN)) throw new Error('Usage : node outils/build.js <N>');
const dossierVoix = path.join(DEPOT, 'videos', `finance-${NN}`);
const voix = ['voix.wav', 'voix.mp3'].map((f) => path.join(dossierVoix, f)).find(fs.existsSync);
if (!voix) throw new Error(`Voix absente : ${dossierVoix}/voix.wav (ou .mp3)`);
const timing = JSON.parse(fs.readFileSync(path.join(dossierVoix, 'timing.json'), 'utf8'));
const spec = require(path.join(RACINE, 'videos', `finance-${NN}.js`));

const dureeVoix = timing.duration;
const derniereParole = timing.words[timing.words.length - 1].end;
// carte de fin = 5 dernières secondes, après la dernière phrase ; durée totale >= 70 s si possible
const debutFin = Math.max(derniereParole + 0.45, (spec.dureeMin || 70) - 5);
const duree = +(debutFin + 5).toFixed(3);

const v = new Video({ id: `finance-${NN}`, mots: timing.words, duree });
v.dureeVoix = dureeVoix;
v.debutFin = debutFin;
fond(v);
const opts = spec.construire(v) || {};
sousTitres(v, { motsCles: spec.motsCles || [], remplacements: spec.remplacements || [], cacher: [[0, opts.finHook ?? 0], [debutFin, duree + 1]] });
carteFin(v, { t: debutFin, teaser: spec.teaser });

// ---------- assets ----------
const out = path.join(RACINE, 'rendu', `finance-${NN}`);
const A = path.join(out, 'assets');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(A, 'fonts'), { recursive: true });
fs.mkdirSync(path.join(A, 'sons'), { recursive: true });
fs.copyFileSync(require.resolve('gsap/dist/gsap.min.js'), path.join(A, 'gsap.min.js'));
for (const w of [700, 800, 900]) {
  const f = `montserrat-latin-${w}-normal.woff2`;
  fs.copyFileSync(path.join(path.dirname(require.resolve('@fontsource/montserrat/package.json')), 'files', f), path.join(A, 'fonts', f));
}
const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
ff(['-i', voix, '-ar', '44100', '-ac', '1', path.join(A, 'voix.wav')]);

// sons : bibliothèque sons/ en priorité, sinon sons de secours générés en code
const BIB = {
  whoosh: 'effets/whoosh.mp3', impact: 'effets/impact.mp3', 'gag-boing': 'effets/gag-boing.mp3',
  pop: 'effets/pop.mp3', caisse: 'effets/caisse.mp3', musique: 'musiques/lofi-finance.mp3',
};
const manquants = [];
const source = (nom) => {
  const p = path.join(DEPOT, 'sons', BIB[nom]);
  if (fs.existsSync(p)) return p;
  manquants.push(`sons/${BIB[nom]}`);
  return path.join(RACINE, 'assets', 'sons-synth', `${nom === 'musique' ? 'lofi-finance' : nom}.wav`);
};
for (const nom of ['whoosh', 'impact', 'gag-boing', 'pop', 'caisse']) ff(['-i', source(nom), '-ar', '44100', '-ac', '1', path.join(A, 'sons', `${nom}.wav`)]);
// musique : -14 dB hors voix, ~-19 dB sous la voix (ducking par compression sidechain), fondu final
ff(['-stream_loop', '-1', '-i', source('musique'), '-i', voix, '-filter_complex',
  `[0:a]aresample=44100,aformat=channel_layouts=mono,atrim=0:${duree},volume=0.2,afade=t=out:st=${(duree - 1.5).toFixed(2)}:d=1.5[m];` +
  `[1:a]aresample=44100,aformat=channel_layouts=mono,apad=whole_dur=${duree}[v];` +
  `[m][v]sidechaincompress=threshold=0.015:ratio=4:attack=30:release=450:makeup=1[d]`,
  '-map', '[d]', '-t', String(duree), path.join(A, 'musique.wav')]);

fs.writeFileSync(path.join(out, 'index.html'), v.page({ titre: spec.titre, chaine: spec.chaine || 'FINANCE' }));
fs.writeFileSync(path.join(out, 'hyperframes.json'), JSON.stringify({ paths: { assets: 'assets' }, media: { autoProxy: false } }, null, 2));
fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify({ id: `finance-${NN}`, name: spec.titre }, null, 2));
fs.writeFileSync(path.join(out, 'scenes.json'), JSON.stringify(v.scenes.map((s) => ({ ...s, duree: +(s.fin - s.debut).toFixed(2) })), null, 1));

const longues = v.scenes.filter((s) => s.fin - s.debut > 5.05);
console.log(`finance-${NN} : ${duree.toFixed(2)} s, ${v.scenes.length} scènes, carte de fin à ${debutFin.toFixed(2)} s`);
if (longues.length) console.log('ATTENTION scènes > 5 s :', longues.map((s) => `${s.id} ${(s.fin - s.debut).toFixed(1)}s`).join(', '));
if (manquants.length) console.log('Sons absents de sons/ (secours générés utilisés) :', [...new Set(manquants)].join(', '));
