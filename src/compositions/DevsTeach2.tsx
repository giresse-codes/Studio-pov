import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Camera, Plan} from '../camera/Camera';
import {BUREAU_STARTUP, BureauStartup, ECRAN_STARTUP, POSTE_TOI, SOL_STARTUP, ZONES_STARTUP as Z} from '../decors/BureauStartup';
import {FondBureauStartup} from '../decors/FondAppel';
import {clamp, prog} from '../lib/anim';
import {Ambiance, Effet, Musique, Voix} from '../lib/sons';
import {C, POLICE_CODE} from '../lib/theme';
import {creerTiming, DonneesVoix} from '../lib/timing';
import {assis, clignement, debout, Expression, marcher, Max, Pose, Smartphone, sursaut, taperClavier, Toi} from '../personnages';
import {
  BulleDirect, CarteAbonne, CarteJeu, CarteOuverture, EcranChoix, EditeurCode, Etiquette, Etincelles, HUD, LigneCode, NotificationSMS,
  SchemaDeuxOptions, SchemaHierarchie, SchemaYeuxGoogle, SiteTitre, SousTitres, TexteHook, valeurAnimee,
} from '../ui';
import donnees from '../../videos/devsteach-2/mots.json';

/** #devsteach 2 — « Max veut un titre géant » */
const AJOUT = 90; // 3 s insérées à la [pause] (pas de silence dans la voix)
const T = creerTiming(donnees as DonneesVoix, {
  ajout: AJOUT,
  cles: ['parfait…', 'Google', 'ÉNORME.', 'Lune.', 'p.', 'paragraphe.', 'petit.', 'h1.', 'quoi', 'yeux.', 'balise.', 'h1,', 'seul', 'h2', 'h3',
    'aveugles.', 'CSS', 'CSS.', 'Presque.', 'disparaissent.'],
});
export const DUREE_DEVSTEACH_2 = T.fin + 50;

const P = T.phrase;
const M = T.mot;
const E = ECRAN_STARTUP;
const REVELATION = P(5).d;

const surSite = (lx: number, ly: number) => ({x: 540 + (E.x + lx - Z.ecran.x) * Z.ecran.zoom, y: 960 + (E.y + ly - Z.ecran.y) * Z.ecran.zoom});

const CODE_P: LigneCode[] = [
  [{t: '<body>', c: '#ff79c6'}],
  [{t: '  <p>', c: '#ff79c6'}, {t: 'Café Paname'}, {t: '</p>', c: '#ff79c6'}],
  [{t: '  <p>', c: '#ff79c6'}, {t: 'Le meilleur café'}, {t: '</p>', c: '#ff79c6'}],
  [{t: '  <img ', c: '#ff79c6'}, {t: 'src', c: '#8be9fd'}, {t: '='}, {t: '"cafe.jpg"', c: '#f1fa8c'}, {t: '>', c: '#ff79c6'}],
  [{t: '</body>', c: '#ff79c6'}],
];
const CODE_H1: LigneCode[] = CODE_P.map((l, i) => (i === 1 ? [{t: '  <h1>', c: '#50fa7b'}, {t: 'Café Paname'}, {t: '</h1>', c: '#50fa7b'}] : l));

