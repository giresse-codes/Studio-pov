import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Camera} from '../camera/Camera';
import {CHAMBRE_DEV, ChambreDev, ECHELLE_PERSO, POS_CHAISE, SOL, ZONES} from '../decors/ChambreDev';
import {FondBureauStartup} from '../decors/FondAppel';
import {clamp, prog} from '../lib/anim';
import {Ambiance, Effet, MIX, Musique, Segments} from '../lib/sons';
import {C, POLICE_CODE} from '../lib/theme';
import {assis, clignement, debout, etirer, marcher, melanger, Max, sursaut, taperClavier, telephoneAssis, Toi} from '../personnages';
import {BlocCode, BulleDirect, CarteJeu, EcranChoix, Etincelles, HUD, Mot, SousTitres, TexteHook, valeurAnimee} from '../ui';

/**
 * TEST de 15 s (450 frames) : valide personnages, décor chambre-dev, caméra, HUD et cartes.
 * Pas de voix off réelle : les sous-titres suivent un texte factice, et la musique
 * baisse (ducking) sur ces mêmes segments pour vérifier le mixage.
 */
export const DUREE_TEST = 450;

// Timeline factice de la voix (mot, début, fin en frames)
const phrase = (texte: string, debut: number, fin: number, cles: string[] = []): Mot[] => {
  const mots = texte.split(' ');
  const pas = (fin - debut) / mots.length;
  return mots.map((t, i) => ({t, d: Math.round(debut + i * pas), f: Math.round(debut + (i + 1) * pas) - 1, cle: cles.includes(t)}));
};
const MOTS: Mot[] = [
  ...phrase('Il est 2 h du matin, et tu codes encore.', 4, 56, ['2', 'h']),
  ...phrase('Ton téléphone vibre : Max t’appelle en direct.', 64, 108, ['Max']),
  ...phrase('Le bouton du site doit être violet. Tout de suite.', 116, 166, ['violet.']),
  ...phrase('Le CSS, c’est ce qui habille ta page.', 196, 244, ['CSS,']),
  ...phrase('Le soleil se lève… et c’est pas fini.', 270, 322, ['soleil']),
  ...phrase('Tu ferais quoi ?', 332, 356, ['quoi']),
];
const SEGMENTS: Segments = [[4, 56], [64, 108], [116, 166], [196, 244], [270, 322], [332, 356]];

const CODE_CSS = (f: number) => {
  const lignes = ['button {', '  background: violet;', '  color: white;', '}'];
  const n = Math.floor(interpolate(f, [176, 232], [0, lignes.join('\n').length], clamp));
  let reste = n;
  return lignes.map((l) => {
    const t = l.slice(0, Math.max(0, reste));
    reste -= l.length + 1;
    return t;
  });
};

