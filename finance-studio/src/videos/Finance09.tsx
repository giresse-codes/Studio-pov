import React from 'react';
import {interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-09-mots.json';
import {IconeNeon} from '../composants/IconeNeon';
import {Flottant} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Etiquette, PieceQuiTombe, prog, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {BandeSon} from '../composants/Sons';
import {ObjetAir, ObjetSol, Perso, Prix} from '../composants/raccourcis';
import {C, halo, SOL_Y} from '../style';

// Script 9 — Le piège du crédit conso
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {'3': 'or', '4': 'or'}},
  {debut: 10, couleurs: {trentesix: 'rouge', fois: 'rouge'}},
  {debut: 18, couleurs: {quinze: 'rouge', pour: 'rouge', cent: 'rouge'}},
  {debut: 30, couleurs: {mille: 'or', deux: 'or', cent: 'or', cinquante: 'or', euros: 'or'}},
  {debut: 41, couleurs: {deux: 'rouge', cent: 'rouge', cinquante: 'rouge', euros: 'rouge'}},
  {debut: 55, couleurs: {trois: 'bleu', ans: 'bleu'}},
  {debut: 61, couleurs: {trentecinq: 'rouge', '62': 'rouge'}},
  {debut: 74, couleurs: {diable: 'attenue'}},
  {debut: 80, couleurs: {rapporte: 'vert'}},
  {debut: 90},
  {debut: 98, couleurs: {perd: 'rouge', valeur: 'rouge'}},
  {debut: 117},
  {debut: 122, couleurs: {rien: 'attenue'}},
  {debut: 128, couleurs: {cash: 'vert', attends: 'bleu'}},
  {debut: 134, couleurs: {banque: 'rouge'}},
  {debut: 146, couleurs: {mille: 'vert', deux: 'vert', cent: 'vert', soixante: 'vert', euros: 'vert'}},
  {debut: 159, couleurs: {deuxieme: 'vert'}},
  {debut: 167, couleurs: {video: 'or', trentesix: 'rouge', fois: 'rouge'}},
];

const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
const K = [0, coupe(18), coupe(41), coupe(55), coupe(74), coupe(98), coupe(117), coupe(134), coupe(159), coupe(167)];
const FIN_VOIX = 48.84;
const FIN_SCENE = 49.1;
export const DUREE_F09 = FIN_SCENE + 1.2;

const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/ | /g, ' ');

/** Croix rouge qui se dessine. */
const Croix: React.FC<{x: number; y: number; taille: number; a: number}> = ({x, y, taille, a}) => {
  const t = useT();
  return (
    <Flottant x={x} y={y} largeur={taille} hauteur={taille}>
      <IconeNeon nom="croix" couleur="rouge" epaisseur={6} trace={prog(t, a, 0.45)} />
    </Flottant>
  );
};

/* ---------- Scènes ---------- */

// « Le téléphone à mille euros ne coûte pas mille euros. Pas quand tu le paies en trente-six fois. »
const S1: React.FC = () => (
  <Plan debut={K[0]} fin={K[1]}>
    <ObjetSol x={330} l={170} h={320} a={w(1)} nom="telephone" couleur="bleu" epaisseur={6} remplissage={0.14} />
    <Prix x={760} y={1080} texte="1 000 €" a={w(3)} taille={40} />
    <Etiquette x={740} y={1330} texte="× 36" couleur="rouge" taille={64} a={w(16)} />
  </Plan>
);

// « Un crédit à la consommation à quinze pour cent sur trois ans, et ton téléphone t'a coûté environ mille deux cent cinquante euros. »
const S2: React.FC = () => {
  const t = useT();
  const montant = interpolate(t, [w(35), w(40) + 0.2], [1000, 1250], clamp);
  const rouge = montant > 1001;
  return (
    <Plan debut={K[1]} fin={K[2]}>
      <ObjetSol x={250} l={150} h={280} a={K[1] + 0.1} nom="telephone" couleur="bleu" epaisseur={5} remplissage={0.12} />
      <ObjetAir x={250} y={1060} l={160} h={106} a={w(19)} nom="carteBancaire" epaisseur={4} remplissage={0.06} />
      <Etiquette x={530} y={1000} texte="15 %" couleur="rouge" taille={50} a={w(24)} />
      <Etiquette x={830} y={1000} texte="3 ANS" couleur="bleu" taille={50} a={w(28)} />
      <ObjetAir x={700} y={1280} l={420} h={230} a={w(32)} nom="etiquette" couleur={rouge ? 'rouge' : 'or'} epaisseur={5} remplissage={0.12} />
      <Etiquette x={640} y={1302} texte={`${fmt(montant)} €`} couleur={rouge ? 'rouge' : 'or'} taille={48} a={w(32)} style={{letterSpacing: '0.04em'}} />
    </Plan>
  );
};

