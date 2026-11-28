import React from 'react';
import {interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-11-mots.json';
import {IconeNeon} from '../composants/IconeNeon';
import {Flottant} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Etiquette, prog, sortie, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {BandeSon} from '../composants/Sons';
import {Fleche} from '../composants/Fleche';
import {ObjetAir, ObjetSol, Perso} from '../composants/raccourcis';
import {C, halo} from '../style';

// Script 11 — Le fonds d'urgence
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {catastrophe: 'rouge', chiffre: 'vert'}},
  {debut: 14, couleurs: {fonds: 'vert', durgence: 'vert'}},
  {debut: 17, couleurs: {trois: 'bleu', mois: 'bleu', jamais: 'rouge'}},
  {debut: 34},
  {debut: 44, couleurs: {fonds: 'vert', mauvais: 'vert', mois: 'vert'}},
  {debut: 51, couleurs: {vingt: 'rouge', pour: 'rouge', cent: 'rouge'}},
  {debut: 65, couleurs: {promo: 'rose', baskets: 'rose'}},
  {debut: 74, couleurs: {trois: 'or', '84': 'or'}},
  {debut: 85},
  {debut: 89, couleurs: {cinq: 'vert', cents: 'vert'}},
  {debut: 93, couleurs: {mille: 'vert'}},
  {debut: 95, couleurs: {rien: 'attenue'}},
  {debut: 101, couleurs: {rentable: 'vert'}},
  {debut: 111, couleurs: {perdre: 'rouge'}},
  {debut: 115, couleurs: {risques: 'bleu', protege: 'or'}},
  {debut: 132, couleurs: {video: 'or'}},
  {debut: 135, couleurs: {aujourdhui: 'vert', vingt: 'or', euros: 'or'}},
];

const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
const K = [0, coupe(14), coupe(34), coupe(44), coupe(65), coupe(74), coupe(95), coupe(115), coupe(132)];
const FIN_VOIX = 53.33;
const FIN_SCENE = 53.6;
export const DUREE_F11 = FIN_SCENE + 1.2;

const Croix: React.FC<{x: number; y: number; taille: number; a: number}> = ({x, y, taille, a}) => {
  const t = useT();
  return (
    <Flottant x={x} y={y} largeur={taille} hauteur={taille}>
      <IconeNeon nom="croix" couleur="rouge" epaisseur={6} trace={prog(t, a, 0.45)} />
    </Flottant>
  );
};

/* ---------- Scènes ---------- */

// « La différence entre un problème et une catastrophe, c'est un chiffre sur un compte. »
const S1: React.FC = () => {
  const t = useT();
  const bascule = w(10) - 0.2;
  return (
    <Plan debut={K[0]} fin={K[1]}>
      <Perso x={220} cles={[[0, 'debout'], [w(3), 'presenteDroite']]} />
      <div style={{position: 'absolute', inset: 0, opacity: sortie(t, bascule)}}>
        <ObjetAir x={520} y={1300} l={130} h={120} a={w(4)} nom="alerte" epaisseur={5} remplissage={0.06} />
        <ObjetAir x={820} y={1220} l={260} h={240} a={w(7)} nom="alerte" couleur="rouge" epaisseur={6} remplissage={0.1} />
      </div>
      <ObjetAir x={680} y={1250} l={320} h={210} a={w(10)} nom="carteBancaire" couleur="vert" epaisseur={5} remplissage={0.1} />
      <Etiquette x={680} y={1090} texte="3 000 €" couleur="vert" taille={52} a={w(10) + 0.2} />
    </Plan>
  );
};

