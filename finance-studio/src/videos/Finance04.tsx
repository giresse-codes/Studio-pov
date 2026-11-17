import React from 'react';
import {interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-04-mots.json';
import {IconeNeon} from '../composants/IconeNeon';
import {Flottant} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Etiquette, prog, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {BandeSon} from '../composants/Sons';
import {Fleche} from '../composants/Fleche';
import {ObjetAir, ObjetSol, Perso} from '../composants/raccourcis';
import {C, halo} from '../style';

// Script 4 — La règle des trois comptes
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {argent: 'or'}},
  {debut: 12, couleurs: {sevapore: 'rouge'}},
  {debut: 14, couleurs: {trois: 'or', comptes: 'or'}},
  {debut: 24, couleurs: {salaire: 'or'}},
  {debut: 38, couleurs: {cinquante: 'or', pour: 'or', cent: 'or'}},
  {debut: 43, couleurs: {plaisir: 'rose'}},
  {debut: 48, couleurs: {trente: 'or', pour: 'or', cent: 'or', culpabilite: 'vert'}},
  {debut: 57, couleurs: {plaisir: 'rose'}},
  {debut: 64, couleurs: {tient: 'vert'}},
  {debut: 71, couleurs: {touches: 'rouge'}},
  {debut: 81, couleurs: {vingt: 'or', pour: 'or', cent: 'or', automatique: 'vert'}},
  {debut: 96, couleurs: {futur: 'bleu', toi: 'bleu'}},
  {debut: 105, couleurs: {actif: 'vert'}},
  {debut: 114, couleurs: {'118': 'or', '119': 'or', '121': 'vert', '122': 'vert', '123': 'vert'}},
  {debut: 126, couleurs: {deux: 'vert', mille: 'vert', quatre: 'vert', cents: 'vert'}},
  {debut: 133, couleurs: {lancer: 'vert'}},
  {debut: 143, couleurs: {video: 'or', gratuits: 'vert'}},
  {debut: 153, couleurs: {automatique: 'vert', subir: 'attenue'}},
];

const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
const K = [0, coupe(14), coupe(24, 0.2), coupe(43), coupe(57), coupe(71), coupe(96), coupe(105), coupe(114), coupe(133), coupe(143), coupe(153)];
const FIN_VOIX = 53.08;
const FIN_SCENE = 53.4;
export const DUREE_F04 = FIN_SCENE + 1.2;

/** Une carte bancaire néon avec son pourcentage au centre. */
const Carte: React.FC<{x: number; y: number; a: number; couleur?: string; texte?: string; aTexte?: number; l?: number; disparait?: number}> = ({
  x,
  y,
  a,
  couleur = 'or',
  texte,
  aTexte,
  l = 250,
  disparait,
}) => (
  <>
    <ObjetAir x={x} y={y} l={l} h={l * 0.66} a={a} nom="carteBancaire" couleur={couleur} epaisseur={5} remplissage={0.1} disparait={disparait} />
    {texte && (
      <Etiquette x={x} y={y - l * 0.33 - 10} texte={texte} couleur={couleur} taille={Math.round(l * 0.17)} a={aTexte ?? a + 0.2} style={{letterSpacing: '0.04em'}} />
    )}
  </>
);

/* ---------- Scènes ---------- */

// « Si ton argent dort sur un seul compte, il ne dort pas. Il s'évapore. »
const S1: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[0]} fin={K[1]}>
      <Perso x={220} cles={[[0, 'debout'], [w(5), 'pointeDroite']]} />
      <ObjetSol x={680} l={320} h={210} a={w(5)} nom="carteBancaire" epaisseur={5} remplissage={0.06} />
      {[0, 1, 2, 3].map((i) => {
        const x0 = 590 + i * 60;
        const p = prog(t, w(13) + i * 0.15, 1.1);
        return (
          <Flottant key={i} x={x0 + p * (i - 1.5) * 30} y={1180 - (i % 2) * 40 - p * 320} largeur={56} hauteur={56} opacity={prog(t, w(2) + i * 0.12, 0.3) * (1 - p)}>
            <IconeNeon nom="piece" couleur="or" epaisseur={3} />
          </Flottant>
        );
      })}
    </Plan>
  );
};