// « Tu as payé deux cent cinquante euros pour le droit de l'avoir plus tôt. »
const S3: React.FC = () => (
  <Plan debut={K[2]} fin={K[3]}>
    <Perso x={250} cles={[[0, 'debout'], [w(43), 'mainsTete']]} />
    <Etiquette x={720} y={1080} texte="+250 €" couleur="rouge" taille={80} a={w(44)} />
    <ObjetAir x={720} y={1300} l={170} h={170} a={w(52)} nom="horloge" couleur="bleu" epaisseur={5} remplissage={0.05} aiguille={-60} />
  </Plan>
);

// « Et pendant trois ans, chaque mois, trente-cinq euros sortent avant même que tu aies décidé quoi que ce soit. »
const S4: React.FC = () => {
  const t = useT();
  const N = 36;
  const taille = 64;
  const pas = 82;
  const x0 = 540 - (6 * pas) / 2 + pas / 2;
  const y0 = 860;
  const debut = w(61);
  const fin = w(73) + 0.3;
  return (
    <Plan debut={K[3]} fin={K[4]}>
      <Etiquette x={540} y={800} texte="36 MOIS" couleur="bleu" taille={36} a={w(56)} />
      {Array.from({length: N}).map((_, i) => {
        const c = i % 6;
        const l = Math.floor(i / 6);
        const x = x0 + c * pas;
        const y = y0 + l * pas;
        const vu = prog(t, w(56) + i * 0.02, 0.3);
        const a = interpolate(i, [0, N - 1], [debut, fin]);
        const p = prog(t, a, 0.9);
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                left: x - taille / 2,
                top: y - taille / 2 + 60,
                width: taille,
                height: taille,
                borderRadius: 10,
                border: `3px solid ${p > 0 ? C.rouge : '#AEB6C0'}`,
                background: p > 0 ? `${C.rouge}22` : 'transparent',
                opacity: vu * (p > 0 ? 0.9 : 0.5),
                boxShadow: p > 0 ? `0 0 10px ${C.rouge}66` : 'none',
              }}
            />
            {p > 0 && p < 1 && (
              <Flottant x={x} y={y + 60 - p * 140} largeur={40} hauteur={40} opacity={1 - p}>
                <IconeNeon nom="piece" couleur="or" epaisseur={3} />
              </Flottant>
            )}
          </React.Fragment>
        );
      })}
      <Etiquette x={540} y={1460} texte="−35 € / MOIS" couleur="rouge" taille={40} a={w(61)} style={{letterSpacing: '0.06em'}} />
    </Plan>
  );
};

// « Le crédit n'est pas le diable. Il est utile pour acheter quelque chose qui rapporte : une machine, un stock, un outil de travail. »
const S5: React.FC = () => (
  <Plan debut={K[4]} fin={K[5]}>
    <ObjetAir x={540} y={880} l={220} h={145} a={w(75)} nom="carteBancaire" epaisseur={5} remplissage={0.06} />
    <Etiquette x={540} y={1020} texte="ACTIF" couleur="vert" taille={44} a={w(88)} style={{letterSpacing: '0.2em'}} />
    <ObjetSol x={230} l={150} h={180} a={w(91)} nom="machineALaver" couleur="vert" epaisseur={5} remplissage={0.08} />
    <ObjetSol x={540} l={170} h={170} a={w(93)} nom="carton" couleur="vert" epaisseur={5} remplissage={0.08} carre />
    <ObjetSol x={850} l={70} h={200} a={w(95)} nom="tournevis" couleur="vert" epaisseur={5} remplissage={0.08} />
    {[230, 540, 850].map((x, i) => (
      <ObjetAir key={x} x={x + 100} y={1230} l={30} h={80} a={[w(91), w(93), w(95)][i] + 0.3} nom="flecheHaut" couleur="vert" epaisseur={5} />
    ))}
  </Plan>
);

// « Le piège, c'est de l'utiliser pour quelque chose qui perd de la valeur dès que tu sors du magasin. »
const S6: React.FC = () => {
  const t = useT();
  const sortieMag = interpolate(t, [w(113), w(116) + 0.5], [330, 620], clamp);
  const niveau = interpolate(t, [w(107), w(116) + 0.5], [1, 0.4], clamp);
  return (
    <Plan debut={K[5]} fin={K[6]}>
      <Etiquette x={540} y={830} texte="PASSIF" couleur="rouge" taille={44} a={w(99)} style={{letterSpacing: '0.2em'}} />
      <ObjetSol x={250} l={280} h={240} a={w(103)} nom="maison" epaisseur={4} remplissage={0.04} intensite={0.6} />
      <ObjetAir x={sortieMag} y={1300} l={90} h={160} a={w(104)} nom="telephone" couleur="bleu" epaisseur={4} remplissage={0.12} />
      <ObjetSol x={860} l={100} h={300} a={w(107)} nom="jauge" couleur={niveau < 0.95 ? 'rouge' : 'vert'} epaisseur={4} remplissage={0.05} niveau={niveau} />
      <ObjetAir x={860} y={1100} l={36} h={90} a={w(110)} nom="flecheBas" couleur="rouge" epaisseur={5} />
    </Plan>
  );
};

