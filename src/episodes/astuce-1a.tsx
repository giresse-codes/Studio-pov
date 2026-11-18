import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import mots from '../../videos/astuce-1a/mots.json';
import {Camera} from '../camera/Camera';
import {APPART, AppartColoc} from '../decors/AppartColoc';
import {clamp, keys, pop, prog, rand, s} from '../lib/anim';
import {FONT} from '../lib/fonts';
import {Bande, Effet} from '../lib/son';
import {Bobo, Toi} from '../personnages';
import {BulleBD, Commentaire} from '../ui/Bulles';
import {CarteJeu} from '../ui/CarteJeu';
import {Etiquette} from '../ui/Communs';
import {CarteOuverture, EcranChoix} from '../ui/Ecrans';
import {HUD} from '../ui/HUD';
import {IconeRiz, IconeSecherAir} from '../ui/Icones';
import {SousTitres} from '../ui/SousTitres';
import {TelephoneMouille} from '../ui/Telephone';

/* Astuces 1a — « Téléphone dans l'eau » */

const m = (i: number) => Math.round(mots[i].s * 30);

export const DUREE_ASTUCE_1A = s(44.8);

const MOTS_CLES = ['Bobo', 'riz', 'rien', 'téléphone', 'évier', 'vaisselle', 'fourchette', 'vivant', 'clignote', 'mouillé', 'seconde', "l'éteins", 'libre', 'géré'];

const T = {
  calme: 4,
  entends: m(11),
  crier: m(16),
  cri: m(20) - 2,
  quand: m(24),
  rienGere: m(31),
  arrive: m(35),
  telephone: m(37),
  fond: m(41),
  eau: m(45),
  fourchette: m(51),
  sors: m(53),
  ecran: m(56) - 4,
  vivant: m(58),
  boboRevient: m(62),
  mets: m(67),
  riz: m(70),
  monde: m(76),
  mouille: m(83) - 3,
  seconde: m(91),
  alors: m(100) - 4,
  opt1: m(101),
  opt2: m(106),
  choix: m(117) - 4,
};

const saut = (f: number, debuts: number[]) =>
  debuts.reduce((a, d) => a + (f >= d && f < d + 12 ? Math.sin(((f - d) / 12) * Math.PI) * 60 : 0), 0);

/** étiquette de valeur posée dans le décor (coordonnées monde) */
const EtiquetteMonde: React.FC<{debut: number; fin?: number; x: number; y: number; texte: string; fond?: string; couleur?: string; taille?: number}> = ({
  debut,
  fin = 1e9,
  x,
  y,
  texte,
  fond = '#ffe14d',
  couleur = '#111',
  taille = 30,
}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin) return null;
  const p = pop(f, debut, 30, 8);
  const w = texte.length * taille * 0.62 + 30;
  return (
    <g transform={`translate(${x},${y + Math.sin(f * 0.15) * 3}) scale(${p})`}>
      <line x1={0} y1={0} x2={0} y2={30} stroke="#111" strokeWidth={3} />
      <rect x={-w / 2} y={-taille - 20} width={w} height={taille + 26} rx={12} fill={fond} stroke={couleur} strokeWidth={4} />
      <text x={0} y={-12} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={taille} fill={couleur}>
        {texte}
      </text>
    </g>
  );
};

