import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import mots from '../../videos/astuce-1b/mots.json';
import {Camera} from '../camera/Camera';
import {APPART, AppartColoc} from '../decors/AppartColoc';
import {clamp, keys, pop, prog, s} from '../lib/anim';
import {FONT} from '../lib/fonts';
import {Bande, Effet} from '../lib/son';
import {Bobo, Toi} from '../personnages';
import {CarteJeu} from '../ui/CarteJeu';
import {Etiquette, Tampon} from '../ui/Communs';
import {CarteOuverture, ChoixRappel, EcranAbonne, Etincelles} from '../ui/Ecrans';
import {HUD} from '../ui/HUD';
import {IconeAir24, IconeBocal, IconeChiffon, IconeCle, IconePower, IconePriseBarree} from '../ui/Icones';
import {FondPlan} from '../ui/Schema';
import {CoupeTelephone, GoutteIons} from '../ui/SchemaAstuce';
import {SousTitres} from '../ui/SousTitres';

/* Astuces 1b — « Téléphone dans l'eau » (la réponse) */

const m = (i: number) => Math.round(mots[i].s * 30);

export const DUREE_ASTUCE_1B = s(64.6);

const MOTS_CLES = ['riz', 'Bobo', 'mythe', 'surface', 'cachée', 'amidon', 'ports', 'courant', 'sels', "l'électricité", 'court-circuit…', 'corrosion.', "l'éteins", 'branches', 'tapotes', 'journée.', 'sèche-cheveux', 'réparateur.', 'cornichons.', "l'air", 'gaspillé.'];

const T = {
  rappel: 3,
  fier: m(13),
  signe: m(18),
  schema: m(23) - 6,
  mythe: m(27),
  seche: m(29),
  surface: m(33),
  aspire: m(36),
  cachee: m(39),
  pire: m(42),
  poussiere: m(44),
  boucher: m(48),
  apple: m(51),
  danger: m(57),
  eau: m(63),
  savon: m(66),
  sels: m(69),
  conduisent: m(71),
  tel: m(73),
  plus: m(75),
  goutte: m(76),
  egale: m(77),
  court: m(78),
  corrosion: m(80),
  etapes: m(81) - 4,
  e1: m(81),
  eteins: m(84),
  e2: m(88),
  branche: m(92),
  pas: m(94),
  e3: m(95),
  coque: m(97),
  essuie: m(101),
  tapote: m(105),
  e4: m(115),
  arrive: m(125),
  pose: m(126),
  journee: m(127),
  evapore: m(132),
  pasRiz: m(140),
  seche2: m(141),
  composants: m(148),
  bugue: m(151),
  cuire: m(158),
  gaspille: m(171),
  teaser: m(172),
  bocal: m(174),
  abonne: s(61.6),
};

const glisse = (f: number, debut: number, fin: number) =>
  (1 - prog(f, debut, 12, Easing.inOut(Easing.cubic))) * 1080 - prog(f, fin, 12, Easing.inOut(Easing.cubic)) * 1080;

