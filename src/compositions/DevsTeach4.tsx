import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Camera, Plan} from '../camera/Camera';
import {BUREAU_STARTUP, BureauStartup, ECRAN_STARTUP, POSTE_TOI, SOL_STARTUP, ZONES_STARTUP as Z} from '../decors/BureauStartup';
import {FondBureauStartup} from '../decors/FondAppel';
import {clamp, prog} from '../lib/anim';
import {Ambiance, Effet, Musique, Voix} from '../lib/sons';
import {C, POLICE} from '../lib/theme';
import {creerTiming, DonneesVoix} from '../lib/timing';
import {assis, clignement, debout, epaulesTombent, Expression, marcher, Max, Pose, sursaut, taperClavier, Toi} from '../personnages';
import {
  BulleDirect, CarteAbonne, CarteJeu, CarteOuverture, EcranChoix, EditeurCode, Etiquette, Etincelles, HUD, LigneCode,
  SchemaDeuxOptions, SchemaTroisLiens, SiteTitre, SousTitres, TexteHook, valeurAnimee,
} from '../ui';
import donnees from '../../videos/devsteach-4/mots.json';

/** #devsteach 4 — « Le lien qui mène nulle part » */
const AJOUT = 90; // 3 s insérées à la [pause]
const T = creerTiming(donnees as DonneesVoix, {
  ajout: AJOUT,
  cles: ['dix', 'rien.', 'panne', 'dièse.', 'vide,', 'Instagram', 'répares', 'texte.', 'quoi', 'a.', 'destination.', 'html.', 'https,', 'blank.', 'onglet,',
    'tel,', 'appelle.', 'jamais', 'perdre', 'SES', 'couleurs.'],
});
export const DUREE_DEVSTEACH_4 = T.fin + 50;

const P = T.phrase;
const M = T.mot;
const E = ECRAN_STARTUP;
const REVELATION = P(5).d;
const surSite = (lx: number, ly: number) => ({x: 540 + (E.x + lx - Z.ecran.x) * Z.ecran.zoom, y: 960 + (E.y + ly - Z.ecran.y) * Z.ecran.zoom});

const rose = '#ff79c6', bleu = '#8be9fd', jaune = '#f1fa8c';
const CODE_AVANT: LigneCode[] = [
  [{t: '<nav>', c: rose}],
  [{t: '  <a ', c: rose}, {t: 'href', c: bleu}, {t: '='}, {t: '"#"', c: '#ff5555'}, {t: '>', c: rose}, {t: 'Contact'}, {t: '</a>', c: rose}],
  [{t: '  <a ', c: rose}, {t: 'href', c: bleu}, {t: '='}, {t: '"#"', c: '#ff5555'}, {t: '>', c: rose}, {t: 'Insta'}, {t: '</a>', c: rose}],
  [{t: '</nav>', c: rose}],
];
const CODE_APRES: LigneCode[] = [
  [{t: '<nav>', c: rose}],
  [{t: '  <a ', c: rose}, {t: 'href', c: bleu}, {t: '='}, {t: '"contact.html"', c: '#50fa7b'}, {t: '>', c: rose}, {t: 'Contact'}, {t: '</a>', c: rose}],
  [{t: '  <a ', c: rose}, {t: 'href', c: bleu}, {t: '='}, {t: '"https://…"', c: '#50fa7b'}, {t: ' target', c: bleu}, {t: '='}, {t: '"_blank"', c: '#50fa7b'}, {t: '>', c: rose}],
  [{t: '  <a ', c: rose}, {t: 'href', c: bleu}, {t: '='}, {t: '"tel:01…"', c: '#50fa7b'}, {t: '>', c: rose}, {t: 'Appeler'}, {t: '</a>', c: rose}],
  [{t: '</nav>', c: rose}],
];

