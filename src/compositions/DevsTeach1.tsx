import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Camera, Plan} from '../camera/Camera';
import {BUREAU_STARTUP, BureauStartup, ECRAN_STARTUP, POSTE_TOI, SOL_STARTUP, ZONES_STARTUP as Z} from '../decors/BureauStartup';
import {clamp, prog} from '../lib/anim';
import {Ambiance, Effet, Musique, Voix} from '../lib/sons';
import {C, POLICE_CODE} from '../lib/theme';
import {creerTiming, DonneesVoix} from '../lib/timing';
import {
  assis, Cafe, clignement, debout, epaulesTombent, etirer, Expression, marcher, Max, melanger, Pose, Smartphone, sursaut,
  taperClavier, Toi,
} from '../personnages';
import {
  CarteAbonne, CarteJeu, CarteOuverture, EcranChoix, Etiquette, Etincelles, HUD, NotificationSMS, SchemaDeuxPistes, SchemaTroisFichiers,
  SiteClient, SousTitres, TexteHook, valeurAnimee,
} from '../ui';
import donnees from '../../videos/devsteach-1/mots.json';

/** #devsteach 1 — « Le site est moche » */
const AJOUT = 90; // 3 s de silence insérées à la balise [pause] (la voix n'en laisse pas)
const T = creerTiming(donnees as DonneesVoix, {
  ajout: AJOUT,
  cles: ['stage…', '1998.', 'URGENT.', 'heure.', 'noir.', 'blanc.', 'couleur.', 'trois', 'HTML,', 'squelette', 'CSS,', 'vêtements', 'JavaScript,', 'muscles',
    'nu.', 'cassé', 'relié', 'quoi', 'perdue.', 'head', 'link,', 'stylesheet,', 'css.', 'apparaît.', 'link,', 'exact', 'géant.'],
});
export const DUREE_DEVSTEACH_1 = T.fin + 50;

const P = T.phrase;
const M = T.mot;
const ECR = ECRAN_STARTUP;

// --- moments clés (frames) ---
const RESSEMBLE = M(0, 'ressemble');
const ASSOIS = M(1, "t'assois,");
const POSE_CAFE = M(1, 'poses');
const VIBRE = M(1, 'vibre.');
const SMS = M(1, 'Max');
const URGENT = M(1, 'URGENT.');
const FIN_SMS = M(1, 'Regarde-le.') + 26;
const OUVRES = P(2).d;
const REVELATION = P(7).d;
const RAFRAICHIS = P(9).d;
const COULEURS = M(9, 'couleurs,');
const APPARAIT = M(9, 'apparaît.');

const ecranVersEcran = (wx: number, wy: number, cam: {x: number; y: number; zoom: number}) => ({
  x: 540 + (wx - cam.x) * cam.zoom,
  y: 960 + (wy - cam.y) * cam.zoom,
});
const CAM_ECRAN = Z.ecran;
// position écran (pixels vidéo) d'un point du site affiché (repère 440 x 290)
const surSite = (lx: number, ly: number) => ecranVersEcran(ECR.x + lx, ECR.y + ly, CAM_ECRAN);