export const DevsTeach2: React.FC = () => {
  const f = useCurrentFrame();

  // ---------------- Caméra ----------------
  const plans: Plan[] = [
    {a: 0, x: 1150, y: 1200, zoom: 1.45},
    {a: 4, ...Z.ecran, duree: 12},
    {a: P(1).d - 8, x: 1120, y: 1150, zoom: 1.25, duree: 16},
    {a: P(2).d - 4, ...Z.ecran, duree: 12},
    {a: P(3).d - 6, x: 1150, y: 1180, zoom: 1.2, duree: 16},
    {a: P(8).d - 6, ...Z.ecran, duree: 12},
    {a: M(8, 'Presque.') - 6, x: 1980, y: 900, zoom: 1.5, duree: 10},
    {a: P(9).d - 6, x: 1120, y: 1200, zoom: 1.5, duree: 14},
  ];

  // ---------------- Toi ----------------
  let pose: Pose = assis(f);
  let expr: Expression = 'fier';
  let regard = 0.8;
  if (f < P(1).d) {
    pose = sursaut(assis(f), f - M(0, 'Google'));
    expr = f < M(0, 'Google') ? 'fier' : 'surpris';
  } else if (f < P(2).d) {
    pose = assis(f);
    expr = f < M(1, 'ÉNORME.') ? 'neutre' : 'surpris';
    regard = 0.2;
  } else if (f < P(3).d) {
    pose = taperClavier(f, 0.8);
    expr = 'concentre';
  } else if (f < REVELATION) {
    pose = assis(f);
    expr = f < P(4).d ? 'concentre' : 'surpris';
    regard = 0.3;
  } else if (f < P(7).d) {
    pose = taperClavier(f, 1.2);
    expr = 'concentre';
  } else if (f < P(9).d) {
    pose = taperClavier(f, 0.6);
    expr = f < P(8).d ? 'fier' : 'content';
  } else {
    pose = sursaut(assis(f), f - M(9, 'disparaissent.'));
    expr = f < M(9, 'photos') ? 'neutre' : 'panique';
  }

  // ---------------- Max (salle de réunion) ----------------
  const auTelephone = (f >= M(1, 'Max') - 20 && f < P(2).d + 10) || (f >= M(8, 'Max') - 20 && f < P(9).d);
  const xMax = auTelephone ? 470 : 400 + Math.sin(f / 45) * 170;
  const poseMax: Pose = auTelephone ? {...debout(f), epauleAv: 60, coudeAv: 90, tete: 10} : marcher(f, 0.9);
  const sensMax: 1 | -1 = auTelephone || Math.cos(f / 45) > 0 ? 1 : -1;

  // ---------------- HUD ----------------
  const minutes = valeurAnimee(f, [[0, 30], [P(2).d, 29], [P(3).d, 28], [P(4).d, 27], [P(6).d, 26], [P(7).d, 25]], 10);
  const stress = valeurAnimee(f, [[0, 0.3], [M(1, 'ÉNORME.'), 0.8], [P(4).d, 0.95], [M(7, 'CSS.'), 0.15], [M(9, 'disparaissent.'), 0.6]], 14);
  const alerte = valeurAnimee(f, [[0, 0.1], [M(1, 'ÉNORME.'), 0.7], [P(4).d, 1], [M(7, 'CSS.'), 0], [M(9, 'disparaissent.'), 0.5]], 12);

  // ---------------- Écran ----------------
  let ecran: React.ReactNode;
  if (f < P(1).d) ecran = <SiteTitre w={E.w} h={E.h} titre="CAFÉ PANAME" tailleTitre={58} />;
  else if (f < P(8).d) {
    const code = f < REVELATION ? CODE_P : CODE_H1;
    const surligne = (f >= M(2, 'balise') && f < P(3).d) || f >= REVELATION ? 1 : undefined;
    ecran = <EditeurCode w={E.w} h={E.h} fichier="index.html" lignes={code} surligne={surligne} />;
  } else if (f < P(9).d) ecran = <SiteTitre w={E.w} h={E.h} titre="CAFÉ PANAME" tailleTitre={interpolate(f, [P(8).d, P(8).d + 20], [40, 64], clamp)} couleurTitre="#c0396b" />;
  else ecran = <SiteTitre w={E.w} h={E.h} titre="CAFÉ PANAME" tailleTitre={40} couleurTitre="#c0396b" photos={f >= M(9, 'photos') ? 'cassees' : 'ok'} />;

  const pTitre = surSite(220, 110);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Camera plans={plans} largeur={BUREAU_STARTUP.largeur} hauteur={BUREAU_STARTUP.hauteur}
        secousse={interpolate(f, [M(0, 'Google'), M(0, 'Google') + 3, M(0, 'Google') + 12], [0, 0.6, 0], clamp)}>
        <BureauStartup
          frame={f}
          ecran={ecran}
          tableau={['DÉMO CLIENT', '10 H 35']}
          salleReunion={
            <g transform={`translate(${xMax},${SOL_STARTUP})`}>
              <Max pose={poseMax} expression={auTelephone ? 'surpris' : 'panique'} sens={sensMax} echelle={1.2} frame={f} cligne={clignement(f, 40)}
                parle={auTelephone ? Math.abs(Math.sin(f / 2.5)) * 0.6 : 0} mainAv={auTelephone ? <Smartphone ecran="#ffffff" /> : undefined} />
            </g>
          }
        >
          <g transform={`translate(${POSTE_TOI},${SOL_STARTUP})`}>
            <Toi pose={pose} expression={expr} regard={regard} cligne={clignement(f)} echelle={1.2} />
          </g>
        </BureauStartup>
      </Camera>

      {/* 1. HOOK */}
      <TexteHook texte="CE TITRE AVAIT L’AIR PARFAIT…" fin={52} y={420} />
      <Etiquette a={M(0, 'Google')} fin={P(1).d - 10} x={pTitre.x + 60} y={pTitre.y + 230} texte="🤖 GOOGLE : « ??? »" fond="#fff" rot={-5} taille={60} />
      <Etiquette a={M(0, 'pas.')} fin={P(1).d - 10} x={540} y={pTitre.y + 380} texte="INVISIBLE 👻" fond={C.rouge} couleur="#fff" rot={4} taille={70} />
      <Etincelles debut={M(0, 'Google')} x={pTitre.x} y={pTitre.y + 230} rayon={200} />

      {/* 2. SITUATION */}
      <CarteOuverture debut={P(1).d} fin={P(2).d + 20} lignes={['MARDI • 10:05', 'Bureau – Startup', 'Toi, stagiaire dev']} y={1110} />
      <BulleDirect debut={M(1, 'Max') - 8} fin={P(2).d - 6} nom="Max" y={430} x={480}>
        <FondBureauStartup frame={f} />
        <g transform="translate(370,720)">
          <Max pose={{...debout(f), epauleAv: 140 + Math.sin(f / 3) * 20, coudeAv: -10 + Math.sin(f / 3) * 15, epauleAr: -120, coudeAr: -20}}
            expression="panique" regard={-0.3} parle={Math.abs(Math.sin(f / 2.5))} cligne={clignement(f, 30)} frame={f} sens={-1} cafe={false} />
        </g>
      </BulleDirect>
      <Etiquette a={M(1, 'ÉNORME.')} fin={P(2).d - 6} x={300} y={1180} texte="ÉNORME !!" fond={C.jaune} rot={-8} taille={84} />
      <Etiquette a={M(1, 'Lune.')} fin={P(2).d - 6} x={720} y={1310} texte="🌕 VISIBLE DEPUIS LA LUNE" fond="#fff" rot={3} taille={44} />
      <Etiquette a={M(2, 'p.')} fin={P(3).d - 6} x={surSite(140, 76).x} y={surSite(140, 76).y - 70} texte="<p> = paragraphe" fond="#ff79c6" couleur="#fff" rot={-4} taille={56} />
      <Etiquette a={M(2, 'petit.')} fin={P(3).d - 6} x={760} y={surSite(220, 200).y + 40} texte="tout petit 🔬" fond="#fff" rot={6} taille={34} />

      <SchemaDeuxOptions debut={P(3).d} fin={P(4).d - 4} a1={P(3).d + 2} a2={M(3, 'Soit', 1)}
        titre1="Garder <p> et grossir" code1={['<p style="font-size:80px">', '  Café Paname', '</p>']}
        titre2="Passer en <h1>" code2={['<h1>Café Paname</h1>']} />

      {/* 3. TU FERAIS QUOI ? */}
      <EcranChoix debut={P(4).d - 4} fin={REVELATION + 34} vert="Garder <p> et grossir" rouge="Passer en <h1>" bonne="rouge" revelation={REVELATION} />

      {/* 4. RÉPONSE + EXPLICATION */}
      <SchemaYeuxGoogle debut={REVELATION + 40} fin={P(6).d - 4} aYeux={REVELATION + 44} aGoogle={M(5, 'Google')} aPetit={M(5, 'petit')} />
      <SchemaHierarchie debut={P(6).d} fin={P(7).d - 4} aH1={M(6, 'h1,')} aSeul={M(6, 'seul')} aH2={M(6, 'h2')} aH3={M(6, 'h3')}
        aGoogle={M(6, 'Google,')} aLecteur={M(6, 'lecteurs')} />
      <CarteJeu debut={P(7).d} fin={P(8).d - 6} surTitre="ASTUCE N° 2" titre="Balise ≠ style" y={420} largeur={940}
        detail="La balise dit ce que c’est. Le CSS dit à quoi ça ressemble."
        contenu={<CodeRegle aHTML={M(7, 'balise')} aCSS={M(7, 'grand')} />} />
      <NotificationSMS debut={M(8, 'Max')} fin={M(8, 'Presque.') - 4} de="Max 🤩" texte="On le voit depuis la Lune ?" y={440} />
      <Etiquette a={M(8, 'Presque.')} fin={P(9).d - 4} x={540} y={760} texte="🔭 PRESQUE." fond={C.jaune} rot={-6} taille={90} />
      <Etincelles debut={M(8, 'Presque.')} x={540} y={760} rayon={260} />
      <Etiquette a={M(9, 'photos') + 4} fin={T.fin + 20} x={540} y={760} texte="📸 LES PHOTOS ?!" fond={C.rouge} couleur="#fff" rot={-4} taille={70} />

      {/* 5. ACCROCHE FINALE */}
      <CarteAbonne debut={M(9, 'disparaissent.') + 12} fin={DUREE_DEVSTEACH_2} y={1600} />

      <HUD valeur={minutes} unite="MIN" libelle="AVANT LA DÉMO" barre={stress} icone="⏱️" alerte={alerte} apparition={4}
        texteValeur={f < M(1, 'ÉNORME.') ? '?' : undefined} />
      <SousTitres mots={T.mots} y={1440} />

      {/* ---------------- SONS ---------------- */}
      <Voix src={staticFile('videos/devsteach-2/voix.wav')} pauseS={(donnees as DonneesVoix).pause ?? undefined} ajout={AJOUT} />
      <Ambiance nom="bureau" duree={DUREE_DEVSTEACH_2} />
      <Musique nom="tech-leger" duree={DUREE_DEVSTEACH_2} voix={T.segments} />
      <Effet nom="whoosh" a={4} duree={24} volume={0.4} />
      <Effet nom="buzzer-erreur" a={M(0, 'Google')} volume={0.3} />
      <Effet nom="gag-boing" a={M(0, 'pas.')} volume={0.4} />
      <Effet nom="whoosh" a={P(1).d - 8} duree={24} volume={0.3} />
      <Effet nom="appel" a={M(1, 'Max') - 8} duree={20} volume={0.35} />
      <Effet nom="pop" a={M(1, 'ÉNORME.')} />
      <Effet nom="compteur" a={M(1, 'ÉNORME.')} duree={20} volume={0.3} />
      <Effet nom="pop" a={M(1, 'Lune.')} />
      <Effet nom="whoosh" a={P(2).d - 4} duree={24} volume={0.35} />
      <Effet nom="frappe-clavier" a={P(2).d} duree={40} volume={0.3} />
      <Effet nom="pop" a={M(2, 'p.')} />
      <Effet nom="pop" a={M(2, 'petit.')} volume={0.35} />
      <Effet nom="whoosh" a={P(3).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(3, 'Soit', 1)} />
      <Effet nom="whoosh" a={P(4).d - 4} duree={24} volume={0.4} />
      <Effet nom="clic-bouton" a={P(4).d + 8} />
      <Effet nom="coeur" a={P(4).d + 10} duree={88} volume={0.5} />
      <Effet nom="ding-bonne-reponse" a={REVELATION} volume={0.55} />
      <Effet nom="whoosh" a={REVELATION + 40} duree={24} volume={0.35} />
      <Effet nom="buzzer-erreur" a={M(5, 'petit')} volume={0.3} />
      <Effet nom="whoosh" a={P(6).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(6, 'h1,')} />
      <Effet nom="pop" a={M(6, 'h2')} />
      <Effet nom="pop" a={M(6, 'h3')} />
      <Effet nom="sparkle" a={M(6, 'Google,')} volume={0.35} />
      <Effet nom="sparkle" a={M(6, 'lecteurs')} volume={0.35} />
      <Effet nom="carte" a={P(7).d} duree={25} />
      <Effet nom="pop" a={M(7, 'grand')} />
      <Effet nom="notification" a={M(8, 'Max')} />
      <Effet nom="whoosh" a={M(8, 'Presque.') - 6} duree={20} volume={0.35} />
      <Effet nom="gag-boing" a={M(8, 'Presque.')} volume={0.45} />
      <Effet nom="buzzer-erreur" a={M(9, 'photos') + 4} volume={0.35} />
      <Effet nom="pop" a={M(9, 'disparaissent.') + 12} />
    </AbsoluteFill>
  );
};

