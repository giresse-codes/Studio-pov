import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Camera, Plan} from '../camera/Camera';
import {BUREAU_STARTUP, BureauStartup, ECRAN_STARTUP, POSTE_TOI, SOL_STARTUP, ZONES_STARTUP as Z} from '../decors/BureauStartup';
import {clamp} from '../lib/anim';
import {Ambiance, Effet, Musique, Voix} from '../lib/sons';
import {C, POLICE} from '../lib/theme';
import {creerTiming, DonneesVoix} from '../lib/timing';
import {assis, clignement, debout, epaulesTombent, etirer, Expression, marcher, Max, Pose, Smartphone, sursaut, taperClavier, Toi} from '../personnages';
import {
  CarteAbonne, CarteJeu, CarteOuverture, EcranChoix, EditeurCode, Etiquette, Etincelles, HUD, LigneCode, NotificationSMS,
  SchemaBazar, SchemaChemin, SchemaDeuxOptions, SiteTitre, SousTitres, TexteHook, valeurAnimee,
} from '../ui';
import donnees from '../../videos/devsteach-3/mots.json';

/** #devsteach 3 — « Les images ne s'affichent pas » */
const AJOUT = 90; // 3 s insérées à la [pause]
const T = creerTiming(donnees as DonneesVoix, {
  ajout: AJOUT,
  cles: ['disparu', 'supprimé', 'cassée,', 'partout.', 'img,', 'jpg.', 'images.', 'chemin', 'quoi', 'GPS.', 'rien.', 'images,', 'slash,', 'dossier.',
    'remonte', 'cents.', 'Piège', 'Photo.JPG', 'photo.jpg,', 'différents.', 'reviennent.', 'Contact', 'part.'],
});
export const DUREE_DEVSTEACH_3 = T.fin + 50;

const P = T.phrase;
const M = T.mot;
const E = ECRAN_STARTUP;
const REVELATION = P(5).d;
const surSite = (lx: number, ly: number) => ({x: 540 + (E.x + lx - Z.ecran.x) * Z.ecran.zoom, y: 960 + (E.y + ly - Z.ecran.y) * Z.ecran.zoom});

const CODE: LigneCode[] = [
  [{t: '<body>', c: '#ff79c6'}],
  [{t: '  <h1>', c: '#ff79c6'}, {t: 'Café Paname'}, {t: '</h1>', c: '#ff79c6'}],
  [{t: '  <img ', c: '#ff79c6'}, {t: 'src', c: '#8be9fd'}, {t: '='}, {t: '"photo.jpg"', c: '#f1fa8c'}, {t: '>', c: '#ff79c6'}],
  [{t: '</body>', c: '#ff79c6'}],
];

