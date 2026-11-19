import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import mots from '../../videos/survie-1b/mots.json';
import {Camera} from '../camera/Camera';
import {FORET, Foret, Vignette} from '../decors/Foret';
import {keys, pop, prog, s} from '../lib/anim';
import {Bande, Effet} from '../lib/son';
import {Personnage, TENUE_TOI, Tenue} from '../personnages';
import {CarteJeu} from '../ui/CarteJeu';
import {CarteOuverture, ChoixRappel, EcranAbonne} from '../ui/Ecrans';
import {HUD} from '../ui/HUD';
import {CarteZone, IconeVoitureEau, Inventaire, Respiration, TelephoneUrgence, TuilesStop} from '../ui/SchemaSurvie';
import {SousTitres} from '../ui/SousTitres';

/* Mode Survie 1b — « Perdu en forêt » (la réponse). Ton grave, gestes clairs, aucun gag. */

const m = (i: number) => Math.round(mots[i].s * 30);

export const DUREE_SURVIE_1B = s(79.5);

const MOTS_CLES = ['marcher…', "l'erreur.", 'sœur', 'lac.', '18', 'secours', 'tomber,', 'blesser…', 'zone', 'STOP.', "S'arrêter.", 'Tête', 'froide', 'Observer', 'Planifier.', '112', 'avion', 'froid.', 'danger', 'sol', 'vent.', 'visible', 'rouge', 'lampe.', 'sifflet,', 'détresse.', 'animal.', 'itinéraire.', 'Prévenir', 'survivre.'];

const T = {
  rappel: 3,
  erreur: m(16),
  carte: m(20) - 4,
  boucle: m(27),
  secours: m(45),
  noir: m(48),
  tomber: m(58),
  blesser: m(61),
  sortir: m(62),
  zone: m(67),
  regle: m(72),
  stop: m(77),
  S: m(78),
  Tt: m(81),
  O: m(86),
  ceQue: m(89),
  P: m(96),
  tel: m(99),
  essaie: m(102),
  avion: m(119),
  rallume: m(126),
  froid: m(131),
  isole: m(141),
  branches: m(146),
  feuilles: m(148),
  sac: m(150),
  vent: m(151),
  mets: m(154),
  visible: m(162),
  lampe: m(172),
  sifflet: m(173),
  eclats: m(177),
  bruit: m(186),
  animal: m(190),
  rester: m(203),
  prevenir: m(213),
  teaser: m(220) - 2,
  abonne: s(76.2),
};

const hhmm = (v: number) => {
  const t = Math.round(v);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

const VESTE: Tenue = {...TENUE_TOI, haut: '#dc2626', hautOmbre: '#991b1b'};

/** Biche (silhouette) qui s'enfuit vers la gauche */
const Biche: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
  const g = Math.sin(t * 0.7) * 22;
  return (
    <g transform={`translate(${x},${y}) scale(-1,1)`} fill="#7a6a5c">
      <ellipse cx={0} cy={-150} rx={95} ry={45} />
      <path d="M70,-170 L110,-260 L140,-250 L105,-160 Z" />
      <ellipse cx={135} cy={-268} rx={34} ry={20} />
      <path d="M118,-285 l-6,-26 l14,20 Z M138,-286 l2,-26 l8,24 Z" />
      {[
        [-60, g],
        [-40, -g],
        [50, -g],
        [70, g],
      ].map(([lx, a], i) => (
        <line key={i} x1={lx} y1={-130} x2={lx + Math.sin((a * Math.PI) / 180) * 120} y2={-130 + Math.cos((a * Math.PI) / 180) * 125} stroke="#7a6a5c" strokeWidth={14} strokeLinecap="round" />
      ))}
      <ellipse cx={-98} cy={-165} rx={14} ry={10} fill="#e7e2d8" />
    </g>
  );
};