// « La méthode la plus simple du monde : trois comptes. »
const S2: React.FC = () => (
  <Plan debut={K[1]} fin={K[2]}>
    {[230, 540, 850].map((x, i) => (
      <Carte key={x} x={x} y={1180} a={w(20) + i * 0.2} texte={['50 %', '30 %', '20 %'][i]} aTexte={w(22) + i * 0.15} />
    ))}
  </Plan>
);

// « Le premier reçoit le salaire et paie le loyer, l'électricité, le transport, la nourriture. Cinquante pour cent, pas plus. »
const S3: React.FC = () => {
  const t = useT();
  const xs = [520, 670, 820, 970];
  const icones: Array<React.ComponentProps<typeof IconeNeon>['nom']> = ['maison', 'ampoule', 'voiture', 'couverts'];
  const debuts = [w(32), w(33), w(35), w(37)];
  return (
    <Plan debut={K[2]} fin={K[3]}>
      <Carte x={220} y={1180} a={K[2] + 0.1} texte="50 %" aTexte={w(38)} />
      <ObjetAir x={220} y={830} l={190} h={100} a={w(28)} nom="billet" couleur="or" epaisseur={5} remplissage={0.12} disparait={w(30)} />
      <Fleche x1={220} y1={890} x2={220} y2={1010} a={w(28) + 0.2} d={0.4} couleur="or" />
      <Fleche x1={360} y1={1200} x2={440} y2={1200} a={w(30)} d={0.4} />
      {xs.map((x, i) => (
        <ObjetSol key={x} x={x} l={120} h={i === 2 ? 80 : 120} a={debuts[i]} nom={icones[i]} epaisseur={4} remplissage={0.06} carre={i === 1 ? true : undefined} />
      ))}
      {/* pas plus : un plafond rouge */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: halo(C.rouge)}}>
        <path d={`M 450 1290 H 1040`} stroke={C.rouge} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(t, w(41), 0.45)} />
      </svg>
    </Plan>
  );
};

// « Le deuxième, c'est le plaisir. Trente pour cent : sorties, vêtements, cadeaux, sans culpabilité. »
const S4: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[3]} fin={K[4]}>
      <Carte x={220} y={1180} a={K[3] + 0.1} texte="30 %" aTexte={w(48)} />
      <ObjetSol x={520} l={120} h={160} a={w(52)} nom="verre" couleur="rose" epaisseur={5} remplissage={0.1} />
      <ObjetSol x={720} l={150} h={150} a={w(53)} nom="tshirt" couleur="rose" epaisseur={5} remplissage={0.1} />
      <ObjetSol x={920} l={140} h={150} a={w(54)} nom="cadeau" couleur="rose" epaisseur={5} remplissage={0.1} carre={false} />
      <Flottant x={720} y={1060} largeur={120} hauteur={90}>
        <IconeNeon nom="coche" couleur="vert" epaisseur={7} trace={prog(t, w(56), 0.45)} />
      </Flottant>
    </Plan>
  );
};

// « Oui, le plaisir est dans le plan. C'est pour ça que le plan tient. »
const S5: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[4]} fin={K[5]}>
      <Perso x={240} cles={[[0, 'debout'], [w(57), 'brasOuverts'], [w(64), 'presenteDroite']]} />
      <ObjetAir x={700} y={1180} l={230} h={290} a={w(62)} nom="contrat" epaisseur={4} remplissage={0.06} />
      <ObjetAir x={830} y={980} l={80} h={130} a={w(59)} nom="ballon" couleur="rose" epaisseur={4} remplissage={0.12} carre={false} />
      <Flottant x={700} y={1400} largeur={120} hauteur={90}>
        <IconeNeon nom="coche" couleur="vert" epaisseur={7} trace={prog(t, w(70), 0.45)} />
      </Flottant>
    </Plan>
  );
};

