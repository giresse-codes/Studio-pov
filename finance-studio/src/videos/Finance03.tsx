import React from 'react';
import {interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-03-mots.json';
import {IconeNeon} from '../composants/IconeNeon';
import {Flottant, SurSol} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Etiquette, PileDePieces, prog, sortie, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {BandeSon} from '../composants/Sons';
import {ObjetAir, ObjetSol, Perso} from '../composants/raccourcis';
import {C, halo, SOL_Y} from '../style';

// Script 3 — Les glaçons
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {bete: 'attenue'}},
  {debut: 7, couleurs: {leau: 'bleu'}},
  {debut: 9, couleurs: {froid: 'bleu'}},
  {debut: 12, couleurs: {fetes: 'rose'}},
  {debut: 25, couleurs: {manque: 'rouge', glacons: 'bleu'}},
  {debut: 30, couleurs: {trois: 'or', cents: 'or', euros: 'or'}},
  {debut: 37, couleurs: {centimes: 'or'}},
  {debut: 41, couleurs: {leau: 'bleu'}},
  {debut: 44, couleurs: {tout: 'vert', seul: 'vert'}},
  {debut: 56, couleurs: {'63': 'or', '64': 'or', '65': 'or', '66': 'or'}},
  {debut: 67},
  {debut: 74, couleurs: {trente: 'or', a: 'or', soixante: 'or', '78': 'or'}},
  {debut: 85, couleurs: {glacon: 'attenue'}},
  {debut: 92, couleurs: {regularite: 'vert'}},
  {debut: 96, couleurs: {meme: 'bleu', heure: 'bleu'}},
  {debut: 110, couleurs: {officiel: 'vert'}},
  {debut: 125, couleurs: {video: 'or'}},
  {debut: 128, couleurs: {ete: 'rouge', pret: 'vert'}},
];

const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
const K = [0, coupe(7), coupe(12), coupe(30), coupe(44), coupe(56), coupe(67), coupe(85), coupe(96), coupe(110), coupe(125)];
const FIN_VOIX = 44.8;
const FIN_SCENE = 45.1;
export const DUREE_F03 = FIN_SCENE + 1.2;

/* ---------- Scènes ---------- */

// « Le business le plus bête du monde. »
const S1: React.FC = () => (
  <Plan debut={K[0]} fin={K[1]}>
    <Perso x={360} cles={[[0, 'debout'], [w(3), 'brasOuverts']]} />
    <ObjetAir x={790} y={1150} l={170} h={110} a={w(1)} nom="etiquette" epaisseur={5} remplissage={0.06} />
  </Plan>
);

// « De l'eau. Mise au froid. »
const S2: React.FC = () => {
  const t = useT();
  const glace = prog(t, w(11) - 0.1, 0.35);
  return (
    <Plan debut={K[1]} fin={K[2]}>
      <SurSol x={540} largeur={240} hauteur={260}>
        <Apparait a={w(8) - 0.1}>
          <div style={{position: 'absolute', inset: 0, opacity: Math.max(0, 1 - glace * 2), transform: `scale(${1 - 0.15 * glace})`}}>
            <IconeNeon nom="goutte" couleur="bleu" epaisseur={6} remplissage={0.15} carre />
          </div>
          <div style={{position: 'absolute', inset: 0, opacity: Math.max(0, glace * 2 - 1)}}>
            <IconeNeon nom="glacon" couleur="#BFE0FF" epaisseur={6} remplissage={0.15} carre />
          </div>
        </Apparait>
      </SurSol>
      <ObjetAir x={830} y={1000} l={120} h={120} a={w(10)} nom="flecheBas" couleur="bleu" epaisseur={5} disparait={w(11) + 0.5} />
    </Plan>
  );
};