export const DevsTeach1: React.FC = () => {
  const f = useCurrentFrame();

  // ---------------- Caméra ----------------
  const plans: Plan[] = [
    {a: 0, x: 1200, y: 1130, zoom: 1.3},
    {a: 3, x: 1180, y: 1180, zoom: 1.5, duree: 10},
    {a: RESSEMBLE - 4, ...Z.ecran, duree: 12},
    {a: P(1).d - 10, x: 1100, y: 1210, zoom: 1.45, duree: 16},
    {a: SMS - 6, ...Z.reunion, duree: 12},
    {a: FIN_SMS - 10, x: 1100, y: 1210, zoom: 1.45, duree: 14},
    {a: OUVRES - 4, ...Z.ecran, duree: 12},
    {a: P(3).d - 6, x: 1150, y: 1180, zoom: 1.2, duree: 16},
    {a: P(4).d - 4, x: 1160, y: 1150, zoom: 1.75, duree: 10},
    {a: P(5).d - 4, x: 1150, y: 1180, zoom: 1.2, duree: 14},
    {a: REVELATION + 30, ...Z.ecran, duree: 14},
    {a: P(8).d - 4, x: 1120, y: 1230, zoom: 1.4, duree: 16},
    {a: RAFRAICHIS - 6, ...Z.ecran, duree: 12},
    {a: APPARAIT + 6, x: 1110, y: 1200, zoom: 1.4, duree: 18},
    {a: P(11).d - 8, x: 400, y: 1060, zoom: 1.35, duree: 14},
  ];

  // ---------------- Toi ----------------
  let pose: Pose = debout(f);
  let expr: Expression = 'neutre';
  let regard = 0.8;
  let regardY = 0;
  let xToi = 960;
  let mainAv: React.ReactNode;
  if (f < ASSOIS) {
    pose = sursaut(debout(f), f - 4);
    pose = {...pose, epauleAv: Math.max(pose.epauleAv, 70), coudeAv: 60};
    expr = f < 40 ? 'surpris' : 'triste';
    mainAv = <g transform="rotate(130)"><Cafe vapeur={f} /></g>;
  } else if (f < VIBRE) {
    const k = prog(f, ASSOIS, ASSOIS + 12);
    xToi = interpolate(k, [0, 1], [960, POSTE_TOI]);
    pose = melanger(debout(f), assis(f), k);
    if (f < POSE_CAFE + 4) {
      pose = {...pose, epauleAv: 70, coudeAv: 60};
      mainAv = <g transform="rotate(130)"><Cafe vapeur={f} /></g>;
    } else {
      pose = taperClavier(f, 0.6);
    }
    expr = 'neutre';
  } else if (f < OUVRES) {
    xToi = POSTE_TOI;
    const lire: Pose = {...assis(f), epauleAv: 70, coudeAv: 95, buste: 6, tete: 10};
    pose = sursaut(melanger(taperClavier(f), lire, prog(f, VIBRE + 6, VIBRE + 14)), f - VIBRE);
    mainAv = f > VIBRE + 8 ? <Smartphone ecran={f > SMS ? '#ffffff' : '#5ad1ff'} /> : undefined;
    expr = f < SMS ? 'surpris' : f < URGENT + 10 ? 'panique' : 'surpris';
    regard = 0.5;
    regardY = 0.6;
  } else {
    xToi = POSTE_TOI;
    pose = taperClavier(f, 0.9);
    expr = 'concentre';
    if (f < P(3).d) expr = 'triste';
    else if (f < P(4).d) { pose = assis(f); expr = 'neutre'; regard = 0.3; }
    else if (f < P(5).d) {
      // fou rire : le corps tressaute
      pose = {...assis(f), y: Math.sin(f * 1.4) * 6, buste: -8, tete: -10 + Math.sin(f * 1.4) * 4, epauleAv: 40, coudeAv: 100};
      expr = 'content';
    } else if (f < REVELATION) { pose = assis(f); expr = f < P(6).d ? 'concentre' : 'surpris'; regard = 0.2; }
    else if (f < P(8).d) { pose = taperClavier(f, 0.6); expr = f < M(7, 'réécrire,') ? 'fier' : 'soulage'; }
    else if (f < RAFRAICHIS) { pose = taperClavier(f, 1.7); expr = 'concentre'; }
    else if (f < APPARAIT) { pose = assis(f); expr = 'surpris'; }
    else if (f < P(10).d + 20) { pose = etirer(assis(f), interpolate(f, [APPARAIT, APPARAIT + 8, P(10).d, P(10).d + 20], [0, 1, 1, 0], clamp)); expr = 'fier'; }
    else if (f < P(11).d) { pose = assis(f); expr = 'fier'; }
    else { pose = epaulesTombent(assis(f), prog(f, M(11, 'géant.'), M(11, 'géant.') + 10)); expr = 'triste'; }
  }

  // ---------------- Max (salle de réunion) ----------------
  const texto = f >= SMS - 30 && f < FIN_SMS + 10;
  const teaser = f >= P(11).d - 20;
  let xMax = 400 + Math.sin(f / 45) * 170;
  const versDroite = Math.cos(f / 45) > 0;
  let poseMax: Pose = marcher(f, 0.9);
  let sensMax: 1 | -1 = versDroite ? 1 : -1;
  let exprMax: Expression = 'panique';
  let mainMax: React.ReactNode;
  if (texto) {
    xMax = 400 + Math.sin((SMS - 30) / 45) * 170;
    poseMax = {...debout(f), epauleAv: 60, coudeAv: 90, tete: 10};
    sensMax = 1;
    mainMax = <Smartphone ecran="#ffffff" />;
  } else if (teaser) {
    // Max montre le tableau blanc : « TITRE GÉANT ! »
    xMax = 600;
    sensMax = -1;
    const leve = prog(f, M(11, 'titre…'), M(11, 'titre…') + 10);
    poseMax = {...debout(f), epauleAv: 40 + leve * 105, coudeAv: 20 - leve * 15, tete: -8 * leve};
    exprMax = f > M(11, 'géant.') ? 'fier' : 'content';
  }

  // ---------------- HUD ----------------
  const minutes = valeurAnimee(f, [[0, 60], [P(3).d, 59], [P(5).d, 58], [P(6).d, 57], [REVELATION, 56], [P(8).d, 55], [RAFRAICHIS, 54]], 10);
  const stress = valeurAnimee(f, [[0, 0.25], [URGENT, 0.82], [P(6).d, 0.96], [APPARAIT, 0.12], [M(11, 'géant.'), 0.55]], 14);
  const alerte = valeurAnimee(f, [[0, 0.05], [URGENT, 0.7], [P(6).d, 1], [APPARAIT, 0], [M(11, 'géant.'), 0.45]], 12);

  // ---------------- écran du PC ----------------
  const styleSite = interpolate(f, [COULEURS, APPARAIT + 6], [0, 1], clamp);
  const ecran = <SiteClient w={ECR.w} h={ECR.h} style={styleSite} frame={f} />;

  // objets posés sur le bureau
  const cafeK = prog(f, POSE_CAFE + 2, POSE_CAFE + 8, Easing.out(Easing.back(3)));
  const telVibre = f >= VIBRE - 4 && f < VIBRE + 8 ? Math.sin(f * 3) * 8 : 0;
  const surBureau = (
    <g>
      {f >= POSE_CAFE + 2 && (
        <g transform={`translate(1340,1330) scale(${cafeK})`}>
          <g transform="translate(0,-6)"><Cafe vapeur={f} /></g>
        </g>
      )}
      {f < VIBRE + 8 && (
        <g transform={`translate(${1415 + telVibre},1324) rotate(${telVibre})`}>
          <rect x={-30} y={-8} width={60} height={14} rx={5} fill="#2d2d3a" />
          {telVibre !== 0 && <path d="M-44,-20 q-8,10 0,20 M44,-20 q8,10 0,20" stroke="#2d2d3a" strokeWidth={4} fill="none" />}
        </g>
      )}
    </g>
  );

  // position écran de la tasse et du site pour les effets
  const p1998 = surSite(320, 120);
  const pCode = surSite(220, 150);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Camera plans={plans} largeur={BUREAU_STARTUP.largeur} hauteur={BUREAU_STARTUP.hauteur}
        secousse={interpolate(f, [4, 8, 16, VIBRE, VIBRE + 3, VIBRE + 12], [0, 0.8, 0, 0, 0.6, 0], clamp)}>
        <BureauStartup
          frame={f}
          ecran={ecran}
          surBureau={surBureau}
          tableau={f >= M(11, 'géant.') - 4 ? ['TITRE', 'GÉANT !'] : undefined}
          salleReunion={
            <g transform={`translate(${xMax},${SOL_STARTUP})`}>
              <Max pose={poseMax} expression={exprMax} sens={sensMax} echelle={1.2} frame={f} cligne={clignement(f, 40)}
                parle={texto || teaser ? Math.abs(Math.sin(f / 2.5)) * 0.6 : 0} regard={0.6} cafe={!teaser} mainAv={mainMax} />
            </g>
          }
        >
          <g transform={`translate(${xToi},${SOL_STARTUP})`}>
            <Toi pose={pose} expression={expr} regard={regard} regardY={regardY} cligne={clignement(f)} echelle={1.2} mainAv={mainAv} />
          </g>
        </BureauStartup>
      </Camera>

      {/* 1. HOOK + bandeau d'ouverture */}
      <TexteHook texte="PREMIER JOUR DE STAGE…" fin={58} y={420} />
      <CarteOuverture debut={14} fin={RESSEMBLE + 40} lignes={['LUNDI • 09:12', 'Bureau – Startup', 'Toi, stagiaire dev']} y={1110} />
      <Etiquette a={M(0, '1998.')} fin={P(1).d - 12} x={p1998.x} y={p1998.y} texte="WORD 1998 💾" fond="#e8e8ee" rot={6} taille={64} />
      <Etincelles debut={M(0, '1998.')} x={p1998.x} y={p1998.y} rayon={180} />

      {/* 2. SITUATION */}
      <Etincelles debut={POSE_CAFE + 3} x={540 + (1340 - 1100) * 1.45} y={960 + (1290 - 1210) * 1.45} rayon={90} />
      <NotificationSMS debut={SMS} fin={FIN_SMS} de="Max 😰" texte="URGENT. Le site sort dans une heure. Regarde-le." y={440} />
      <Etiquette a={M(2, 'noir.')} fin={P(3).d - 8} x={340} y={720} texte="TEXTE NOIR" fond="#141418" couleur="#fff" rot={-6} />
      <Etiquette a={M(2, 'blanc.')} fin={P(3).d - 8} x={760} y={900} texte="FOND BLANC" fond="#ffffff" rot={5} />
      <Etiquette a={M(2, 'couleur.')} fin={P(3).d - 8} x={540} y={1120} texte="0 COULEUR" fond={C.rouge} couleur="#fff" rot={-3} taille={72} />

      {/* explication : 3 fichiers */}
      <SchemaTroisFichiers debut={P(3).d} fin={P(4).d - 6} aHTML={M(3, 'HTML,')} aCSS={M(3, 'CSS,')} aJS={M(3, 'JavaScript,')} />
      <Etiquette a={M(4, 'nu.') - 6} fin={P(5).d - 6} x={760} y={860} texte="TOUT NU 🙈" fond={C.rouge} couleur="#fff" rot={-12} taille={80} />
      <SchemaDeuxPistes debut={P(5).d} fin={P(6).d - 4} aPiste2={M(5, 'Soit', 1)} />

      {/* 3. TU FERAIS QUOI ? */}
      <EcranChoix debut={P(6).d - 4} fin={REVELATION + 34} vert="Réécrire le HTML" rouge="Relier le CSS" bonne="rouge" revelation={REVELATION} />

      {/* 4. RÉPONSE + EXPLICATION */}
      <Etiquette a={M(7, 'titres')} fin={P(8).d - 6} x={surSite(250, 54).x} y={surSite(250, 54).y} texte="✓ TITRES" fond={C.vert} rot={-4} />
      <Etiquette a={M(7, 'texte')} fin={P(8).d - 6} x={surSite(300, 110).x} y={surSite(300, 110).y + 30} texte="✓ TEXTE" fond={C.vert} rot={4} />
      <Etiquette a={M(7, 'HTML')} fin={P(8).d - 6} x={540} y={surSite(220, 200).y} texte="HTML : OK 👍" fond={C.vert} rot={-2} taille={70} />
      <Etiquette a={M(7, 'perdue.')} fin={P(8).d - 6} x={720} y={surSite(220, 268).y + 40} texte="– 1 H ⏳" fond={C.rouge} couleur="#fff" rot={8} taille={70} />
      <Etiquette a={P(8).d + 2} fin={M(8, 'Dans') - 4} x={540} y={760} texte="🔍 Il ne devine rien !" fond="#fff" rot={-3} taille={60} />
      <CarteJeu debut={M(8, 'Dans') - 6} fin={P(9).d - 8} surTitre="NOTION" titre="La balise link" y={420} largeur={940}
        detail="Elle relie le CSS à la page."
        contenu={<CodeLink />} />
      <Etincelles debut={COULEURS} x={pCode.x} y={pCode.y} rayon={260} />
      <Etincelles debut={M(9, 'boutons,')} x={surSite(380, 120).x} y={surSite(380, 120).y} rayon={150} couleur={C.vert} />
      <Etincelles debut={APPARAIT} x={540} y={900} rayon={320} couleur="#ff6b9a" />
      <Etiquette a={APPARAIT + 8} fin={P(10).d - 6} x={540} y={720} texte="✨ STYLÉ !" fond={C.jaune} rot={-5} taille={76} />
      <CarteJeu debut={P(10).d} fin={P(11).d - 8} surTitre="ASTUCE N° 1" titre="Site sans style ?" y={420} largeur={940}
        detail="Vérifie d’abord la balise link… et le nom EXACT du fichier."
        contenu={<BlocLien a={M(10, 'exact')} />} />

      {/* 5. ACCROCHE FINALE */}
      <Etincelles debut={M(11, 'géant.') - 4} x={540 + (310 - 400) * 1.35} y={960 + (635 - 1060) * 1.35} rayon={240} />
      <CarteAbonne debut={M(11, 'géant.') + 10} fin={DUREE_DEVSTEACH_1} y={1600} />

      <HUD valeur={minutes} unite="MIN" libelle="AVANT LA SORTIE" barre={stress} icone="⏱️" alerte={alerte} apparition={4}
        texteValeur={f < URGENT ? '?' : undefined} />
      <SousTitres mots={T.mots} y={1440} />

      {/* ---------------- SONS ---------------- */}
      <Voix src={staticFile('videos/devsteach-1/voix.wav')} pauseS={(donnees as DonneesVoix).pause ?? undefined} ajout={AJOUT} />
      <Ambiance nom="bureau" duree={DUREE_DEVSTEACH_1} />
      <Musique nom="tech-leger" duree={DUREE_DEVSTEACH_1} voix={T.segments} />
      <Effet nom="gag-boing" a={4} volume={0.35} />
      <Effet nom="whoosh" a={RESSEMBLE - 4} duree={24} volume={0.4} />
      <Effet nom="pop" a={M(0, '1998.')} />
      <Effet nom="whoosh" a={P(1).d - 10} duree={24} volume={0.3} />
      <Effet nom="pop" a={POSE_CAFE + 2} volume={0.4} />
      <Effet nom="vibration" a={VIBRE - 4} duree={30} volume={0.6} />
      <Effet nom="whoosh" a={SMS - 6} duree={24} volume={0.35} />
      <Effet nom="notification" a={SMS} />
      <Effet nom="compteur" a={URGENT} duree={20} volume={0.35} />
      <Effet nom="whoosh" a={OUVRES - 4} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(2, 'noir.')} />
      <Effet nom="pop" a={M(2, 'blanc.')} />
      <Effet nom="gag-boing" a={M(2, 'couleur.')} volume={0.35} />
      <Effet nom="whoosh" a={P(3).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(3, 'HTML,')} />
      <Effet nom="pop" a={M(3, 'CSS,')} />
      <Effet nom="pop" a={M(3, 'JavaScript,')} />
      <Effet nom="gag-boing" a={M(4, 'nu.') - 6} volume={0.45} />
      <Effet nom="whoosh" a={P(5).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(5, 'Soit', 1)} />
      <Effet nom="whoosh" a={P(6).d - 4} duree={24} volume={0.4} />
      <Effet nom="clic-bouton" a={P(6).d + 8} />
      <Effet nom="coeur" a={P(6).d + 10} duree={88} volume={0.5} />
      <Effet nom="ding-bonne-reponse" a={REVELATION} volume={0.55} />
      <Effet nom="pop" a={M(7, 'texte')} volume={0.35} />
      <Effet nom="pop" a={M(7, 'titres')} volume={0.35} />
      <Effet nom="buzzer-erreur" a={M(7, 'perdue.')} volume={0.35} />
      <Effet nom="carte" a={M(8, 'Dans') - 6} duree={25} />
      <Effet nom="frappe-clavier" a={M(8, 'link,') - 4} duree={M(8, 'css.') - M(8, 'link,') + 20} volume={0.3} />
      <Effet nom="whoosh" a={RAFRAICHIS - 6} duree={24} volume={0.35} />
      <Effet nom="sparkle" a={COULEURS} />
      <Effet nom="sparkle" a={APPARAIT} />
      <Effet nom="carte" a={P(10).d} duree={25} />
      <Effet nom="whoosh" a={P(11).d - 8} duree={24} volume={0.35} />
      <Effet nom="sparkle" a={M(11, 'géant.') - 4} volume={0.4} />
      <Effet nom="gag-boing" a={M(11, 'géant.')} volume={0.45} />
      <Effet nom="pop" a={M(11, 'géant.') + 10} />
    </AbsoluteFill>
  );
};

