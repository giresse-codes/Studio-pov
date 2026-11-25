import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Camera, Plan} from '../camera/Camera';
import {CUISINE_COLOC, CuisineColoc, EVIER, PLAN_TRAVAIL, SOL_CUISINE, ZONES_CUISINE as Z} from '../decors/CuisineColoc';
import {BocalCornichons} from '../decors/CuisineColoc';
import {clamp, prog} from '../lib/anim';
import {Ambiance, Effet, Musique, Voix} from '../lib/sons';
import {C} from '../lib/theme';
import {creerTiming, DonneesVoix} from '../lib/timing';
import {
  Bobo, Casserole, clignement, debout, epaulesTombent, Expression, Fourchette, marcher, Pose, SaladierRiz, sursaut, TelephoneAPlat, Toi,
} from '../personnages';
import {
  BulleParole, CarteAbonne, CarteJeu, CarteOuverture, EcranChoix, Etiquette, Etincelles, HUD, SchemaDeuxChoix, SchemaEquation, SchemaEtapes,
  SchemaListe, SousTitres, TexteHook, valeurAnimee,
} from '../ui';
import donnees from '../../videos/astuce-1/mots.json';

/** #astuce 1 — « Téléphone dans l'eau » */
const AJOUT = 90; // la voix ne laisse que 0,7 s à la [pause] : on ajoute 3 s pour le compte à rebours
const T = creerTiming(donnees as DonneesVoix, {
  ajout: AJOUT,
  cles: ['riz.', 'géré ! »', 'rien', 'évier.', 'vaisselle.', 'fourchette', 'clignote', 'riz,', 'quoi', 'mythe.', 'poussière', 'Apple', 'courant :',
    'court-circuit.', 'éteins', 'branches', 'coque,', 'bas.', 'journée.', 'sèche-cheveux', 'réparateur.', 'cuire', 'gaspillé.', 'cornichons.'],
});
export const DUREE_ASTUCE_1 = T.fin + 50;

const P = T.phrase;
const M = T.mot;
const REVELATION = P(7).d;
// convertit un point du monde en pixels écran pour un plan de caméra donné
const ecran = (wx: number, wy: number, cam: {x: number; y: number; zoom: number}) => ({x: 540 + (wx - cam.x) * cam.zoom, y: 960 + (wy - cam.y) * cam.zoom});

const CAM_P1 = {x: 1000, y: 1150, zoom: 1.0};
const CAM_P4 = {x: 1500, y: 1150, zoom: 1.3};
const CAM_P11 = {x: 1150, y: 1200, zoom: 1.45};
const CAM_P12 = {x: 1820, y: 1150, zoom: 1.5};