// « Le troisième, c'est le compte que tu ne touches pas. Vingt pour cent, virement automatique
//   le jour de la paie, avant même d'avoir vu l'argent. »
const S6: React.FC = () => (
  <Plan debut={K[5]} fin={K[6]}>
    <Carte x={540} y={1200} a={K[5] + 0.1} couleur="vert" texte="20 %" aTexte={w(81)} l={280} />
    <ObjetAir x={540} y={925} l={100} h={110} a={w(75)} nom="cadenas" epaisseur={5} remplissage={0.08} />
    <ObjetAir x={170} y={900} l={180} h={100} a={w(84)} nom="billet" couleur="or" epaisseur={5} remplissage={0.12} />
    <Fleche x1={180} y1={960} x2={390} y2={1150} a={w(85)} courbe={-20} couleur="vert" />
    <ObjetAir x={880} y={1180} l={170} h={160} a={w(87)} nom="calendrier" epaisseur={4} remplissage={0.05} />
  </Plan>
);

// « Ce compte-là, c'est ton futur toi qui parle : »
const S7: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[6]} fin={K[7]}>
      <Perso x={260} cles={[[0, 'debout']]} />
      <ObjetAir x={540} y={1300} l={160} h={106} a={w(97)} nom="carteBancaire" couleur="vert" epaisseur={4} remplissage={0.1} />
      <div style={{position: 'absolute', inset: 0, opacity: 0.45 * prog(t, w(100), 0.6), filter: halo(C.bleu, 0.6)}}>
        <Perso x={820} cles={[[0, 'debout'], [w(103), 'pointeGauche']]} />
      </div>
    </Plan>
  );
};

// « la machine, le stock, la formation, le premier actif. »
const S8: React.FC = () => (
  <Plan debut={K[7]} fin={K[8]}>
    <ObjetSol x={170} l={150} h={180} a={w(106)} nom="machineALaver" epaisseur={4} remplissage={0.06} />
    <ObjetSol x={400} l={170} h={170} a={w(108)} nom="carton" epaisseur={4} remplissage={0.06} carre />
    <ObjetSol x={640} l={190} h={150} a={w(110)} nom="livre" epaisseur={4} remplissage={0.06} />
    <ObjetSol x={890} l={190} h={170} a={w(112)} nom="maison" couleur="vert" epaisseur={5} remplissage={0.1} />
    <ObjetAir x={890} y={1180} l={36} h={90} a={w(113)} nom="flecheHaut" couleur="vert" epaisseur={5} />
  </Plan>
);

// « Sur un salaire de mille euros, c'est deux cents euros par mois. En un an, deux mille quatre cents. »
const S9: React.FC = () => {
  const t = useT();
  const xG = 90;
  const L = 900;
  const p = prog(t, w(116), 0.8);
  const segs = [
    {part: 0.5, c: C.blanc, a: w(116) + 0.3},
    {part: 0.3, c: C.rose, a: w(116) + 0.55},
    {part: 0.2, c: C.vert, a: w(116) + 0.8},
  ];
  let acc = 0;
  const mois = Math.max(1, Math.min(12, Math.floor(interpolate(t, [w(126), w(132)], [1, 12.99], clamp))));
  const montant = 200 * mois;
  const afficheCompteur = t >= w(126);
  return (
    <Plan debut={K[8]} fin={K[9]}>
      <Etiquette x={540} y={790} texte="1 000 €" couleur="or" taille={50} a={w(118)} />
      {/* barre du salaire qui se découpe 50 / 30 / 20 */}
      <div style={{position: 'absolute', left: xG, top: 850, width: L * p, height: 46, borderRadius: 10, border: `4px solid ${C.or}`, filter: halo(C.or, 0.6), opacity: p > 0 ? 1 : 0}} />
      {segs.map((s, i) => {
        const x = xG + L * acc + (i > 0 ? 8 : 0);
        acc += s.part;
        const o = prog(t, s.a, 0.4);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x + 8,
              top: 860,
              width: L * s.part - 24,
              height: 26,
              borderRadius: 6,
              background: `${s.c}55`,
              border: `2px solid ${s.c}`,
              opacity: o,
              transform: `translateY(${o * 70}px)`,
              filter: halo(s.c, 0.5),
            }}
          />
        );
      })}
      <Etiquette x={xG + L * 0.9} y={1060} texte="200 €" couleur="vert" taille={42} a={w(121)} />
      {/* compteur 200 € → 2 400 € sur 12 mois */}
      {afficheCompteur && (
        <>
          <ObjetAir x={300} y={1300} l={200} h={190} a={w(126)} nom="calendrier" epaisseur={4} remplissage={0.05} />
          <Etiquette x={300} y={1450} texte={`MOIS ${mois}`} taille={34} a={w(126)} />
          <Etiquette x={740} y={1330} texte={`${montant.toLocaleString('fr-FR').replace(/ | /g, ' ')} €`} couleur="vert" taille={64} a={w(126)} />
        </>
      )}
    </Plan>
  );
};

