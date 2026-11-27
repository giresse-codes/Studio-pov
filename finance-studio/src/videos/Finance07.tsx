import React from 'react';
import {interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-07-mots.json';
import {IconeNeon, NomIcone} from '../composants/IconeNeon';
import {Flottant} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Etiquette, PieceQuiTombe, PileDePieces, prog, sortie, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {BandeSon} from '../composants/Sons';
import {Fleche} from '../composants/Fleche';
import {ObjetAir, ObjetSol, Perso} from '../composants/raccourcis';
import {C, halo, SOL_Y} from '../style';

// Script 7 — Le distributeur de boissons
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {vingtquatre: 'bleu', heures: 'bleu'}},
  {debut: 11, couleurs: {monnaie: 'or'}},
  {debut: 20, couleurs: {distributeur: 'bleu'}},
  {debut: 22, couleurs: {mille: 'or', deux: 'or', euros: 'or'}},
  {debut: 32, couleurs: {passage: 'bleu'}},
  {debut: 49, couleurs: {quarante: 'attenue', centimes: 'attenue', un: 'or', euro: 'or'}},
  {debut: 58, couleurs: {dixhuit: 'vert', euros: 'vert'}},
  {debut: 68, couleurs: {cinq: 'or', cents: 'or', '71': 'or'}},
  {debut: 84, couleurs: {vide: 'rouge'}},
  {debut: 95, couleurs: {ta: 'rouge', faute: 'rouge'}},
  {debut: 103, couleurs: {negociation: 'bleu'}},
  {debut: 112, couleurs: {pourcentage: 'or', gagne: 'vert'}},
  {debut: 123, couleurs: {salaire: 'vert'}},
  {debut: 130, couleurs: {entreprise: 'vert'}},
  {debut: 136, couleurs: {video: 'or', soif: 'bleu'}},
];

const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
const K = [0, coupe(20), coupe(32), coupe(49), coupe(58), coupe(68), coupe(84), coupe(103), coupe(123), coupe(136)];
const FIN_VOIX = 46.73;
const FIN_SCENE = 47.0;
export const DUREE_F07 = FIN_SCENE + 1.2;

/* ---------- Scènes ---------- */

// « Il y a un employé qui travaille vingt-quatre heures sur vingt-quatre, ne se plaint jamais, et te rend la monnaie. »
const S1: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[0]} fin={K[1]}>
      <ObjetAir x={300} y={1150} l={280} h={280} a={w(4)} nom="horloge" couleur="bleu" epaisseur={5} remplissage={0.06} aiguille={(t - w(4)) * 300} />
      <Etiquette x={300} y={1380} texte="24/24" couleur="bleu" taille={46} a={w(7)} />
      <ObjetAir x={760} y={960} l={200} h={160} a={w(12)} nom="bulle" epaisseur={4} remplissage={0.05} intensite={0.6} />
      <Flottant x={760} y={950} largeur={180} hauteur={180}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={6} trace={prog(t, w(14), 0.45)} />
      </Flottant>
      {[0, 1, 2].map((i) => (
        <PieceQuiTombe key={i} x={720 + i * 45} a={w(17) + i * 0.15} y0={1100} yFin={SOL_Y - i * 4} taille={54} duree={0.55} />
      ))}
    </Plan>
  );
};

// « Le distributeur. Un distributeur d'occasion coûte entre mille et deux mille euros. »
const S2: React.FC = () => (
  <Plan debut={K[1]} fin={K[2]}>
    <ObjetSol x={420} l={250} h={400} a={w(20)} nom="distributeur" epaisseur={6} remplissage={0.07} />
    <ObjetAir x={760} y={1300} l={150} h={150} a={w(21)} nom="horloge" couleur="bleu" epaisseur={4} remplissage={0.05} aiguille={0} />
    <ObjetAir x={250} y={830} l={130} h={80} a={w(27)} nom="etiquette" couleur="or" epaisseur={5} remplissage={0.12} />
    <Etiquette x={620} y={860} texte="1 000 – 2 000 €" couleur="or" taille={46} a={w(27)} style={{letterSpacing: '0.04em'}} />
  </Plan>
);

// « Tu le places dans un lieu de passage : école, garage, salle de sport, immeuble de bureaux. »
const S3: React.FC = () => {
  const lieux: Array<{nom: NomIcone; i: number; l: number; h: number}> = [
    {nom: 'livre', i: 41, l: 160, h: 130},
    {nom: 'voiture', i: 42, l: 190, h: 110},
    {nom: 'haltere', i: 43, l: 150, h: 110},
    {nom: 'immeuble', i: 46, l: 130, h: 230},
  ];
  const xs = [150, 400, 660, 910];
  return (
    <Plan debut={K[2]} fin={K[3]}>
      {lieux.map((l, k) => (
        <React.Fragment key={k}>
          <ObjetSol x={xs[k]} l={l.l} h={l.h} a={w(l.i)} nom={l.nom} epaisseur={4} remplissage={0.06} />
          <ObjetAir x={xs[k]} y={SOL_Y - l.h - 90} l={60} h={80} a={w(l.i) + 0.15} nom="pin" couleur="bleu" epaisseur={4} remplissage={0.2} />
        </React.Fragment>
      ))}
      <ObjetAir x={540} y={880} l={110} h={175} a={w(34)} nom="distributeur" epaisseur={4} remplissage={0.06} />
    </Plan>
  );
};

