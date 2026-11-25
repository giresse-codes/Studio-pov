import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Camera, Plan} from '../camera/Camera';
import {BocalCornichons, CUISINE_COLOC, CuisineColoc, SOL_CUISINE} from '../decors/CuisineColoc';
import {clamp, prog} from '../lib/anim';
import {Ambiance, Effet, Musique, Voix} from '../lib/sons';
import {C} from '../lib/theme';
import {creerTiming, DonneesVoix} from '../lib/timing';
import {Bobo, clignement, Couteau, debout, epaulesTombent, Expression, Pose, SaucePiquante, sursaut, Toi} from '../personnages';
import {
  BulleParole, CarteAbonne, CarteJeu, CarteOuverture, EcranChoix, Etiquette, Etincelles, HUD, SchemaBocal, SchemaDeuxChoix, SousTitres, TexteHook,
  valeurAnimee,
} from '../ui';
import donnees from '../../videos/astuce-2/mots.json';

/** #astuce 2 — « Le bocal impossible » */
const AJOUT = 90; // 0,7 s de silence à la [pause] : on ajoute 3 s pour le compte à rebours
const T = creerTiming(donnees as DonneesVoix, {
  ajout: AJOUT,
  cles: ['pschitt', 'cornichons.', 'rouge.', 'grogne.', 'couteau', 'Range', 'force.', 'invisible', 'chaude.', 'congélateur', 'quoi', 'chaud.', 'vide.', 'dehors',
    'dilate,', 'desserre.', 'cuillère', 'levier', 'Pschitt', 'inverse', 'rétrécit', 'doigt.', 'desserré.', 'piquante'],
});
export const DUREE_ASTUCE_2 = T.fin + 50;

const P = T.phrase;
const M = T.mot;
const REVELATION = P(6).d;
const ecran = (wx: number, wy: number, cam: {x: number; y: number; zoom: number}) => ({x: 540 + (wx - cam.x) * cam.zoom, y: 960 + (wy - cam.y) * cam.zoom});

const X_BOBO = 1300;
const X_TOI = 760;
const CAM_LARGE = {x: 1050, y: 1170, zoom: 1.25};
const CAM_BOCAL = {x: 1220, y: 1180, zoom: 2.1};
const CAM_BOBO = {x: 1260, y: 1150, zoom: 1.6};

