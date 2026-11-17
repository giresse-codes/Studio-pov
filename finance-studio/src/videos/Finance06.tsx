import React from 'react';
import {Easing, interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-06-mots.json';
import {IconeNeon} from '../composants/IconeNeon';
import {Flottant} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Barre, Etiquette, prog, sortie, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {BandeSon} from '../composants/Sons';
import {ObjetAir, Perso} from '../composants/raccourcis';
import {C, halo, SOL_Y} from '../style';

// Script 6 — Les intérêts composés
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {huitieme: 'or', merveille: 'or'}},
  {debut: 10, couleurs: {jamais: 'rouge'}},
  {debut: 16, couleurs: {reel: 'vert'}},
  {debut: 23, couleurs: {interets: 'or', composes: 'or'}},
  {debut: 26, couleurs: {'28': 'or', '29': 'or', '31': 'vert', '32': 'vert', '33': 'vert'}},
  {debut: 34, couleurs: {'39': 'or', '40': 'or'}},
  {debut: 41, couleurs: {'49': 'vert', '50': 'vert'}},
  {debut: 54, couleurs: {cent: 'or', vingt: 'or', et: 'or', un: 'or'}},
  {debut: 58, couleurs: {ridicule: 'attenue'}},
  {debut: 62, couleurs: {deux: 'attenue', cents: 'attenue', euros: 'attenue'}},
  {debut: 71, couleurs: {deux: 'or', cent: 'or', cinquanteneuf: 'or'}},
  {debut: 75, couleurs: {mille: 'or', sept: 'or', cent: 'or', quarantecinq: 'or'}},
  {debut: 81, couleurs: {rien: 'vert'}},
  {debut: 84, couleurs: {enfants: 'or'}},
  {debut: 97, couleurs: {cinquante: 'or', euros: 'or'}},
  {debut: 106, couleurs: {dixhuit: 'attenue', mille: 'attenue', euros: 'attenue'}},
  {debut: 112, couleurs: {cent: 'vert', mille: 'vert'}},
  {debut: 118, couleurs: {temps: 'bleu'}},
  {debut: 129, couleurs: {vingt: 'vert', '136': 'vert', quarante: 'attenue'}},
  {debut: 144, couleurs: {video: 'or'}},
  {debut: 147, couleurs: {hier: 'attenue'}},
  {debut: 154, couleurs: {mois: 'vert', moisci: 'vert'}},
];

const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
const K = [0, coupe(23), coupe(26), coupe(58), coupe(81), coupe(97), coupe(118), coupe(129), coupe(144)];
const FIN_VOIX = 54.48;
const FIN_SCENE = 54.8;
export const DUREE_F06 = FIN_SCENE + 1.2;

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ');

/* ---------- Scènes ---------- */

// « Einstein aurait dit que c'était la huitième merveille du monde. Il n'a probablement jamais dit ça.
//   Mais le principe, lui, est bien réel. »
const S1: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[0]} fin={K[1]}>
      <Perso x={260} gris cles={[[0, 'debout'], [w(1), 'presenteDroite']]} />
      <Flottant x={660} y={960} largeur={300} hauteur={230} opacity={sortie(t, w(18), 0.5)}>
        <Apparait a={w(2)}>
          <IconeNeon nom="bulle" epaisseur={5} remplissage={0.06} />
        </Apparait>
      </Flottant>
      <div style={{opacity: sortie(t, w(18), 0.5)}}>
        <Etiquette x={660} y={950} texte="8E" couleur="or" taille={64} a={w(6)} />
      </div>
      <Flottant x={660} y={960} largeur={260} hauteur={230} opacity={sortie(t, w(18), 0.5)}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={7} trace={prog(t, w(13), 0.45)} />
      </Flottant>
      <ObjetAir x={720} y={1150} l={260} h={240} a={w(19)} nom="graphique" couleur="#C9D1DB" couleurCourbe="vert" courbe="monte" epaisseur={5} intensite={0.6} />
      <ObjetAir x={900} y={950} l={100} h={80} a={w(22)} nom="coche" couleur="vert" epaisseur={7} />
    </Plan>
  );
};

// « Les intérêts composés. »
const S2: React.FC = () => {
  const t = useT();
  const p = prog(t, w(24), 1.2, Easing.in(Easing.quad));
  return (
    <Plan debut={K[1]} fin={K[2]}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: halo(C.or, 0.8)}}>
        <path
          d={`M 200 1400 C 600 1400 760 1330 880 820`}
          fill="none"
          stroke={C.or}
          strokeWidth={6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />
      </svg>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: prog(t, K[1] + 0.1, 0.4)}}>
        <path d={`M 160 760 V 1440 H 940`} fill="none" stroke="#AEB6C0" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      </svg>
    </Plan>
  );
};

