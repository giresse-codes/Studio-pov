import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import mots from '../../videos/survie-1a/mots.json';
import {Camera} from '../camera/Camera';
import {FORET, Foret, Vignette} from '../decors/Foret';
import {clamp, keys, prog, s} from '../lib/anim';
import {Bande, Effet} from '../lib/son';
import {Toi} from '../personnages';
import {CarteJeu} from '../ui/CarteJeu';
import {CarteOuverture, EcranChoix} from '../ui/Ecrans';
import {HUD} from '../ui/HUD';
import {IconePas, IconeRester} from '../ui/Icones';
import {SousTitres} from '../ui/SousTitres';
import {TelephoneEcran} from '../ui/Telephone';

/* Mode Survie 1a — « Perdu en forêt ». Ton grave : aucun gag. */

const m = (i: number) => Math.round(mots[i].s * 30);

export const DUREE_SURVIE_1A = s(48);

const MOTS_CLES = ['9', '%', 'réseau.', 'froid.', 'sœur', '18', 'derrière', 'courir,', 'lumière.', 'chemin…', 'restes', 'lac,', 'sentier'];

const T = {
  sentier: m(12),
  arrete: m(15),
  depuis: m(21),
  arbres: m(27),
  telephone: m(30),
  soleil: m(38),
  froid: m(43),
  beaucoup: m(47),
  message: m(50),
  coupe: m(58),
  bruit: m(75),
  bouger: m(79),
  cerveau: m(82),
  hurle: m(84),
  marcher: m(88),
  route: m(92),
  lumiere: m(98),
  option1: m(105),
  option2: m(113),
  choix: m(120) - 4,
};