// « Le fonds d'urgence. Trois mois de dépenses, mis de côté, sur un compte séparé, et jamais touché sauf urgence réelle. »
const S2: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[1]} fin={K[2]}>
      {[0, 1, 2].map((i) => (
        <ObjetAir key={i} x={330 + i * 210} y={880} l={150} h={140} a={w(17) + i * 0.15} nom="calendrier" couleur="bleu" epaisseur={4} remplissage={0.05} />
      ))}
      <ObjetAir x={250} y={1300} l={260} h={170} a={w(24)} nom="carteBancaire" couleur="#AEB6C0" epaisseur={4} remplissage={0.03} intensite={0.4} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: prog(t, w(27), 0.4)}}>
        <path d="M 470 1130 V 1460" stroke="#AEB6C0" strokeWidth={3} strokeDasharray="10 12" opacity={0.6} />
      </svg>
      <ObjetAir x={720} y={1300} l={300} h={200} a={w(15)} nom="carteBancaire" couleur="vert" epaisseur={5} remplissage={0.1} />
      <Fleche x1={540} y1={960} x2={680} y2={1170} a={w(21)} d={0.5} couleur="vert" />
      <ObjetAir x={880} y={1160} l={90} h={100} a={w(29)} nom="cadenas" epaisseur={5} remplissage={0.1} />
      <ObjetAir x={950} y={1420} l={80} h={74} a={w(32)} nom="alerte" couleur="rouge" epaisseur={4} remplissage={0.1} />
    </Plan>
  );
};

// « Une panne de voiture, un licenciement, une facture d'hôpital : »
const S3: React.FC = () => (
  <Plan debut={K[2]} fin={K[3]}>
    <ObjetSol x={200} l={260} h={150} a={w(35)} nom="voiture" epaisseur={5} remplissage={0.06} />
    <ObjetAir x={270} y={1260} l={70} h={64} a={w(37)} nom="alerte" couleur="rouge" epaisseur={4} remplissage={0.1} />
    <ObjetSol x={540} l={170} h={220} a={w(39)} nom="contrat" epaisseur={5} remplissage={0.06} />
    <Croix x={540} y={1388} taille={190} a={w(39) + 0.3} />
    <ObjetSol x={860} l={190} h={190} a={w(41)} nom="hopital" epaisseur={5} remplissage={0.06} />
  </Plan>
);

// « avec le fonds, c'est un mauvais mois. Sans, c'est un crédit à vingt pour cent, et trois ans à le rembourser. »
const S4: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[3]} fin={K[4]}>
      {/* avec le fonds */}
      <Etiquette x={270} y={820} texte="AVEC" couleur="vert" taille={42} a={w(44)} style={{letterSpacing: '0.2em'}} />
      <ObjetAir x={270} y={1050} l={200} h={220} a={w(45)} nom="bouclier" couleur="vert" epaisseur={5} remplissage={0.1} />
      <ObjetAir x={270} y={1330} l={150} h={140} a={w(49)} nom="calendrier" epaisseur={4} remplissage={0.05} />
      <Etiquette x={270} y={1470} texte="1 MOIS" taille={34} a={w(50)} />
      {/* sans le fonds */}
      <Etiquette x={810} y={820} texte="SANS" couleur="rouge" taille={42} a={w(51)} style={{letterSpacing: '0.2em'}} />
      <ObjetAir x={810} y={1010} l={220} h={145} a={w(54)} nom="carteBancaire" couleur="rouge" epaisseur={5} remplissage={0.08} />
      <Etiquette x={810} y={1150} texte="20 %" couleur="rouge" taille={46} a={w(56)} />
      {Array.from({length: 36}).map((_, i) => {
        const c = i % 6;
        const l = Math.floor(i / 6);
        const on = prog(t, w(60) + i * 0.035, 0.2);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 690 + c * 42,
              top: 1210 + l * 42,
              width: 32,
              height: 32,
              borderRadius: 6,
              border: `3px solid ${C.rouge}`,
              background: `${C.rouge}22`,
              opacity: on * 0.85,
            }}
          />
        );
      })}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: prog(t, w(51) - 0.2, 0.4)}}>
        <path d="M 540 800 V 1480" stroke="#AEB6C0" strokeWidth={2} opacity={0.35} />
      </svg>
    </Plan>
  );
};