export const Astuce1: React.FC = () => {
  const f = useCurrentFrame();

  // ---------------- Caméra ----------------
  const plans: Plan[] = [
    {a: 0, x: 440, y: 1150, zoom: 1.2},
    {a: 2, ...Z.table, zoom: 2.1, duree: 10},
    {a: P(1).d - 8, ...CAM_P1, duree: 16},
    {a: P(2).d - 4, x: 1400, y: 1200, zoom: 1.7, duree: 12},
    {a: P(3).d - 4, ...Z.evier, duree: 12},
    {a: P(4).d - 6, ...CAM_P4, duree: 14},
    {a: P(5).d - 6, x: 1200, y: 1150, zoom: 1.15, duree: 16},
    {a: P(11).d - 8, ...CAM_P11, duree: 14},
    {a: P(12).d - 6, ...CAM_P12, duree: 14},
  ];

  // ---------------- Toi ----------------
  let xToi = 560;
  let pose: Pose = debout(f);
  let expr: Expression = 'neutre';
  let sensToi: 1 | -1 = 1;
  const dMarche = P(3).d - 30, fMarche = P(3).d + 10;
  if (f < P(1).d) { xToi = 790; sensToi = -1; pose = sursaut(debout(f), f - 4); expr = 'panique'; }
  else if (f < dMarche) { expr = f < P(2).d ? 'neutre' : 'concentre'; pose = f < P(2).d ? debout(f) : epaulesTombent(debout(f), prog(f, P(2).d, P(2).d + 12)); }
  else if (f < fMarche) { xToi = interpolate(f, [dMarche, fMarche], [560, 1220], clamp); pose = marcher(f - dMarche); expr = 'neutre'; }
  else {
    xToi = 1220;
    if (f < P(4).d) { pose = sursaut(debout(f), f - M(3, 'téléphone')); expr = 'panique'; }
    else if (f < P(11).d) { pose = debout(f); expr = f < REVELATION ? 'surpris' : 'concentre'; }
    else if (f < P(12).d) { xToi = 1430; sensToi = -1; pose = epaulesTombent(debout(f), 0.7); expr = 'triste'; }
    else { xToi = 1420; pose = debout(f); expr = 'surpris'; }
  }

  // ---------------- Bobo ----------------
  let xBobo = 1400;
  let poseBobo: Pose = debout(f);
  let exprBobo: Expression = 'content';
  let sensBobo: 1 | -1 = -1;
  let mainBobo: React.ReactNode;
  let regardBobo = 0.6;
  if (f < P(2).d) {
    // pouce levé « j'ai tout géré ! »
    poseBobo = {...debout(f), epauleAv: 120, coudeAv: -30 + Math.sin(f / 4) * 8};
    exprBobo = 'fier';
  } else if (f < P(3).d) {
    poseBobo = {...debout(f), epauleAv: 10, coudeAv: 120, epauleAr: -10, coudeAr: 120};
    exprBobo = 'coupable';
    regardBobo = -0.8;
  } else if (f < P(4).d) {
    // il file se cacher vers le frigo en sifflotant
    const k = prog(f, P(3).d, P(3).d + 30);
    xBobo = interpolate(k, [0, 1], [1400, 2180]);
    poseBobo = k < 1 ? marcher(f, 1.3) : debout(f);
    sensBobo = k < 1 ? 1 : -1;
    exprBobo = 'coupable';
  } else if (f < P(11).d) {
    const k = prog(f, P(4).d, P(4).d + 34, Easing.linear);
    xBobo = interpolate(k, [0, 1], [2180, 1780]);
    poseBobo = k < 1 ? marcher(f, 1.1) : debout(f);
    poseBobo = {...poseBobo, epauleAv: 55, coudeAv: 35};
    mainBobo = <g transform="rotate(90)"><SaladierRiz echelle={0.8} /></g>;
    exprBobo = 'fier';
  } else if (f < P(12).d) {
    // il mange le riz cuit, fier de lui
    xBobo = 960;
    sensBobo = 1;
    poseBobo = {...debout(f), epauleAv: 25, coudeAv: 95 + Math.sin(f / 4) * 10, epauleAr: -20, coudeAr: 90};
    exprBobo = 'fier';
  } else {
    // contre le bocal de cornichons
    xBobo = 1880;
    sensBobo = -1;
    const lutte = f < M(12, 'cornichons.');
    poseBobo = {...debout(f), epauleAv: 70, coudeAv: 40, epauleAr: 60, coudeAr: 50, buste: lutte ? Math.sin(f * 1.3) * 5 : -8, y: lutte ? Math.sin(f * 2) * 3 : 0};
    exprBobo = lutte ? 'panique' : 'surpris';
    const angle = poseBobo.epauleAv + poseBobo.coudeAv;
    mainBobo = <g transform={`rotate(${angle + (lutte ? Math.sin(f * 1.5) * 10 : 0)})`}><BocalCornichons x={0} y={50} ouvert={interpolate(f, [M(12, 'cornichons.'), M(12, 'cornichons.') + 6], [0, 1], clamp)} /></g>;
  }

  // ---------------- HUD : dégâts de Bobo (€) + ta patience ----------------
  const degats = valeurAnimee(f, [[0, 0], [M(3, 'téléphone'), 899], [M(11, 'cuire'), 902], [M(12, 'cornichons.'), 905]], 18);
  const patience = valeurAnimee(f, [[0, 1], [P(2).d, 0.82], [M(3, 'clignote'), 0.35], [M(4, 'riz,'), 0.22], [P(9).d, 0.55], [M(11, 'cuire'), 0.4], [M(12, 'cornichons.'), 0.28]], 16);
  const alerte = Math.max(0, Math.min(1, (0.75 - patience) / 0.5));

  // ---------------- objets du décor ----------------
  const allume = f < M(9, "l'éteins") && Math.floor(f / 7) % 2 === 0;
  const yFourchette = interpolate(f, [M(3, 'fourchette'), M(3, 'fourchette') + 10], [EVIER.haut - 60, EVIER.bas - 38], {...clamp, easing: Easing.in(Easing.quad)});
  const fondEvier = (
    <g>
      <g transform={`translate(${EVIER.x + 140},${EVIER.bas - 12})`}><TelephoneAPlat allume={allume} rot={-3} /></g>
      {f >= M(3, 'fourchette') && <g transform={`translate(${EVIER.x + 150},${yFourchette})`}><Fourchette rot={-8} /></g>}
    </g>
  );
  const surTable = f < P(1).d ? <g transform={`translate(440,${PLAN_TRAVAIL})`}><SaladierRiz echelle={1.3} telephone /></g> : undefined;
  const surPlaques = f >= P(11).d - 10 ? <g transform={`translate(1050,${PLAN_TRAVAIL - 10})`}><Casserole riz vapeur={f} /></g> : undefined;
  const bocalEtagere = f >= P(12).d - 10 ? <g /> : undefined;

  const pBulle1 = ecran(1400, 900, CAM_P1);
  const pBulle4 = ecran(1780, 880, CAM_P4);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Camera plans={plans} largeur={CUISINE_COLOC.largeur} hauteur={CUISINE_COLOC.hauteur}
        secousse={interpolate(f, [M(3, 'téléphone'), M(3, 'téléphone') + 3, M(3, 'téléphone') + 14], [0, 0.7, 0], clamp)}>
        <CuisineColoc frame={f} fondEvier={fondEvier} surTable={surTable} surPlaques={surPlaques} bocal={bocalEtagere}>
          <g transform={`translate(${xBobo},${SOL_CUISINE})`}>
            <Bobo pose={poseBobo} expression={exprBobo} sens={sensBobo} echelle={1.2} cligne={clignement(f, 20)} regard={regardBobo} mainAv={mainBobo}
              parle={(f >= P(1).d && f < P(2).d) || (f >= P(11).d && f < P(12).d) ? Math.abs(Math.sin(f / 2.5)) * 0.7 : 0} />
          </g>
          <g transform={`translate(${xToi},${SOL_CUISINE})`}>
            <Toi pose={pose} expression={expr} sens={sensToi} echelle={1.2} cligne={clignement(f)} />
          </g>
        </CuisineColoc>
      </Camera>

      {/* 1. HOOK */}
      <TexteHook texte="ARRÊTE LE RIZ ! 🍚" fin={56} y={420} />
      <Etiquette a={M(0, 'riz.')} fin={P(1).d - 6} x={540} y={1180} texte="❌ MAUVAISE IDÉE" fond={C.rouge} couleur="#fff" rot={-6} taille={72} />

      {/* 2. SITUATION */}
      <CarteOuverture debut={P(1).d} fin={P(2).d + 10} lignes={['SAMEDI • 14:03', 'Appartement – Coloc', 'Toi, en week-end']} y={1110} />
      <BulleParole a={M(1, "T'inquiète,")} fin={P(2).d - 4} x={pBulle1.x - 190} y={pBulle1.y - 40} texte="T’inquiète, j’ai tout géré ! 👍" queue="droite" largeur={520} />
      <Etiquette a={M(2, 'rien')} fin={P(3).d - 6} x={540} y={760} texte="🚨 ALERTE BOBO" fond={C.rouge} couleur="#fff" rot={-5} taille={72} />
      <Etiquette a={M(3, 'téléphone') + 6} fin={P(4).d - 8} x={540} y={720} texte="📱 899 €… À L’EAU" fond="#fff" rot={4} taille={60} />
      <Etiquette a={M(3, 'fourchette')} fin={P(4).d - 8} x={760} y={900} texte="+ une fourchette 🍴" fond={C.jaune} rot={-4} taille={48} />
      <Etiquette a={M(3, 'clignote')} fin={P(4).d - 8} x={330} y={1260} texte="ça clignote… 😬" fond="#5ad1ff" rot={-3} taille={48} />
      <BulleParole a={M(4, 'Mets-le')} fin={P(5).d - 6} x={pBulle4.x - 130} y={pBulle4.y - 30} texte="Mets-le dans le riz ! Ma tante fait toujours ça 🍚" queue="droite" largeur={540} />

      <SchemaDeuxChoix debut={P(5).d} fin={P(6).d - 4} a1={P(5).d + 2} a2={M(5, 'Soit', 1)} icone1="🍚" texte1="Le riz" icone2="📴" texte2="Éteindre et sécher à l’air libre" />

      {/* 3. TU FERAIS QUOI ? */}
      <EcranChoix debut={P(6).d - 4} fin={REVELATION + 34} vert="Dans le riz" rouge="Éteindre et sécher à l’air" bonne="rouge" revelation={REVELATION} />

      {/* 4. RÉPONSE + EXPLICATION */}
      <SchemaListe debut={REVELATION + 40} fin={P(8).d - 4} titre="LE RIZ ?" tampon={{a: REVELATION + 44, texte: 'MYTHE'}} items={[
        {a: M(7, "n'aspire"), icone: '💧', texte: 'N’aspire pas l’eau cachée à l’intérieur', couleur: C.rouge},
        {a: M(7, 'poussière'), icone: '🌫️', texte: 'Sa poussière bouche les ports', couleur: C.rouge},
        {a: M(7, 'Apple'), icone: '🍏', texte: 'Même Apple le déconseille', couleur: C.rouge},
      ]} />
      <SchemaEquation debut={P(8).d} fin={P(9).d - 4} titre="LE VRAI DANGER" termes={[
        {a: M(8, 'courant\u00a0:'), icone: '📱', texte: 'Téléphone allumé'}, {a: M(8, "l'eau"), icone: '💧', texte: 'Eau savonneuse'},
      ]} resultat={{a: M(8, 'court-circuit.'), icone: '⚡', texte: 'COURT-CIRCUIT'}} />
      <SchemaEtapes debut={P(9).d} fin={P(10).d - 4} titre="LE BON RÉFLEXE" etapes={[
        {a: M(9, "l'éteins"), icone: '📴', texte: 'Éteins tout de suite'},
        {a: M(9, 'branches'), icone: '🔌', texte: 'Ne le branche pas'},
        {a: M(9, 'enlèves'), icone: '🧽', texte: 'Coque off, essuie'},
        {a: M(9, 'tapotes'), icone: '👇', texte: 'Ports vers le bas'},
        {a: M(9, 'sécher'), icone: '🌬️', texte: 'Sèche à l’air, au moins 24 h'},
      ]} />
      <CarteJeu debut={P(10).d} fin={P(11).d - 8} surTitre="ASTUCE N° 1" titre="Pas de chaleur !" y={420} largeur={940}
        detail="Pas de sèche-cheveux chaud. Ça bugue encore ? Direction le réparateur 🔧" />
      <Etiquette a={M(11, 'gaspillé.') - 6} fin={P(12).d - 6} x={ecran(1000, 900, CAM_P11).x + 80} y={ecran(1000, 900, CAM_P11).y - 140} texte="🍚 PAS GASPILLÉ !" fond={C.jaune} rot={-6} taille={60} />
      <Etincelles debut={M(12, 'cornichons.')} x={ecran(1880, 900, CAM_P12).x} y={ecran(1880, 900, CAM_P12).y - 60} rayon={200} couleur="#7dff8a" />

      {/* 5. ACCROCHE FINALE */}
      <CarteAbonne debut={M(12, 'cornichons.') + 10} fin={DUREE_ASTUCE_1} y={1600} />

      <HUD valeur={degats} unite="€" libelle="DÉGÂTS DE BOBO" barre={patience} icone="🏠" alerte={alerte} apparition={4} />
      <SousTitres mots={T.mots} y={1440} />

      {/* ---------------- SONS ---------------- */}
      <Voix src={staticFile('videos/astuce-1/voix.wav')} pauseS={(donnees as DonneesVoix).pause ?? undefined} ajout={AJOUT} />
      <Ambiance nom="appartement" duree={DUREE_ASTUCE_1} />
      <Musique nom="comique" duree={DUREE_ASTUCE_1} voix={T.segments} />
      <Effet nom="whoosh" a={2} duree={24} volume={0.4} />
      <Effet nom="buzzer-erreur" a={M(0, 'riz.')} volume={0.35} />
      <Effet nom="whoosh" a={P(1).d - 8} duree={24} volume={0.3} />
      <Effet nom="pop" a={M(1, "T'inquiète,")} />
      <Effet nom="gag-boing" a={M(2, 'rien')} volume={0.4} />
      <Effet nom="whoosh" a={P(3).d - 4} duree={24} volume={0.35} />
      <Effet nom="eau-plouf" a={M(3, 'téléphone')} duree={40} volume={0.5} />
      <Effet nom="compteur" a={M(3, 'téléphone') + 4} duree={24} volume={0.35} />
      <Effet nom="pas" a={dMarche} duree={40} volume={0.35} />
      <Effet nom="eau-plouf" a={M(3, 'fourchette') + 8} duree={30} volume={0.3} />
      <Effet nom="pop" a={M(3, 'clignote')} volume={0.35} />
      <Effet nom="pas" a={P(4).d} duree={34} volume={0.3} />
      <Effet nom="pop" a={M(4, 'Mets-le')} />
      <Effet nom="whoosh" a={P(5).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(5, 'Soit', 1)} />
      <Effet nom="whoosh" a={P(6).d - 4} duree={24} volume={0.4} />
      <Effet nom="clic-bouton" a={P(6).d + 8} />
      <Effet nom="coeur" a={P(6).d + 10} duree={88} volume={0.5} />
      <Effet nom="ding-bonne-reponse" a={REVELATION} volume={0.55} />
      <Effet nom="whoosh" a={REVELATION + 40} duree={24} volume={0.35} />
      <Effet nom="buzzer-erreur" a={REVELATION + 44} volume={0.3} />
      <Effet nom="pop" a={M(7, 'poussière')} />
      <Effet nom="pop" a={M(7, 'Apple')} />
      <Effet nom="whoosh" a={P(8).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(8, 'courant\u00a0:')} />
      <Effet nom="pop" a={M(8, "l'eau")} />
      <Effet nom="buzzer-erreur" a={M(8, 'court-circuit.')} volume={0.35} />
      <Effet nom="whoosh" a={P(9).d} duree={24} volume={0.35} />
      {["l'éteins", 'branches', 'enlèves', 'tapotes', 'sécher'].map((m) => <Effet key={m} nom="pop" a={M(9, m)} volume={0.4} />)}
      <Effet nom="carte" a={P(10).d} duree={25} />
      <Effet nom="whoosh" a={P(11).d - 8} duree={24} volume={0.35} />
      <Effet nom="sparkle" a={M(11, 'gaspillé.') - 6} volume={0.35} />
      <Effet nom="whoosh" a={P(12).d - 6} duree={24} volume={0.35} />
      <Effet nom="gag-boing" a={M(12, 'cornichons.')} volume={0.5} />
      <Effet nom="pop" a={M(12, 'cornichons.') + 10} />
    </AbsoluteFill>
  );
};
