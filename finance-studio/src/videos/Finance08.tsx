import React from 'react';
import {Easing, interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-08-mots.json';
import {IconeNeon, NomIcone} from '../composants/IconeNeon';
import {Flottant, SurSol} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Etiquette, PieceQuiTombe, prog, sortie, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {BandeSon} from '../composants/Sons';
import {Fleche} from '../composants/Fleche';
import {ObjetAir, ObjetSol, Perso} from '../composants/raccourcis';
import {C, halo, SOL_Y} from '../style';

// Script 8 — La réparation d'écrans
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {milliers: 'bleu', telephones: 'bleu'}},
  {debut: 7, couleurs: {casse: 'rouge', payer: 'or'}},
  {debut: 21, couleurs: {semaine: 'bleu', gratuits: 'vert'}},
  {debut: 33, couleurs: {trente: 'or', euros: 'or'}},
  {debut: 39, couleurs: {vingt: 'or', a: 'or', quarante: 'or', euros: 'or'}},
  {debut: 48, couleurs: {soixante: 'or', a: 'or', cent: 'or', vingt: 'or'}},
  {debut: 56, couleurs: {lecran: 'attenue'}},
  {debut: 64, couleurs: {trois: 'bleu', jours: 'bleu'}},
  {debut: 75, couleurs: {cent: 'vert', euros: 'vert'}},
  {debut: 87, couleurs: {boutique: 'rouge'}},
  {debut: 95, couleurs: {reseaux: 'bleu'}},
  {debut: 106},
  {debut: 117, couleurs: {revenu: 'or'}},
  {debut: 124, couleurs: {comptoir: 'vert'}},
  {debut: 139, couleurs: {video: 'or'}},
  {debut: 142, couleurs: {fissure: 'rouge', cent: 'bleu', metres: 'bleu'}},
];

const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
const K = [0, coupe(7), coupe(21), coupe(33), coupe(48), coupe(56), coupe(75), coupe(87), coupe(106), coupe(124), coupe(139)];
const FIN_VOIX = 54.05;
const FIN_SCENE = 54.35;
export const DUREE_F08 = FIN_SCENE + 1.2;

/** Fissure qui se dessine sur un écran (boîte l x h centrée en x, y). */
const Fissure: React.FC<{x: number; y: number; l: number; h: number; a: number}> = ({x, y, l, h, a}) => {
  const t = useT();
  const p = prog(t, a, 0.35, Easing.out(Easing.cubic));
  if (p <= 0) return null;
  const traits = [
    'M 52 40 L 40 26 L 34 8',
    'M 52 40 L 66 30 L 72 12',
    'M 52 40 L 70 52 L 74 70 L 70 92',
    'M 52 40 L 36 56 L 32 80',
    'M 52 40 L 50 62 L 56 84',
  ];
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', left: x - l / 2, top: y - h / 2, width: l, height: h, overflow: 'visible', filter: halo(C.blanc, 0.6)}}>
      {traits.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={C.blanc} strokeWidth={3} strokeLinejoin="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      ))}
    </svg>
  );
};

/* ---------- Scènes ---------- */