// « La règle est simple : si l'objet ne te rapporte rien, tu l'achètes cash, ou tu attends. »
const S7: React.FC = () => (
  <Plan debut={K[6]} fin={K[7]}>
    <ObjetSol x={220} l={130} h={250} a={w(123)} nom="telephone" epaisseur={5} remplissage={0.06} />
    <Etiquette x={220} y={1130} texte="0 €" taille={44} a={w(127)} style={{color: '#AEB6C0'}} />
    <ObjetAir x={560} y={1300} l={220} h={120} a={w(130)} nom="billet" couleur="vert" epaisseur={5} remplissage={0.12} />
    <Etiquette x={560} y={1180} texte="CASH" couleur="vert" taille={40} a={w(130)} />
    <Etiquette x={730} y={1320} texte="OU" taille={34} a={w(131)} style={{color: '#AEB6C0'}} />
    <ObjetAir x={900} y={1290} l={170} h={170} a={w(133)} nom="horloge" couleur="bleu" epaisseur={5} remplissage={0.05} aiguille={30} />
  </Plan>
);

// « Les trente-cinq euros mensuels que tu n'as pas donnés à la banque, mis de côté, ça fait mille deux cent soixante euros en trois ans. »
const S8: React.FC = () => {
  const t = useT();
  const total = interpolate(t, [w(146), w(155)], [0, 1260], clamp);
  return (
    <Plan debut={K[7]} fin={K[8]}>
      <ObjetSol x={230} l={260} h={240} a={w(144)} nom="banque" epaisseur={5} remplissage={0.05} />
      <Croix x={230} y={1370} taille={260} a={w(145)} />
      <ObjetSol x={720} l={280} h={240} a={w(146)} nom="tirelire" epaisseur={5} remplissage={0.08} />
      {[0, 1, 2, 3, 4].map((i) => (
        <PieceQuiTombe key={i} x={700 + (i % 2) * 40} a={w(147) + i * 0.4} y0={950} yFin={SOL_Y - 200} taille={46} duree={0.5} />
      ))}
      <Etiquette x={720} y={1000} texte={`${fmt(Math.round(total / 10) * 10)} €`} couleur="vert" taille={60} a={w(146)} />
    </Plan>
  );
};

// « De quoi acheter le téléphone, et un deuxième. »
const S9: React.FC = () => (
  <Plan debut={K[8]} fin={K[9]}>
    <ObjetSol x={400} l={150} h={280} a={w(162)} nom="telephone" couleur="bleu" epaisseur={5} remplissage={0.12} />
    <ObjetSol x={680} l={150} h={280} a={w(165)} nom="telephone" couleur="bleu" epaisseur={5} remplissage={0.12} />
    <ObjetAir x={400} y={1130} l={100} h={75} a={w(163)} nom="coche" couleur="vert" epaisseur={7} />
    <ObjetAir x={680} y={1130} l={100} h={75} a={w(166)} nom="coche" couleur="vert" epaisseur={7} />
  </Plan>
);

// « Enregistre cette vidéo avant ta prochaine tentation en trente-six fois. »
const S10: React.FC = () => {
  return (
    <Plan debut={K[9]} fin={FIN_SCENE}>
      <Flottant x={300} y={1150} largeur={180} hauteur={260}>
        <Apparait a={w(167)}>
          <IconeNeon nom="telephone" epaisseur={5} remplissage={0.06} />
        </Apparait>
      </Flottant>
      <Flottant x={300} y={1150} largeur={60} hauteur={70}>
        <Apparait a={w(167) + 0.1}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
            <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
          </svg>
        </Apparait>
      </Flottant>
      <ObjetAir x={362} y={1040} l={56} h={84} a={w(169)} nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
      <ObjetAir x={760} y={1150} l={300} h={170} a={w(172)} nom="etiquette" couleur="rouge" epaisseur={5} remplissage={0.1} />
      <Etiquette x={720} y={1172} texte="× 36" couleur="rouge" taille={48} a={w(172) + 0.1} />
      <Croix x={760} y={1150} taille={260} a={w(176)} />
    </Plan>
  );
};

const EFFETS: Array<[number, string]> = [
  [w(3), 'piece'],
  [w(16), 'clic-doux'],
  [w(36), 'piece'],
  [w(44), 'clic-doux'],
  [w(61), 'piece'],
  [w(91), 'pop-leger'],
  [w(93), 'pop-leger'],
  [w(95), 'pop-leger'],
  [w(130), 'pop-leger'],
  [w(145), 'clic-doux'],
  [w(147), 'piece'],
  [w(151), 'piece'],
  [w(163), 'pop-leger'],
  [w(166), 'pop-leger'],
  [w(169), 'clic-doux'],
  [w(176), 'clic-doux'],
];

export const Finance09: React.FC = () => (
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
        </>
      }
      texte={<TexteMotAMot mots={MOTS} phrases={PHRASES} fin={FIN_SCENE} />}
      dessus={<FonduNoir coupes={K.slice(1)} finNoir={FIN_SCENE} />}
    />
    <BandeSon voix="voix/finance-09.mp3" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