export const Survie1b: React.FC = () => {
  const f = useCurrentFrame();

  /* ---------- Toi ---------- */
  const toiX = keys(f, [
    [0, 2500],
    [T.carte, 2800],
    [T.noir, 2800],
    [T.tomber, 3000],
    [T.regle - 1, 3000],
    [T.regle, 2960],
  ], Easing.linear);
  const chute = f >= T.tomber && f < T.regle - 1 ? keys(f, [[T.tomber, 0], [T.tomber + 8, 84]], Easing.in(Easing.quad)) : 0;
  const telEnMain = f >= T.tel && f < T.froid;
  const mainLampe: [number, number] = [toiX + 190, 1217];

  const lumiere = keys(f, [
    [0, 0.36],
    [T.noir, 0.36],
    [T.noir + 24, 0.15],
    [DUREE_SURVIE_1B, 0.12],
  ]);

  // éclats de la lampe : 3 flashs
  const flash = [T.eclats, m(178) + 5, m(180) + 6].some((d) => f >= d && f < d + 6);
  const lampeOn = f >= T.lampe && f < T.bruit;
  const lampeForce = lampeOn ? (f >= T.eclats && f < m(181) + 6 ? (flash ? 1 : 0.15) : 0.6) : 0;

  const plans = [
    {f: 0, x: 2650, y: 1080, z: 1.45},
    {f: 3, x: 2850, y: 1080, z: 1.45, d: T.carte, ease: Easing.linear},
    {f: T.noir, x: 2950, y: 1100, z: 1.6, d: 20},
    {f: T.tomber, x: 3020, y: 1250, z: 2.0, d: 6},
    {f: T.regle, x: 3000, y: 1040, z: 1.45, d: 10},
    {f: T.tel, x: 3010, y: 1080, z: 1.7, d: 14},
    {f: T.froid, x: 3060, y: 1130, z: 1.45, d: 16},
    {f: T.visible, x: 3150, y: 1060, z: 1.35, d: 14},
    {f: T.bruit, x: 2780, y: 1150, z: 1.35, d: 16},
    {f: T.rester, x: 2650, y: 1100, z: 1.25, d: 30},
    {f: T.teaser, x: 2850, y: 1000, z: 1.3, d: 20},
  ];

  const effets: Effet[] = [
    {f: 0, son: 'pas-feuilles', vol: 0.35, dur: T.carte},
    {f: T.rappel, son: 'carte', vol: 0.4},
    {f: T.erreur, son: 'buzzer-erreur', vol: 0.3},
    {f: T.carte, son: 'whoosh', vol: 0.35},
    {f: T.noir, son: 'pas-feuilles', vol: 0.4, dur: T.tomber - T.noir},
    {f: T.tomber + 6, son: 'buisson', vol: 0.5},
    {f: T.sortir, son: 'whoosh', vol: 0.35},
    {f: T.stop, son: 'carte', vol: 0.45},
    {f: T.S, son: 'pop', vol: 0.35},
    {f: T.Tt, son: 'pop', vol: 0.35},
    {f: T.O, son: 'pop', vol: 0.35},
    {f: T.P, son: 'pop', vol: 0.35},
    {f: T.essaie, son: 'clic-bouton', vol: 0.4},
    {f: T.avion, son: 'clic-bouton', vol: 0.4},
    {f: T.froid, son: 'carte', vol: 0.4},
    {f: T.branches, son: 'buisson', vol: 0.4},
    {f: T.feuilles, son: 'pas-feuilles', vol: 0.4, dur: 20},
    {f: T.visible, son: 'carte', vol: 0.4},
    {f: T.bruit, son: 'buisson', vol: 0.55},
    {f: T.rester, son: 'carte', vol: 0.4},
    {f: T.prevenir, son: 'ding-bonne-reponse', vol: 0.35},
    {f: T.teaser, son: 'carte', vol: 0.45},
    {f: T.abonne, son: 'pop', vol: 0.4},
  ];

  return (
    <AbsoluteFill style={{background: '#03050c'}}>
      {/* ======================= MONDE : la forêt ======================= */}
      <Camera plans={plans} mondeW={FORET.W} mondeH={FORET.H} haut={0} bas={1700}>
        <Foret lumiere={lumiere} brume={0.8} buissonBouge={T.bruit + 4} lueur={telEnMain ? {x: toiX + 70, y: 1180, force: 0.8} : lampeOn ? {x: mainLampe[0], y: mainLampe[1], force: lampeForce} : undefined}>
          {/* tronc couché qui sert de siège */}
          <g>
            <rect x={2880} y={1372} width={220} height={128} rx={40} fill="#1b1410" />
            <ellipse cx={3100} cy={1436} rx={30} ry={64} fill="#2a2018" />
            <ellipse cx={3100} cy={1436} rx={16} ry={40} fill="#1b1410" />
          </g>
          {/* froid qui monte du sol */}
          {f >= T.froid && f < T.branches + 12 &&
            [0, 1, 2].map((i) => {
              const k = ((f - T.froid) * 0.03 + i * 0.33) % 1;
              return (
                <path
                  key={i}
                  d={`M${2920 + i * 60},${1500 - k * 160} q-12,-20 0,-40 q12,-20 0,-40 l-12,10 m12,-10 l12,10`}
                  stroke="#93c5fd"
                  strokeWidth={6}
                  fill="none"
                  strokeLinecap="round"
                  opacity={Math.sin(k * Math.PI) * (1 - prog(f, T.branches, 12))}
                />
              );
            })}
          {/* isolation : branches, feuilles, sac */}
          {f >= T.branches &&
            [-60, 0, 60, 110, 170].map((dx, i) => (
              <line key={i} x1={2870 + dx} y1={1372 - 6 - (i % 2) * 6} x2={2990 + dx} y2={1372 - 12 + (i % 2) * 6} stroke="#5b3a22" strokeWidth={12} strokeLinecap="round" transform={`scale(1,${pop(f, T.branches + i * 3)})`} style={{transformOrigin: `${2930 + dx}px 1372px`}} />
            ))}
          {f >= T.feuilles &&
            Array.from({length: 12}).map((_, i) => (
              <ellipse key={i} cx={2890 + i * 18} cy={1360 - (i % 3) * 5} rx={22 * pop(f, T.feuilles + i)} ry={10 * pop(f, T.feuilles + i)} fill={i % 2 ? '#7c4a1e' : '#9a6b2f'} />
            ))}
          {f >= T.sac && (
            <g transform={`translate(3070,1500) scale(${pop(f, T.sac)})`}>
              <rect x={-36} y={-90} width={72} height={90} rx={18} fill="#9a3412" />
              <rect x={-26} y={-52} width={52} height={30} rx={8} fill="#7c2d12" />
            </g>
          )}
          {/* abri contre le vent : branches appuyées */}
          {f >= T.vent &&
            [0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={3180 + i * 22} y1={1500} x2={3120 + i * 10} y2={1500 - 380 * pop(f, T.vent + i * 3)} stroke="#4a3020" strokeWidth={16} strokeLinecap="round" />
            ))}
          {/* vent */}
          {f >= T.froid && f < T.visible &&
            [0, 1, 2].map((i) => {
              const k = ((f - T.froid) * 0.03 + i * 0.33) % 1;
              const stop = f >= T.vent ? 3260 : 2900;
              const x0 = 3700 - k * (3700 - stop);
              return <path key={i} d={`M${x0},${1180 + i * 70} q-40,-20 -80,0 t-80,0`} stroke="#cbd5e1" strokeWidth={6} fill="none" opacity={0.5 * Math.sin(k * Math.PI)} strokeLinecap="round" />;
            })}
          {/* faisceau de la lampe */}
          {lampeOn && (
            <path d={`M${mainLampe[0]},${mainLampe[1]} L${mainLampe[0] + 900},${mainLampe[1] - 420} L${mainLampe[0] + 900},${mainLampe[1] + 120} Z`} fill="#fef3c7" opacity={0.08 + 0.32 * lampeForce} />
          )}
          {/* sifflet : 3 coups */}
          {[T.sifflet, m(174) + 5, m(176) + 4].map((d, i) => {
            if (f < d || f > d + 20) return null;
            const k = (f - d) / 20;
            return (
              <g key={i}>
                <circle cx={toiX + 40} cy={1130} r={40 + k * 160} fill="none" stroke="#fde68a" strokeWidth={8 * (1 - k)} opacity={1 - k} />
                <text x={toiX + 40 + 120} y={1000 - i * 4} fontFamily="'Fredoka', sans-serif" fontWeight={700} fontSize={60} fill="#fde68a" opacity={1 - k}>
                  {i + 1}
                </text>
              </g>
            );
          })}
          {/* la biche qui s'enfuit */}
          {f >= T.animal && f < T.rester && <Biche x={keys(f, [[T.animal, FORET.buisson], [m(197), 1950]], Easing.in(Easing.quad))} y={1505} t={f} />}
          {/* lampes des secours au loin */}
          {f >= T.rester &&
            [0, 1, 2].map((i) => {
              const x = keys(f, [[T.rester, 2120 - i * 70], [T.teaser, 2420 - i * 70]], Easing.linear);
              const y = 1240 + i * 18 + Math.sin(f * 0.2 + i) * 6;
              return (
                <g key={i} opacity={prog(f, T.rester, 20)}>
                  <path d={`M${x},${y} L${x + 420},${y - 120} L${x + 420},${y + 110} Z`} fill="#fef9c3" opacity={0.12} />
                  <circle cx={x} cy={y} r={16} fill="#fef9c3" />
                  <circle cx={x} cy={y} r={44} fill="#fef9c3" opacity={0.2} />
                </g>
              );
            })}
          <Personnage
            tenue={f >= T.mets ? VESTE : TENUE_TOI}
            x={toiX}
            y={1500}
            sac={f < T.sac}
            rotation={chute}
            tremble={f >= T.froid && f < T.mets ? 1.4 : 0}
            ecranTel="#8ab4f8"
            timeline={[
              {f: 0, base: 'marche', bras: 'repos', expr: 'triste', regard: [1, 0]},
              {f: T.carte, base: 'debout'},
              {f: T.noir, base: 'marche', expr: 'triste'},
              {f: T.tomber, base: 'debout', bras: 'panique', expr: 'panique'},
              {f: T.blesser, bras: 'repos', expr: 'triste'},
              {f: T.regle, base: 'debout', bras: 'repos', expr: 'concentre', regard: [1, 0]},
              {f: T.S, base: 'assis', bras: 'genoux', expr: 'neutre'},
              {f: T.Tt, expr: 'concentre'},
              {f: T.O, regard: [-1, 0]},
              {f: T.ceQue, regard: [1, 0.3]},
              {f: m(93), regard: [0.3, -0.6]},
              {f: T.P, bras: 'reflechit'},
              {f: T.tel, bras: 'telephone', expr: 'concentre', regard: [1, 0.5]},
              {f: T.froid, bras: 'croises', expr: 'triste', regard: [0.4, 0.3]},
              {f: T.branches, bras: 'poser'},
              {f: T.vent, bras: 'croises'},
              {f: T.mets, expr: 'neutre'},
              {f: T.lampe, bras: 'pointer', regard: [1, -0.3]},
              {f: T.bruit, bras: 'repos', expr: 'surpris', regard: [-1, 0]},
              {f: T.animal + 15, expr: 'neutre'},
              {f: T.rester, regard: [-1, -0.2]},
            ]}
          />
        </Foret>
      </Camera>

      {/* ambiance */}
      <Vignette force={0.6} />
      <Vignette force={0.4 * prog(f, T.froid, 40) * (1 - prog(f, T.mets, 40))} couleur="110,160,230" />
      {f >= T.blesser && f < T.sortir && <Vignette force={0.55 * (1 - (f - T.blesser) / (T.sortir - T.blesser))} couleur="170,20,20" />}

      {/* rappel du choix */}
      {f < T.carte + 10 && <AbsoluteFill style={{background: `rgba(2,4,12,${0.6 * (1 - prog(f, T.carte - 6, 10))})`}} />}
      <ChoixRappel
        debut={T.rappel}
        fin={T.carte - 6}
        vert="Marcher"
        rouge="Rester sur place"
        titre="MARCHER OU RESTER ?"
        etatVert="faux"
        depuisVert={T.erreur}
        etatRouge="bon"
        depuisRouge={T.erreur + 14}
        labelFaux="✗ L'ERREUR FRÉQUENTE"
        y={640}
      />
      <CarteOuverture debut={4} fin={m(6) - 4} ligne1="SAMEDI • 17:45" ligne2="Forêt de montagne" ligne3="Toi, randonneur" />

      {/* carte de la zone de recherche */}
      {((f >= T.carte && f < T.noir + 8) || (f >= T.sortir - 2 && f < T.regle + 6)) && (
        <AbsoluteFill style={{background: `rgba(2,4,12,${0.7})`}} />
      )}
      <CarteZone debut={T.carte} fin={T.noir - 2} boucle={T.boucle} zone={T.secours} position={[700, 560]} />
      <CarteZone
        debut={T.sortir - 2}
        fin={T.regle - 2}
        zone={T.sortir - 30}
        position={[keys(f, [[T.sortir + 6, 700], [T.zone, 820]]), keys(f, [[T.sortir + 6, 560], [T.zone, 760]])]}
        trace={f >= T.sortir + 6 ? [[700, 560], [keys(f, [[T.sortir + 6, 700], [T.zone, 820]]), keys(f, [[T.sortir + 6, 560], [T.zone, 760]])]] : undefined}
        horsZone={T.zone}
      />
      <CarteJeu debut={m(21)} fin={T.noir - 4} surtitre="TA SŒUR SAIT" couleurSurtitre="#fbbf24" titre="Tour du lac • retour 18 h" x={380} y={290} largeur={640} />
      <CarteJeu debut={T.blesser} fin={T.sortir - 4} surtitre="DANGER" couleurSurtitre="#f87171" titre="Chute • blessure" x={380} y={290} largeur={640} />

      {/* règle S.T.O.P. */}
      <TuilesStop debut={T.stop - 4} fin={T.tel - 4} actif={f < T.S ? -1 : f < T.Tt ? 0 : f < T.O ? 1 : f < T.P ? 2 : 3} y={290} x={50} taille={150} />
      <CarteJeu debut={T.S} fin={T.Tt - 2} surtitre="S COMME" couleurSurtitre="#fb923c" titre="S'arrêter" detail="tu ne bouges plus" x={540} y={480} largeur={900} />
      <CarteJeu debut={T.Tt} fin={T.O - 2} surtitre="T COMME" couleurSurtitre="#fb923c" titre="Tête froide" detail="respire lentement" x={540} y={480} largeur={900} />
      <Respiration debut={m(85) - 10} fin={T.O - 4} x={790} y={1010} />
      <CarteJeu debut={T.O} fin={T.P - 2} surtitre="O COMME" couleurSurtitre="#fb923c" titre="Observer" detail="ce que tu as, où tu es" icone={<Inventaire debut={T.ceQue} pas={4} />} x={540} y={480} largeur={900} />
      <CarteJeu debut={T.P} fin={T.tel - 4} surtitre="P COMME" couleurSurtitre="#fb923c" titre="Planifier" detail="un plan pour passer la nuit" x={540} y={480} largeur={900} />

      {/* le téléphone */}
      <CarteJeu debut={T.tel} fin={T.avion - 2} surtitre="1 • LE TÉLÉPHONE" couleurSurtitre="#4ade80" titre="Essaie le 112" detail="un autre opérateur peut passer" x={380} y={290} largeur={640} />
      <CarteJeu debut={T.avion} fin={T.froid - 4} surtitre="ENSUITE" couleurSurtitre="#4ade80" titre="Mode avion" detail="rallume-le de temps en temps" x={380} y={290} largeur={640} />
      <TelephoneUrgence debut={T.essaie - 4} fin={T.froid - 6} avion={T.avion} veille={T.rallume} y={1000} echelle={0.7} />

      {/* le froid */}
      <CarteJeu debut={T.froid} fin={T.isole - 2} surtitre="2 • LE FROID" couleurSurtitre="#93c5fd" titre="Le vrai danger cette nuit" x={380} y={290} largeur={640} />
      <CarteJeu debut={T.isole} fin={T.vent - 2} surtitre="ISOLE-TOI DU SOL" couleurSurtitre="#93c5fd" titre="Branches • feuilles • sac" x={380} y={290} largeur={640} />
      <CarteJeu debut={T.vent} fin={T.mets - 2} surtitre="ABRITE-TOI" couleurSurtitre="#93c5fd" titre="Coupe le vent" x={380} y={290} largeur={640} />
      <CarteJeu debut={T.mets} fin={T.visible - 2} surtitre="COUCHES" couleurSurtitre="#93c5fd" titre="Mets tout sur toi" x={380} y={290} largeur={640} />

      {/* visible + signal */}
      <CarteJeu debut={T.visible} fin={T.sifflet - 2} surtitre="3 • SOIS VISIBLE" couleurSurtitre="#fbbf24" titre="Veste rouge • lampe" x={380} y={290} largeur={640} />
      <CarteJeu debut={T.sifflet} fin={T.bruit - 2} surtitre="SIGNAL DE DÉTRESSE" couleurSurtitre="#f87171" titre="3 coups • 3 éclats" x={380} y={290} largeur={640} />

      {/* le bruit, la règle, le teaser */}
      <CarteJeu debut={T.bruit} fin={T.rester - 2} surtitre="LE BRUIT ?" couleurSurtitre="#a3a3a3" titre="Sûrement un animal" detail="il a plus peur que toi" x={380} y={290} largeur={640} />
      <CarteJeu debut={T.rester} fin={T.prevenir - 2} surtitre="RESTER SUR PLACE" couleurSurtitre="#4ade80" titre="…si quelqu'un connaît ton itinéraire" x={380} y={290} largeur={640} />
      <CarteJeu debut={T.prevenir} fin={T.teaser - 4} surtitre="À RETENIR" couleurSurtitre="#fbbf24" titre="Préviens avant de partir" detail="itinéraire + heure de retour" x={380} y={290} largeur={640} />
      <CarteJeu debut={T.teaser} fin={T.abonne - 4} surtitre="PROCHAINE SITUATION" couleurSurtitre="#60a5fa" titre="Ta voiture tombe dans l'eau" icone={<IconeVoitureEau s={170} />} x={540} y={470} largeur={900} />

      <HUD
        compteur={[
          [0, 17 * 60 + 45],
          [T.noir, 18 * 60 + 20],
          [T.regle, 18 * 60 + 35],
          [T.froid, 19 * 60 + 40],
          [T.visible, 20 * 60 + 30],
          [T.rester, 22 * 60 + 10],
        ]}
        format={hhmm}
        barre={[
          [0, 0.42],
          [m(53), 0.3],
          [T.blesser, 0.25],
          [T.regle, 0.38],
          [m(133), 0.26],
          [T.branches + 10, 0.4],
          [T.sac + 10, 0.48],
          [T.vent + 10, 0.55],
          [T.mets + 15, 0.66],
          [T.rester, 0.7],
          [DUREE_SURVIE_1B, 0.74],
        ]}
        unite=""
        label="HEURE • CHALEUR"
        icone="coeur"
        inverse
        alerte={0.55}
      />
      <EcranAbonne debut={T.abonne} />
      {f < T.abonne && <SousTitres mots={mots} motsCles={MOTS_CLES} y={1400} />}

      <Bande voix="videos/survie-1b/voix.wav" mots={mots} effets={effets} ambiance="ambiances/foret-soir.mp3" musique="musiques/documentaire.mp3" />
    </AbsoluteFill>
  );
};