export const Astuce1b: React.FC = () => {
  const f = useCurrentFrame();

  /* ---------- Toi ---------- */
  const toiX = keys(f, [
    [0, 2330],
    [T.e4, 2330],
    [T.arrive, 960],
  ], Easing.linear);
  const toiFacing: 1 | -1 = f >= T.e4 && f < T.arrive ? -1 : 1;

  /* ---------- Bobo ---------- */
  const boboX = (() => {
    if (f < T.schema + 10) return 2730;
    if (f < T.e2) return 3320;
    if (f < T.e3 + 6) return keys(f, [[T.e2, 3320], [T.branche, 2790]], Easing.out(Easing.quad));
    if (f < T.seche2 - 1) return keys(f, [[T.e3 + 6, 2790], [T.essuie, 3320]], Easing.linear);
    if (f < m(150)) return keys(f, [[T.seche2 - 1, 1780], [m(144) + 6, 1340]], Easing.out(Easing.quad));
    if (f < T.bugue + 30) return keys(f, [[m(150), 1340], [T.bugue + 28, 1780]], Easing.linear);
    return 2300;
  })();
  const boboFacing: 1 | -1 = (f >= T.e3 + 6 && f < T.essuie) || (f >= m(150) && f < T.bugue + 30) ? 1 : -1;
  const accBobo = f < T.schema || f >= T.bugue + 30 ? (f >= T.bocal ? null : 'saladier') : null;
  const mainPoser: [number, number] = [boboX + 178 * boboFacing, 1208];
  const mainCafe: [number, number] = [boboX + 120 * boboFacing, 1198];

  /* ---------- jour / nuit : « pendant au moins une journée » ---------- */
  const jour = keys(f, [
    [T.journee, 1],
    [T.journee + 14, 0.05],
    [m(131) + 16, 1],
  ]);

  /* ---------- caméra ---------- */
  const plans = [
    {f: 0, x: 2550, y: 1100, z: 1.5},
    {f: T.fier, x: 2680, y: 1080, z: 1.9, d: 10},
    {f: T.etapes, x: 2520, y: 1050, z: 1.75, d: 1},
    {f: T.e2, x: 2600, y: 1070, z: 1.55, d: 14},
    {f: T.e3, x: 2470, y: 1060, z: 1.9, d: 14},
    {f: T.e4, x: 1150, y: 1080, z: 1.6, d: T.arrive - T.e4, ease: Easing.inOut(Easing.quad)},
    {f: T.seche2, x: 1220, y: 1120, z: 1.45, d: 16},
    {f: T.cuire, x: 2150, y: 1120, z: 1.7, d: 18},
    {f: T.teaser, x: 2250, y: 990, z: 1.6, d: 20},
  ];

  const toiMain: [number, number] = [toiX + 105 * toiFacing, 1141];
  const telPose = f >= T.pose + 6;

  const effets: Effet[] = [
    {f: T.rappel, son: 'carte', vol: 0.5},
    {f: T.fier, son: 'sparkle', vol: 0.45},
    {f: T.signe, son: 'gag-boing', vol: 0.45},
    {f: T.schema, son: 'whoosh', vol: 0.5},
    {f: T.mythe, son: 'buzzer-erreur', vol: 0.45},
    {f: T.surface, son: 'pop', vol: 0.45},
    {f: T.cachee, son: 'pop', vol: 0.45},
    {f: T.boucher, son: 'pop', vol: 0.45},
    {f: T.apple, son: 'carte', vol: 0.5},
    {f: T.danger, son: 'carte', vol: 0.5},
    {f: T.sels, son: 'pop', vol: 0.4},
    {f: T.conduisent, son: 'sparkle', vol: 0.4},
    {f: T.court, son: 'gag-boing', vol: 0.5},
    {f: T.etapes, son: 'whoosh', vol: 0.5},
    {f: T.e1, son: 'carte', vol: 0.5},
    {f: T.eteins, son: 'clic-bouton', vol: 0.5},
    {f: T.e2, son: 'carte', vol: 0.5},
    {f: T.pas, son: 'buzzer-erreur', vol: 0.45},
    {f: T.e3, son: 'carte', vol: 0.5},
    {f: T.coque, son: 'pop', vol: 0.5},
    {f: T.tapote, son: 'eau-plouf', vol: 0.35},
    {f: T.e4, son: 'carte', vol: 0.5},
    {f: T.e4 + 4, son: 'pas', vol: 0.4, dur: 50},
    {f: T.journee, son: 'whoosh', vol: 0.4},
    {f: T.evapore, son: 'ding-bonne-reponse', vol: 0.5},
    {f: T.seche2, son: 'buzzer-erreur', vol: 0.45},
    {f: T.bugue, son: 'carte', vol: 0.5},
    {f: T.cuire, son: 'whoosh', vol: 0.45},
    {f: T.gaspille, son: 'compteur', vol: 0.45},
    {f: T.teaser, son: 'carte', vol: 0.5},
    {f: T.abonne, son: 'pop', vol: 0.5},
  ];

  return (
    <AbsoluteFill style={{background: '#2b2238'}}>
      {/* ======================= MONDE ======================= */}
      <Camera plans={plans} mondeW={APPART.W} mondeH={APPART.H} haut={180} bas={1650} secousse={f >= T.court && f < T.court + 12 ? 8 : 0}>
        <AppartColoc jour={jour} mousse={0.4} riz={false}>
          {/* téléphone posé sur la table basse, sur une serviette */}
          {telPose && (
            <g>
              <rect x={1040} y={1390} width={124} height={12} rx={4} fill="#f472b6" />
              <rect x={1058} y={1380} width={88} height={12} rx={4} fill="#111827" stroke="#9ca3af" strokeWidth={2} />
              {f >= T.evapore &&
                [0, 1, 2].map((i) => (
                  <path
                    key={i}
                    d={`M${1075 + i * 25},${1370 - ((f - T.evapore) * 1.2 + i * 20) % 80} q-10,-15 0,-30 q10,-15 0,-30`}
                    stroke="#fff"
                    strokeWidth={5}
                    fill="none"
                    opacity={0.7}
                    strokeLinecap="round"
                  />
                ))}
            </g>
          )}
          {/* courant d'air depuis la fenêtre */}
          {f >= m(121) && f < T.bugue &&
            [0, 1, 2, 3].map((i) => {
              const k = ((f - m(121)) * 0.025 + i * 0.25) % 1;
              return (
                <path
                  key={i}
                  d={`M${560 + k * 380},${860 + i * 50 + k * 380} q40,-24 80,0 t80,0`}
                  stroke="#e0f2fe"
                  strokeWidth={7}
                  fill="none"
                  strokeLinecap="round"
                  opacity={Math.sin(k * Math.PI)}
                />
              );
            })}
          {/* chargeur de Bobo */}
          {f >= T.e2 && f < T.essuie && (
            <g transform={`translate(${mainPoser[0]},${mainPoser[1]})`}>
              <rect x={-22} y={-30} width={44} height={50} rx={8} fill="#fff" stroke="#9ca3af" strokeWidth={3} />
              <rect x={-12} y={-46} width={6} height={18} fill="#9ca3af" />
              <rect x={6} y={-46} width={6} height={18} fill="#9ca3af" />
              <path d="M0,20 q30,60 -10,120 q-30,50 20,90" stroke="#fff" strokeWidth={6} fill="none" />
              {f >= T.pas && (
                <g transform={`scale(${pop(f, T.pas)})`}>
                  <line x1={-50} y1={-60} x2={50} y2={40} stroke="#ef4444" strokeWidth={14} strokeLinecap="round" />
                  <line x1={50} y1={-60} x2={-50} y2={40} stroke="#ef4444" strokeWidth={14} strokeLinecap="round" />
                </g>
              )}
            </g>
          )}
          {/* sèche-cheveux de Bobo */}
          {f >= T.seche2 - 1 && f < T.bugue + 30 && (
            <g transform={`translate(${mainPoser[0]},${mainPoser[1]}) scale(${boboFacing === -1 ? 1 : -1},1)`}>
              <rect x={-20} y={-10} width={30} height={70} rx={10} fill="#ec4899" transform="rotate(10)" />
              <rect x={-90} y={-40} width={110} height={56} rx={26} fill="#f472b6" />
              <rect x={-120} y={-30} width={40} height={36} rx={6} fill="#be185d" />
              {f < m(146) &&
                [0, 1, 2].map((i) => {
                  const k = ((f * 2 + i * 10) % 30) / 30;
                  return <path key={i} d={`M${-130 - k * 160},${-26 + i * 14} q-15,-10 -30,0 t-30,0`} stroke="#f97316" strokeWidth={6} fill="none" opacity={1 - k} strokeLinecap="round" />;
                })}
            </g>
          )}
          {/* bocal de cornichons */}
          {f >= T.bocal && (
            <g transform={`translate(${mainCafe[0] - 10},${mainCafe[1] - 60}) rotate(${Math.sin(f * 0.9) * 8})`}>
              <rect x={-30} y={-6} width={60} height={16} rx={4} fill="#dc2626" />
              <rect x={-34} y={8} width={68} height={86} rx={14} fill="#d9f99d" opacity={0.7} stroke="#65a30d" strokeWidth={4} />
              <rect x={-22} y={22} width={18} height={30} rx={9} fill="#4d7c0f" />
              <rect x={4} y={40} width={18} height={30} rx={9} fill="#4d7c0f" />
            </g>
          )}
          <Bobo
            x={boboX}
            y={1530}
            facing={boboFacing}
            accessoire={accBobo as 'saladier' | null}
            tremble={f >= T.bocal ? 3 : 0}
            timeline={[
              {f: 0, base: 'debout', bras: 'poser', expr: 'fier', regard: [1, 0]},
              {f: T.fier, bras: 'leve', expr: 'fier'},
              {f: T.signe, bras: 'cafe', expr: 'amuse'},
              {f: T.e2, base: 'marche', bras: 'poser', expr: 'fier'},
              {f: T.branche, base: 'debout'},
              {f: T.pas, bras: 'repos', expr: 'coupable'},
              {f: T.e3 + 6, base: 'marche', bras: 'repos', expr: 'triste'},
              {f: T.essuie, base: 'debout'},
              {f: T.seche2 - 1, base: 'marche', bras: 'poser', expr: 'fier'},
              {f: m(144) + 6, base: 'debout'},
              {f: m(146), expr: 'coupable'},
              {f: m(150), base: 'marche', bras: 'repos', expr: 'triste'},
              {f: T.bugue + 30, base: 'debout', bras: 'cafe', expr: 'soulage', regard: [1, 0.5]},
              {f: T.bocal, bras: 'cafe', expr: 'panique', regard: [0, -1]},
            ]}
          />
          <Toi
            x={toiX}
            y={1500}
            facing={toiFacing}
            ecranTel={f >= T.eteins ? '#000000' : Math.sin(f * 0.9) > 0 ? '#60a5fa' : '#1e3a8a'}
            timeline={[
              {f: 0, base: 'debout', bras: 'telephone', expr: 'panique', regard: [1, 0.4]},
              {f: T.fier, expr: 'consterne', regard: [1, 0]},
              {f: T.e1, bras: 'telephone', expr: 'concentre', regard: [1, 0.4]},
              {f: T.e2, expr: 'surpris', regard: [1, 0]},
              {f: T.branche, bras: 'pointer', expr: 'fache'},
              {f: T.e3, bras: 'telephone', expr: 'concentre', regard: [1, 0.4]},
              {f: T.e4, base: 'marche', bras: 'telephone', expr: 'concentre'},
              {f: T.arrive, base: 'debout'},
              {f: T.pose, bras: 'poser', expr: 'fier', regard: [1, 0.6]},
              {f: T.pose + 20, bras: 'repos'},
              {f: T.evapore, expr: 'soulage'},
              {f: T.seche2, expr: 'surpris', regard: [1, 0]},
              {f: m(144), bras: 'pointer', expr: 'fache'},
              {f: T.bugue, bras: 'reflechit', expr: 'concentre'},
            ]}
          />
          {/* éteindre : icône */}
          {f >= T.eteins && f < T.e2 && (
            <g transform={`translate(${toiMain[0] + 60},${toiMain[1] - 120}) scale(${pop(f, T.eteins)})`}>
              <circle r={44} fill="#ef4444" stroke="#fff" strokeWidth={6} />
              <path d="M-14,-12 A20,20 0 1,0 14,-12" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" />
              <line x1={0} y1={-24} x2={0} y2={0} stroke="#fff" strokeWidth={7} strokeLinecap="round" />
            </g>
          )}
          {/* coque qui s'envole */}
          {f >= T.coque && f < T.coque + 30 && (
            <g transform={`translate(${toiMain[0] + (f - T.coque) * -6},${toiMain[1] - 30 - Math.sin(((f - T.coque) / 30) * Math.PI) * 160 + (f - T.coque) * 4}) rotate(${(f - T.coque) * 18})`}>
              <rect x={-18} y={-32} width={36} height={64} rx={8} fill="none" stroke="#a855f7" strokeWidth={8} />
            </g>
          )}
          {/* chiffon */}
          {f >= T.essuie && f < T.tapote && (
            <rect x={toiMain[0] - 10 + Math.sin(f * 0.8) * 14} y={toiMain[1] - 40} width={50} height={40} rx={8} fill="#facc15" transform={`rotate(${Math.sin(f * 0.8) * 10} ${toiMain[0]} ${toiMain[1]})`} />
          )}
          {/* gouttes qui sortent des ports */}
          {f >= T.tapote && f < T.e4 &&
            [0, 1, 2].map((i) => {
              const k = ((f * 2 + i * 10) % 30) / 30;
              return <ellipse key={i} cx={toiMain[0] + 6 + i * 5} cy={toiMain[1] + k * 300} rx={5} ry={8} fill="#7dd3fc" opacity={1 - k} />;
            })}
        </AppartColoc>
      </Camera>

      {/* ======================= RAPPEL ======================= */}
      {f < T.fier + 12 && <AbsoluteFill style={{background: `rgba(15,10,30,${0.6 * (1 - prog(f, T.fier - 6, 10))})`}} />}
      <ChoixRappel debut={T.rappel} fin={T.fier - 6} vert="Dans le riz" rouge="Éteindre et sécher à l'air" titre="TEAM RIZ OU TEAM AIR ?" y={640} />
      <CarteOuverture debut={4} fin={T.fier - 10} ligne1="SAMEDI • 14:05" ligne2="Appartement – Coloc" ligne3="Toi, en week-end" />
      {f >= T.fier && f < T.schema && <Etincelles debut={T.fier} x={640} y={760} r={180} />}
      {f >= T.signe && f < T.schema + 10 && <Etiquette debut={T.signe} x={540} y={520} texte="⚠ MAUVAIS SIGNE" couleur="#dc2626" rot={-4} />}

      {/* ======================= SCHÉMAS : le riz / le courant ======================= */}
      {f >= T.schema && f < T.etapes + 12 && (
        <AbsoluteFill style={{transform: `translateX(${glisse(f, T.schema, T.etapes)}px)`}}>
          <FondPlan />
          {/* A-C : le téléphone en coupe */}
          {f < T.danger + 8 && (
            <div style={{position: 'absolute', inset: 0, opacity: 1 - prog(f, T.danger - 2, 10)}}>
              <div
                style={{
                  position: 'absolute',
                  left: 375,
                  top: 700,
                  width: 330,
                  transformOrigin: '50% 95%',
                  transform: `translateY(${-170 * (prog(f, T.pire, 14) - prog(f, T.apple, 14))}px) scale(${1 + 0.8 * (prog(f, T.pire, 14) - prog(f, T.apple, 14))})`,
                }}
              >
                <CoupeTelephone
                  largeur={330}
                  riz
                  surface={1 - prog(f, T.seche, 20)}
                  alerteInterieur={T.aspire}
                  poussiere={prog(f, T.poussiere, 40, Easing.linear)}
                />
              </div>
              {f < T.seche && <Tampon debut={T.mythe} x={540} y={980} texte="MYTHE" couleur="#dc2626" taille={120} />}
              {f < T.pire && <Etiquette debut={T.surface} x={850} y={820} texte="SURFACE ✓" couleur="#15803d" rot={4} />}
              {f < T.pire && <Etiquette debut={T.cachee} x={820} y={1200} texte="EAU CACHÉE ✗" couleur="#dc2626" rot={-3} />}
              {f >= T.pire && f < T.apple && <Etiquette debut={T.poussiere} x={540} y={720} texte="POUSSIÈRE + AMIDON" couleur="#78350f" rot={-2} />}
              {f >= T.pire && f < T.apple && <Etiquette debut={T.boucher} x={540} y={1270} texte="PORTS BOUCHÉS ✗" couleur="#dc2626" rot={3} />}
              {f >= T.apple && <Tampon debut={m(53)} x={540} y={1000} texte="PAS DE RIZ" couleur="#dc2626" taille={96} rot={-10} />}
            </div>
          )}
          <CarteJeu debut={T.schema + 6} fin={T.apple - 2} surtitre="ASTUCE N° 1" titre="Le riz, c'est un mythe" detail="il ne sèche que la surface" x={380} y={290} largeur={640} />
          <CarteJeu debut={T.apple} fin={T.danger - 2} surtitre="INFO" titre="Même Apple le déconseille" x={380} y={290} largeur={640} />

          {/* D : la goutte, les sels, le courant */}
          {f >= T.danger - 4 && f < T.tel + 8 && (
            <div style={{position: 'absolute', inset: 0, opacity: prog(f, T.danger - 4, 10) * (1 - prog(f, T.tel - 4, 10))}}>
              <div style={{position: 'absolute', left: 270, top: 720, transform: `scale(${pop(f, T.eau, 30, 10)})`}}>
                <GoutteIons largeur={540} savon={prog(f, T.savon, 16)} ions={prog(f, T.sels - 8, 20)} courant={T.conduisent} />
              </div>
              <Etiquette debut={T.savon} x={800} y={720} texte="EAU SAVONNEUSE" couleur="#0369a1" rot={4} />
              <Etiquette debut={T.sels} x={250} y={800} texte="DES SELS" couleur="#b91c1c" rot={-4} />
              <Etiquette debut={m(72)} x={540} y={1300} texte="⚡ ÇA CONDUIT !" couleur="#a16207" rot={-2} />
            </div>
          )}
          <CarteJeu debut={T.danger} fin={T.etapes - 4} surtitre="LE VRAI DANGER" couleurSurtitre="#f87171" titre="Le courant ⚡" x={380} y={290} largeur={640} />

          {/* E : l'équation */}
          {f >= T.tel - 2 && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 820, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, fontFamily: FONT, fontWeight: 700, color: '#fff', fontSize: 90}}>
              <div style={{transform: `scale(${pop(f, T.tel)})`, textAlign: 'center'}}>
                <svg width={150} height={240} viewBox="0 0 150 240">
                  <rect x={10} y={10} width={130} height={220} rx={22} fill="#1f2937" stroke="#9ca3af" strokeWidth={6} />
                  <rect x={22} y={26} width={106} height={180} rx={10} fill="#60a5fa" />
                  <text x={75} y={130} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff">
                    ON
                  </text>
                </svg>
              </div>
              <div style={{transform: `scale(${pop(f, T.plus)})`}}>+</div>
              <div style={{transform: `scale(${pop(f, T.goutte)})`}}>
                <svg width={140} height={180} viewBox="0 0 140 180">
                  <path d="M70,6 C40,60 12,96 12,124 A58,58 0 0,0 128,124 C128,96 100,60 70,6 Z" fill="#38bdf8" stroke="#e0f2fe" strokeWidth={6} />
                </svg>
              </div>
              <div style={{transform: `scale(${pop(f, T.egale)})`}}>=</div>
              <div style={{transform: `scale(${pop(f, T.court, 30, 6)}) rotate(${f >= T.court ? Math.sin(f * 1.5) * 6 : 0}deg)`}}>
                <svg width={170} height={220} viewBox="0 0 170 220">
                  <path d="M100,4 L20,120 L80,120 L50,216 L150,84 L90,84 L130,4 Z" fill="#facc15" stroke="#fff" strokeWidth={8} />
                </svg>
              </div>
            </div>
          )}
          {f >= T.court && (
            <div
              style={{
                position: 'absolute',
                left: 540,
                top: 1150,
                transform: `translate(-50%,-50%) scale(${pop(f, T.court + 4)})`,
                background: '#facc15',
                color: '#111827',
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 62,
                padding: '10px 34px',
                borderRadius: 22,
                whiteSpace: 'nowrap',
                boxShadow: '0 10px 0 #a16207',
              }}
            >
              COURT-CIRCUIT
              {f >= T.corrosion && <span style={{color: '#92400e'}}> + CORROSION</span>}
            </div>
          )}
          {f >= T.court && f < T.court + 10 && <AbsoluteFill style={{background: `rgba(254,240,138,${0.6 * (1 - (f - T.court) / 10)})`}} />}
        </AbsoluteFill>
      )}

      {/* ======================= LES 4 ÉTAPES ======================= */}
      <CarteJeu debut={T.e1} fin={T.e2 - 2} surtitre="ÉTAPE 1" couleurSurtitre="#4ade80" titre="Éteins-le" detail="tout de suite" icone={<IconePower s={110} />} x={380} y={290} largeur={640} />
      <CarteJeu debut={T.e2} fin={T.e3 - 2} surtitre="ÉTAPE 2" couleurSurtitre="#4ade80" titre="Ne le branche pas" detail="surtout pas !" icone={<IconePriseBarree s={110} />} x={380} y={290} largeur={640} />
      <CarteJeu debut={T.e3} fin={T.e4 - 2} surtitre="ÉTAPE 3" couleurSurtitre="#4ade80" titre="Coque, essuie, tapote" detail="ports vers le bas" icone={<IconeChiffon s={110} />} x={380} y={290} largeur={640} />
      <CarteJeu debut={T.e4} fin={T.seche2 - 2} surtitre="ÉTAPE 4" couleurSurtitre="#4ade80" titre="Sèche à l'air libre" detail="au moins 24 h" icone={<IconeAir24 s={110} />} x={380} y={290} largeur={640} />
      {f >= T.tapote && f < T.e4 && <Etiquette debut={T.tapote} x={760} y={760} texte="TAP TAP" couleur="#0369a1" rot={6} />}
      {f >= T.journee && f < T.seche2 && <Etiquette debut={m(129)} x={780} y={780} texte="⏱ 24 H" rot={4} />}
      {f >= T.evapore && f < T.seche2 && <Etiquette debut={m(133)} x={300} y={1000} texte="L'AIR ✓" couleur="#15803d" rot={-4} />}
      {f >= T.evapore && f < T.seche2 && <Etiquette debut={T.pasRiz} x={760} y={1060} texte="LE RIZ ✗" couleur="#dc2626" rot={4} />}

      {/* sèche-cheveux */}
      <CarteJeu debut={T.seche2} fin={T.bugue - 2} surtitre="ATTENTION" couleurSurtitre="#f87171" titre="Pas de sèche-cheveux" detail="la chaleur abîme les composants" x={380} y={290} largeur={640} />
      {f >= T.seche2 && f < T.bugue && <Tampon debut={m(144)} x={700} y={820} texte="✗ STOP" couleur="#dc2626" taille={80} rot={8} />}
      {f >= T.seche2 && f < T.bugue && <Etiquette debut={T.composants} x={300} y={1250} texte="COMPOSANTS 🔥" couleur="#c2410c" rot={-3} />}

      {/* réparateur */}
      {f >= T.bugue && f < T.cuire + 10 && <AbsoluteFill style={{background: `rgba(15,10,30,${0.72 * clamp((f - T.bugue) / 8) * (1 - prog(f, T.cuire - 4, 10))})`}} />}
      <CarteJeu debut={T.bugue} fin={T.cuire - 4} surtitre="ÇA BUGUE ENCORE ?" couleurSurtitre="#c084fc" titre="Direction le réparateur" icone={<IconeCle s={130} />} x={540} y={560} largeur={900} />

      {/* Bobo a fait cuire le riz */}
      {f >= T.cuire && f < T.teaser && <Etiquette debut={m(162)} x={330} y={620} texte="RIZ CUIT 😋" rot={-4} />}
      {f >= T.cuire && f < T.teaser && <Etiquette debut={T.gaspille} x={720} y={1260} texte="0 € GASPILLÉ ✓" couleur="#15803d" rot={3} />}

      {/* teaser */}
      <CarteJeu debut={T.teaser} fin={T.abonne - 4} surtitre="PROCHAINE CATASTROPHE" couleurSurtitre="#fbbf24" titre="Bobo contre un bocal de cornichons" icone={<IconeBocal s={120} />} x={540} y={470} largeur={900} />

      {/* ======================= UI permanente ======================= */}
      <HUD
        compteur={[
          [0, 1002],
          [T.gaspille, 999],
        ]}
        barre={[
          [0, 0.16],
          [T.eteins, 0.3],
          [T.pas, 0.42],
          [m(114), 0.55],
          [m(131), 0.75],
          [m(144), 0.55],
          [m(150) + 20, 0.7],
          [T.cuire + 20, 0.82],
          [T.gaspille, 0.92],
        ]}
        unite="€"
        label="DÉGÂTS DE BOBO"
        icone="maison"
        inverse
        alerte={0.7}
      />
      <EcranAbonne debut={T.abonne} />
      {f < T.abonne && <SousTitres mots={mots} motsCles={MOTS_CLES} y={1400} />}

      <Bande voix="videos/astuce-1b/voix.wav" mots={mots} effets={effets} ambiance="ambiances/appartement.mp3" musique="musiques/comique.mp3" />
    </AbsoluteFill>
  );
};
