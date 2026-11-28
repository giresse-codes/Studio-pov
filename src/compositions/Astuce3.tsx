import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Camera, Plan} from '../camera/Camera';
import {CUISINE_COLOC, CuisineColoc, PLAN_TRAVAIL, SOL_CUISINE} from '../decors/CuisineColoc';
import {clamp} from '../lib/anim';
import {Ambiance, Effet, Musique, Voix} from '../lib/sons';
import {C} from '../lib/theme';
import {creerTiming, DonneesVoix} from '../lib/timing';
import {Bobo, clignement, debout, Expression, Flammes, Pose, SaucePiquante, Smartphone, sursaut, Taco, Toi, Verre} from '../personnages';
import {
  BulleParole, CarteAbonne, CarteOuverture, EcranChoix, Etiquette, Etincelles, HUD, SchemaCapsaicine, SchemaDeuxChoix, SchemaEquation, SchemaListe,
  SousTitres, TexteHook, valeurAnimee,
} from '../ui';
import donnees from '../../videos/astuce-3/mots.json';

/** #astuce 3 — « La bouche en feu » */
const AJOUT = 90; // 1,1 s de silence à la [pause] : on ajoute 3 s pour le compte à rebours
const T = creerTiming(donnees as DonneesVoix, {
  ajout: AJOUT,
  cles: ['pique.', 'relevée »,', 'feu.', 'trois', 'capsaïcine.', 'cerveau', 'cuit.', 'glacée.', 'lait.', 'quoi', "l'huile :", 'partout', "s'étend.",
    'gras', 'caséine,', 'attrape', 'savon.', 'yaourt,', 'pain.', 'entier', 'quatrième', 'pas.', 'batterie'],
});
export const DUREE_ASTUCE_3 = T.fin + 50;

const P = T.phrase;
const M = T.mot;
const REVELATION = P(6).d;
const ecran = (wx: number, wy: number, cam: {x: number; y: number; zoom: number}) => ({x: 540 + (wx - cam.x) * cam.zoom, y: 960 + (wy - cam.y) * cam.zoom});

const X_TOI = 330;
const X_BOBO = 790;
const CAM_TABLE = {x: 560, y: 1180, zoom: 1.4};
const CAM_TOI = {x: 400, y: 1120, zoom: 1.9};
const CAM_BOBO = {x: 760, y: 1130, zoom: 1.8};
const JOUR = 0.42; // samedi 20 h 15 : la nuit tombe