export const Astuce1a: React.FC = () => {
  const f = useCurrentFrame();
  const {canape, evier: E} = APPART;

  /* ---------- positions ---------- */
  const toiX = keys(f, [
    [0, canape.x],
    [T.arrive - 1, canape.x],
    [T.arrive, 1600],
    [T.telephone, 2330],
  ], Easing.linear);
  const boboX = keys(f, [
    [0, 2860],
    [T.sors, 2860],
    [m(61), 3320],
    [T.boboRevient, 3320],
    [m(66) + 10, 2730],
  ], Easing.inOut(Easing.quad));
  const boboFacing: 1 | -1 = f >= T.sors && f < T.boboRevient ? 1 : -1;
  const boboMarche = (f >= T.sors && f < m(61)) || (f >= T.boboRevient && f < m(66) + 10);

  /* ---------- caméra ---------- */
  const plans = [
    {f: 0, x: 800, y: 1100, z: 1.4},
    {f: T.entends, x: 900, y: 1070, z: 1.5, d: 20},
    {f: T.quand, x: 760, y: 1100, z: 1.6, d: 14},
    {f: T.rienGere, x: 2620, y: 1090, z: 1.45, d: 14},
    {f: T.arrive, x: 2450, y: 1100, z: 1.5, d: 20},
    {f: T.telephone, x: 2590, y: 1290, z: 2.7, d: 12},
    {f: T.sors, x: 2470, y: 1150, z: 1.85, d: 14},
    {f: T.boboRevient, x: 2600, y: 1100, z: 1.5, d: 20},
    {f: T.seconde, x: 2400, y: 1060, z: 2.3, d: 50, ease: Easing.out(Easing.cubic)},
    {f: T.alors, x: 2550, y: 1100, z: 1.5, d: 20},
  ];
  const secousse = f >= T.fourchette + 6 && f < T.fourchette + 16 ? 10 : 0;

  /* ---------- objets du décor ---------- */
  const fourchetteY = keys(f, [
    [T.fourchette, 1100],
    [T.fourchette + 9, 1332],
  ], Easing.in(Easing.quad));
  const telDansEvier = f < T.sors + 8;
  const mousse = keys(f, [
    [0, 0.5],
    [T.rienGere - 10, 0.5],
    [T.rienGere + 6, 1.2],
  ]);
  const flaque = keys(f, [
    [T.rienGere - 10, 0],
    [T.rienGere + 20, 1],
  ]);

  const evier = (
    <g>
      {telDansEvier && (
        <g>
          <rect x={E.x + 50} y={E.y + 92} width={110} height={18} rx={6} fill="#1f2937" stroke="#9ca3af" strokeWidth={2} />
          <rect x={E.x + 56} y={E.y + 95} width={98} height={6} rx={2} fill={Math.sin(f * 0.9) > 0 ? '#60a5fa' : '#1e3a8a'} />
        </g>
      )}
      {telDansEvier && f >= T.fourchette && (
        <g transform={`translate(${E.x + 100},${fourchetteY}) rotate(${keys(f, [[T.fourchette, -60], [T.fourchette + 9, -6]])})`}>
          <rect x={-70} y={-5} width={110} height={10} rx={5} fill="#d1d5db" stroke="#6b7280" strokeWidth={2} />
          <path d="M40,-10 L80,-12 M40,-3 L82,-4 M40,4 L82,4 M40,11 L80,12" stroke="#d1d5db" strokeWidth={5} strokeLinecap="round" />
        </g>
      )}
    </g>
  );

  const effets: Effet[] = [
    {f: T.entends - 4, son: 'gag-boing', vol: 0.3},
    {f: T.cri, son: 'pop', vol: 0.5},
    {f: T.quand, son: 'carte', vol: 0.5},
    {f: T.rienGere, son: 'whoosh', vol: 0.55},
    {f: T.arrive, son: 'pas', vol: 0.4, dur: 30},
    {f: T.telephone, son: 'whoosh', vol: 0.45},
    {f: T.fond, son: 'compteur', vol: 0.5},
    {f: T.eau, son: 'eau-plouf', vol: 0.45},
    {f: T.fourchette + 8, son: 'gag-boing', vol: 0.55},
    {f: T.sors, son: 'eau-plouf', vol: 0.4},
    {f: T.ecran, son: 'pop', vol: 0.4},
    {f: T.vivant, son: 'sparkle', vol: 0.45},
    {f: T.boboRevient, son: 'pas', vol: 0.4, dur: 40},
    {f: T.mets, son: 'pop', vol: 0.5},
    {f: T.riz, son: 'compteur', vol: 0.4},
    {f: T.monde, son: 'notification', vol: 0.4},
    {f: T.monde + 10, son: 'notification', vol: 0.4},
    {f: T.monde + 20, son: 'notification', vol: 0.4},
    {f: T.mouille, son: 'whoosh', vol: 0.4},
    {f: T.seconde, son: 'coeur', vol: 0.55, dur: s(2.5)},
    {f: T.opt1, son: 'carte', vol: 0.5},
    {f: T.opt2, son: 'carte', vol: 0.5},
    {f: T.choix, son: 'carte', vol: 0.55},
    {f: T.choix + 14, son: 'clic-bouton', vol: 0.5},
  ];

  return (
    <AbsoluteFill style={{background: '#2b2238'}}>
      {/* ======================= MONDE : l'appart ======================= */}
      <Camera plans={plans} mondeW={APPART.W} mondeH={APPART.H} haut={180} bas={1650} secousse={secousse}>
        <AppartColoc jour={1} evier={evier} mousse={mousse} riz={f < T.boboRevient - 30}>
          {/* flaque + vaisselle tombée */}
          <ellipse cx={2620} cy={1512} rx={260 * flaque} ry={16 * flaque} fill="#7dd3fc" opacity={0.7} />
          {flaque > 0.5 && (
            <g>
              <path d="M2500,1500 l30,-8 l14,10 z" fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
              <path d="M2700,1502 l26,-12 l10,14 z" fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
            </g>
          )}
          {/* grains de riz semés par Bobo */}
          {f >= T.boboRevient &&
            Array.from({length: 34}).map((_, i) => {
              const gx = 2700 + i * 18 + rand(i) * 10;
              if (boboX > gx + 60) return null;
              return <ellipse key={i} cx={gx} cy={1500 + rand(i + 4) * 14} rx={5} ry={3} fill="#fff" stroke="#d6d3d1" strokeWidth={1} />;
            })}
          {boboMarche && f >= T.boboRevient &&
            [0, 1, 2].map((i) => {
              const k = ((f * 3 + i * 9) % 26) / 26;
              return <ellipse key={i} cx={boboX - 110 + i * 14} cy={1270 + k * 230} rx={5} ry={3} fill="#fff" opacity={1 - k * 0.3} />;
            })}
          <Bobo
            x={boboX}
            y={1530}
            facing={boboFacing}
            accessoire={f >= T.boboRevient ? 'saladier' : null}
            timeline={[
              {f: 0, base: 'debout', bras: 'leve', expr: 'fier'},
              {f: T.rienGere, bras: 'hanches', expr: 'fier', regard: [1, 0]},
              {f: T.telephone + 10, bras: 'reflechit', expr: 'coupable', regard: [-1, -1]},
              {f: T.fourchette, bras: 'repos', expr: 'coupable', regard: [0, -1]},
              {f: T.sors, base: 'marche', bras: 'repos', expr: 'neutre'},
              {f: m(61), base: 'debout'},
              {f: T.boboRevient, base: 'marche', bras: 'cafe', expr: 'fier'},
              {f: m(66) + 10, base: 'debout', bras: 'poser', expr: 'fier', regard: [1, 0]},
              {f: T.monde, bras: 'cafe', expr: 'amuse'},
              {f: T.seconde, bras: 'poser', expr: 'fier'},
            ]}
          />
          <Toi
            x={toiX}
            y={f < T.arrive ? canape.y : 1500}
            saut={saut(f, [T.cri, T.fourchette + 8])}
            tremble={f >= T.seconde && f < T.alors ? 2.5 : 0}
            timeline={[
              {f: 0, base: 'assis', bras: 'croises', expr: 'soulage', regard: [1, 0]},
              {f: T.entends, expr: 'curieux', regard: [1, -0.3]},
              {f: T.crier, expr: 'consterne'},
              {f: T.cri, expr: 'surpris'},
              {f: T.quand, bras: 'facepalm', expr: 'consterne'},
              {f: T.arrive, base: 'marche', bras: 'repos', expr: 'consterne', regard: [1, 0]},
              {f: T.telephone, base: 'debout', expr: 'surpris', regard: [1, 0.6]},
              {f: T.eau, expr: 'panique'},
              {f: T.sors, bras: 'telephone', expr: 'concentre', regard: [1, 0.4]},
              {f: T.ecran, expr: 'surpris'},
              {f: T.vivant, expr: 'soulage'},
              {f: T.boboRevient, bras: 'telephone', expr: 'consterne', regard: [1, 0]},
              {f: T.monde, bras: 'reflechit', expr: 'curieux'},
              {f: T.mouille, bras: 'telephone', expr: 'panique', regard: [1, 0.5]},
              {f: T.alors, bras: 'reflechit', expr: 'concentre', regard: [0.6, -0.6]},
            ]}
          />
          {/* gouttes qui tombent du téléphone */}
          {f >= T.sors &&
            f < T.boboRevient &&
            [0, 1, 2].map((i) => {
              const k = ((f * 2 + i * 11) % 30) / 30;
              return <ellipse key={i} cx={2440 + i * 6} cy={1260 + k * 240} rx={5} ry={8} fill="#7dd3fc" opacity={1 - k} />;
            })}
          <EtiquetteMonde debut={T.fond} fin={T.sors} x={E.x + 105} y={E.y + 40} texte="999 €" taille={28} />
          <EtiquetteMonde debut={T.eau} fin={T.sors} x={E.x + 250} y={E.y - 60} texte="EAU + SAVON" fond="#bae6fd" taille={22} />
          <EtiquetteMonde debut={T.riz} fin={T.alors} x={2830} y={1490} texte="+3 € DE RIZ" taille={30} />
        </AppartColoc>
      </Camera>

      {/* ======================= bulles et cartes ======================= */}
      <BulleBD debut={T.cri} fin={T.quand - 2} x={560} y={650} largeur={820} cri texte={"« T'inquiète, j'ai tout géré\u00a0!\u00a0»"} auteur="BOBO (DEPUIS LA CUISINE)" pointe={[1080, 900]} taille={56} />
      <CarteJeu debut={T.quand} fin={T.rienGere + 4} surtitre="RÈGLE DE LA COLOC" titre={"Bobo a «\u00a0tout géré\u00a0»"} detail="= rien n'est géré" x={380} y={300} largeur={640} />
      <TelephoneMouille debut={T.ecran} fin={T.boboRevient - 6} vivant={T.vivant} y={880} echelle={0.9} />
      {f >= T.ecran && f < T.boboRevient && <Etiquette debut={m(60)} x={300} y={480} texte="ENCORE VIVANT ♥" couleur="#15803d" rot={-5} />}
      <BulleBD debut={T.mets} fin={T.monde - 2} x={470} y={560} largeur={840} texte={"« Mets-le dans le riz, ma tante fait toujours ça\u00a0!\u00a0»"} auteur="BOBO" pointe={[690, 860]} taille={52} />

      {/* « tout le monde en parle » */}
      {f >= T.monde && f < T.mouille + 6 && <AbsoluteFill style={{background: `rgba(15,10,30,${0.55 * clamp((f - T.monde) / 8) * (1 - prog(f, T.mouille - 4, 8))})`}} />}
      <Commentaire debut={m(77)} fin={T.mouille - 4} x={420} y={520} nom="tata_josie" texte="mets-le dans le riz !!" couleur="#f472b6" rot={-3} />
      <Commentaire debut={m(78)} fin={T.mouille - 4} x={620} y={760} nom="kevin_du_76" texte="le riz ça marche 🍚" couleur="#60a5fa" rot={2} />
      <Commentaire debut={m(80)} fin={T.mouille - 4} x={430} y={1000} nom="mamie.lou" texte="ma mamie fait ça" couleur="#34d399" rot={-2} />
      <Commentaire debut={m(82)} fin={T.mouille - 4} x={600} y={1230} nom="lucas.tech" texte="RIZ = MAGIE ✨" couleur="#fbbf24" rot={3} />

      {/* téléphone mouillé qui clignote */}
      <TelephoneMouille debut={T.mouille} fin={T.seconde - 4} y={880} echelle={0.9} />
      {f >= T.mouille && f < T.seconde && <Etiquette debut={m(88)} x={290} y={480} texte="TOUT MOUILLÉ" couleur="#1d4ed8" rot={-4} />}
      {f >= T.mouille && f < T.seconde && <Etiquette debut={m(90)} x={800} y={1270} texte="IL CLIGNOTE…" couleur="#dc2626" rot={3} />}

      {/* chaque seconde compte : cœur qui bat + chrono */}
      {f >= T.seconde && f < T.choix && (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(220,38,38,0.55) 100%)',
              opacity: (0.4 + 0.6 * Math.abs(Math.sin((f - T.seconde) * 0.2))) * (1 - prog(f, T.alors, 10)),
            }}
          />
          {f < T.alors + 6 && (
            <div
              style={{
                position: 'absolute',
                left: 60,
                top: 330,
                transform: `scale(${pop(f, T.seconde + 6) * (1 - prog(f, T.alors, 8))}) rotate(-3deg)`,
                background: '#111827',
                border: '6px solid #ef4444',
                color: '#f87171',
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 64,
                padding: '8px 28px',
                borderRadius: 20,
              }}
            >
              ⏱ 00:{String(Math.floor((f - T.seconde) / 10)).padStart(2, '0')}
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ======================= LES DEUX OPTIONS ======================= */}
      {f >= T.alors && f < T.choix + 10 && (
        <AbsoluteFill style={{background: `rgba(15,10,30,${0.7 * clamp((f - T.alors) / 10)})`}}>
          <div
            style={{
              position: 'absolute',
              left: 60,
              top: 300,
              transform: `scale(${pop(f, T.alors + 2)}) rotate(-3deg)`,
              background: '#f4c542',
              color: '#0f1630',
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 64,
              padding: '8px 34px',
              borderRadius: 24,
              boxShadow: '0 10px 0 #b8860b',
            }}
          >
            ALORS ?
          </div>
          <CarteJeu debut={T.opt1} fin={T.choix} surtitre="OPTION 1" couleurSurtitre="#4ade80" titre="Dans le riz de Bobo" detail="« ma tante fait toujours ça »" icone={<IconeRiz s={130} />} x={540} y={440} largeur={900} />
          <CarteJeu debut={T.opt2} fin={T.choix} surtitre="OPTION 2" couleurSurtitre="#f87171" titre="Éteindre + sécher à l'air" detail="et attendre…" icone={<IconeSecherAir s={150} />} x={540} y={930} largeur={900} />
        </AbsoluteFill>
      )}

      {/* ======================= UI permanente ======================= */}
      <HUD
        compteur={[
          [0, 0],
          [T.fond + 2, 999],
          [T.riz, 1002],
        ]}
        barre={[
          [0, 1],
          [m(23), 0.9],
          [m(34), 0.75],
          [T.fond, 0.5],
          [T.fourchette + 8, 0.38],
          [T.riz, 0.28],
          [T.seconde, 0.16],
        ]}
        unite="€"
        label="DÉGÂTS DE BOBO"
        icone="maison"
        inverse
        alerte={0.7}
      />
      <CarteOuverture debut={T.calme} fin={m(9) - 4} ligne1="SAMEDI • 14:03" ligne2="Appartement – Coloc" ligne3="Toi, en week-end" />
      <EcranChoix debut={T.choix} vert="Dans le riz" rouge="Éteindre et sécher à l'air" ctaDebut={s(41.5)} />
      {f < T.choix && <SousTitres mots={mots} motsCles={MOTS_CLES} y={1400} />}

      <Bande voix="videos/astuce-1a/voix.wav" mots={mots} effets={effets} ambiance="ambiances/appartement.mp3" musique="musiques/comique.mp3" />
    </AbsoluteFill>
  );
};