// « Tu places cent euros à dix pour cent. Fin d'année un, tu as cent dix.
//   Année deux, les dix pour cent s'appliquent sur cent dix, pas sur cent. Cent vingt et un. »
const S3: React.FC = () => {
  const t = useT();
  const echelle = 2.6; // px par euro
  const cols = [
    {x: 260, v: 100, a: w(28), gain: 0, aGain: 0, label: 'AN 0'},
    {x: 540, v: 110, a: w(36), gain: 10, aGain: w(39), label: 'AN 1'},
    {x: 820, v: 121, a: w(42), gain: 11, aGain: w(54), label: 'AN 2'},
  ];
  return (
    <Plan debut={K[2]} fin={K[3]}>
      {cols.map((c, i) => {
        const base = c.v - c.gain;
        const pBase = prog(t, c.a, 0.5);
        const pGain = c.gain ? prog(t, c.aGain, 0.5) : 0;
        const hBase = base * echelle * pBase;
        const hGain = c.gain * echelle * pGain;
        const montant = base + c.gain * pGain;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: c.x - 80, top: SOL_Y - hBase, width: 160, height: hBase, border: `4px solid ${C.or}`, borderRadius: 8, background: `${C.or}18`, filter: halo(C.or, 0.6), opacity: pBase}} />
            {c.gain > 0 && (
              <div style={{position: 'absolute', left: c.x - 80, top: SOL_Y - hBase - hGain - 6, width: 160, height: hGain, border: `4px solid ${C.vert}`, borderRadius: 8, background: `${C.vert}30`, filter: halo(C.vert, 0.6), opacity: pGain}} />
            )}
            <Etiquette x={c.x} y={SOL_Y - c.v * echelle - 40} texte={`${fmt(montant)} €`} couleur={pGain > 0.5 ? 'vert' : 'or'} taille={40} a={c.a + 0.2} />
            <Etiquette x={c.x} y={SOL_Y + 70} texte={c.label} taille={30} a={c.a} style={{color: '#AEB6C0'}} />
          </React.Fragment>
        );
      })}
      <Etiquette x={400} y={1000} texte="+10 %" couleur="vert" taille={42} a={w(31)} />
      <Etiquette x={680} y={1000} texte="+10 %" couleur="vert" taille={42} a={w(44)} />
    </Plan>
  );
};

// « Ça a l'air ridicule. Mais année dix, ce n'est plus deux cents euros. C'est deux cent cinquante-neuf.
//   Année trente, mille sept cent quarante-cinq. »
const S4: React.FC = () => {
  const t = useT();
  const X0 = 160;
  const X1 = 940;
  const Y0 = 1440;
  const H = 650;
  const xAn = (n: number) => X0 + ((X1 - X0) * n) / 30;
  const yVal = (v: number) => Y0 - (v / 1745) * H;
  // jusqu'où la courbe est tracée (en années)
  const an = interpolate(t, [K[3] + 0.2, w(58) + 1, w(63), w(64) + 0.6, w(75), w(77) + 0.4], [0, 3, 3, 10, 10, 30], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const pts: string[] = [];
  for (let n = 0; n <= an + 1e-6; n += 0.25) pts.push(`${xAn(n)},${yVal(100 * Math.pow(1.1, n))}`);
  pts.push(`${xAn(an)},${yVal(100 * Math.pow(1.1, an))}`);
  const pLin = prog(t, w(67), 0.6);
  const points = [
    {n: 1, v: 110, a: K[3] + 0.6},
    {n: 10, v: 259, a: w(72)},
    {n: 30, v: 1745, a: w(77)},
  ];
  return (
    <Plan debut={K[3]} fin={K[4]}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path d={`M ${X0} ${Y0 - H - 20} V ${Y0} H ${X1 + 20}`} fill="none" stroke="#AEB6C0" strokeWidth={3} strokeLinecap="round" opacity={0.55} />
        {/* ce que l'on imagine : une droite (intérêts simples) */}
        <path
          d={`M ${xAn(0)} ${yVal(100)} L ${xAn(10)} ${yVal(200)}`}
          stroke="#AEB6C0"
          strokeWidth={3}
          strokeDasharray="10 10"
          opacity={0.7 * pLin * sortie(t, w(77), 0.6)}
        />
        <g style={{filter: halo(C.or, 0.8)}}>
          <polyline points={pts.join(' ')} fill="none" stroke={C.or} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => {
            const o = prog(t, p.a, 0.3);
            return <circle key={i} cx={xAn(p.n)} cy={yVal(p.v)} r={12} fill={C.or} opacity={o} />;
          })}
        </g>
      </svg>
      <div style={{opacity: pLin * sortie(t, w(72), 0.4)}}>
        <Etiquette x={xAn(10)} y={yVal(200) - 30} texte="200 €" taille={34} a={w(67)} style={{color: '#AEB6C0'}} />
      </div>
      <Etiquette x={xAn(1) + 40} y={yVal(110) - 30} texte="110 €" couleur="or" taille={30} a={K[3] + 0.6} />
      <Etiquette x={xAn(10)} y={yVal(259) - 34} texte="259 €" couleur="or" taille={38} a={w(72)} />
      <Etiquette x={xAn(30) - 110} y={yVal(1745) + 20} texte="1 745 €" couleur="or" taille={44} a={w(77)} />
      {[1, 10, 30].map((n) => (
        <Etiquette key={n} x={xAn(n)} y={Y0 + 60} texte={`AN ${n}`} taille={26} a={n === 1 ? K[3] + 0.6 : n === 10 ? w(63) : w(75)} style={{color: '#AEB6C0'}} />
      ))}
    </Plan>
  );
};