// « Et pourtant, dans tous les bars, restaurants, maquis, mariages et fêtes de quartier,
//   il manque toujours des glaçons. »
const S3: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[2]} fin={K[3]}>
      <ObjetSol x={160} l={130} h={170} a={w(17)} nom="verre" epaisseur={5} remplissage={0.08} />
      <ObjetSol x={370} l={180} h={170} a={w(18)} nom="couverts" epaisseur={5} remplissage={0.06} />
      <ObjetSol x={600} l={200} h={150} a={w(19)} nom="table" epaisseur={5} remplissage={0.06} />
      <ObjetSol x={790} l={130} h={140} a={w(20)} nom="cadeau" epaisseur={5} remplissage={0.06} carre={false} />
      <ObjetSol x={950} l={90} h={200} a={w(22)} nom="ballon" couleur="rose" epaisseur={5} remplissage={0.12} carre={false} />
      <ObjetAir x={540} y={950} l={190} h={190} a={w(26)} nom="glacon" couleur="#AEB6C0" epaisseur={5} remplissage={0.04} intensite={0.5} carre />
      <Flottant x={540} y={950} largeur={230} hauteur={230}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={7} trace={prog(t, w(29), 0.45)} />
      </Flottant>
    </Plan>
  );
};

// « Un congélateur coffre, environ trois cents euros. Des sachets, quelques centimes. L'eau, presque rien. »
const S4: React.FC = () => (
  <Plan debut={K[3]} fin={K[4]}>
    <ObjetSol x={250} l={330} h={240} a={w(31)} nom="congelateur" epaisseur={5} remplissage={0.06} />
    <Etiquette x={250} y={1150} texte="300 €" couleur="or" taille={46} a={w(34)} />
    <ObjetSol x={600} l={150} h={190} a={w(38)} nom="sachet" epaisseur={5} remplissage={0.06} />
    <ObjetAir x={600} y={1150} l={56} h={56} a={w(40)} nom="piece" couleur="or" epaisseur={3} />
    <ObjetSol x={880} l={130} h={170} a={w(41)} nom="goutte" couleur="bleu" epaisseur={5} remplissage={0.12} />
    <Etiquette x={880} y={1150} texte="≈ 0" couleur="bleu" taille={44} a={w(42)} />
  </Plan>
);

// « Le produit se fabrique tout seul pendant que tu regardes la télé. »
const S5: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[4]} fin={K[5]}>
      <ObjetSol x={790} l={300} h={220} a={K[4] + 0.1} nom="congelateur" epaisseur={5} remplissage={0.06} />
      {[0, 1, 2].map((i) => (
        <ObjetAir key={i} x={720 + i * 70} y={1170 - (i % 2) * 30} l={64} h={64} a={w(47) + i * 0.35} nom="glacon" couleur="#BFE0FF" epaisseur={4} remplissage={0.15} carre />
      ))}
      <Flottant x={790} y={1090} largeur={120} hauteur={70}>
        <IconeNeon nom="coche" couleur="vert" epaisseur={7} trace={prog(t, w(49), 0.45)} />
      </Flottant>
      <Perso x={200} echelle={0.8} cles={[[0, 'debout'], [w(50), 'assis']]} a={w(50) - 0.4} />
      <SurSol x={200} largeur={215} hauteur={225}>
        <Apparait a={w(50) - 0.4}>
          <IconeNeon nom="chaise" couleur="#AEB6C0" epaisseur={4} remplissage={0.04} intensite={0.4} />
        </Apparait>
      </SurSol>
      <ObjetAir x={470} y={1210} l={180} h={150} a={w(53)} nom="ordinateur" epaisseur={4} remplissage={0.08} />
    </Plan>
  );
};