// « Une canette achetée quarante centimes se vend un euro. »
const S4: React.FC = () => (
  <Plan debut={K[3]} fin={K[4]}>
    <ObjetSol x={200} l={120} h={210} a={w(50)} nom="canette" couleur="bleu" epaisseur={5} remplissage={0.12} />
    <Etiquette x={480} y={1310} texte="0,40 €" taille={50} a={w(52)} style={{color: '#AEB6C0'}} />
    <Fleche x1={620} y1={1290} x2={720} y2={1290} a={w(54)} d={0.4} />
    <Etiquette x={860} y={1310} texte="1 €" couleur="or" taille={64} a={w(56)} />
  </Plan>
);

// « Trente ventes par jour, c'est dix-huit euros de marge quotidienne, »
const S5: React.FC = () => {
  const t = useT();
  const n = Math.round(interpolate(t, [w(58), w(61) + 0.3], [0, 30], clamp));
  return (
    <Plan debut={K[4]} fin={K[5]}>
      <ObjetSol x={260} l={230} h={370} a={K[4] + 0.1} nom="distributeur" epaisseur={5} remplissage={0.06} />
      <ObjetAir x={600} y={1250} l={70} h={120} a={w(58)} nom="canette" couleur="bleu" epaisseur={4} remplissage={0.12} />
      <Etiquette x={790} y={1280} texte={`× ${n}`} taille={60} a={w(58)} />
      <Etiquette x={680} y={1000} texte="+18 € / JOUR" couleur="vert" taille={46} a={w(63)} style={{letterSpacing: '0.06em'}} />
    </Plan>
  );
};

// « environ cinq cents euros par mois, pour une machine que tu visites deux fois par semaine. »
const S6: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[5]} fin={K[6]}>
      <ObjetSol x={240} l={230} h={370} a={K[5] + 0.1} nom="distributeur" epaisseur={5} remplissage={0.06} />
      <Etiquette x={680} y={880} texte="500 € / MOIS" couleur="or" taille={46} a={w(69)} style={{letterSpacing: '0.06em'}} />
      <PileDePieces x={600} a={w(69)} n={14} d={1.4} largeur={150} />
      <ObjetAir x={860} y={1260} l={200} h={190} a={w(79)} nom="calendrier" epaisseur={4} remplissage={0.05} />
      {[0, 1].map((i) => (
        <Flottant key={i} x={830 + i * 60} y={1130} largeur={32} hauteur={32}>
          <div style={{width: '100%', height: '100%', borderRadius: 16, background: C.vert, boxShadow: `0 0 14px ${C.vert}`, opacity: prog(t, w(80) + i * 0.3, 0.3)}} />
        </Flottant>
      ))}
    </Plan>
  );
};

// « Le pire jour de ton distributeur, c'est quand il est vide. Et ça, c'est ta faute, pas la sienne. »
const S7: React.FC = () => {
  const t = useT();
  const niveau = interpolate(t, [w(86), w(94) + 0.3], [0.9, 0], clamp);
  return (
    <Plan debut={K[6]} fin={K[7]}>
      <ObjetSol x={600} l={230} h={370} a={K[6] + 0.1} nom="distributeur" epaisseur={5} remplissage={0.06} />
      <ObjetSol x={860} l={90} h={280} a={w(85)} nom="jauge" couleur={niveau < 0.3 ? 'rouge' : 'blanc'} epaisseur={4} remplissage={0.05} niveau={niveau} />
      <Perso x={230} echelle={0.85} cles={[[0, 'debout'], [w(98), 'mainsTete']]} a={w(95)} />
    </Plan>
  );
};

// « Le vrai travail, c'est la négociation de l'emplacement : tu proposes au propriétaire un pourcentage, et tout le monde gagne. »
const S8: React.FC = () => (
  <Plan debut={K[7]} fin={K[8]}>
    <Perso x={200} echelle={0.85} cles={[[0, 'debout'], [w(113), 'presenteDroite']]} />
    <ObjetSol x={540} l={170} h={270} a={w(108)} nom="distributeur" epaisseur={4} remplissage={0.06} />
    <Perso x={880} echelle={0.85} gris a={w(114)} />
    <Etiquette x={540} y={1110} texte="%" couleur="or" taille={90} a={w(117)} />
    <ObjetAir x={200} y={830} l={100} h={80} a={w(122)} nom="coche" couleur="vert" epaisseur={7} />
    <ObjetAir x={880} y={830} l={100} h={80} a={w(122) + 0.15} nom="coche" couleur="vert" epaisseur={7} />
  </Plan>
);