// « Chaque jour, des milliers de téléphones tombent. »
const S1: React.FC = () => {
  const t = useT();
  const chutes = [
    {x: 220, a: w(2), r: -30},
    {x: 420, a: w(3), r: 40},
    {x: 640, a: w(4) + 0.1, r: -50},
    {x: 860, a: w(5), r: 25},
    {x: 330, a: w(6), r: 60},
    {x: 760, a: w(6) + 0.2, r: -35},
  ];
  return (
    <Plan debut={K[0]} fin={K[1]}>
      {chutes.map((c, i) => {
        if (t < c.a) return null;
        const p = interpolate(t, [c.a, c.a + 0.6], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
        const y = interpolate(p, [0, 1], [700, SOL_Y - 40]);
        return (
          <Flottant key={i} x={c.x} y={y} largeur={70} hauteur={120} opacity={prog(t, c.a, 0.15)} style={{transform: `rotate(${c.r * p}deg)`}}>
            <IconeNeon nom="telephone" couleur="bleu" epaisseur={4} remplissage={0.12} />
          </Flottant>
        );
      })}
    </Plan>
  );
};

// « Et chaque écran cassé, c'est quelqu'un qui est prêt à payer tout de suite. »
const S2: React.FC = () => {
  const t = useT();
  const choc = t > w(10) ? Math.sin((t - w(10)) * 70) * 6 * Math.max(0, 1 - (t - w(10)) * 4) : 0;
  return (
    <Plan debut={K[1]} fin={K[2]}>
      <Flottant x={380} y={1150} largeur={220} hauteur={400} style={{transform: `translateX(${choc}px)`}}>
        <Apparait a={K[1] + 0.1}>
          <IconeNeon nom="telephone" couleur="bleu" epaisseur={6} remplissage={0.14} />
        </Apparait>
      </Flottant>
      <Fissure x={380} y={1150} l={170} h={340} a={w(10)} />
      <Perso x={820} echelle={0.8} gris a={w(12)} />
      <ObjetAir x={820} y={870} l={90} h={90} a={w(17)} nom="piece" couleur="or" epaisseur={3} />
      <ObjetAir x={700} y={940} l={90} h={90} a={w(19)} nom="horloge" epaisseur={4} remplissage={0.05} aiguille={0} />
    </Plan>
  );
};

// « Apprendre à changer un écran prend une semaine avec des tutoriels gratuits. »
const S3: React.FC = () => {
  const t = useT();
  const jours = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  return (
    <Plan debut={K[2]} fin={K[3]}>
      <Perso x={180} echelle={0.75} cles={[[0, 'debout'], [w(23), 'reflechit']]} />
      {/* la semaine d'apprentissage */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: prog(t, w(26), 0.4)}}>
        <path d="M 380 1080 H 980" stroke="#AEB6C0" strokeWidth={3} opacity={0.5} />
      </svg>
      {jours.map((j, i) => {
        const x = 380 + i * 100;
        const on = prog(t, w(27) + i * 0.15, 0.25);
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: x - 18, top: 1062, width: 36, height: 36, borderRadius: 18, border: `4px solid ${on > 0.5 ? C.bleu : '#AEB6C0'}`, background: on > 0.5 ? `${C.bleu}88` : 'transparent', boxShadow: on > 0.5 ? `0 0 14px ${C.bleu}` : 'none', opacity: prog(t, w(26), 0.4)}} />
            <Etiquette x={x} y={1160} texte={j} taille={28} a={w(26)} style={{color: '#AEB6C0'}} />
          </React.Fragment>
        );
      })}
      <ObjetAir x={680} y={1330} l={220} h={180} a={w(31)} nom="video" epaisseur={4} remplissage={0.06} />
      <Etiquette x={880} y={1350} texte="0 €" couleur="vert" taille={50} a={w(32)} />
    </Plan>
  );
};

// « Le kit d'outils coûte trente euros. Un écran de remplacement s'achète vingt à quarante euros. »
const S4: React.FC = () => (
  <Plan debut={K[3]} fin={K[4]}>
    <ObjetSol x={220} l={90} h={230} a={w(34)} nom="tournevis" epaisseur={5} remplissage={0.08} />
    <ObjetSol x={330} l={70} h={180} a={w(35)} nom="tournevis" epaisseur={4} remplissage={0.08} />
    <Etiquette x={280} y={1180} texte="30 €" couleur="or" taille={52} a={w(37)} />
    <ObjetSol x={760} l={150} h={280} a={w(40)} nom="telephone" epaisseur={5} remplissage={0.06} />
    <Etiquette x={760} y={1120} texte="20-40 €" couleur="or" taille={48} a={w(44)} />
  </Plan>
);

// « La réparation se facture soixante à cent vingt. »
const S5: React.FC = () => (
  <Plan debut={K[4]} fin={K[5]}>
    <ObjetSol x={540} l={150} h={280} a={K[4] + 0.1} nom="telephone" couleur="bleu" epaisseur={5} remplissage={0.12} />
    <ObjetAir x={540} y={1120} l={110} h={80} a={w(49)} nom="coche" couleur="vert" epaisseur={7} />
    <Etiquette x={210} y={1340} texte="20-40 €" taille={40} a={K[4] + 0.2} style={{color: '#AEB6C0'}} />
    <Fleche x1={680} y1={1320} x2={760} y2={1320} a={w(51)} d={0.35} />
    <Etiquette x={900} y={1340} texte="60-120 €" couleur="or" taille={44} a={w(52)} />
  </Plan>
);