// « Un sac de deux kilos se vend un à deux euros. »
const S6: React.FC = () => (
  <Plan debut={K[5]} fin={K[6]}>
    <ObjetSol x={380} l={220} h={280} a={w(57)} nom="sachet" epaisseur={6} remplissage={0.08} />
    <Etiquette x={380} y={1090} texte="2 KG" taille={44} a={w(60)} />
    <ObjetAir x={760} y={1200} l={280} h={130} a={w(62)} nom="etiquette" couleur="or" epaisseur={5} remplissage={0.12} />
    <Etiquette x={706} y={1214} texte="1-2 €" couleur="or" taille={34} a={w(63)} style={{letterSpacing: '0.02em'}} />
  </Plan>
);

// « Trente sacs par jour en saison chaude, c'est trente à soixante euros par jour, avec un seul congélateur. »
const S7: React.FC = () => {
  const t = useT();
  const n = Math.round(interpolate(t, [w(67), w(70)], [0, 30], clamp));
  return (
    <Plan debut={K[6]} fin={K[7]}>
      <ObjetSol x={260} l={300} h={220} a={K[6] + 0.1} nom="congelateur" epaisseur={5} remplissage={0.06} />
      <ObjetAir x={170} y={1100} l={90} h={110} a={w(67)} nom="sachet" epaisseur={4} remplissage={0.06} />
      <Etiquette x={300} y={1130} texte={`× ${n}`} taille={56} a={w(67)} />
      <ObjetAir x={790} y={880} l={170} h={170} a={w(72)} nom="soleil" couleur="or" epaisseur={5} remplissage={0.1} disparait={w(75) - 0.2} />
      <PileDePieces x={790} a={w(75)} n={16} d={w(80) - w(75)} largeur={150} />
      <Etiquette x={790} y={1000} texte="30-60 € / JOUR" couleur="or" taille={36} a={w(77)} style={{letterSpacing: '0.06em'}} />
      <ObjetAir x={260} y={1060} l={80} h={70} a={w(84)} nom="coche" couleur="vert" epaisseur={6} />
    </Plan>
  );
};

// « Le secret, ce n'est pas le glaçon. C'est la régularité : »
const S8: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[7]} fin={K[8]}>
      <ObjetAir x={300} y={1180} l={200} h={200} a={w(86)} nom="glacon" couleur="#AEB6C0" epaisseur={5} remplissage={0.04} intensite={0.5} carre />
      <Flottant x={300} y={1180} largeur={240} hauteur={240}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={7} trace={prog(t, w(91), 0.45)} />
      </Flottant>
      <ObjetAir x={770} y={1180} l={260} h={240} a={w(93)} nom="calendrier" epaisseur={5} remplissage={0.05} />
      {/* une coche par jour, régulièrement */}
      <Flottant x={770} y={1000} largeur={300} hauteur={50}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{width: 46, height: 40}}>
              <IconeNeon nom="coche" couleur="vert" epaisseur={5} trace={prog(t, w(94) + i * 0.2, 0.3)} />
            </div>
          ))}
        </div>
      </Flottant>
    </Plan>
  );
};

// « les bars veulent un fournisseur qui livre tous les jours à la même heure. »
const S9: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[8]} fin={K[9]}>
      <ObjetSol x={210} l={150} h={200} a={w(97)} nom="verre" epaisseur={5} remplissage={0.08} />
      {[0, 1, 2].map((i) => (
        <ObjetSol key={i} x={400 + i * 110} l={90} h={115} a={w(102) + i * 0.3} nom="sachet" epaisseur={4} remplissage={0.06} />
      ))}
      <ObjetAir x={830} y={1180} l={230} h={230} a={w(106)} nom="horloge" couleur="bleu" epaisseur={5} remplissage={0.06} aiguille={interpolate(t, [w(106), w(109)], [300, 240], clamp)} />
    </Plan>
  );
};

