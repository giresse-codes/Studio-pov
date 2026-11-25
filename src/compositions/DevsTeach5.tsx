import React from 'react';
import {AbsoluteFill, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Camera, Plan} from '../camera/Camera';
import {BUREAU_STARTUP, BureauStartup, ECRAN_STARTUP, POSTE_TOI, SOL_STARTUP, ZONES_STARTUP as Z} from '../decors/BureauStartup';
import {clamp, prog} from '../lib/anim';
import {Ambiance, Effet, Musique, Voix} from '../lib/sons';
import {C, POLICE} from '../lib/theme';
import {creerTiming, DonneesVoix} from '../lib/timing';
import {assis, clignement, debout, epaulesTombent, etirer, Expression, marcher, Max, Pose, Smartphone, sursaut, taperClavier, Toi} from '../personnages';
import {
  BarreNavigateur, CarteAbonne, CarteJeu, CarteOuverture, EcranChoix, EditeurCode, Etiquette, Etincelles, HUD, LigneCode, NotificationSMS,
  SchemaClasse, SchemaDeuxOptions, SchemaPointDiese, SchemaPrecision, SousTitres, TexteHook, valeurAnimee,
} from '../ui';
import donnees from '../../videos/devsteach-5/mots.json';

/** #devsteach 5 — « Les couleurs du client » */
const AJOUT = 90; // 3 s insérées à la [pause]
const T = creerTiming(donnees as DonneesVoix, {
  ajout: AJOUT,
  cles: ['trois', 'seule', 'orange.', 'vert.', 'Acheter.', 'classe', 'HTML.', 'quoi', 'class', 'btn-acheter.', 'btn-acheter,', 'point,', 'dièse,', 'id',
    'précise', 'fouilles', 'Fini.', 'collé,', 'respire.'],
});
export const DUREE_DEVSTEACH_5 = T.fin + 50;

const P = T.phrase;
const M = T.mot;
const E = ECRAN_STARTUP;
const REVELATION = P(5).d;
const surSite = (lx: number, ly: number) => ({x: 540 + (E.x + lx - Z.ecran.x) * Z.ecran.zoom, y: 960 + (E.y + ly - Z.ecran.y) * Z.ecran.zoom});

/** Page du site avec 3 boutons (repère 440 x 290) */
const SiteBoutons: React.FC<{couleurs: [string, string, string]; colle?: boolean}> = ({couleurs, colle}) => {
  const noms = ['Menu', 'Réserver', 'Acheter'];
  return (
    <g>
      <rect x={0} y={0} width={E.w} height={E.h} fill="#fff4e6" />
      <BarreNavigateur w={E.w} url="cafe-paname.fr" />
      <rect x={0} y={26} width={E.w} height={32} fill="#3b2418" />
      <text x={14} y={48} fontFamily={POLICE} fontWeight={900} fontSize={14} fill="#ffd9a8">☕ Café Paname</text>
      {colle ? (
        <g>
          <text x={4} y={84} fontFamily={POLICE} fontWeight={900} fontSize={30} fill="#c0396b">CAFÉ PANAME</text>
          <rect x={4} y={88} width={E.w - 8} height={7} fill="#d9c3ab" /><rect x={4} y={96} width={E.w - 8} height={7} fill="#d9c3ab" />
          {noms.map((n, i) => (
            <g key={n} transform={`translate(${4 + i * 122},104)`}>
              <rect x={0} y={0} width={124} height={34} fill={couleurs[i]} />
              <text x={62} y={23} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={15} fill="#fff">{n}</text>
            </g>
          ))}
          {[0, 1, 2].map((i) => <rect key={i} x={4 + i * 144} y={140} width={144} height={60} fill={['#ffb88a', '#a8d8ff', '#c9f2b0'][i]} />)}
        </g>
      ) : (
        <g>
          <text x={E.w / 2} y={108} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={34} fill="#c0396b">CAFÉ PANAME</text>
          <rect x={60} y={124} width={E.w - 120} height={7} rx={3} fill="#d9c3ab" />
          {noms.map((n, i) => (
            <g key={n} transform={`translate(${36 + i * 128},176)`}>
              <rect x={0} y={4} width={112} height={44} rx={14} fill="#000" opacity={0.15} />
              <rect x={0} y={0} width={112} height={44} rx={14} fill={couleurs[i]} />
              <text x={56} y={28} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={16} fill="#fff">{n}</text>
            </g>
          ))}
        </g>
      )}
    </g>
  );
};