// « Le client ne te paie pas pour l'écran. Il te paie pour ne pas rester trois jours sans téléphone. »
const S6: React.FC = () => {
  const t = useT();
  const bascule = w(64) - 0.1;
  return (
    <Plan debut={K[5]} fin={K[6]}>
      <Perso x={230} gris cles={[[0, 'debout'], [w(59), 'presenteDroite']]} />
      <div style={{position: 'absolute', inset: 0, opacity: sortie(t, bascule)}}>
        <ObjetAir x={640} y={1200} l={140} h={250} a={w(61)} nom="telephone" couleur="#AEB6C0" epaisseur={4} remplissage={0.04} intensite={0.4} />
        <Flottant x={640} y={1200} largeur={220} hauteur={220}>
          <IconeNeon nom="croix" couleur="rouge" epaisseur={6} trace={prog(t, w(63), 0.45)} />
        </Flottant>
      </div>
      <ObjetAir x={620} y={1180} l={250} h={240} a={w(70)} nom="calendrier" epaisseur={5} remplissage={0.05} />
      {[0, 1, 2].map((i) => (
        <Flottant key={i} x={560 + i * 60} y={1350} largeur={30} hauteur={30}>
          <div style={{width: '100%', height: '100%', borderRadius: 15, background: C.bleu, boxShadow: `0 0 14px ${C.bleu}`, opacity: prog(t, w(71) + i * 0.15, 0.3)}} />
        </Flottant>
      ))}
      <ObjetAir x={880} y={1150} l={90} h={160} a={w(74)} nom="telephone" couleur="#AEB6C0" epaisseur={4} remplissage={0.03} intensite={0.4} />
      <Flottant x={880} y={1150} largeur={150} hauteur={150}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={5} trace={prog(t, w(74) + 0.2, 0.45)} />
      </Flottant>
    </Plan>
  );
};

// « Trois réparations par jour, c'est plus de cent euros de marge quotidienne, »
const S7: React.FC = () => (
  <Plan debut={K[6]} fin={K[7]}>
    {[0, 1, 2].map((i) => (
      <React.Fragment key={i}>
        <ObjetSol x={260 + i * 280} l={130} h={240} a={w(75) + i * 0.25} nom="telephone" couleur="bleu" epaisseur={5} remplissage={0.12} />
        <ObjetAir x={260 + i * 280} y={1170} l={90} h={70} a={w(76) + i * 0.25} nom="coche" couleur="vert" epaisseur={7} />
      </React.Fragment>
    ))}
    <Etiquette x={540} y={960} texte="+100 € / JOUR" couleur="vert" taille={50} a={w(82)} style={{letterSpacing: '0.06em'}} />
  </Plan>
);

// « sans boutique : tu travailles depuis ta table, et tu te fais connaître sur les réseaux de ton quartier. »
const S8: React.FC = () => {
  const t = useT();
  const bascule = w(97) - 0.2;
  return (
    <Plan debut={K[7]} fin={K[8]}>
      <Perso x={230} echelle={0.85} cles={[[0, 'debout'], [w(90), 'assis']]} a={K[7] + 0.1} />
      <SurSol x={410} largeur={260} hauteur={170}>
        <Apparait a={w(93)}>
          <IconeNeon nom="table" epaisseur={4} remplissage={0.05} />
        </Apparait>
      </SurSol>
      <ObjetAir x={410} y={1290} l={50} h={80} a={w(93) + 0.2} nom="telephone" couleur="bleu" epaisseur={3} remplissage={0.12} />
      <div style={{position: 'absolute', inset: 0, opacity: sortie(t, bascule)}}>
        <ObjetAir x={790} y={1200} l={240} h={210} a={w(87)} nom="maison" couleur="#AEB6C0" epaisseur={4} remplissage={0.03} intensite={0.4} />
        <Flottant x={790} y={1200} largeur={250} hauteur={250}>
          <IconeNeon nom="croix" couleur="rouge" epaisseur={6} trace={prog(t, w(88), 0.45)} />
        </Flottant>
      </div>
      <ObjetAir x={790} y={1180} l={260} h={240} a={w(101)} nom="reseau" couleur="bleu" epaisseur={4} remplissage={0.15} />
    </Plan>
  );
};

// « Ensuite viennent les batteries, les connecteurs de charge, les vitres arrière. Chaque panne est une ligne de revenu. »
const S9: React.FC = () => {
  const t = useT();
  const lignes: Array<{nom: NomIcone; label: string; a: number}> = [
    {nom: 'telephone', label: 'ÉCRAN', a: K[8] + 0.15},
    {nom: 'batterie', label: 'BATTERIE', a: w(109)},
    {nom: 'eclair', label: 'CHARGE', a: w(113)},
    {nom: 'telephone', label: 'VITRE', a: w(115)},
  ];
  return (
    <Plan debut={K[8]} fin={K[9]}>
      {lignes.map((l, i) => {
        const y = 860 + i * 150;
        const p = prog(t, w(119) + i * 0.25, 0.7);
        return (
          <React.Fragment key={i}>
            <ObjetAir x={150} y={y} l={l.nom === 'telephone' ? 50 : 90} h={90} a={l.a} nom={l.nom} epaisseur={4} remplissage={0.08} />
            <Etiquette x={340} y={y + 18} texte={l.label} taille={34} a={l.a + 0.1} style={{textAlign: 'left', left: 230, width: 300}} />
            <div style={{position: 'absolute', left: 560, top: y - 12, width: 380 * p, height: 24, borderRadius: 12, background: `${C.or}66`, border: `3px solid ${C.or}`, filter: halo(C.or, 0.6), opacity: p > 0 ? 1 : 0}} />
            <Etiquette x={990} y={y + 18} texte="+ €" couleur="or" taille={30} a={w(119) + i * 0.25 + 0.6} />
          </React.Fragment>
        );
      })}
    </Plan>
  );
};