// « Assez pour lancer la plupart des business de cette chaîne. »
const S10: React.FC = () => {
  const t = useT();
  const items: Array<{nom: React.ComponentProps<typeof IconeNeon>['nom']; l: number; h: number}> = [
    {nom: 'machineALaver', l: 140, h: 170},
    {nom: 'congelateur', l: 200, h: 140},
    {nom: 'chaise', l: 120, h: 175},
    {nom: 'sachet', l: 110, h: 140},
  ];
  const xs = [170, 410, 650, 880];
  return (
    <Plan debut={K[9]} fin={K[10]}>
      <Etiquette x={540} y={960} texte="2 400 €" couleur="vert" taille={56} a={K[9] + 0.15} />
      {items.map((it, i) => {
        const a = w(135) + i * 0.3;
        const vert = prog(t, w(139) + i * 0.15, 0.4);
        return (
          <React.Fragment key={i}>
            <ObjetSol x={xs[i]} l={it.l} h={it.h} a={a} nom={it.nom} epaisseur={4} remplissage={0.06} couleur={vert > 0.5 ? 'vert' : 'blanc'} />
          </React.Fragment>
        );
      })}
    </Plan>
  );
};

// « Enregistre cette vidéo, ouvre tes deux comptes gratuits cette semaine. »
const S11: React.FC = () => (
  <Plan debut={K[10]} fin={K[11]}>
    <ObjetAir x={250} y={1150} l={180} h={260} a={w(143)} nom="telephone" epaisseur={5} remplissage={0.06} />
    <Flottant x={250} y={1150} largeur={60} hauteur={70}>
      <Apparait a={w(143) + 0.1}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
          <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
        </svg>
      </Apparait>
    </Flottant>
    <ObjetAir x={312} y={1040} l={56} h={84} a={w(145)} nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
    <Carte x={600} y={1180} a={w(148)} l={220} couleur="blanc" />
    <Carte x={870} y={1180} a={w(149)} l={220} couleur="blanc" />
    <Etiquette x={735} y={1390} texte="0 €" couleur="vert" taille={50} a={w(150)} />
  </Plan>
);

// « Le premier virement automatique, c'est le jour où tu arrêtes de subir ton argent. »
const S12: React.FC = () => (
  <Plan debut={K[11]} fin={FIN_SCENE}>
    <Perso x={240} cles={[[0, 'debout'], [w(162), 'brasLeves']]} />
    <ObjetAir x={560} y={950} l={180} h={100} a={w(154)} nom="billet" couleur="or" epaisseur={5} remplissage={0.12} />
    <Fleche x1={640} y1={1010} x2={790} y2={1140} a={w(155)} courbe={-30} couleur="vert" />
    <Carte x={850} y={1220} a={w(155) + 0.2} l={230} couleur="vert" texte="20 %" />
    <ObjetAir x={1000} y={1225} l={90} h={70} a={w(156)} nom="coche" couleur="vert" epaisseur={7} />
  </Plan>
);

const EFFETS: Array<[number, string]> = [
  [w(13), 'clic-doux'],
  [w(22), 'pop-leger'],
  [w(28), 'piece'],
  [w(41), 'clic-doux'],
  [w(52), 'pop-leger'],
  [w(53), 'pop-leger'],
  [w(54), 'pop-leger'],
  [w(70), 'pop-leger'],
  [w(75), 'clic-doux'],
  [w(85), 'piece'],
  [w(112), 'pop-leger'],
  [w(121), 'piece'],
  [w(132), 'piece'],
  [w(139), 'pop-leger'],
  [w(145), 'clic-doux'],
  [w(156), 'pop-leger'],
];

export const Finance04: React.FC = () => (
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
          <S12 />
        </>
      }
      texte={<TexteMotAMot mots={MOTS} phrases={PHRASES} fin={FIN_SCENE} />}
      dessus={<FonduNoir coupes={K.slice(1)} finNoir={FIN_SCENE} />}
    />
    <BandeSon voix="voix/finance-04.wav" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