export const DevsTeach4: React.FC = () => {
  const f = useCurrentFrame();
  const CODE_F = P(2).d;

  // ---------------- Caméra ----------------
  const plans: Plan[] = [
    {a: 0, x: 1150, y: 1200, zoom: 1.45},
    {a: 3, ...Z.ecran, duree: 12},
    {a: P(1).d - 8, x: 1120, y: 1150, zoom: 1.25, duree: 14},
    {a: CODE_F - 4, ...Z.ecran, duree: 12},
    {a: P(3).d - 6, x: 1150, y: 1180, zoom: 1.2, duree: 16},
    {a: P(8).d - 6, x: 1120, y: 1220, zoom: 1.4, duree: 14},
    {a: P(9).d - 8, x: 400, y: 1060, zoom: 1.35, duree: 14},
  ];

  // ---------------- Toi ----------------
  const clics = Array.from({length: 10}, (_, i) => Math.round(4 + i * ((M(0, 'rien.') - 10) / 10)));
  let pose: Pose = assis(f);
  let expr: Expression = 'neutre';
  let regard = 0.8;
  if (f < P(1).d) { pose = taperClavier(f, 2.2); expr = f < M(0, 'rien.') ? 'concentre' : 'triste'; }
  else if (f < CODE_F) { pose = sursaut(assis(f), f - M(1, 'panne')); expr = 'surpris'; regard = 0.2; }
  else if (f < P(3).d) { pose = taperClavier(f, 0.8); expr = f < M(2, 'Instagram') ? 'concentre' : 'surpris'; }
  else if (f < REVELATION) { pose = assis(f); expr = f < P(4).d ? 'concentre' : 'surpris'; regard = 0.3; }
  else if (f < P(8).d) { pose = taperClavier(f, 1.2); expr = f < M(7, 'appelle.') ? 'concentre' : 'fier'; }
  else if (f < P(9).d) { pose = assis(f); expr = 'fier'; }
  else { pose = epaulesTombent(assis(f), prog(f, M(9, 'couleurs.'), M(9, 'couleurs.') + 10)); expr = 'triste'; }

  // ---------------- Max ----------------
  const teaser = f >= P(9).d - 20;
  const xMax = teaser ? 600 : 400 + Math.sin(f / 45) * 170;
  const leve = prog(f, M(9, 'veut'), M(9, 'veut') + 10);
  const poseMax: Pose = teaser ? {...debout(f), epauleAv: 40 + leve * 105, coudeAv: 20 - leve * 15, tete: -8 * leve} : marcher(f, 0.9);
  const sensMax: 1 | -1 = teaser ? -1 : Math.cos(f / 45) > 0 ? 1 : -1;

  // ---------------- HUD ----------------
  const minutes = valeurAnimee(f, [[0, 40], [P(2).d, 39], [P(3).d, 38], [P(4).d, 37], [P(6).d, 36], [P(8).d, 35]], 10);
  const stress = valeurAnimee(f, [[0, 0.4], [M(1, 'panne'), 0.85], [P(4).d, 0.95], [M(7, 'appelle.'), 0.12], [M(9, 'SES'), 0.55]], 14);
  const alerte = valeurAnimee(f, [[0, 0.3], [M(1, 'panne'), 0.75], [P(4).d, 1], [M(7, 'appelle.'), 0], [M(9, 'SES'), 0.45]], 12);

  // ---------------- Écran ----------------
  let ecran: React.ReactNode;
  if (f < CODE_F) {
    const dernierClic = [...clics].reverse().find((c) => f >= c) ?? -99;
    const appuye = f - dernierClic < 4;
    ecran = (
      <g>
        <SiteTitre w={E.w} h={E.h} titre="CAFÉ PANAME" tailleTitre={44} couleurTitre="#c0396b" photos="ok" />
        <g transform={`translate(${E.w / 2 - 70},150) scale(${appuye ? 0.92 : 1})`}>
          <rect x={0} y={0} width={140} height={40} rx={20} fill="#3b2418" />
          <text x={70} y={26} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={16} fill="#ffd9a8">Contact</text>
        </g>
        <path transform={`translate(${E.w / 2 + 30 + (appuye ? 2 : 0)},${176 + (appuye ? 2 : 0)})`} d="M0,0 L0,28 L8,20 L14,32 L19,30 L13,18 L24,18 Z" fill="#fff" stroke="#000" strokeWidth={2} />
      </g>
    );
  } else {
    const apres = f >= REVELATION;
    ecran = <EditeurCode w={E.w} h={E.h} fichier="index.html" lignes={apres ? CODE_APRES : CODE_AVANT} taille={15}
      surligne={!apres && f >= M(2, 'href') ? (f >= M(2, 'Instagram') ? 2 : 1) : undefined} />;
  }
  const nbClics = clics.filter((c) => f >= c).length;
  const pBouton = surSite(220, 170);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Camera plans={plans} largeur={BUREAU_STARTUP.largeur} hauteur={BUREAU_STARTUP.hauteur}
        secousse={interpolate(f, [M(1, 'panne'), M(1, 'panne') + 3, M(1, 'panne') + 12], [0, 0.6, 0], clamp)}>
        <BureauStartup
          frame={f}
          ecran={ecran}
          tableau={teaser && f >= M(9, 'SES') - 4 ? ['SES', 'COULEURS !'] : ['RÉUNION', '12 H 00']}
          salleReunion={
            <g transform={`translate(${xMax},${SOL_STARTUP})`}>
              <Max pose={poseMax} expression={teaser ? 'content' : 'panique'} sens={sensMax} echelle={1.2} frame={f} cligne={clignement(f, 40)}
                parle={teaser ? Math.abs(Math.sin(f / 2.5)) * 0.6 : 0} cafe={!teaser} />
            </g>
          }
        >
          <g transform={`translate(${POSTE_TOI},${SOL_STARTUP})`}>
            <Toi pose={pose} expression={expr} regard={regard} cligne={clignement(f)} echelle={1.2} />
          </g>
        </BureauStartup>
      </Camera>

      {/* 1. HOOK */}
      <TexteHook texte="IL CLIQUE… ET RIEN !" fin={56} y={420} />
      {nbClics > 0 && f < P(1).d && (
        <Etiquette a={clics[0]} x={pBouton.x + 230} y={pBouton.y - 40} texte={`CLIC ×${nbClics}`} fond={C.jaune} rot={8} taille={60} />
      )}
      <Etiquette a={M(0, 'rien.')} fin={P(1).d - 6} x={540} y={pBouton.y + 230} texte="… RIEN 😶" fond={C.rouge} couleur="#fff" rot={-4} taille={70} />

      {/* 2. SITUATION */}
      <CarteOuverture debut={P(1).d} fin={CODE_F + 20} lignes={['JEUDI • 11:20', 'Bureau – Startup', 'Toi, stagiaire dev']} y={1110} />
      <BulleDirect debut={M(1, 'Max') - 8} fin={CODE_F - 6} nom="Max" y={430} x={480}>
        <FondBureauStartup frame={f} />
        <g transform="translate(370,720)">
          <Max pose={{...debout(f), epauleAv: 140 + Math.sin(f / 3) * 20, coudeAv: -10 + Math.sin(f / 3) * 15, epauleAr: -120, coudeAr: -20}}
            expression="panique" regard={-0.3} parle={Math.abs(Math.sin(f / 2.5))} cligne={clignement(f, 30)} frame={f} sens={-1} cafe={false} />
        </g>
      </BulleDirect>
      <Etiquette a={M(1, 'panne')} fin={CODE_F - 6} x={320} y={1200} texte="EN PANNE ?! 🔧" fond={C.rouge} couleur="#fff" rot={-6} taille={64} />
      <Etiquette a={M(2, 'dièse.')} fin={P(3).d - 6} x={surSite(250, 50).x + 40} y={surSite(250, 50).y + 120} texte={'href="#"'} fond="#ff5555" couleur="#fff" rot={-4} taille={56} />
      <Etiquette a={M(2, 'vide,')} fin={P(3).d - 6} x={540} y={surSite(220, 150).y + 40} texte="# = lien VIDE 🕳️" fond="#fff" rot={4} taille={56} />
      <Etiquette a={M(2, 'attendant ».')} fin={P(3).d - 6} x={680} y={surSite(220, 150).y + 150} texte="« en attendant… »" fond={C.jaune} rot={-3} taille={46} />
      <Etiquette a={M(2, 'Instagram')} fin={P(3).d - 6} x={540} y={surSite(220, 240).y + 60} texte="📸 Insta : sans fermer le site !" fond="#ff6b9a" couleur="#fff" rot={2} taille={44} />

      <SchemaDeuxOptions debut={P(3).d} fin={P(4).d - 4} a1={P(3).d + 2} a2={M(3, 'Soit', 1)}
        titre1="Réparer les liens" code1={['<a href="contact.html">', '  Contact</a>']}
        titre2="Tout en texte" code2={['Tél : 01 23 45 67 89']} />

      {/* 3. TU FERAIS QUOI ? */}
      <EcranChoix debut={P(4).d - 4} fin={REVELATION + 34} vert="Réparer les liens" rouge="Tout remplacer par du texte" bonne="vert" revelation={REVELATION} />

      {/* 4. RÉPONSE + EXPLICATION */}
      <SchemaTroisLiens debut={REVELATION + 40} fin={P(8).d - 4} aBalise={M(5, 'a.')} aDestination={M(5, 'destination.')} aContact={M(5, 'contact', 1)}
        aInsta={P(6).d} aBlank={M(6, 'target')} aTel={P(7).d} aAppel={M(7, 'appelle.')} />
      <CarteJeu debut={P(8).d} fin={P(9).d - 8} surTitre="ASTUCE N° 4" titre="1 lien = 1 client" y={420} largeur={940}
        detail="Personne ne recopie un numéro à la main. Supprimer un lien, c’est perdre des clients." />
      <Etiquette a={M(8, 'perdre')} fin={P(9).d - 8} x={700} y={1250} texte="– CLIENTS 📉" fond={C.rouge} couleur="#fff" rot={6} taille={64} />
      <Etincelles debut={M(9, 'SES') - 4} x={540 + (310 - 400) * 1.35} y={960 + (635 - 1060) * 1.35} rayon={240} couleur="#ff6b9a" />

      {/* 5. ACCROCHE FINALE */}
      <CarteAbonne debut={M(9, 'couleurs.') + 10} fin={DUREE_DEVSTEACH_4} y={1600} />

      <HUD valeur={minutes} unite="MIN" libelle="AVANT LA RÉUNION" barre={stress} icone="⏱️" alerte={alerte} apparition={4} />
      <SousTitres mots={T.mots} y={1440} />

      {/* ---------------- SONS ---------------- */}
      <Voix src={staticFile('videos/devsteach-4/voix.wav')} pauseS={(donnees as DonneesVoix).pause ?? undefined} ajout={AJOUT} />
      <Ambiance nom="bureau" duree={DUREE_DEVSTEACH_4} />
      <Musique nom="tech-leger" duree={DUREE_DEVSTEACH_4} voix={T.segments} />
      <Effet nom="whoosh" a={3} duree={24} volume={0.4} />
      {clics.map((c, i) => <Effet key={i} nom="clic-bouton" a={c} volume={0.35} />)}
      <Effet nom="buzzer-erreur" a={M(0, 'rien.')} volume={0.3} />
      <Effet nom="whoosh" a={P(1).d - 8} duree={24} volume={0.3} />
      <Effet nom="appel" a={M(1, 'Max') - 8} duree={20} volume={0.35} />
      <Effet nom="gag-boing" a={M(1, 'panne')} volume={0.4} />
      <Effet nom="whoosh" a={CODE_F - 4} duree={24} volume={0.35} />
      <Effet nom="frappe-clavier" a={CODE_F} duree={40} volume={0.3} />
      <Effet nom="pop" a={M(2, 'dièse.')} />
      <Effet nom="pop" a={M(2, 'vide,')} />
      <Effet nom="pop" a={M(2, 'Instagram')} />
      <Effet nom="whoosh" a={P(3).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(3, 'Soit', 1)} />
      <Effet nom="whoosh" a={P(4).d - 4} duree={24} volume={0.4} />
      <Effet nom="clic-bouton" a={P(4).d + 8} />
      <Effet nom="coeur" a={P(4).d + 10} duree={88} volume={0.5} />
      <Effet nom="ding-bonne-reponse" a={REVELATION} volume={0.55} />
      <Effet nom="whoosh" a={REVELATION + 40} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(5, 'a.')} />
      <Effet nom="pop" a={M(5, 'destination.')} />
      <Effet nom="pop" a={P(6).d} />
      <Effet nom="sparkle" a={M(6, 'target')} volume={0.35} />
      <Effet nom="pop" a={P(7).d} />
      <Effet nom="vibration" a={M(7, 'appelle.')} duree={30} volume={0.5} />
      <Effet nom="carte" a={P(8).d} duree={25} />
      <Effet nom="buzzer-erreur" a={M(8, 'perdre')} volume={0.3} />
      <Effet nom="whoosh" a={P(9).d - 8} duree={24} volume={0.35} />
      <Effet nom="sparkle" a={M(9, 'SES') - 4} volume={0.4} />
      <Effet nom="gag-boing" a={M(9, 'couleurs.')} volume={0.4} />
      <Effet nom="pop" a={M(9, 'couleurs.') + 10} />
    </AbsoluteFill>
  );
};