/** Code de la balise link, tapé au rythme de la voix */
const CodeLink: React.FC = () => {
  const f = useCurrentFrame();
  const vis = (a: number) => ({opacity: interpolate(f, [a, a + 4], [0, 1], clamp)});
  const head = M(8, 'head');
  const style: React.CSSProperties = {fontFamily: POLICE_CODE, fontSize: 40, fontWeight: 700, lineHeight: 1.5, whiteSpace: 'pre'};
  const nouvelle = f >= M(8, 'link,');
  return (
    <div style={{marginTop: 24, background: '#0b0d1f', borderRadius: 22, padding: '20px 26px', border: '3px solid #2f3770', color: '#e6e8ff', ...style}}>
      <div style={vis(head)}><span style={{color: '#ff79c6'}}>{'<head>'}</span></div>
      <div style={vis(head)}><span style={{color: '#8890b8'}}>{'  <title>Café Paname</title>'}</span></div>
      <div style={{background: nouvelle ? 'rgba(62,224,122,0.18)' : 'transparent', borderRadius: 10, margin: '0 -10px', padding: '0 10px'}}>
        <span style={vis(M(8, 'link,'))}><span style={{color: '#ff79c6'}}>{'  <link'}</span></span>
        <span style={vis(M(8, 'rel'))}><span style={{color: '#8be9fd'}}>{' rel'}</span>=</span>
        <span style={vis(M(8, 'stylesheet,'))}><span style={{color: '#f1fa8c'}}>{'"stylesheet"'}</span></span>
        {'\n'}
        <span style={vis(M(8, 'href'))}><span style={{color: '#8be9fd'}}>{'        href'}</span>=</span>
        <span style={vis(M(8, 'style'))}><span style={{color: '#f1fa8c'}}>{'"style'}</span></span>
        <span style={vis(M(8, 'css.'))}><span style={{color: '#f1fa8c'}}>{'.css"'}</span><span style={{color: '#ff79c6'}}>{'>'}</span></span>
      </div>
      <div style={vis(head)}><span style={{color: '#ff79c6'}}>{'</head>'}</span></div>
    </div>
  );
};

/** Rappel : nom exact du fichier */
const BlocLien: React.FC<{a: number}> = ({a}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [a, a + 6], [0, 1], clamp);
  return (
    <div style={{marginTop: 24, background: '#0b0d1f', borderRadius: 22, padding: '18px 24px', border: '3px solid #2f3770', color: '#e6e8ff', fontFamily: POLICE_CODE, fontSize: 34,
      fontWeight: 700, lineHeight: 1.6}}>
      <div><span style={{color: '#ff79c6'}}>{'<link '}</span><span style={{color: '#8be9fd'}}>href</span>=<span style={{color: '#f1fa8c',
        background: `rgba(255,210,63,${k * 0.35})`, borderRadius: 8, padding: '0 6px'}}>"style.css"</span><span style={{color: '#ff79c6'}}>{'>'}</span></div>
      <div style={{opacity: k, color: '#fff', fontFamily: "'Inter Studio', sans-serif", fontWeight: 900, fontSize: 38, marginTop: 6}}>
        <span style={{color: C.vert}}>style.css ✓</span>   <span style={{color: C.rouge, textDecoration: 'line-through'}}>Style.css</span>   <span style={{color: C.rouge, textDecoration: 'line-through'}}>styles.css</span>
      </div>
    </div>
  );
};