export const DevsTeach3: React.FC = () => {
  const f = useCurrentFrame();
  const SMS = M(1, 'Max');
  const FIN_SMS = P(2).d + 6;
  const CODE_F = M(2, 'Dans');

  // ---------------- Caméra ----------------
  const plans: Plan[] = [
    {a: 0, x: 1150, y: 1200, zoom: 1.45},
    {a: 3, ...Z.ecran, duree: 12},
    {a: P(1).d - 8, x: 1120, y: 1210, zoom: 1.4, duree: 14},
    {a: SMS - 6, ...Z.reunion, duree: 12},
    {a: FIN_SMS - 8, ...Z.ecran, duree: 14},
    {a: P(3).d - 6, x: 1150, y: 1180, zoom: 1.2, duree: 16},
    {a: P(9).d - 6, ...Z.ecran, duree: 12},
    {a: M(9, 'reviennent.') + 6, x: 1120, y: 1200, zoom: 1.45, duree: 14},
    {a: P(10).d - 4, ...Z.ecran, duree: 12},
  ];

  // ---------------- Toi ----------------
  let pose: Pose = assis(f);
  let expr: Expression = 'neutre';
  let regard = 0.8;
  if (f < P(1).d) { pose = sursaut(assis(f), f - M(0, 'disparu')); expr = 'panique'; }
  else if (f < P(2).d) { pose = epaulesTombent(assis(f), 0.6); expr = 'triste'; }
  else if (f < P(3).d) { pose = taperClavier(f, 0.8); expr = 'concentre'; }
  else if (f < REVELATION) { pose = assis(f); expr = f < P(4).d ? 'concentre' : 'surpris'; regard = 0.3; }
  else if (f < P(9).d) { pose = taperClavier(f, 1.1); expr = 'concentre'; }
  else if (f < P(10).d) { pose = etirer(assis(f), interpolate(f, [M(9, 'reviennent.'), M(9, 'reviennent.') + 8], [0, 1], clamp)); expr = 'fier'; }
  else { pose = assis(f); expr = f < M(10, 'nulle') ? 'neutre' : 'surpris'; }

  // ---------------- Max ----------------
  const auTel = f >= SMS - 24 && f < FIN_SMS + 10;
  const xMax = auTel ? 470 : 400 + Math.sin(f / 45) * 170;
  const poseMax: Pose = auTel ? {...debout(f), epauleAv: 60, coudeAv: 90, tete: 10} : marcher(f, 0.9);
  const sensMax: 1 | -1 = auTel || Math.cos(f / 45) > 0 ? 1 : -1;

  // ---------------- HUD ----------------
  const minutes = valeurAnimee(f, [[0, 25], [P(2).d, 24], [P(3).d, 23], [P(4).d, 22], [P(6).d, 21], [P(8).d, 20]], 10);
  const stress = valeurAnimee(f, [[0, 0.7], [M(1, 'supprimé'), 0.85], [P(4).d, 0.95], [M(9, 'reviennent.'), 0.12], [M(10, 'nulle'), 0.5]], 14);
  const alerte = valeurAnimee(f, [[0, 0.6], [M(1, 'supprimé'), 0.75], [P(4).d, 1], [M(9, 'reviennent.'), 0], [M(10, 'nulle'), 0.45]], 12);

  // ---------------- Écran ----------------
  let ecran: React.ReactNode;
  if (f < CODE_F || (f >= P(9).d && f < P(10).d)) {
    const ok = f >= M(9, 'Toutes');
    ecran = <SiteTitre w={E.w} h={E.h} titre="CAFÉ PANAME" tailleTitre={44} couleurTitre="#c0396b" photos={ok ? 'ok' : 'cassees'} />;
  } else if (f < P(9).d) {
    const corrige = f >= REVELATION;
    const lignes = corrige
      ? CODE.map((l, i) => (i === 2 ? [{t: '  <img ', c: '#ff79c6'}, {t: 'src', c: '#8be9fd'}, {t: '='}, {t: '"images/photo.jpg"', c: '#50fa7b'}, {t: '>', c: '#ff79c6'}] : l))
      : CODE;
    ecran = <EditeurCode w={E.w} h={E.h} fichier="index.html" lignes={lignes} surligne={f >= M(2, 'img,') ? 2 : undefined} />;
  } else {
    // teaser : le bouton Contact ne mène nulle part
    const clic = f >= M(10, 'Contact') + 6;
    ecran = (
      <g>
        <SiteTitre w={E.w} h={E.h} titre="CAFÉ PANAME" tailleTitre={44} couleurTitre="#c0396b" photos="ok" />
        <g transform={`translate(${E.w / 2 - 70},150) scale(${clic && f < M(10, 'Contact') + 12 ? 0.92 : 1})`}>
          <rect x={0} y={0} width={140} height={40} rx={20} fill="#3b2418" />
          <text x={70} y={26} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={16} fill="#ffd9a8">Contact</text>
        </g>
        <path transform={`translate(${interpolate(f, [P(10).d, M(10, 'Contact') + 4], [380, E.w / 2 + 30], clamp)},${interpolate(f, [P(10).d, M(10, 'Contact') + 4], [270, 176], clamp)})`}
          d="M0,0 L0,28 L8,20 L14,32 L19,30 L13,18 L24,18 Z" fill="#fff" stroke="#000" strokeWidth={2} />
      </g>
    );
  }

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Camera plans={plans} largeur={BUREAU_STARTUP.largeur} hauteur={BUREAU_STARTUP.hauteur}
        secousse={interpolate(f, [M(0, 'disparu'), M(0, 'disparu') + 3, M(0, 'disparu') + 12], [0, 0.7, 0], clamp)}>
        <BureauStartup
          frame={f}
          ecran={ecran}
          tableau={['CLIENT FURIEUX', '15 H 00']}
          salleReunion={
            <g transform={`translate(${xMax},${SOL_STARTUP})`}>
              <Max pose={poseMax} expression={auTel ? 'panique' : 'surpris'} sens={sensMax} echelle={1.2} frame={f} cligne={clignement(f, 40)}
                parle={auTel ? Math.abs(Math.sin(f / 2.5)) * 0.6 : 0} mainAv={auTel ? <Smartphone ecran="#ffffff" /> : undefined} />
            </g>
          }
        >
          <g transform={`translate(${POSTE_TOI},${SOL_STARTUP})`}>
            <Toi pose={pose} expression={expr} regard={regard} cligne={clignement(f)} echelle={1.2} />
          </g>
        </BureauStartup>
      </Camera>

      {/* 1. HOOK */}
      <TexteHook texte="TOUTES LES PHOTOS ONT DISPARU !" fin={56} y={420} />
      <Etincelles debut={M(0, 'disparu')} x={540} y={surSite(220, 240).y} rayon={260} couleur={C.rouge} />

      {/* 2. SITUATION */}
      <CarteOuverture debut={P(1).d} fin={P(2).d + 30} lignes={['MERCREDI • 14:30', 'Bureau – Startup', 'Toi, stagiaire dev']} y={1110} />
      <NotificationSMS debut={SMS} fin={FIN_SMS} de="Max 😱" texte="Le client croit qu’on a supprimé ses photos !" y={440} />
      <Etiquette a={M(2, 'cassée,')} fin={CODE_F - 4} x={540} y={surSite(220, 150).y} texte="🖼️ IMAGE CASSÉE" fond="#fff" rot={-4} taille={60} />
      <Etiquette a={M(2, 'partout.')} fin={CODE_F - 4} x={760} y={surSite(220, 150).y + 130} texte="PARTOUT !" fond={C.rouge} couleur="#fff" rot={6} taille={64} />
      <Etiquette a={M(2, 'jpg.')} fin={P(3).d - 6} x={surSite(300, 104).x} y={surSite(300, 104).y + 90} texte="« à côté de moi »" fond={C.jaune} rot={4} taille={50} />
      <Etiquette a={M(2, 'images.')} fin={P(3).d - 6} x={540} y={surSite(220, 230).y + 30} texte="📁 mais elles sont dans images/ !" fond="#fff" rot={-3} taille={46} />

      <SchemaDeuxOptions debut={P(3).d} fin={P(4).d - 4} a1={P(3).d + 2} a2={M(3, 'Soit', 1)}
        titre1="Sortir les photos" code1={['images/photo.jpg', '  → photo.jpg']}
        titre2="Corriger le chemin" code2={['<img src="images/', '           photo.jpg">']} />

      {/* 3. TU FERAIS QUOI ? */}
      <EcranChoix debut={P(4).d - 4} fin={REVELATION + 34} vert="Déplacer les photos" rouge="Corriger le chemin" bonne="rouge" revelation={REVELATION} />

      {/* 4. RÉPONSE + EXPLICATION */}
      <SchemaChemin debut={REVELATION + 40} fin={P(7).d - 4} aCote={M(5, 'côté', 0)} aRien={M(5, 'rien.')} aImages={M(6, 'images,')}
        aTrouve={M(6, 'jpg.')} aRemonte={M(6, 'remonte')} />
      <SchemaBazar debut={P(7).d} fin={P(8).d - 4} aPile={P(7).d + 4} aDeuxCents={M(7, 'cents.')} />
      <CarteJeu debut={P(8).d} fin={P(9).d - 6} surTitre="PIÈGE !" titre="Photo.JPG ≠ photo.jpg" y={420} largeur={940}
        detail="Pour un serveur, majuscules et minuscules = deux fichiers différents." />
      <Etincelles debut={M(9, 'Toutes')} x={540} y={surSite(220, 240).y} rayon={300} couleur={C.vert} />
      <Etiquette a={M(9, 'reviennent.')} fin={P(10).d - 6} x={540} y={760} texte="📸 RETOUR DES PHOTOS !" fond={C.vert} rot={-4} taille={60} />
      <Etiquette a={M(10, 'nulle')} fin={T.fin + 30} x={540} y={surSite(220, 60).y - 40} texte="🔗 → NULLE PART ?!" fond={C.rouge} couleur="#fff" rot={-5} taille={64} />

      {/* 5. ACCROCHE FINALE */}
      <CarteAbonne debut={M(10, 'part.') + 10} fin={DUREE_DEVSTEACH_3} y={1600} />

      <HUD valeur={minutes} unite="MIN" libelle="AVANT L’APPEL CLIENT" barre={stress} icone="⏱️" alerte={alerte} apparition={4} />
      <SousTitres mots={T.mots} y={1440} />

      {/* ---------------- SONS ---------------- */}
      <Voix src={staticFile('videos/devsteach-3/voix.wav')} pauseS={(donnees as DonneesVoix).pause ?? undefined} ajout={AJOUT} />
      <Ambiance nom="bureau" duree={DUREE_DEVSTEACH_3} />
      <Musique nom="tech-leger" duree={DUREE_DEVSTEACH_3} voix={T.segments} />
      <Effet nom="whoosh" a={3} duree={24} volume={0.4} />
      <Effet nom="buzzer-erreur" a={M(0, 'disparu')} volume={0.35} />
      <Effet nom="whoosh" a={SMS - 6} duree={24} volume={0.35} />
      <Effet nom="notification" a={SMS} />
      <Effet nom="whoosh" a={FIN_SMS - 8} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(2, 'cassée,')} />
      <Effet nom="gag-boing" a={M(2, 'partout.')} volume={0.4} />
      <Effet nom="frappe-clavier" a={CODE_F} duree={40} volume={0.3} />
      <Effet nom="pop" a={M(2, 'jpg.')} />
      <Effet nom="pop" a={M(2, 'images.')} />
      <Effet nom="whoosh" a={P(3).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(3, 'Soit', 1)} />
      <Effet nom="whoosh" a={P(4).d - 4} duree={24} volume={0.4} />
      <Effet nom="clic-bouton" a={P(4).d + 8} />
      <Effet nom="coeur" a={P(4).d + 10} duree={88} volume={0.5} />
      <Effet nom="ding-bonne-reponse" a={REVELATION} volume={0.55} />
      <Effet nom="whoosh" a={REVELATION + 40} duree={24} volume={0.35} />
      <Effet nom="buzzer-erreur" a={M(5, 'rien.')} volume={0.3} />
      <Effet nom="pop" a={M(6, 'images,')} />
      <Effet nom="sparkle" a={M(6, 'jpg.')} volume={0.4} />
      <Effet nom="pop" a={M(6, 'remonte')} />
      <Effet nom="whoosh" a={P(7).d} duree={24} volume={0.35} />
      <Effet nom="compteur" a={P(7).d + 4} duree={40} volume={0.3} />
      <Effet nom="gag-boing" a={M(7, 'cents.')} volume={0.45} />
      <Effet nom="carte" a={P(8).d} duree={25} />
      <Effet nom="whoosh" a={P(9).d - 6} duree={24} volume={0.35} />
      <Effet nom="sparkle" a={M(9, 'Toutes')} />
      <Effet nom="ding-bonne-reponse" a={M(9, 'reviennent.')} volume={0.3} />
      <Effet nom="clic-bouton" a={M(10, 'Contact') + 6} />
      <Effet nom="buzzer-erreur" a={M(10, 'nulle')} volume={0.3} />
      <Effet nom="pop" a={M(10, 'part.') + 10} />
    </AbsoluteFill>
  );
};