const hhmm = (v: number) => {
  const t = Math.round(v);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

export const Survie1a: React.FC = () => {
  const f = useCurrentFrame();

  const toiX = keys(f, [
    [0, 450],
    [m(11) + 20, 1380],
    [T.depuis, 1380],
    [T.telephone - 10, 2900],
    [T.hurle, 2900],
    [m(97) + 10, 3150],
  ], Easing.linear);
  const marche = (f < m(11) + 20) || (f >= T.depuis && f < T.telephone - 10) || (f >= T.hurle && f < m(97) + 10);

  const lumiere = keys(f, [
    [0, 0.85],
    [T.soleil, 0.85],
    [T.froid + 20, 0.6],
    [m(49) + 10, 0.52],
    [T.bruit, 0.45],
    [T.lumiere, 0.38],
    [DUREE_SURVIE_1A, 0.32],
  ]);
  const brume = keys(f, [
    [0, 0.35],
    [T.soleil, 0.4],
    [T.bruit, 0.75],
    [DUREE_SURVIE_1A, 0.9],
  ]);
  const telEnMain = (f >= T.telephone && f < T.soleil) || (f >= T.message && f < T.bruit);

  const plans = [
    {f: 0, x: 800, y: 1000, z: 1.2},
    {f: s(0.5), x: 1300, y: 1090, z: 1.45, d: m(11) + 10},
    {f: T.sentier, x: 1450, y: 1150, z: 1.8, d: 20},
    {f: T.depuis, x: 2950, y: 1130, z: 1.5, d: T.telephone - 10 - T.depuis, ease: Easing.inOut(Easing.quad)},
    {f: T.telephone, x: 2960, y: 1120, z: 2.2, d: 14},
    {f: T.soleil, x: 2900, y: 960, z: 1.15, d: 36},
    {f: T.message, x: 2960, y: 1120, z: 2.1, d: 14},
    {f: T.bruit, x: 2700, y: 1150, z: 1.9, d: 14},
    {f: T.hurle, x: 2960, y: 1060, z: 2.7, d: 4},
    {f: T.marcher, x: 3060, y: 1150, z: 1.6, d: 4},
    {f: T.route, x: 3130, y: 1060, z: 2.6, d: 4},
    {f: T.lumiere, x: 3000, y: 950, z: 1.2, d: 34},
    {f: T.option1, x: 3100, y: 1080, z: 1.5, d: 30},
  ];

  const effets: Effet[] = [
    {f: 0, son: 'pas-feuilles', vol: 0.4, dur: m(11) + 20},
    {f: T.depuis, son: 'pas-feuilles', vol: 0.4, dur: T.telephone - T.depuis},
    {f: T.arrete, son: 'carte', vol: 0.35},
    {f: T.telephone, son: 'pop', vol: 0.3},
    {f: T.coupe, son: 'buzzer-erreur', vol: 0.25},
    {f: T.bouger, son: 'buisson', vol: 0.6},
    {f: T.hurle, son: 'coeur', vol: 0.6, dur: T.lumiere - T.hurle},
    {f: T.hurle, son: 'pas-feuilles', vol: 0.5, dur: m(97) - T.hurle},
    {f: T.lumiere, son: 'carte', vol: 0.35},
    {f: T.option1, son: 'carte', vol: 0.4},
    {f: T.option2, son: 'carte', vol: 0.4},
    {f: T.choix, son: 'carte', vol: 0.45},
  ];

  return (
    <AbsoluteFill style={{background: '#03050c'}}>
      <Camera
        plans={plans}
        mondeW={FORET.W}
        mondeH={FORET.H}
        haut={0}
        bas={1700}
        secousse={f >= T.hurle && f < T.lumiere ? 3 : 0}
      >
        <Foret lumiere={lumiere} brume={brume} buissonBouge={T.bouger} lueur={telEnMain ? {x: toiX + 70, y: 1090, force: 0.8} : undefined}>
          {/* le même arbre, deux fois : la branche cassée */}
          {f >= T.arbres &&
            f < T.telephone &&
            FORET.reperes.map((x) => (
              <circle key={x} cx={x + 150} cy={1262} r={70 + Math.sin(f * 0.15) * 6} fill="none" stroke="#e5e7eb" strokeWidth={4} opacity={0.45 * clamp((f - T.arbres) / 10)} strokeDasharray="14 10" />
            ))}
          <Toi
            x={toiX}
            y={1500}
            sac
            tremble={f >= T.froid && f < T.hurle ? 1.4 : 0}
            ecranTel="#8ab4f8"
            timeline={[
              {f: 0, base: 'marche', bras: 'repos', expr: 'neutre', regard: [1, 0]},
              {f: m(11) + 20, base: 'debout'},
              {f: T.sentier, expr: 'curieux', regard: [-1, 0]},
              {f: T.arrete + 10, regard: [1, 0]},
              {f: m(19), expr: 'triste'},
              {f: T.depuis, base: 'marche', expr: 'concentre', regard: [1, 0]},
              {f: T.arbres, regard: [-0.5, -0.6]},
              {f: T.telephone - 10, base: 'debout'},
              {f: T.telephone, bras: 'telephone', expr: 'concentre', regard: [1, 0.5]},
              {f: m(32), expr: 'triste'},
              {f: T.soleil, bras: 'repos', regard: [0.5, -1]},
              {f: T.froid, bras: 'croises', expr: 'triste', regard: [0.4, 0.2]},
              {f: T.message, bras: 'telephone', expr: 'concentre', regard: [1, 0.5]},
              {f: T.coupe, expr: 'triste'},
              {f: T.bruit, bras: 'repos', expr: 'surpris', regard: [-1, 0]},
              {f: T.cerveau, expr: 'panique'},
              {f: T.hurle, base: 'marche'},
              {f: m(97) + 10, base: 'debout'},
              {f: T.lumiere, expr: 'triste', regard: [0.6, -0.8]},
              {f: T.option1, bras: 'reflechit', expr: 'concentre', regard: [0.5, -0.4]},
            ]}
          />
          {/* souffle qui fume dans le froid */}
          {f >= T.froid &&
            [0, 1].map((i) => {
              const p = ((f - T.froid + i * 45) % 90) / 30;
              if (p > 1) return null;
              return <ellipse key={i} cx={toiX + 40 + p * 50} cy={1078 - p * 40} rx={10 + p * 26} ry={7 + p * 16} fill="#dbeafe" opacity={(1 - p) * 0.55} />;
            })}
        </Foret>
      </Camera>

      {/* ambiance : vignette sombre, froid bleuté, cœur qui bat */}
      <Vignette force={0.6} />
      <Vignette force={0.5 * prog(f, T.froid, 60)} couleur="110,160,230" />
      {f >= T.bruit && f < T.hurle && <Vignette force={0.45 * prog(f, T.bruit, 20)} />}
      {f >= T.hurle && f < T.lumiere && <Vignette force={0.35 + 0.35 * Math.abs(Math.sin((f - T.hurle) * 0.21))} couleur="170,20,20" />}

      {/* cartes et téléphone */}
      <CarteOuverture debut={4} fin={T.sentier - 10} ligne1="SAMEDI • 17:40" ligne2="Forêt de montagne" ligne3="Toi, randonneur" />
      <CarteJeu debut={T.sentier + 4} fin={T.depuis - 2} surtitre="SENTIER" couleurSurtitre="#fb923c" titre="Disparu depuis 20 min" x={380} y={290} largeur={640} />
      <TelephoneEcran debut={T.telephone + 4} fin={T.soleil - 6} batterie={9} heure="17:46" />
      <TelephoneEcran
        debut={T.message + 4}
        fin={T.bruit - 6}
        batterie={9}
        heure="17:51"
        reseauCoupe={T.coupe}
        message={{a: 'Ma sœur', texte: '« Je fais le grand tour du lac, je rentre vers 18 h. »', debut: m(52), envoye: 'Envoyé à 16:52 ✓'}}
      />
      <CarteJeu debut={T.lumiere} fin={T.option1 - 4} surtitre="LUMIÈRE RESTANTE" couleurSurtitre="#fb923c" titre="≈ 1 heure" x={380} y={290} largeur={640} />

      {/* les deux options */}
      {f >= T.option1 - 4 && f < T.choix + 10 && (
        <AbsoluteFill style={{background: `rgba(2,4,12,${0.65 * clamp((f - T.option1 + 4) / 10)})`}}>
          <CarteJeu debut={T.option1} fin={T.choix} surtitre="OPTION 1" couleurSurtitre="#4ade80" titre="Marcher pour retrouver le chemin" icone={<IconePas s={110} />} x={540} y={440} largeur={900} />
          <CarteJeu debut={T.option2} fin={T.choix} surtitre="OPTION 2" couleurSurtitre="#f87171" titre="Rester exactement où tu es" icone={<IconeRester s={110} />} x={540} y={930} largeur={900} />
        </AbsoluteFill>
      )}

      <HUD
        compteur={[
          [0, 17 * 60 + 40],
          [T.telephone, 17 * 60 + 46],
          [T.message, 17 * 60 + 51],
          [T.bruit, 17 * 60 + 54],
          [T.lumiere, 17 * 60 + 59],
        ]}
        format={hhmm}
        barre={[
          [0, 0.85],
          [T.froid, 0.72],
          [T.beaucoup, 0.55],
          [T.bruit, 0.5],
          [T.lumiere, 0.42],
          [DUREE_SURVIE_1A, 0.36],
        ]}
        unite=""
        label="HEURE • CHALEUR"
        icone="coeur"
        inverse
        alerte={0.55}
      />
      <EcranChoix debut={T.choix} vert="Marcher pour retrouver le chemin" rouge="Rester sur place" ctaDebut={s(44.9)} />
      {f < T.choix && <SousTitres mots={mots} motsCles={MOTS_CLES} y={1400} />}

      <Bande voix="videos/survie-1a/voix.wav" mots={mots} effets={effets} ambiance="ambiances/foret-soir.mp3" musique="musiques/suspense.mp3" />
    </AbsoluteFill>
  );
};