export const Test: React.FC = () => {
  const f = useCurrentFrame();

  // --- Temps de la journée : nuit → jour (fenêtre + lumière) ---
  const jour = interpolate(f, [268, 330], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const heure = interpolate(f, [0, 268, 330], [120, 125, 470], clamp);

  // --- Caméra ---
  const plans = [
    {a: 0, ...ZONES.ensemble, zoom: 1.0},
    {a: 2, x: 1020, y: 1150, zoom: 1.55, duree: 14},           // hook : zoom rapide sur Toi
    {a: 74, x: 1160, y: 1090, zoom: 1.2, duree: 20},           // l'appel arrive : on recule un peu
    {a: 170, ...ZONES.ecran, duree: 18},                        // zoom sur l'écran (whoosh)
    {a: 262, x: 1560, y: 1080, zoom: 1.12, duree: 26},          // glisse vers la fenêtre
    {a: 300, x: 1700, y: 1000, zoom: 1.05, duree: 40},
  ];

  // --- Toi ---
  const debutMarche = 268, finMarche = 306;
  const xToi = interpolate(f, [debutMarche, finMarche], [POS_CHAISE, 1720], {...clamp, easing: Easing.inOut(Easing.sin)});
  let pose = taperClavier(f, 0.9);
  let expression: React.ComponentProps<typeof Toi>['expression'] = 'concentre';
  let regard = 0.8;
  if (f >= 62 && f < 172) {
    const base = melanger(taperClavier(f), telephoneAssis(f), prog(f, 70, 80));
    pose = sursaut(base, f - 62);
    expression = f < 80 ? 'surpris' : 'panique';
    regard = 0.2;
  } else if (f >= 172 && f < debutMarche) {
    pose = taperClavier(f, 1.6);
    expression = f < 252 ? 'concentre' : 'fier';
  } else if (f >= debutMarche && f < finMarche) {
    pose = marcher(f - debutMarche);
    expression = 'neutre';
  } else if (f >= finMarche) {
    pose = etirer(debout(f), interpolate(f, [finMarche, finMarche + 12, 326, 336], [0, 1, 1, 0.2], clamp));
    expression = f < 330 ? 'soulage' : 'surpris';
  }
  const parleToi = 0;

  // --- HUD : minutes avant la deadline + stress de Max ---
  const minutes = valeurAnimee(f, [[0, 45], [110, 30], [300, 9]], 16);
  const stress = valeurAnimee(f, [[0, 0.35], [90, 0.8], [180, 0.6], [300, 0.92]], 18);
  const alerte = valeurAnimee(f, [[0, 0.1], [90, 0.65], [180, 0.4], [300, 1]], 14);

  const ecranCode = (
    <g>
      <rect x={0} y={0} width={300} height={22} fill="#2a2c40" />
      <circle cx={14} cy={11} r={5} fill="#ff5f56" /><circle cx={30} cy={11} r={5} fill="#ffbd2e" /><circle cx={46} cy={11} r={5} fill="#27c93f" />
      <text x={70} y={16} fontFamily={POLICE_CODE} fontSize={12} fill="#9aa0c8">style.css</text>
      {CODE_CSS(f).map((l, i) => (
        <text key={i} x={14} y={56 + i * 30} fontFamily={POLICE_CODE} fontWeight={700} fontSize={20} fill={i === 1 ? '#c792ea' : i === 2 ? '#8be9fd' : '#ffcb6b'} style={{whiteSpace: 'pre'}}>{l}</text>
      ))}
      {/* aperçu : le bouton devient violet */}
      <g transform="translate(176,172)">
        <rect x={0} y={0} width={110} height={44} rx={12} fill={f > 238 ? '#8a4fff' : '#9a9a9a'} />
        <text x={55} y={29} textAnchor="middle" fontFamily={POLICE_CODE} fontWeight={700} fontSize={16} fill="#fff">ACHETER</text>
      </g>
    </g>
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Camera plans={plans} largeur={CHAMBRE_DEV.largeur} hauteur={CHAMBRE_DEV.hauteur} secousse={interpolate(f, [62, 66, 78], [0, 1, 0], clamp)}>
        <ChambreDev jour={jour} frame={f} heure={heure} ecran={f >= 172 ? ecranCode : undefined}>
          <g transform={`translate(${f >= debutMarche ? xToi : POS_CHAISE},${SOL})`}>
            <Toi pose={pose} expression={expression} regard={regard} cligne={clignement(f)} parle={parleToi} echelle={ECHELLE_PERSO}
              mainAv={f >= 70 && f < 172 ? <Smartphone /> : undefined} />
          </g>
        </ChambreDev>
      </Camera>

      {/* HOOK (2 premières secondes) */}
      <TexteHook texte="2 H DU MAT’… ET TU CODES ENCORE" fin={54} y={400} />

      <HUD valeur={minutes} unite="MIN" libelle="AVANT LA DEADLINE" barre={stress} icone="⏱️" alerte={alerte} apparition={6} />

      {/* Appel EN DIRECT de Max */}
      <BulleDirect debut={74} fin={170} nom="Max" y={430} x={480}>
        <FondBureauStartup frame={f} />
        <g transform="translate(370,720)">
          <Max
            pose={{...debout(f), epauleAv: 85 + Math.sin(f / 3) * 22, coudeAv: -20 + Math.sin(f / 3) * 25, epauleAr: 15, coudeAr: 115}}
            expression={f < 115 ? 'panique' : 'surpris'} regard={-0.3} parle={Math.abs(Math.sin(f / 2.5))} cligne={clignement(f, 30)} frame={f} sens={-1}
          />
        </g>
      </BulleDirect>

      {/* Carte NOTION : CSS */}
      <CarteJeu debut={182} fin={232} surTitre="NOTION" titre="CSS" y={260} largeur={900}
        detail="Le CSS habille ta page HTML : couleurs, tailles, placement."
        contenu={<BlocCode debut={200} lignes={[[{t: 'button', c: '#ffcb6b'}, {t: ' {'}], [{t: '  background', c: '#8be9fd'}, {t: ': '}, {t: 'violet', c: '#c792ea'}, {t: ';'}], [{t: '}'}]]} />}
      />
      <Etincelles debut={186} x={540} y={420} rayon={220} />
      <Etincelles debut={239} x={700} y={1180} rayon={140} couleur={C.vert} />

      {/* TU FERAIS QUOI ? */}
      <EcranChoix debut={330} fin={460} vert="Je change juste le CSS" rouge="Je réécris tout le HTML" bonne="vert" revelation={436} />

      <SousTitres mots={MOTS} y={1420} />

      {/* --- SONS --- */}
      <Ambiance nom="bureau" duree={DUREE_TEST} />
      <Musique nom="tech-leger" duree={DUREE_TEST} voix={SEGMENTS} />
      <Effet nom="whoosh" a={0} duree={30} />
      <Effet nom="pop" a={6} />
      <Effet nom="frappe-clavier" a={10} duree={50} volume={0.3} />
      <Effet nom="vibration" a={60} duree={34} />
      <Effet nom="appel" a={64} duree={44} volume={0.4} />
      <Effet nom="compteur" a={110} duree={24} volume={0.4} />
      <Effet nom="whoosh" a={168} duree={30} />
      <Effet nom="frappe-clavier" a={178} duree={70} volume={0.3} />
      <Effet nom="carte" a={182} duree={25} />
      <Effet nom="sparkle" a={239} volume={0.35} />
      <Effet nom="sparkle" a={186} />
      <Effet nom="whoosh" a={260} duree={30} volume={0.4} />
      <Effet nom="pas" a={268} duree={38} volume={0.45} />
      <Effet nom="whoosh" a={328} duree={30} />
      <Effet nom="clic-bouton" a={342} />
      <Sequence from={344} durationInFrames={90} layout="none">
        <Effet nom="coeur" a={0} duree={90} volume={MIX.effet} />
      </Sequence>
      <Effet nom="ding-bonne-reponse" a={436} />
    </AbsoluteFill>
  );
};

/** Smartphone dans la main (repère main) */
const Smartphone: React.FC = () => (
  <g transform="rotate(-10) translate(-16,-60)">
    <rect x={0} y={0} width={36} height={66} rx={8} fill="#2d2d3a" />
    <rect x={4} y={6} width={28} height={52} rx={4} fill="#5ad1ff" />
  </g>
);
