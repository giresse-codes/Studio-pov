import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Camera, Plan} from '../camera/Camera';
import {PRISE, SALON_COLOC, SalonColoc, SOL_SALON} from '../decors/SalonColoc';
import {clamp, prog} from '../lib/anim';
import {Ambiance, Effet, Musique, Voix} from '../lib/sons';
import {C} from '../lib/theme';
import {creerTiming, DonneesVoix} from '../lib/timing';
import {assis, Bobo, clignement, debout, epaulesTombent, Expression, Pose, Smartphone, sursaut, Toi} from '../personnages';
import {
  BulleParole, CarteAbonne, CarteJeu, CarteOuverture, EcranChoix, Etiquette, Etincelles, HUD, SchemaClassement, SchemaDeuxChoix, SchemaListe, SousTitres,
  TelephoneGeant, TexteHook, valeurAnimee,
} from '../ui';
import donnees from '../../videos/astuce-4/mots.json';

/** #astuce 4 — « Batterie à 1 % » */
const AJOUT = 90; // 0,5 s de silence à la [pause] : on ajoute 3 s pour le compte à rebours
const T = creerTiming(donnees as DonneesVoix, {
  ajout: AJOUT,
  cles: ['PLUS', 'taxi.', '1 %.', 'chargeur.', 'Ferme', 'luminosité', 'économie', 'quoi', 'mythe.', 'pause.', 'zéro :', 'écran', 'GPS,', 'vidéo,', 'faible,',
    'minimum,', 'avion', 'longtemps.', 'bugue', 'chauffe,', 'débranche', 'console.', 'pierre.'],
});
export const DUREE_ASTUCE_4 = T.fin + 50;

const P = T.phrase;
const M = T.mot;
const REVELATION = P(5).d;
const ecran = (wx: number, wy: number, cam: {x: number; y: number; zoom: number}) => ({x: 540 + (wx - cam.x) * cam.zoom, y: 960 + (wy - cam.y) * cam.zoom});

const X_TOI = 560;
const X_BOBO = 1240;
const CAM_LARGE = {x: 960, y: 1180, zoom: 1.15};
const CAM_TOI = {x: 600, y: 1150, zoom: 1.6};
const CAM_BOBO = {x: 1300, y: 1180, zoom: 1.6};
const JOUR = 0.5; // vendredi 19 h

/** Avocat (repère main) */
const Avocat: React.FC = () => (
  <g transform="translate(0,-40)">
    <ellipse cx={0} cy={0} rx={34} ry={46} fill="#2f5a1f" />
    <ellipse cx={-8} cy={-12} rx={10} ry={14} fill="#4b7a2a" opacity={0.6} />
  </g>
);