// « Deux congélateurs, un livreur à vélo, et tu es le fournisseur officiel de ta rue. »
const S10: React.FC = () => {
  const t = useT();
  const xVelo = interpolate(t, [w(113), w(117)], [380, 860], clamp);
  const yRue = 1000;
  const bars = [180, 360, 540, 720, 900];
  return (
    <Plan debut={K[9]} fin={K[10]}>
      <ObjetSol x={150} l={170} h={125} a={w(110)} nom="congelateur" epaisseur={4} remplissage={0.06} />
      <ObjetSol x={150} l={170} h={125} y={-135} reflet={0} a={w(111)} nom="congelateur" epaisseur={4} remplissage={0.06} />
      <SurSol x={xVelo} largeur={190} hauteur={150}>
        <Apparait a={w(112)}>
          <IconeNeon nom="velo" epaisseur={5} remplissage={0} carre={false} />
        </Apparait>
      </SurSol>
      {/* la rue, vue de haut : les bars s'allument un par un */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: halo(C.blanc, 0.5)}}>
        <path
          d={`M 110 ${yRue} H 970`}
          stroke="#AEB6C0"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.7}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - prog(t, w(118), 0.6)}
        />
      </svg>
      {bars.map((x, i) => {
        const allume = prog(t, w(120) + i * 0.22, 0.3);
        const vu = prog(t, w(118) + i * 0.1, 0.3);
        return (
          <div
            key={x}
            style={{
              position: 'absolute',
              left: x - 18,
              top: yRue - 18,
              width: 36,
              height: 36,
              borderRadius: 18,
              border: `4px solid ${allume > 0.5 ? C.vert : '#AEB6C0'}`,
              background: allume > 0.5 ? `${C.vert}88` : 'transparent',
              boxShadow: allume > 0.5 ? `0 0 18px ${C.vert}` : 'none',
              opacity: vu,
            }}
          />
        );
      })}
    </Plan>
  );
};

// « Enregistre cette vidéo. Le prochain été arrive, que tu sois prêt ou pas. »
const S11: React.FC = () => {
  const t = useT();
  const fin = w(128) - 0.3;
  return (
    <Plan debut={K[10]} fin={FIN_SCENE}>
      <Flottant x={540} y={1080} largeur={180} hauteur={260} opacity={sortie(t, fin)}>
        <Apparait a={w(125)}>
          <IconeNeon nom="telephone" epaisseur={5} remplissage={0.06} />
        </Apparait>
      </Flottant>
      <Flottant x={540} y={1080} largeur={60} hauteur={70} opacity={sortie(t, fin)}>
        <Apparait a={w(125) + 0.1}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
            <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
          </svg>
        </Apparait>
      </Flottant>
      <Flottant x={602} y={970} largeur={56} hauteur={84} opacity={sortie(t, fin)}>
        <Apparait a={w(127)}>
          <IconeNeon nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
        </Apparait>
      </Flottant>
      {/* l'été arrive : le thermomètre monte */}
      <Perso x={300} echelle={0.85} cles={[[0, 'debout'], [w(135), 'mainsHanches']]} a={w(129)} />
      <ObjetSol
        x={760}
        l={130}
        h={380}
        a={w(129)}
        nom="thermometre"
        couleur="rouge"
        epaisseur={5}
        remplissage={0.05}
        niveau={interpolate(t, [w(129), w(137)], [0.15, 0.95], clamp)}
      />
    </Plan>
  );
};

const EFFETS: Array<[number, string]> = [
  [w(8), 'pop-leger'],
  [w(11), 'clic-doux'],
  [w(17), 'pop-leger'],
  [w(18), 'pop-leger'],
  [w(19), 'pop-leger'],
  [w(20), 'pop-leger'],
  [w(22), 'pop-leger'],
  [w(29), 'clic-doux'],
  [w(34), 'piece'],
  [w(40), 'piece'],
  [w(49), 'pop-leger'],
  [w(63), 'piece'],
  [w(77), 'piece'],
  [w(91), 'clic-doux'],
  [w(94), 'pop-leger'],
  [w(120), 'pop-leger'],
  [w(127), 'clic-doux'],
];

export const Finance03: React.FC = () => (
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
    <BandeSon voix="voix/finance-03.wav" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