// « Puis tu formes quelqu'un, tu ouvres un comptoir, et tu ne tiens plus le tournevis. »
const S10: React.FC = () => {
  return (
    <Plan debut={K[9]} fin={K[10]}>
      <Perso x={200} echelle={0.8} cles={[[0, 'pointeDroite'], [w(135), 'brasOuverts']]} />
      <ObjetAir x={330} y={1200} l={50} h={130} a={K[9] + 0.1} nom="tournevis" epaisseur={4} remplissage={0.08} disparait={w(136)} />
      <Perso x={470} echelle={0.65} gris a={w(126)} />
      <ObjetSol x={790} l={300} h={250} a={w(130)} nom="maison" couleur="vert" epaisseur={5} remplissage={0.08} />
      <ObjetAir x={790} y={1120} l={50} h={90} a={w(131)} nom="telephone" couleur="bleu" epaisseur={3} remplissage={0.12} />
      <ObjetAir x={560} y={1150} l={50} h={130} a={w(136)} nom="tournevis" couleur="#AEB6C0" epaisseur={4} remplissage={0.05} intensite={0.4} />
    </Plan>
  );
};

// « Enregistre cette vidéo. Il y a un téléphone fissuré dans la poche de quelqu'un à moins de cent mètres de toi. »
const S11: React.FC = () => {
  const t = useT();
  const fin = w(142) - 0.2;
  return (
    <Plan debut={K[10]} fin={FIN_SCENE}>
      <Flottant x={540} y={1150} largeur={180} hauteur={260} opacity={sortie(t, fin)}>
        <Apparait a={w(139)}>
          <IconeNeon nom="telephone" epaisseur={5} remplissage={0.06} />
        </Apparait>
      </Flottant>
      <Flottant x={540} y={1150} largeur={60} hauteur={70} opacity={sortie(t, fin)}>
        <Apparait a={w(139) + 0.1}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
            <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
          </svg>
        </Apparait>
      </Flottant>
      <Flottant x={602} y={1040} largeur={56} hauteur={84} opacity={sortie(t, fin)}>
        <Apparait a={w(141)}>
          <IconeNeon nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
        </Apparait>
      </Flottant>
      <Perso x={200} echelle={0.8} cles={[[0, 'debout'], [w(158), 'pointeDroite']]} a={w(142)} />
      <Perso x={860} echelle={0.8} gris a={w(148)} />
      <ObjetAir x={940} y={1260} l={50} h={90} a={w(146)} nom="telephone" couleur="bleu" epaisseur={3} remplissage={0.12} />
      <Fissure x={940} y={1260} l={38} h={78} a={w(147)} />
      <Fleche x1={360} y1={1420} x2={700} y2={1420} a={w(154)} d={0.5} couleur="bleu" />
      <Fleche x1={700} y1={1420} x2={360} y2={1420} a={w(154) + 0.1} d={0.5} couleur="bleu" />
      <Etiquette x={530} y={1390} texte="< 100 M" couleur="bleu" taille={40} a={w(156)} />
    </Plan>
  );
};

const EFFETS: Array<[number, string]> = [
  [w(6), 'clic-doux'],
  [w(10), 'clic-doux'],
  [w(17), 'piece'],
  [w(31), 'pop-leger'],
  [w(37), 'piece'],
  [w(44), 'piece'],
  [w(52), 'piece'],
  [w(63), 'clic-doux'],
  [w(76), 'pop-leger'],
  [w(82), 'piece'],
  [w(88), 'clic-doux'],
  [w(101), 'pop-leger'],
  [w(119), 'piece'],
  [w(130), 'pop-leger'],
  [w(141), 'clic-doux'],
  [w(147), 'clic-doux'],
];

export const Finance08: React.FC = () => (
  <>
    <CadreVideo
      scenes={
        <>
          <S1 />
          <S2 />
          <S3 />
          <S4 />
          <S5 />
          <S6 />
          <S7 />
          <S8 />
          <S9 />
          <S10 />
          <S11 />
        </>
      }
      texte={<TexteMotAMot mots={MOTS} phrases={PHRASES} fin={FIN_SCENE} />}
      dessus={<FonduNoir coupes={K.slice(1)} finNoir={FIN_SCENE} />}
    />
    <BandeSon voix="voix/finance-08.mp3" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