export const Astuce4: React.FC = () => {
  const f = useCurrentFrame();

  // ---------------- Caméra ----------------
  const plans: Plan[] = [
    {a: 0, ...CAM_TOI},
    {a: P(1).d - 8, ...CAM_LARGE, duree: 16},
    {a: M(1, 'Bobo') - 4, ...CAM_BOBO, duree: 12},
    {a: P(3).d - 6, x: 1000, y: 1150, zoom: 1.1, duree: 16},
    {a: P(9).d - 8, ...CAM_LARGE, duree: 14},
    {a: P(10).d - 4, ...CAM_BOBO, duree: 12},
  ];

  // ---------------- Toi ----------------
  const tel: Pose = {...debout(f), epauleAv: 60, coudeAv: 85, tete: 10};
  let pose: Pose = tel;
  let expr: Expression = 'concentre';
  if (f < P(1).d) { pose = tel; expr = f < M(0, 'PLUS') ? 'concentre' : 'panique'; }
  else if (f < P(2).d) { pose = sursaut(tel, f - M(1, 'Batterie :')); expr = f < M(1, 'Batterie :') ? 'neutre' : 'panique'; }
  else if (f < REVELATION) { pose = tel; expr = f < P(4).d ? 'concentre' : 'surpris'; }
  else if (f < P(9).d) { pose = tel; expr = f < M(7, 'longtemps.') ? 'concentre' : 'fier'; }
  else { pose = epaulesTombent(tel, prog(f, M(9, 'débranche'), M(9, 'débranche') + 10)); expr = f < M(9, 'débranche') ? 'content' : 'triste'; }

  // ---------------- Bobo ----------------
  let poseBobo: Pose = {...assis(f), epauleAv: 55 + Math.sin(f * 1.5) * 4, coudeAv: 60, epauleAr: 50, coudeAr: 60};
  let exprBobo: Expression = 'concentre';
  let xBobo = X_BOBO;
  let mainBobo: React.ReactNode;
  let sensBobo: 1 | -1 = 1;
  const debranche = M(9, 'débranche');
  if (f >= debranche - 20 && f < P(10).d) {
    // il se lève et file vers la prise
    const k = prog(f, debranche - 20, debranche);
    xBobo = interpolate(k, [0, 1], [X_BOBO, 980]);
    poseBobo = {...debout(f), epauleAv: 70, coudeAv: 20};
    sensBobo = -1;
    exprBobo = 'content';
  } else if (f >= P(10).d) {
    xBobo = 1300;
    sensBobo = -1;
    poseBobo = {...debout(f), epauleAv: 100 + Math.abs(Math.sin(f / 3)) * 30, coudeAv: 40};
    exprBobo = 'surpris';
    mainBobo = <g transform={`rotate(${poseBobo.epauleAv + poseBobo.coudeAv})`}><Avocat /></g>;
  } else if (f >= P(2).d && f < P(3).d) {
    exprBobo = 'fier';
  }

  // câble du chargeur : de la prise au téléphone de Bobo, puis à sa console
  const finCable = f < debranche ? {x: 1300, y: 1395} : {x: 1940, y: 1385};
  const cable = (
    <g>
      <path d={`M${PRISE.x + 20},${PRISE.y} C${PRISE.x + 120},${PRISE.y + 160} ${finCable.x - 200},${finCable.y + 120} ${finCable.x},${finCable.y}`} stroke="#f4f4f6" strokeWidth={9} fill="none" />
      {f < debranche && (
        <g transform="translate(1300,1395)">
          <rect x={-40} y={-10} width={80} height={16} rx={6} fill="#2d2d3a" />
          <rect x={-34} y={-12} width={68} height={5} rx={2} fill="#3ee07a" />
        </g>
      )}
    </g>
  );

  // ---------------- HUD ----------------
  const degats = valeurAnimee(f, [[0, 0], [M(9, 'arrive.'), 3], [M(10, "l'avocat"), 5]], 16);
  const patience = valeurAnimee(f, [[0, 0.8], [M(1, 'Batterie :'), 0.45], [M(1, 'chargeur.'), 0.3], [P(2).d, 0.25], [M(7, 'longtemps.'), 0.65], [M(9, 'console.'), 0.35], [M(10, "l'avocat"), 0.3]], 14);
  const alerte = Math.max(0, Math.min(1, (0.75 - patience) / 0.5));

  // batterie affichée sur le téléphone géant
  const batterieHook = interpolate(f, [6, M(0, 'vite.')], [9, 1], clamp);
  const pBobo = ecran(X_BOBO, 980, CAM_BOBO);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Camera plans={plans} largeur={SALON_COLOC.largeur} hauteur={SALON_COLOC.hauteur}
        secousse={interpolate(f, [M(1, 'Batterie :'), M(1, 'Batterie :') + 3, M(1, 'Batterie :') + 12], [0, 0.6, 0], clamp)}>
        <SalonColoc frame={f} jour={JOUR} cable={cable}>
          <g transform={`translate(${xBobo},${SOL_SALON})`}>
            <Bobo pose={poseBobo} expression={exprBobo} sens={sensBobo} echelle={1.2} cligne={clignement(f, 20)} mainAv={mainBobo} regard={0.8}
              parle={f >= P(2).d && f < P(3).d ? Math.abs(Math.sin(f / 2.5)) * 0.7 : 0} />
          </g>
          <g transform={`translate(${X_TOI},${SOL_SALON})`}>
            <Toi pose={pose} expression={expr} echelle={1.2} cligne={clignement(f)} regardY={0.5} mainAv={<Smartphone ecran={rougeTel(f) ? '#ff4757' : '#5ad1ff'} />} />
          </g>
        </SalonColoc>
      </Camera>

      {/* 1. HOOK */}
      <TelephoneGeant debut={0} fin={P(1).d - 10} batterie={batterieHook} mode="applis" aFermeture={8} y={560} />
      <TexteHook texte="FERMER TES APPLIS = PIRE ! 🔋" fin={56} y={410} />
      <Etiquette a={M(0, 'PLUS')} fin={P(1).d - 6} x={540} y={1300} texte="🔋 ÇA VIDE PLUS VITE !" fond={C.rouge} couleur="#fff" rot={-5} taille={64} />

      {/* 2. SITUATION */}
      <CarteOuverture debut={P(1).d} fin={M(1, 'Batterie :') - 4} lignes={['VENDREDI • 19:02', 'Appartement – Coloc', 'Toi, pressé']} y={1110} />
      <Etiquette a={M(1, 'taxi.')} fin={M(1, 'Batterie :') - 2} x={760} y={760} texte="🚕 COMMANDER UN TAXI" fond={C.jaune} rot={4} taille={54} />
      <TelephoneGeant debut={M(1, 'Batterie :')} fin={M(1, 'Bobo') - 6} batterie={1} mode="batterie" message="🚕 Taxi pas encore commandé…" />
      <Etiquette a={M(1, 'chargeur.')} fin={P(2).d + 6} x={ecran(1300, 1395, CAM_BOBO).x - 40} y={ecran(1300, 1395, CAM_BOBO).y - 130} texte="🔌 TON chargeur !" fond="#fff" rot={-5} taille={56} />
      <BulleParole a={M(2, 'Ferme')} fin={P(3).d - 4} x={pBobo.x - 30} y={pBobo.y - 60} texte="Ferme toutes tes applis, ça vide la batterie ! 🎮" queue="gauche" largeur={560} />

      <SchemaDeuxChoix debut={P(3).d} fin={P(4).d - 4} a1={P(3).d + 2} a2={M(3, 'Soit', 1)} icone1="🧹" texte1="Fermer toutes les applis" icone2="🔅" texte2="Luminosité ↓ + mode économie" />

      {/* 3. TU FERAIS QUOI ? */}
      <EcranChoix debut={P(4).d - 4} fin={REVELATION + 34} vert="Fermer toutes les applis" rouge="Luminosité + économie" bonne="rouge" revelation={REVELATION} />

      {/* 4. RÉPONSE + EXPLICATION */}
      <SchemaListe debut={REVELATION + 40} fin={P(6).d - 4} titre="FERMER TOUT ?" tampon={{a: REVELATION + 44, texte: 'MYTHE'}} items={[
        {a: M(5, 'pause.'), icone: '⏸️', texte: 'Les applis sont déjà en pause', couleur: C.rouge},
        {a: M(5, 'rouvrant,'), icone: '🔄', texte: 'Les rouvrir = tout recharger', couleur: C.rouge},
        {a: M(5, 'consomme'), icone: '🔋', texte: 'Ça consomme PLUS', couleur: C.rouge},
      ]} />
      <SchemaClassement debut={P(6).d} fin={P(7).d - 4} titre="CE QUI VIDE TA BATTERIE" items={[
        {a: M(6, "l'écran"), icone: '💡', texte: 'L’écran (luminosité)', valeur: 1},
        {a: M(6, 'GPS,'), icone: '📍', texte: 'Le GPS', valeur: 0.72},
        {a: M(6, 'vidéo,'), icone: '🎬', texte: 'La vidéo', valeur: 0.62},
        {a: M(6, 'réseau'), icone: '📶', texte: 'Réseau faible', valeur: 0.55},
      ]} />
      <TelephoneGeant debut={P(7).d} fin={P(8).d - 6} batterie={1} mode="reglages"
        reglages={{aLum: M(7, 'Luminosité'), aEco: M(7, 'économie,'), aAvion: M(7, 'avion')}} message={f >= M(7, 'longtemps.') ? '⏳ Ton 1 % tient bien plus longtemps' : undefined} />
      <CarteJeu debut={P(8).d} fin={P(9).d - 8} surTitre="ASTUCE N° 4" titre="Fermer ? Seulement si ça bugue." y={420} largeur={940}
        detail="Une appli qui bugue ou qui chauffe : oui. Toutes, tout le temps : non." />
      <Etiquette a={M(9, 'arrive.')} fin={P(10).d - 6} x={330} y={720} texte="🚕 TAXI ARRIVÉ !" fond={C.jaune} rot={-5} taille={60} />
      <Etiquette a={M(9, 'console.')} fin={P(10).d - 6} x={620} y={1250} texte="🔌 → 🎮 POUR SA CONSOLE" fond={C.rouge} couleur="#fff" rot={4} taille={54} />
      <Etiquette a={M(10, "l'avocat")} fin={T.fin + 30} x={540} y={760} texte="🥑 = 🪨 ?!" fond="#fff" rot={-6} taille={90} />
      <Etincelles debut={M(10, 'pierre.')} x={ecran(1300, 1150, CAM_BOBO).x} y={ecran(1300, 1150, CAM_BOBO).y - 200} rayon={180} />

      {/* 5. ACCROCHE FINALE */}
      <CarteAbonne debut={M(10, 'pierre.') + 8} fin={DUREE_ASTUCE_4} y={1600} />

      <HUD valeur={degats} unite="€" libelle="DÉGÂTS DE BOBO" barre={patience} icone="🏠" alerte={alerte} apparition={4} />
      <SousTitres mots={T.mots} y={1440} />

      {/* ---------------- SONS ---------------- */}
      <Voix src={staticFile('videos/astuce-4/voix.mp3')} pauseS={(donnees as DonneesVoix).pause ?? undefined} ajout={AJOUT} />
      <Ambiance nom="appartement" duree={DUREE_ASTUCE_4} />
      <Musique nom="comique" duree={DUREE_ASTUCE_4} voix={T.segments} />
      {[0, 1, 2, 3, 4].map((i) => <Effet key={i} nom="whoosh" a={8 + i * 8} duree={10} volume={0.2} />)}
      <Effet nom="buzzer-erreur" a={M(0, 'PLUS')} volume={0.35} />
      <Effet nom="whoosh" a={P(1).d - 8} duree={24} volume={0.3} />
      <Effet nom="pop" a={M(1, 'taxi.')} />
      <Effet nom="vibration" a={M(1, 'Batterie :')} duree={30} volume={0.55} />
      <Effet nom="whoosh" a={M(1, 'Bobo') - 4} duree={20} volume={0.3} />
      <Effet nom="pop" a={M(1, 'chargeur.')} />
      <Effet nom="pop" a={M(2, 'Ferme')} />
      <Effet nom="whoosh" a={P(3).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(3, 'Soit', 1)} />
      <Effet nom="whoosh" a={P(4).d - 4} duree={24} volume={0.4} />
      <Effet nom="clic-bouton" a={P(4).d + 8} />
      <Effet nom="coeur" a={P(4).d + 10} duree={88} volume={0.5} />
      <Effet nom="ding-bonne-reponse" a={REVELATION} volume={0.55} />
      <Effet nom="whoosh" a={REVELATION + 40} duree={24} volume={0.35} />
      <Effet nom="buzzer-erreur" a={REVELATION + 44} volume={0.3} />
      <Effet nom="whoosh" a={P(6).d} duree={24} volume={0.35} />
      {["l'écran", 'GPS,', 'vidéo,', 'réseau'].map((m) => <Effet key={m} nom="pop" a={M(6, m)} volume={0.4} />)}
      <Effet nom="whoosh" a={P(7).d} duree={24} volume={0.35} />
      {['Luminosité', 'économie,', 'avion'].map((m) => <Effet key={m} nom="clic-bouton" a={M(7, m)} />)}
      <Effet nom="sparkle" a={M(7, 'longtemps.')} volume={0.4} />
      <Effet nom="carte" a={P(8).d} duree={25} />
      <Effet nom="whoosh" a={P(9).d - 8} duree={24} volume={0.3} />
      <Effet nom="pop" a={M(9, 'arrive.')} />
      <Effet nom="pas" a={debranche - 20} duree={22} volume={0.35} />
      <Effet nom="gag-boing" a={M(9, 'console.')} volume={0.45} />
      <Effet nom="whoosh" a={P(10).d - 4} duree={20} volume={0.3} />
      <Effet nom="gag-boing" a={M(10, 'pierre.')} volume={0.4} />
      <Effet nom="pop" a={M(10, 'pierre.') + 8} />
    </AbsoluteFill>
  );
};

const rougeTel = (f: number) => Math.floor(f / 10) % 2 === 0;