/** Code de la règle : la balise (HTML) puis le style (CSS) */
const CodeRegle: React.FC<{aHTML: number; aCSS: number}> = ({aHTML, aCSS}) => {
  const f = useCurrentFrame();
  const vis = (a: number) => ({opacity: interpolate(f, [a, a + 5], [0, 1], clamp), transform: `translateX(${interpolate(f, [a, a + 8], [30, 0], clamp)}px)`});
  return (
    <div style={{marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16, fontFamily: POLICE_CODE, fontWeight: 700, fontSize: 40}}>
      <div style={{...vis(aHTML), background: '#0b0d1f', borderRadius: 18, padding: '14px 22px', border: '3px solid #e8642c', color: '#e6e8ff'}}>
        <span style={{color: '#e8642c', fontFamily: "'Inter Studio', sans-serif", fontWeight: 900, fontSize: 30}}>HTML  </span>
        <span style={{color: '#50fa7b'}}>{'<h1>'}</span>Café Paname<span style={{color: '#50fa7b'}}>{'</h1>'}</span>
      </div>
      <div style={{...vis(aCSS), background: '#0b0d1f', borderRadius: 18, padding: '14px 22px', border: '3px solid #2f6fe0', color: '#e6e8ff'}}>
        <span style={{color: '#5a9bff', fontFamily: "'Inter Studio', sans-serif", fontWeight: 900, fontSize: 30}}>CSS  </span>
        <span style={{color: '#50fa7b'}}>h1</span> {'{ '}<span style={{color: '#8be9fd'}}>font-size</span>: <span style={{color: '#f1fa8c'}}>80px</span>{'; }'}
      </div>
    </div>
  );
};