export const Astuce2: React.FC = () => {
  const f = useCurrentFrame();

  // ---------------- Caméra ----------------
  const plans: Plan[] = [
    {a: 0, ...CAM_BOBO},
    {a: 2, ...CAM_BOCAL, duree: 10},
    {a: P(1).d - 8, ...CAM_LARGE, duree: 16},
    {a: M(1, 'rouge.') - 4, ...CAM_BOBO, duree: 10},
    {a: P(2).d - 4, ...CAM_LARGE, duree: 12},
    {a: P(3).d - 2, ...CAM_BOCAL, duree: 12},
    {a: P(4).d - 6, x: 1100, y: 1150, zoom: 1.15, duree: 16},
    {a: P(10).d - 8, ...CAM_LARGE, duree: 14},
    {a: P(11).d - 4, ...CAM_BOBO, duree: 12},
  ];

  // ---------------- Bobo ----------------
  const ouvreDoigt = M(10, 'doigt.');
  const lutte = (f >= P(1).d && f < P(2).d) || (f < P(1).d && f < M(0, 'pschitt'));
  let poseBobo: Pose = {...debout(f), epauleAv: 70, coudeAv: 40, epauleAr: 60, coudeAr: 50};
  let exprBobo: Expression = 'content';
  let mainAr: React.ReactNode;
  let mainAv: React.ReactNode;
  const teaser = f >= P(11).d;
  if (lutte) {
    poseBobo = {...poseBobo, buste: Math.sin(f * 1.3) * 6, y: Math.sin(f * 2) * 4};
    exprBobo = 'panique';
  } else if (f < P(4).d) {
    exprBobo = 'coupable';
  } else if (f < P(10).d) {
    exprBobo = 'neutre';
  } else if (!teaser) {
    exprBobo = f < ouvreDoigt ? 'concentre' : 'fier';
    poseBobo = {...poseBobo, epauleAr: 130, coudeAr: f < ouvreDoigt ? 40 : 10};
  } else {
    exprBobo = 'content';
    poseBobo = {...debout(f), epauleAv: 140, coudeAv: 20 + Math.sin(f / 3) * 10, epauleAr: -10, coudeAr: 30};
  }
  const couteau = f >= M(1, 'couteau') && f < P(2).d + 6;
  if (couteau) mainAr = <g transform={`rotate(${poseBobo.epauleAr + poseBobo.coudeAr})`}><Couteau rot={-30 + Math.sin(f) * 5} /></g>;
  const ouvertBocal = f < P(1).d
    ? interpolate(f, [M(0, 'pschitt'), M(0, 'pschitt') + 6], [0, 1], clamp)
    : interpolate(f, [ouvreDoigt, ouvreDoigt + 6], [0, 1], clamp);
  if (!teaser) {
    const angle = poseBobo.epauleAv + poseBobo.coudeAv;
    mainAv = <g transform={`rotate(${angle + (lutte ? Math.sin(f * 1.5) * 10 : 0)}) scale(-1,1)`}><BocalCornichons x={0} y={50} ouvert={ouvertBocal} /></g>;
  } else {
    mainAv = <g transform={`rotate(${poseBobo.epauleAv + poseBobo.coudeAv}) scale(-1,1)`}><SaucePiquante /></g>;
  }

  // ---------------- Toi ----------------
  let pose: Pose = debout(f);
  let expr: Expression = 'neutre';
  if (f < P(2).d) { expr = f < M(1, 'couteau') ? 'neutre' : 'panique'; pose = sursaut(debout(f), f - M(1, 'couteau')); }
  else if (f < P(3).d) { pose = {...debout(f), epauleAv: 95, coudeAv: -5}; expr = 'concentre'; }
  else if (f < P(10).d) { pose = debout(f); expr = 'concentre'; }
  else if (f < P(11).d) { pose = epaulesTombent(debout(f), prog(f, M(10, 'dit'), M(10, 'dit') + 10)); expr = f < M(10, 'dit') ? 'surpris' : 'triste'; }
  else { pose = debout(f); expr = 'panique'; }

  // ---------------- HUD ----------------
  const degats = valeurAnimee(f, [[0, 0], [M(1, 'couteau'), 15], [M(11, 'sauce'), 23]], 16);
  const patience = valeurAnimee(f, [[0, 0.9], [M(1, 'rouge.'), 0.75], [M(1, 'couteau'), 0.3], [P(2).d + 10, 0.4], [M(8, 'Pschitt'), 0.7], [M(10, 'desserré.'), 0.5], [M(11, 'sauce'), 0.35]], 14);
  const alerte = Math.max(0, Math.min(1, (0.75 - patience) / 0.5));

  const pTete = ecran(X_BOBO, 920, CAM_BOBO);
  const pBocal = ecran(X_BOBO - 120, 1180, CAM_BOCAL);
  const pBulle = ecran(X_BOBO, 900, CAM_LARGE);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Camera plans={plans} largeur={CUISINE_COLOC.largeur} hauteur={CUISINE_COLOC.hauteur}
        secousse={interpolate(f, [M(1, 'couteau'), M(1, 'couteau') + 3, M(1, 'couteau') + 12], [0, 0.6, 0], clamp)}>
        <CuisineColoc frame={f} bocal={<g />}>
          <g transform={`translate(${X_TOI},${SOL_CUISINE})`}>
            <Toi pose={pose} expression={expr} echelle={1.2} cligne={clignement(f)} />
          </g>
          <g transform={`translate(${X_BOBO},${SOL_CUISINE})`}>
            <Bobo pose={poseBobo} expression={exprBobo} sens={-1} echelle={1.2} cligne={clignement(f, 20)} mainAv={mainAv} mainAr={mainAr} regard={0.4}
              parle={lutte || (f >= M(10, 'dit') && f < P(11).d) ? Math.abs(Math.sin(f / 2.5)) * 0.7 : 0} />
          </g>
        </CuisineColoc>
      </Camera>

      {/* 1. HOOK */}
      <TexteHook texte="LE « PSCHITT » MAGIQUE 🥒" fin={56} y={420} />
      <Etiquette a={M(0, 'pschitt')} fin={P(1).d - 6} x={640} y={1230} texte="PSCHITT ! 💨" fond="#fff" rot={-8} taille={80} />
      <Etincelles debut={M(0, 'pschitt')} x={250} y={800} rayon={240} couleur="#7dff8a" />

      {/* 2. SITUATION */}
      <CarteOuverture debut={P(1).d} fin={M(1, 'rouge.')} lignes={['DIMANCHE • 12:20', 'Appartement – Coloc', 'Toi, affamé']} y={1110} />
      <Etiquette a={M(1, 'rouge.')} fin={P(2).d - 4} x={pTete.x - 260} y={pTete.y - 90} texte="🥵 ROUGE" fond={C.rouge} couleur="#fff" rot={-8} taille={60} />
      <Etiquette a={M(1, 'grogne.')} fin={P(2).d - 4} x={pTete.x + 140} y={pTete.y - 240} texte="GRRRR 😤" fond="#fff" rot={6} taille={64} />
      {couteau && <Etiquette a={M(1, 'couteau')} fin={P(2).d - 4} x={540} y={1210} texte="🔪 NOOON !" fond={C.rouge} couleur="#fff" rot={-4} taille={76} />}
      <Etiquette a={M(3, 'force.')} fin={P(4).d - 6} x={pBocal.x + 140} y={pBocal.y - 470} texte="💪 LA FORCE ? NON." fond="#fff" rot={-5} taille={56} />
      <Etiquette a={M(3, 'invisible')} fin={P(4).d - 6} x={540} y={1240} texte="👻 un truc INVISIBLE…" fond={C.jaune} rot={4} taille={56} />

      <SchemaDeuxChoix debut={P(4).d} fin={P(5).d - 4} a1={P(4).d + 2} a2={M(4, 'Soit', 1)} icone1="🔥" texte1="Couvercle sous l’eau très chaude" icone2="🧊" texte2="Au congélateur pour qu’il rétrécisse" />

      {/* 3. TU FERAIS QUOI ? */}
      <EcranChoix debut={P(5).d - 4} fin={REVELATION + 34} vert="Eau très chaude" rouge="Congélateur" bonne="vert" revelation={REVELATION} />

      {/* 4. RÉPONSE + EXPLICATION */}
      <SchemaBocal debut={REVELATION + 40} fin={P(9).d - 4}
        aChaud={REVELATION + 40} aFroid={M(6, 'refroidissant,')} aVide={M(6, 'vide.')} aDehors={M(6, 'dehors')}
        aEau={P(7).d} aVerre={M(7, 'verre.')} aDesserre={M(7, 'desserre.')}
        aCuillere={P(8).d} aLevier={M(8, 'levier')} aPschitt={M(8, 'Pschitt')} aOuvre={M(8, "s'ouvre")} />
      <CarteJeu debut={P(9).d} fin={P(10).d - 8} surTitre="ASTUCE N° 2" titre="Jamais le congélateur ❄️" y={420} largeur={940}
        detail="Le froid fait rétrécir le métal : le couvercle serre encore plus." />
      <Etiquette a={ouvreDoigt} fin={P(11).d - 6} x={pBulle.x - 230} y={pBulle.y + 420} texte="☝️ AVEC UN DOIGT" fond={C.jaune} rot={-6} taille={56} />
      <BulleParole a={M(10, 'dit')} fin={P(11).d - 4} x={pBulle.x - 260} y={pBulle.y + 30} texte="Je l’avais déjà desserré 😎" queue="droite" largeur={500} />
      <Etiquette a={M(11, 'sauce')} fin={T.fin + 30} x={540} y={760} texte="🌶️🔥 LA SAUCE DE BOBO ?!" fond={C.rouge} couleur="#fff" rot={-4} taille={56} />

      {/* 5. ACCROCHE FINALE */}
      <CarteAbonne debut={M(11, 'Bobo.') + 6} fin={DUREE_ASTUCE_2} y={1600} />

      <HUD valeur={degats} unite="€" libelle="DÉGÂTS DE BOBO" barre={patience} icone="🏠" alerte={alerte} apparition={4} />
      <SousTitres mots={T.mots} y={1440} />

      {/* ---------------- SONS ---------------- */}
      <Voix src={staticFile('videos/astuce-2/voix.wav')} pauseS={(donnees as DonneesVoix).pause ?? undefined} ajout={AJOUT} />
      <Ambiance nom="appartement" duree={DUREE_ASTUCE_2} />
      <Musique nom="comique" duree={DUREE_ASTUCE_2} voix={T.segments} />
      <Effet nom="whoosh" a={2} duree={24} volume={0.4} />
      <Effet nom="pop" a={M(0, 'pschitt')} volume={0.6} />
      <Effet nom="sparkle" a={M(0, 'pschitt')} volume={0.4} />
      <Effet nom="whoosh" a={P(1).d - 8} duree={24} volume={0.3} />
      <Effet nom="gag-boing" a={M(1, 'rouge.')} volume={0.35} />
      <Effet nom="pop" a={M(1, 'grogne.')} />
      <Effet nom="buzzer-erreur" a={M(1, 'couteau')} volume={0.35} />
      <Effet nom="whoosh" a={P(2).d - 4} duree={24} volume={0.3} />
      <Effet nom="whoosh" a={P(3).d - 2} duree={24} volume={0.3} />
      <Effet nom="pop" a={M(3, 'force.')} />
      <Effet nom="pop" a={M(3, 'invisible')} />
      <Effet nom="whoosh" a={P(4).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(4, 'Soit', 1)} />
      <Effet nom="whoosh" a={P(5).d - 4} duree={24} volume={0.4} />
      <Effet nom="clic-bouton" a={P(5).d + 8} />
      <Effet nom="coeur" a={P(5).d + 10} duree={88} volume={0.5} />
      <Effet nom="ding-bonne-reponse" a={REVELATION} volume={0.55} />
      <Effet nom="whoosh" a={REVELATION + 40} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(6, 'vide.')} />
      <Effet nom="whoosh" a={M(6, 'dehors')} duree={20} volume={0.3} />
      <Effet nom="eau-plouf" a={P(7).d} duree={40} volume={0.3} />
      <Effet nom="ding-bonne-reponse" a={M(7, 'desserre.')} volume={0.25} />
      <Effet nom="pop" a={P(8).d} />
      <Effet nom="pop" a={M(8, 'Pschitt')} volume={0.6} />
      <Effet nom="sparkle" a={M(8, "s'ouvre")} volume={0.4} />
      <Effet nom="carte" a={P(9).d} duree={25} />
      <Effet nom="whoosh" a={P(10).d - 8} duree={24} volume={0.3} />
      <Effet nom="pop" a={ouvreDoigt} volume={0.6} />
      <Effet nom="gag-boing" a={M(10, 'dit')} volume={0.35} />
      <Effet nom="whoosh" a={P(11).d - 4} duree={24} volume={0.3} />
      <Effet nom="gag-boing" a={M(11, 'sauce')} volume={0.45} />
      <Effet nom="pop" a={M(11, 'Bobo.') + 6} />
    </AbsoluteFill>
  );
};