// « Sans rien ajouter. Ton argent a fait des enfants, et ses enfants ont fait des enfants. »
const S5: React.FC = () => {
  const t = useT();
  const niveaux = [
    {y: 1400, n: 1, a: w(84)},
    {y: 1220, n: 2, a: w(89)},
    {y: 1050, n: 4, a: w(92)},
    {y: 890, n: 8, a: w(96)},
  ];
  const xs = (n: number) => Array.from({length: n}).map((_, i) => 540 + (i - (n - 1) / 2) * (840 / Math.max(n, 2)) * (n === 2 ? 0.8 : 1));
  return (
    <Plan debut={K[4]} fin={K[5]}>
      <Etiquette x={180} y={1460} texte="+0 €" taille={40} a={w(82)} style={{color: '#AEB6C0'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: halo(C.or, 0.4)}}>
        {niveaux.slice(1).map((nv, k) => {
          const parents = xs(niveaux[k].n);
          const enfants = xs(nv.n);
          const p = prog(t, nv.a - 0.2, 0.5);
          return enfants.map((x, j) => {
            const px = parents[Math.floor(j / 2)];
            return (
              <line key={`${k}-${j}`} x1={px} y1={niveaux[k].y - 30} x2={px + (x - px) * p} y2={niveaux[k].y - 30 + (nv.y + 30 - niveaux[k].y + 30) * p} stroke={C.or} strokeWidth={3} opacity={0.6} />
            );
          });
        })}
      </svg>
      {niveaux.map((nv, k) =>
        xs(nv.n).map((x, j) => (
          <ObjetAir key={`${k}-${j}`} x={x} y={nv.y} l={70 - k * 8} h={70 - k * 8} a={nv.a + j * 0.04} nom="piece" couleur="or" epaisseur={3} />
        )),
      )}
    </Plan>
  );
};

// « Maintenant ajoute cinquante euros par mois pendant trente ans. Tu auras versé dix-huit mille euros.
//   Tu en auras environ cent mille. »
const S6: React.FC = () => {
  const t = useT();
  const hMax = 520;
  const pVerse = prog(t, w(108), 0.8);
  const pObtenu = prog(t, w(113), 1.2, Easing.inOut(Easing.cubic));
  return (
    <Plan debut={K[5]} fin={K[6]}>
      <Etiquette x={540} y={790} texte="+50 € / MOIS × 30 ANS" couleur="or" taille={36} a={w(99)} style={{letterSpacing: '0.06em'}} />
      {/* versé */}
      <div style={{position: 'absolute', left: 260, top: SOL_Y - hMax * 0.18 * pVerse, width: 180, height: hMax * 0.18 * pVerse, border: `4px solid #C9D1DB`, borderRadius: 8, background: '#C9D1DB18', filter: halo('#C9D1DB', 0.5), opacity: pVerse}} />
      <Etiquette x={350} y={SOL_Y - hMax * 0.18 - 40} texte="18 000 €" taille={38} a={w(109)} style={{color: '#C9D1DB'}} />
      <Etiquette x={350} y={SOL_Y + 70} texte="VERSÉ" taille={28} a={w(108)} style={{color: '#AEB6C0'}} />
      {/* obtenu */}
      <div style={{position: 'absolute', left: 640, top: SOL_Y - hMax * pObtenu, width: 180, height: hMax * pObtenu, border: `4px solid ${C.vert}`, borderRadius: 8, background: `${C.vert}22`, filter: halo(C.vert, 0.7), opacity: pObtenu > 0 ? 1 : 0}} />
      <Etiquette x={730} y={SOL_Y - hMax * pObtenu - 40} texte={`≈ ${fmt(18000 + 82000 * pObtenu)} €`} couleur="vert" taille={40} a={w(113)} />
      <Etiquette x={730} y={SOL_Y + 70} texte="OBTENU" taille={28} a={w(113)} style={{color: '#AEB6C0'}} />
    </Plan>
  );
};