// « L'urgence, ce n'est pas la promo sur les baskets. »
const S5: React.FC = () => (
  <Plan debut={K[4]} fin={K[5]}>
    <ObjetSol x={480} l={330} h={210} a={w(65)} nom="basket" couleur="rose" epaisseur={5} remplissage={0.1} />
    <ObjetAir x={800} y={1060} l={220} h={120} a={w(70)} nom="etiquette" couleur="rose" epaisseur={5} remplissage={0.1} />
    <Etiquette x={770} y={1080} texte="-50%" couleur="rose" taille={36} a={w(70) + 0.1} />
    <Croix x={560} y={1220} taille={380} a={w(73)} />
  </Plan>
);

// « Si tu dépenses mille euros par mois, l'objectif est trois mille. Ça fait peur ? Commence à cinq cents. Puis mille. »
const S6: React.FC = () => {
  const t = useT();
  const X0 = 120;
  const L = 840;
  const xVal = (v: number) => X0 + (L * v) / 3000;
  const rempli = interpolate(t, [w(91), w(92) + 0.4, w(94), w(94) + 0.5], [0, 500, 500, 1000], clamp);
  const paliers = [
    {v: 500, a: w(91)},
    {v: 1000, a: w(94)},
    {v: 3000, a: w(83)},
  ];
  return (
    <Plan debut={K[5]} fin={K[6]}>
      <Etiquette x={540} y={830} texte="1 000 € / MOIS" taille={40} a={w(77)} style={{color: '#AEB6C0'}} />
      <div style={{position: 'absolute', left: X0, top: 1100, width: L, height: 56, borderRadius: 28, border: `4px solid ${C.blanc}`, filter: halo(C.blanc, 0.5), opacity: prog(t, w(81), 0.4)}} />
      <div style={{position: 'absolute', left: X0 + 8, top: 1108, width: Math.max(0, (L * rempli) / 3000 - 16), height: 40, borderRadius: 20, background: C.vert, filter: halo(C.vert), opacity: rempli > 0 ? 1 : 0}} />
      {paliers.map((p, i) => (
        <React.Fragment key={i}>
          <div style={{position: 'absolute', left: xVal(p.v) - 2, top: 1080, width: 4, height: 96, background: p.v === 3000 ? C.or : '#AEB6C0', opacity: prog(t, p.a, 0.3)}} />
          <Etiquette x={Math.min(xVal(p.v), 900)} y={p.v === 500 ? 1062 : 1240} texte={`${p.v.toLocaleString('fr-FR').replace(/ | /g, ' ')} €`} couleur={p.v === 3000 ? 'or' : rempli >= p.v ? 'vert' : 'blanc'} taille={34} a={p.a} />
        </React.Fragment>
      ))}
      <Etiquette x={860} y={1040} texte="OBJECTIF" couleur="or" taille={30} a={w(83)} />
    </Plan>
  );
};

// « Le fonds d'urgence ne rapporte rien. Et c'est justement pour ça qu'il est si rentable : il t'évite de perdre. »
const S7: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[6]} fin={K[7]}>
      <ObjetAir x={540} y={1250} l={260} h={290} a={K[6] + 0.1} nom="bouclier" couleur="vert" epaisseur={6} remplissage={0.1} />
      <Etiquette x={250} y={1280} texte="0 %" taille={52} a={w(99)} style={{color: '#AEB6C0'}} />
      {/* les pertes tombent et rebondissent sur le bouclier */}
      {[0, 1, 2].map((i) => {
        const a = w(112) + i * 0.3;
        const p = prog(t, a, 0.7);
        if (p <= 0 || p >= 1) return null;
        const y = p < 0.5 ? interpolate(p, [0, 0.5], [820, 1060]) : interpolate(p, [0.5, 1], [1060, 960]);
        const x = 460 + i * 80 + (p > 0.5 ? (i - 1) * 160 * (p - 0.5) : 0);
        return (
          <Flottant key={i} x={x} y={y} largeur={34} hauteur={90} opacity={p < 0.5 ? 1 : 2 - p * 2}>
            <IconeNeon nom="flecheBas" couleur="rouge" epaisseur={5} />
          </Flottant>
        );
      })}
      <ObjetAir x={820} y={1080} l={100} h={75} a={w(109)} nom="coche" couleur="vert" epaisseur={7} />
    </Plan>
  );
};