export const Astuce3: React.FC = () => {
  const f = useCurrentFrame();

  // ---------------- Caméra ----------------
  const plans: Plan[] = [
    {a: 0, ...CAM_TABLE},
    {a: 2, ...CAM_TOI, duree: 10},
    {a: P(1).d - 8, ...CAM_TABLE, duree: 16},
    {a: M(2, 'Bobo') - 4, ...CAM_BOBO, duree: 10},
    {a: P(3).d - 4, x: 600, y: 1150, zoom: 1.15, duree: 16},
    {a: P(9).d - 8, ...CAM_TABLE, duree: 14},
    {a: P(10).d - 4, ...CAM_TOI, duree: 12},
  ];

  // ---------------- Toi ----------------
  let pose: Pose = debout(f);
  let expr: Expression = 'neutre';
  let mainToi: React.ReactNode;
  let feuToi = false;
  const boire: Pose = {...debout(f), epauleAv: 105, coudeAv: 135 + Math.sin(f / 5) * 5, tete: -14};
  if (f < P(1).d) { pose = boire; expr = 'panique'; feuToi = true; mainToi = <g transform={`rotate(${boire.epauleAv + boire.coudeAv})`}><Verre contenu="eau" niveau={0.4} /></g>; }
  else if (f < M(2, 'feu.')) { pose = {...debout(f), epauleAv: 100, coudeAv: 40}; expr = 'content'; mainToi = <g transform="rotate(140)"><Taco /></g>; }
  else if (f < P(9).d) {
    pose = sursaut(debout(f), f - M(2, 'feu.'));
    expr = f < REVELATION ? 'panique' : 'concentre';
    feuToi = f < P(7).d;
  } else if (f < P(10).d) { pose = boire; expr = 'soulage'; mainToi = <g transform={`rotate(${boire.epauleAv + boire.coudeAv})`}><Verre contenu="lait" niveau={0.7} /></g>; }
  else { pose = sursaut({...debout(f), epauleAv: 70, coudeAv: 80}, f - M(10, 'batterie')); expr = 'panique'; mainToi = <Smartphone ecran="#ff4757" />; }

  // ---------------- Bobo ----------------
  let poseBobo: Pose = debout(f);
  let exprBobo: Expression = 'fier';
  let mainBobo: React.ReactNode;
  const feuBobo = f >= M(2, 'Bobo') && f < P(10).d;
  const boireBobo: Pose = {...debout(f), epauleAv: 105, coudeAv: 135 + Math.sin(f / 4) * 6, tete: -14};
  if (f < P(2).d) {
    poseBobo = {...debout(f), epauleAv: 120, coudeAv: 10};
    mainBobo = <g transform={`rotate(130) scale(-1,1)`}><SaucePiquante /></g>;
  } else if (feuBobo) {
    const boit = (f >= M(2, 'Bobo') && f < P(3).d) || f >= P(9).d;
    poseBobo = boit ? boireBobo : {...debout(f), epauleAv: 140 + Math.sin(f * 0.8) * 25, coudeAv: 40, epauleAr: 130 + Math.cos(f * 0.8) * 25, coudeAr: 40};
    exprBobo = 'panique';
    if (boit) mainBobo = <g transform={`rotate(${boireBobo.epauleAv + boireBobo.coudeAv})`}><Verre contenu="eau" niveau={0.5} /></g>;
  } else {
    poseBobo = debout(f);
    exprBobo = 'triste';
  }

  // verres vides de Bobo sur la table
  const nVerres = f < M(2, 'Bobo') ? 0 : f < P(9).d ? Math.min(3, 1 + Math.floor((f - M(2, 'Bobo')) / 14)) : 4;

  // ---------------- HUD ----------------
  const degats = valeurAnimee(f, [[0, 0], [M(2, 'bouchée :'), 24], [M(9, 'quatrième'), 26]], 16);
  const patience = valeurAnimee(f, [[0, 0.9], [M(2, 'feu.'), 0.4], [M(2, 'fort.'), 0.3], [M(7, 'savon.'), 0.72], [M(9, 'pas.'), 0.6], [M(10, 'batterie'), 0.35]], 14);
  const alerte = Math.max(0, Math.min(1, (0.75 - patience) / 0.5));

  const pBulle1 = ecran(X_BOBO, 900, CAM_TABLE);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Camera plans={plans} largeur={CUISINE_COLOC.largeur} hauteur={CUISINE_COLOC.hauteur}
        secousse={interpolate(f, [M(2, 'feu.'), M(2, 'feu.') + 3, M(2, 'feu.') + 14], [0, 0.7, 0], clamp)}>
        <CuisineColoc frame={f} jour={JOUR}
          surTable={
            <g>
              {/* tacos et sauce */}
              <g transform={`translate(330,${PLAN_TRAVAIL - 6})`}><Taco /></g>
              <g transform={`translate(430,${PLAN_TRAVAIL - 6}) scale(0.8)`}><Taco /></g>
              {Array.from({length: nVerres}).map((_, i) => <g key={i} transform={`translate(${560 + i * 40},${PLAN_TRAVAIL})`}><Verre contenu="vide" echelle={0.7} /></g>)}
              {f >= P(2).d && <g transform={`translate(250,${PLAN_TRAVAIL})`}><SaucePiquante /></g>}
            </g>
          }>
          <g transform={`translate(${X_TOI},${SOL_CUISINE})`}>
            <Toi pose={pose} expression={expr} echelle={1.2} cligne={clignement(f)} mainAv={mainToi} />
          </g>
          <g transform={`translate(${X_BOBO},${SOL_CUISINE})`}>
            <Bobo pose={poseBobo} expression={exprBobo} sens={-1} echelle={1.2} cligne={clignement(f, 20)} mainAv={mainBobo}
              parle={feuBobo || (f >= M(1, 'Légèrement') && f < P(2).d) ? Math.abs(Math.sin(f / 2.2)) * 0.8 : 0} />
          </g>
          {feuToi && <g transform={`translate(${X_TOI + 10},960)`}><Flammes frame={f} echelle={0.9} /></g>}
          {feuBobo && <g transform={`translate(${X_BOBO - 10},960)`}><Flammes frame={f + 7} echelle={f >= P(9).d ? 1.4 : 1} /></g>}
        </CuisineColoc>
      </Camera>

      {/* 1. HOOK */}
      <TexteHook texte="ARRÊTE L’EAU QUAND ÇA PIQUE ! 🔥" fin={56} y={420} />
      <Etiquette a={M(0, 'pique.')} fin={P(1).d - 6} x={700} y={1250} texte="❌ ÇA EMPIRE" fond={C.rouge} couleur="#fff" rot={-6} taille={72} />

      {/* 2. SITUATION */}
      <CarteOuverture debut={P(1).d} fin={P(2).d} lignes={['SAMEDI • 20:15', 'Appartement – Coloc', 'Toi, soirée tacos']} y={1110} />
      <BulleParole a={M(1, 'Légèrement')} fin={P(2).d - 4} x={pBulle1.x - 150} y={pBulle1.y + 20} texte="« Légèrement relevée » 😇" queue="droite" largeur={500} />
      <Etiquette a={M(2, 'feu.')} fin={M(2, 'Bobo') - 2} x={540} y={760} texte="🔥 BOUCHE EN FEU 🔥" fond={C.rouge} couleur="#fff" rot={-5} taille={68} />
      <Etiquette a={M(2, 'trois')} fin={P(3).d - 6} x={300} y={1240} texte={`💧 VERRE N° ${Math.max(1, nVerres)}`} fond="#7fc6ff" rot={-4} taille={56} />
      <Etiquette a={M(2, 'fort.')} fin={P(3).d - 6} x={720} y={560} texte="ENCORE PIRE 😭" fond="#fff" rot={5} taille={60} />

      {/* explication : la capsaïcine */}
      <SchemaEquation debut={P(3).d} fin={P(4).d - 4} titre="POURQUOI ÇA BRÛLE ?" termes={[
        {a: M(3, 'capsaïcine.'), icone: '🌶️', texte: 'Capsaïcine'}, {a: M(3, 'cerveau'), icone: '🧠', texte: 'Ton cerveau'},
      ]} resultat={{a: M(3, 'cuit.'), icone: '🔥', texte: '« Ça cuit ! »'}} />
      <SchemaDeuxChoix debut={P(4).d} fin={P(5).d - 4} a1={P(4).d + 2} a2={M(4, 'Soit', 1)} icone1="🧊" texte1="Un grand verre d’eau glacée" icone2="🥛" texte2="Un verre de lait" />

      {/* 3. TU FERAIS QUOI ? */}
      <EcranChoix debut={P(5).d - 4} fin={REVELATION + 34} vert="Eau glacée" rouge="Un verre de lait" bonne="rouge" revelation={REVELATION} />

      {/* 4. RÉPONSE + EXPLICATION */}
      <SchemaCapsaicine debut={REVELATION + 40} fin={P(8).d - 4} aHuile={REVELATION + 40} aEau={M(6, "L'eau", 1)} aEtend={M(6, 'feu')}
        aLait={P(7).d} aCaseine={M(7, 'caséine,')} aAttrape={M(7, 'attrape')} aSavon={M(7, 'savon.')} />
      <SchemaListe debut={P(8).d} fin={P(9).d - 4} titre="PAS DE LAIT ?" items={[
        {a: M(8, 'yaourt,'), icone: '🥣', texte: 'Un yaourt', couleur: C.vert},
        {a: M(8, 'fromage'), icone: '🧀', texte: 'Du fromage blanc', couleur: C.vert},
        {a: M(8, 'pain.'), icone: '🍞', texte: 'Un morceau de pain', couleur: C.vert},
        {a: M(8, 'entier'), icone: '🥛', texte: 'Lait ENTIER > écrémé', couleur: C.jaune},
      ]} />
      <BulleParole a={M(9, 'dit')} fin={M(9, 'pas.') + 20} x={pBulle1.x - 150} y={pBulle1.y - 40} texte="Ça commence à marcher… 🥲" queue="droite" largeur={500} />
      <Etiquette a={M(9, 'pas.')} fin={P(10).d - 4} x={540} y={1250} texte="SPOILER : NON ❌" fond={C.rouge} couleur="#fff" rot={-5} taille={72} />
      <Etiquette a={M(9, 'quatrième')} fin={P(10).d - 4} x={300} y={760} texte="🥛 TOI : RÉGLÉ" fond={C.vert} rot={4} taille={54} />
      <Etiquette a={M(10, 'batterie')} fin={T.fin + 30} x={560} y={1230} texte="🔋 1 % !!!" fond={C.rouge} couleur="#fff" rot={-6} taille={90} />
      <Etincelles debut={M(10, 'batterie')} x={560} y={1230} rayon={220} couleur={C.rouge} />

      {/* 5. ACCROCHE FINALE */}
      <CarteAbonne debut={M(10, 'batterie') + 24} fin={DUREE_ASTUCE_3} y={1600} />

      <HUD valeur={degats} unite="€" libelle="DÉGÂTS DE BOBO" barre={patience} icone="🏠" alerte={alerte} apparition={4} />
      <SousTitres mots={T.mots} y={1440} />

      {/* ---------------- SONS ---------------- */}
      <Voix src={staticFile('videos/astuce-3/voix.mp3')} pauseS={(donnees as DonneesVoix).pause ?? undefined} ajout={AJOUT} />
      <Ambiance nom="appartement" duree={DUREE_ASTUCE_3} />
      <Musique nom="comique" duree={DUREE_ASTUCE_3} voix={T.segments} />
      <Effet nom="whoosh" a={2} duree={24} volume={0.4} />
      <Effet nom="buzzer-erreur" a={M(0, 'pique.')} volume={0.35} />
      <Effet nom="whoosh" a={P(1).d - 8} duree={24} volume={0.3} />
      <Effet nom="pop" a={M(1, 'Légèrement')} />
      <Effet nom="gag-boing" a={M(2, 'feu.')} volume={0.45} />
      <Effet nom="whoosh" a={M(2, 'Bobo') - 4} duree={20} volume={0.3} />
      {[0, 1, 2].map((i) => <Effet key={i} nom="pop" a={M(2, 'Bobo') + i * 14} volume={0.35} />)}
      <Effet nom="whoosh" a={P(3).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(3, 'capsaïcine.')} />
      <Effet nom="pop" a={M(3, 'cerveau')} />
      <Effet nom="buzzer-erreur" a={M(3, 'cuit.')} volume={0.3} />
      <Effet nom="whoosh" a={P(4).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(4, 'Soit', 1)} />
      <Effet nom="whoosh" a={P(5).d - 4} duree={24} volume={0.4} />
      <Effet nom="clic-bouton" a={P(5).d + 8} />
      <Effet nom="coeur" a={P(5).d + 10} duree={88} volume={0.5} />
      <Effet nom="ding-bonne-reponse" a={REVELATION} volume={0.55} />
      <Effet nom="whoosh" a={REVELATION + 40} duree={24} volume={0.35} />
      <Effet nom="eau-plouf" a={M(6, "L'eau", 1)} duree={30} volume={0.3} />
      <Effet nom="buzzer-erreur" a={M(6, 'feu')} volume={0.3} />
      <Effet nom="sparkle" a={M(7, 'attrape')} volume={0.4} />
      <Effet nom="ding-bonne-reponse" a={M(7, 'savon.')} volume={0.25} />
      <Effet nom="whoosh" a={P(8).d} duree={24} volume={0.35} />
      {['yaourt,', 'fromage', 'pain.', 'entier'].map((m) => <Effet key={m} nom="pop" a={M(8, m)} volume={0.4} />)}
      <Effet nom="whoosh" a={P(9).d - 8} duree={24} volume={0.3} />
      <Effet nom="pop" a={M(9, 'dit')} />
      <Effet nom="gag-boing" a={M(9, 'pas.')} volume={0.45} />
      <Effet nom="whoosh" a={P(10).d - 4} duree={20} volume={0.3} />
      <Effet nom="vibration" a={M(10, 'batterie')} duree={30} volume={0.5} />
      <Effet nom="pop" a={M(10, 'batterie') + 24} />
    </AbsoluteFill>
  );
};