const OR = '#ff9f1a';
const rose = '#ff79c6', bleu = '#8be9fd';

export const DevsTeach5: React.FC = () => {
  const f = useCurrentFrame();
  const SMS = M(1, 'client');
  const CSS_F = M(2, 'CSS');
  const RESULTAT = M(2, 'Résultat');

  // ---------------- Caméra ----------------
  const plans: Plan[] = [
    {a: 0, x: 1150, y: 1200, zoom: 1.45},
    {a: 3, ...Z.ecran, duree: 12},
    {a: P(1).d - 8, x: 1120, y: 1210, zoom: 1.4, duree: 14},
    {a: CSS_F - 6, ...Z.ecran, duree: 12},
    {a: P(3).d - 6, x: 1150, y: 1180, zoom: 1.2, duree: 16},
    {a: P(9).d - 6, ...Z.ecran, duree: 12},
    {a: M(9, 'Fini.') + 2, x: 1120, y: 1200, zoom: 1.45, duree: 12},
    {a: P(10).d - 4, ...Z.ecran, duree: 12},
  ];

  // ---------------- Toi ----------------
  let pose: Pose = assis(f);
  let expr: Expression = 'neutre';
  let regard = 0.8;
  if (f < P(1).d) { pose = taperClavier(f, 0.5); expr = 'fier'; }
  else if (f < CSS_F) { pose = assis(f); expr = f < M(1, 'vert.') ? 'neutre' : 'surpris'; regard = 0.2; }
  else if (f < P(3).d) { pose = f < RESULTAT ? taperClavier(f, 0.8) : epaulesTombent(assis(f), prog(f, RESULTAT, RESULTAT + 10)); expr = f < RESULTAT ? 'concentre' : 'coupable'; }
  else if (f < REVELATION) { pose = assis(f); expr = f < P(4).d ? 'concentre' : 'surpris'; regard = 0.3; }
  else if (f < P(9).d) { pose = taperClavier(f, 1.1); expr = 'concentre'; }
  else if (f < P(10).d) { pose = f < M(9, 'Fini.') ? taperClavier(f, 0.5) : etirer(assis(f), prog(f, M(9, 'Fini.'), M(9, 'Fini.') + 8)); expr = 'fier'; }
  else { pose = sursaut(assis(f), f - M(10, 'collé,')); expr = f < M(10, 'collé,') ? 'neutre' : 'panique'; }

  // ---------------- Max ----------------
  const auTel = f >= SMS - 24 && f < CSS_F;
  const xMax = auTel ? 470 : 400 + Math.sin(f / 45) * 170;
  const poseMax: Pose = auTel ? {...debout(f), epauleAv: 60, coudeAv: 90, tete: 10} : marcher(f, 0.9);
  const sensMax: 1 | -1 = auTel || Math.cos(f / 45) > 0 ? 1 : -1;

  // ---------------- HUD ----------------
  const minutes = valeurAnimee(f, [[0, 80], [P(2).d, 79], [P(3).d, 78], [P(4).d, 77], [P(6).d, 76], [P(8).d, 75], [P(9).d, 74]], 10);
  const stress = valeurAnimee(f, [[0, 0.3], [M(2, 'Acheter.'), 0.8], [P(4).d, 0.95], [M(5, 'verte.'), 0.2], [M(9, 'Fini.'), 0.08], [M(10, 'collé,'), 0.55]], 14);
  const alerte = valeurAnimee(f, [[0, 0.1], [M(2, 'Acheter.'), 0.7], [P(4).d, 1], [M(5, 'verte.'), 0.1], [M(9, 'Fini.'), 0], [M(10, 'collé,'), 0.45]], 12);

  // ---------------- Écran ----------------
  const verts = ['#1faa55', '#2ecc71', '#0e8a44'];
  const avis = Math.min(2, Math.floor(interpolate(f, [8, M(0, 'fois…') + 4], [0, 3], clamp)));
  let ecran: React.ReactNode;
  if (f < P(1).d) ecran = <SiteBoutons couleurs={[OR, OR, verts[avis]]} />;
  else if (f < CSS_F) ecran = <SiteBoutons couleurs={f >= M(1, 'orange.') ? [OR, OR, OR] : ['#9aa3b5', '#9aa3b5', '#9aa3b5']} />;
  else if (f < RESULTAT) {
    const l: LigneCode[] = [[{t: 'button', c: '#ffb86c'}, {t: ' {'}], [{t: '  background', c: bleu}, {t: ': '}, {t: 'orange', c: OR}, {t: ';'}], [{t: '}'}]];
    ecran = <EditeurCode w={E.w} h={E.h} fichier="style.css" lignes={l} surligne={f >= M(2, 'button,') ? 0 : undefined} />;
  } else if (f < REVELATION) ecran = <SiteBoutons couleurs={[OR, OR, OR]} />;
  else if (f < P(10).d) {
    const nouveauVert = f >= M(9, 'vert', 1);
    const l: LigneCode[] = [
      [{t: 'button', c: '#ffb86c'}, {t: ' {'}], [{t: '  background', c: bleu}, {t: ': '}, {t: 'orange', c: OR}, {t: ';'}], [{t: '}'}],
      [{t: '.btn-acheter', c: '#50fa7b'}, {t: ' {'}], [{t: '  background', c: bleu}, {t: ': '}, {t: nouveauVert ? '#00d26a' : 'green', c: '#50fa7b'}, {t: ';'}], [{t: '}'}],
    ];
    ecran = <EditeurCode w={E.w} h={E.h} fichier="style.css" lignes={l} surligne={f >= P(9).d ? 4 : undefined} />;
  } else ecran = <SiteBoutons couleurs={[OR, OR, '#00d26a']} colle={f >= M(10, 'collé,')} />;

  const pAcheter = surSite(348, 198);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Camera plans={plans} largeur={BUREAU_STARTUP.largeur} hauteur={BUREAU_STARTUP.hauteur}
        secousse={interpolate(f, [M(10, 'collé,'), M(10, 'collé,') + 3, M(10, 'collé,') + 12], [0, 0.6, 0], clamp)}>
        <BureauStartup
          frame={f}
          ecran={ecran}
          tableau={['WEEK-END', '17 H 00']}
          salleReunion={
            <g transform={`translate(${xMax},${SOL_STARTUP})`}>
              <Max pose={poseMax} expression={auTel ? 'surpris' : 'panique'} sens={sensMax} echelle={1.2} frame={f} cligne={clignement(f, 40)}
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
      <TexteHook texte="3 AVIS… 1 SEULE LIGNE 😎" fin={56} y={420} />
      {f < P(1).d && f >= 8 && <Etiquette a={8} x={pAcheter.x - 60} y={pAcheter.y - 150} texte={`AVIS N° ${avis + 1}`} fond="#fff" rot={6} taille={52} />}
      {[0, 1, 2].map((i) => <Etincelles key={i} debut={Math.round(8 + i * ((M(0, 'fois…') + 4 - 8) / 3))} x={pAcheter.x} y={pAcheter.y} rayon={120} couleur={C.vert} />)}

      {/* 2. SITUATION */}
      <CarteOuverture debut={P(1).d} fin={CSS_F + 10} lignes={['VENDREDI • 15:40', 'Bureau – Startup', 'Toi, stagiaire dev']} y={1110} />
      <NotificationSMS debut={SMS} fin={CSS_F - 4} de="Le client 🧑‍💼" texte="Tous les boutons en orange. Sauf Acheter : lui, en vert !" y={440} />
      <Etiquette a={RESULTAT} fin={P(3).d - 6} x={540} y={pAcheter.y - 190} texte="TOUT EST ORANGE 🍊" fond={OR} couleur="#fff" rot={-4} taille={60} />
      <Etiquette a={M(2, 'Acheter.')} fin={P(3).d - 6} x={pAcheter.x - 40} y={pAcheter.y + 110} texte="MÊME ACHETER 🙃" fond="#fff" rot={5} taille={50} />

      <SchemaDeuxOptions debut={P(3).d} fin={P(4).d - 4} a1={P(3).d + 2} a2={M(3, 'Soit', 1)}
        titre1="Une classe en CSS" code1={['.btn-acheter {', '  background: green;', '}']}
        titre2="La couleur dans le HTML" code2={['<button style=', '  "background:green">']} />

      {/* 3. TU FERAIS QUOI ? */}
      <EcranChoix debut={P(4).d - 4} fin={REVELATION + 34} vert="Une classe CSS" rouge="La couleur dans le HTML" bonne="vert" revelation={REVELATION} />

      {/* 4. RÉPONSE + EXPLICATION */}
      <SchemaClasse debut={REVELATION + 40} fin={P(6).d - 4} aHTML={M(5, 'class')} aCSS={M(5, 'point')} aVert={M(5, 'verte.')} />
      <SchemaPointDiese debut={P(6).d} fin={P(7).d - 4} aPoint={P(6).d + 2} aDiese={M(6, 'dièse,')} />
      <SchemaPrecision debut={P(7).d} fin={P(8).d - 4} aGagne={M(7, 'gagne', 1)} aClasse={M(7, 'classe')} />
      <CarteJeu debut={P(8).d} fin={P(9).d - 8} surTitre="ASTUCE N° 5" titre="Les couleurs ? Dans le CSS." y={420} largeur={940}
        detail="Couleur dans le HTML = fouiller toutes tes pages au moindre changement d’avis." />
      <Etiquette a={M(9, 'vert', 1)} fin={P(10).d - 6} x={surSite(300, 140).x} y={surSite(300, 140).y + 70} texte="encore + vert 🟢" fond={C.vert} rot={-4} taille={50} />
      <Etiquette a={M(9, 'ligne.')} fin={P(10).d - 6} x={540} y={760} texte="1 LIGNE. FINI. ✅" fond={C.jaune} rot={-5} taille={76} />
      <Etincelles debut={M(9, 'ligne.')} x={540} y={760} rayon={260} />
      <Etiquette a={M(10, 'collé,') + 2} fin={T.fin + 30} x={540} y={surSite(220, 60).y - 40} texte="😵 TOUT EST COLLÉ !" fond={C.rouge} couleur="#fff" rot={-4} taille={64} />

      {/* 5. ACCROCHE FINALE */}
      <CarteAbonne debut={M(10, 'respire.') + 10} fin={DUREE_DEVSTEACH_5} y={1600} />

      <HUD valeur={minutes} unite="MIN" libelle="AVANT LE WEEK-END" barre={stress} icone="⏱️" alerte={alerte} apparition={4} />
      <SousTitres mots={T.mots} y={1440} />

      {/* ---------------- SONS ---------------- */}
      <Voix src={staticFile('videos/devsteach-5/voix.wav')} pauseS={(donnees as DonneesVoix).pause ?? undefined} ajout={AJOUT} />
      <Ambiance nom="bureau" duree={DUREE_DEVSTEACH_5} />
      <Musique nom="tech-leger" duree={DUREE_DEVSTEACH_5} voix={T.segments} />
      <Effet nom="whoosh" a={3} duree={24} volume={0.4} />
      {[0, 1, 2].map((i) => <Effet key={i} nom="pop" a={Math.round(8 + i * ((M(0, 'fois…') + 4 - 8) / 3))} volume={0.4} />)}
      <Effet nom="whoosh" a={P(1).d - 8} duree={24} volume={0.3} />
      <Effet nom="notification" a={SMS} />
      <Effet nom="whoosh" a={CSS_F - 6} duree={24} volume={0.35} />
      <Effet nom="frappe-clavier" a={CSS_F} duree={30} volume={0.3} />
      <Effet nom="pop" a={RESULTAT} />
      <Effet nom="gag-boing" a={M(2, 'Acheter.')} volume={0.45} />
      <Effet nom="whoosh" a={P(3).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(3, 'Soit', 1)} />
      <Effet nom="whoosh" a={P(4).d - 4} duree={24} volume={0.4} />
      <Effet nom="clic-bouton" a={P(4).d + 8} />
      <Effet nom="coeur" a={P(4).d + 10} duree={88} volume={0.5} />
      <Effet nom="ding-bonne-reponse" a={REVELATION} volume={0.55} />
      <Effet nom="whoosh" a={REVELATION + 40} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(5, 'class')} />
      <Effet nom="pop" a={M(5, 'point')} />
      <Effet nom="sparkle" a={M(5, 'verte.')} volume={0.4} />
      <Effet nom="whoosh" a={P(6).d} duree={24} volume={0.35} />
      <Effet nom="pop" a={M(6, 'dièse,')} />
      <Effet nom="whoosh" a={P(7).d} duree={24} volume={0.35} />
      <Effet nom="ding-bonne-reponse" a={M(7, 'gagne', 1)} volume={0.3} />
      <Effet nom="carte" a={P(8).d} duree={25} />
      <Effet nom="whoosh" a={P(9).d - 6} duree={24} volume={0.35} />
      <Effet nom="frappe-clavier" a={M(9, 'vert', 1) - 6} duree={16} volume={0.3} />
      <Effet nom="sparkle" a={M(9, 'ligne.')} />
      <Effet nom="gag-boing" a={M(10, 'collé,')} volume={0.4} />
      <Effet nom="pop" a={M(10, 'respire.') + 10} />
    </AbsoluteFill>
  );
};