// « C'est aussi lui qui te permet de prendre des risques ailleurs, parce que ton toit est protégé. »
const S8: React.FC = () => (
  <Plan debut={K[7]} fin={K[8]}>
    <ObjetSol x={280} l={280} h={240} a={w(127)} nom="maison" epaisseur={5} remplissage={0.06} />
    <ObjetAir x={280} y={1080} l={150} h={165} a={w(129)} nom="bouclier" couleur="or" epaisseur={5} remplissage={0.12} />
    <Perso x={740} echelle={0.8} cles={[[0, 'debout'], [w(122), 'brasLeves']]} a={w(117)} />
    <ObjetAir x={920} y={950} l={180} h={160} a={w(124)} nom="graphique" couleur="#C9D1DB" couleurCourbe="bleu" courbe="monte" epaisseur={4} intensite={0.6} />
  </Plan>
);

// « Enregistre cette vidéo. Le premier virement vers ton fonds, c'est aujourd'hui, même si c'est vingt euros. »
const S9: React.FC = () => {
  const t = useT();
  const fin = w(135) - 0.2;
  return (
    <Plan debut={K[8]} fin={FIN_SCENE}>
      <Flottant x={540} y={1150} largeur={180} hauteur={260} opacity={sortie(t, fin)}>
        <Apparait a={w(132)}>
          <IconeNeon nom="telephone" epaisseur={5} remplissage={0.06} />
        </Apparait>
      </Flottant>
      <Flottant x={540} y={1150} largeur={60} hauteur={70} opacity={sortie(t, fin)}>
        <Apparait a={w(132) + 0.1}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
            <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
          </svg>
        </Apparait>
      </Flottant>
      <Flottant x={602} y={1040} largeur={56} hauteur={84} opacity={sortie(t, fin)}>
        <Apparait a={w(134)}>
          <IconeNeon nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
        </Apparait>
      </Flottant>
      <ObjetAir x={250} y={1200} l={200} h={110} a={w(137)} nom="billet" couleur="or" epaisseur={5} remplissage={0.12} />
      <Etiquette x={250} y={1340} texte="20 €" couleur="or" taille={46} a={w(146)} />
      <Fleche x1={380} y1={1200} x2={600} y2={1200} a={w(138)} d={0.5} couleur="vert" />
      <ObjetAir x={780} y={1200} l={260} h={290} a={w(140)} nom="bouclier" couleur="or" epaisseur={6} remplissage={0.12} />
    </Plan>
  );
};

const EFFETS: Array<[number, string]> = [
  [w(7), 'clic-doux'],
  [w(10), 'pop-leger'],
  [w(15), 'pop-leger'],
  [w(29), 'clic-doux'],
  [w(39), 'clic-doux'],
  [w(45), 'pop-leger'],
  [w(56), 'clic-doux'],
  [w(73), 'clic-doux'],
  [w(91), 'piece'],
  [w(94), 'piece'],
  [w(112), 'clic-doux'],
  [w(129), 'pop-leger'],
  [w(134), 'clic-doux'],
  [w(140), 'pop-leger'],
];

export const Finance11: React.FC = () => (
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
        </>
      }
      texte={<TexteMotAMot mots={MOTS} phrases={PHRASES} fin={FIN_SCENE} />}
      dessus={<FonduNoir coupes={K.slice(1)} finNoir={FIN_SCENE} />}
    />
    <BandeSon voix="voix/finance-11.mp3" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