// « Le seul ingrédient qu'on ne peut pas acheter, c'est le temps. »
const S7: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[6]} fin={K[7]}>
      <ObjetAir x={300} y={1200} l={220} h={110} a={w(120)} nom="etiquette" couleur="or" epaisseur={5} remplissage={0.1} />
      <Flottant x={300} y={1200} largeur={200} hauteur={200}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={7} trace={prog(t, w(124), 0.45)} />
      </Flottant>
      <ObjetAir x={740} y={1180} l={300} h={300} a={w(127)} nom="horloge" couleur="bleu" epaisseur={6} remplissage={0.06} aiguille={(t - w(127)) * 160} />
    </Plan>
  );
};

// « C'est pour ça que commencer à vingt ans vaut plus que commencer riche à quarante. »
const S8: React.FC = () => (
  <Plan debut={K[7]} fin={K[8]}>
    <Perso x={270} echelle={0.75} cles={[[0, 'debout'], [w(138), 'brasLeves']]} a={w(133)} />
    <Etiquette x={270} y={SOL_Y + 80} texte="20 ANS" couleur="vert" taille={36} a={w(135)} />
    <Barre x={270} y={890} largeur={380} a={w(136)} d={1.2} couleur="vert" />
    <Perso x={790} echelle={0.75} gris a={w(140)} />
    <ObjetAir x={900} y={1330} l={60} h={60} a={w(141)} nom="piece" couleur="or" epaisseur={3} />
    <Etiquette x={790} y={SOL_Y + 80} texte="40 ANS" taille={36} a={w(142)} style={{color: '#AEB6C0'}} />
    <Barre x={790} y={890} largeur={380} a={w(142)} d={0.8} valeur={0.35} couleur="#AEB6C0" />
  </Plan>
);

// « Enregistre cette vidéo. Le meilleur moment pour commencer, c'était hier. Le deuxième meilleur, c'est ce mois-ci. »
const S9: React.FC = () => {
  const t = useT();
  const fin = w(147) - 0.1;
  return (
    <Plan debut={K[8]} fin={FIN_SCENE}>
      <Flottant x={540} y={1150} largeur={180} hauteur={260} opacity={sortie(t, fin)}>
        <Apparait a={w(144)}>
          <IconeNeon nom="telephone" epaisseur={5} remplissage={0.06} />
        </Apparait>
      </Flottant>
      <Flottant x={540} y={1150} largeur={60} hauteur={70} opacity={sortie(t, fin)}>
        <Apparait a={w(144) + 0.1}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
            <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
          </svg>
        </Apparait>
      </Flottant>
      <Flottant x={602} y={1040} largeur={56} hauteur={84} opacity={sortie(t, fin)}>
        <Apparait a={w(146)}>
          <IconeNeon nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
        </Apparait>
      </Flottant>
      <ObjetAir x={320} y={1220} l={220} h={210} a={w(150)} nom="calendrier" couleur="#AEB6C0" epaisseur={4} remplissage={0.03} intensite={0.4} />
      <Etiquette x={320} y={1420} texte="HIER" taille={34} a={w(153)} style={{color: '#AEB6C0'}} />
      <ObjetAir x={760} y={1220} l={220} h={210} a={w(155)} nom="calendrier" epaisseur={5} remplissage={0.06} />
      <Etiquette x={760} y={1420} texte="CE MOIS-CI" couleur="vert" taille={34} a={w(158)} />
      <ObjetAir x={900} y={1040} l={36} h={110} a={w(159)} nom="flecheHaut" couleur="vert" epaisseur={6} />
    </Plan>
  );
};

const EFFETS: Array<[number, string]> = [
  [w(13), 'clic-doux'],
  [w(22), 'pop-leger'],
  [w(28), 'piece'],
  [w(39), 'piece'],
  [w(54), 'piece'],
  [w(72), 'pop-leger'],
  [w(77), 'pop-leger'],
  [w(89), 'piece'],
  [w(92), 'piece'],
  [w(96), 'piece'],
  [w(109), 'clic-doux'],
  [w(116), 'pop-leger'],
  [w(124), 'clic-doux'],
  [w(146), 'clic-doux'],
  [w(158), 'pop-leger'],
];

export const Finance06: React.FC = () => (
  <>
    <CadreVideo
      scenes={
        <>
          <S1 />
          <S2 />
          <S3 />
          <S4 />
          <S5 />
          <S6 />
          <S7 />
          <S8 />
          <S9 />
        </>
      }
      texte={<TexteMotAMot mots={MOTS} phrases={PHRASES} fin={FIN_SCENE} />}
      dessus={<FonduNoir coupes={K.slice(1)} finNoir={FIN_SCENE} />}
    />
    <BandeSon voix="voix/finance-06.wav" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