// « Trois machines, et tu as un salaire. Dix, et tu as une entreprise. »
const S9: React.FC = () => {
  const t = useT();
  const cellules = Array.from({length: 10}).map((_, i) => ({x: 180 + (i % 5) * 180, y: i < 5 ? 1080 : 1330}));
  return (
    <Plan debut={K[8]} fin={K[9]}>
      {cellules.map((c, i) => {
        const a = i < 3 ? w(123) + i * 0.18 : w(130) + (i - 3) * 0.1;
        const on = prog(t, a, 0.3);
        return (
          <Flottant key={i} x={c.x} y={c.y} largeur={110} hauteur={175}>
            <div style={{position: 'absolute', inset: 0, opacity: (1 - on) * prog(t, K[8] + 0.1, 0.4)}}>
              <IconeNeon nom="distributeur" couleur="#5E6672" epaisseur={3} remplissage={0} intensite={0.2} />
            </div>
            <div style={{position: 'absolute', inset: 0, opacity: on}}>
              <IconeNeon nom="distributeur" couleur="vert" epaisseur={4} remplissage={0.1} />
            </div>
          </Flottant>
        );
      })}
      <ObjetAir x={300} y={820} l={170} h={95} a={w(129)} nom="billet" couleur="vert" epaisseur={5} remplissage={0.12} />
      <ObjetAir x={780} y={790} l={110} h={170} a={w(135)} nom="immeuble" couleur="vert" epaisseur={5} remplissage={0.1} />
    </Plan>
  );
};

// « Enregistre cette vidéo et note trois lieux près de chez toi où les gens attendent avec soif. »
const S10: React.FC = () => {
  const t = useT();
  const fin = w(140) - 0.2;
  const pins = [
    {x: 600, y: 1080},
    {x: 820, y: 1170},
    {x: 690, y: 1300},
  ];
  return (
    <Plan debut={K[9]} fin={FIN_SCENE}>
      <Flottant x={540} y={1150} largeur={180} hauteur={260} opacity={sortie(t, fin)}>
        <Apparait a={w(136)}>
          <IconeNeon nom="telephone" epaisseur={5} remplissage={0.06} />
        </Apparait>
      </Flottant>
      <Flottant x={540} y={1150} largeur={60} hauteur={70} opacity={sortie(t, fin)}>
        <Apparait a={w(136) + 0.1}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
            <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
          </svg>
        </Apparait>
      </Flottant>
      <Flottant x={602} y={1040} largeur={56} hauteur={84} opacity={sortie(t, fin)}>
        <Apparait a={w(138)}>
          <IconeNeon nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
        </Apparait>
      </Flottant>
      {/* le quartier, vu de haut : trois lieux notés */}
      <Flottant x={700} y={1200} largeur={460} hauteur={420}>
        <Apparait a={w(140)}>
          <svg viewBox="0 0 460 420" width="100%" height="100%" style={{overflow: 'visible', filter: halo(C.blanc, 0.4)}}>
            <rect x={4} y={4} width={452} height={412} rx={16} fill="rgba(242,245,248,0.04)" stroke={C.blanc} strokeWidth={4} />
            <path d="M 4 150 H 456 M 4 300 H 456 M 160 4 V 416 M 330 4 V 416" stroke="#AEB6C0" strokeWidth={3} opacity={0.4} />
          </svg>
        </Apparait>
      </Flottant>
      <Perso x={220} echelle={0.8} cles={[[0, 'debout'], [w(141), 'pointeDroite']]} a={w(140)} />
      {pins.map((p, i) => (
        <ObjetAir key={i} x={p.x} y={p.y} l={60} h={80} a={w(141) + i * 0.3} nom="pin" couleur="vert" epaisseur={4} remplissage={0.25} />
      ))}
      <ObjetAir x={840} y={890} l={60} h={100} a={w(152)} nom="canette" couleur="bleu" epaisseur={4} remplissage={0.12} />
    </Plan>
  );
};

const EFFETS: Array<[number, string]> = [
  [w(14), 'clic-doux'],
  [w(17), 'piece'],
  [w(20), 'pop-leger'],
  [w(27), 'piece'],
  [w(41), 'pop-leger'],
  [w(42), 'pop-leger'],
  [w(43), 'pop-leger'],
  [w(46), 'pop-leger'],
  [w(56), 'piece'],
  [w(63), 'piece'],
  [w(69), 'piece'],
  [w(117), 'clic-doux'],
  [w(122), 'pop-leger'],
  [w(123), 'pop-leger'],
  [w(130), 'pop-leger'],
  [w(138), 'clic-doux'],
  [w(141), 'pop-leger'],
];

export const Finance07: React.FC = () => (
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
    <BandeSon voix="voix/finance-07.mp3" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
