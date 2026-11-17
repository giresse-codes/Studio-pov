import React from 'react';
import {interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-05-mots.json';
import {IconeNeon, NomIcone} from '../composants/IconeNeon';
import {Flottant, SurSol} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Barre, Etiquette, PieceQuiTombe, PileDePieces, prog, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {BandeSon} from '../composants/Sons';
import {Fleche} from '../composants/Fleche';
import {ObjetAir, ObjetSol, Perso, Prix} from '../composants/raccourcis';
import {C, halo, SOL_Y} from '../style';

// Script 5 — La sono du quartier
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {bruit: 'bleu', minuit: 'bleu'}},
  {debut: 12, couleurs: {rapporte: 'or'}},
  {debut: 17, couleurs: {sono: 'bleu'}},
  {debut: 19, couleurs: {mariages: 'rose', soirees: 'rose'}},
  {debut: 27, couleurs: {seul: 'rouge'}},
  {debut: 34, couleurs: {loue: 'vert'}},
  {debut: 39},
  {debut: 51, couleurs: {huit: 'or', cents: 'or', euros: 'or'}},
  {debut: 57, couleurs: {jamais: 'rouge'}},
  {debut: 71, couleurs: {soixante: 'or', a: 'or', cent: 'or', cinquante: 'or', euros: 'or'}},
  {debut: 81, couleurs: {rembourse: 'vert'}},
  {debut: 95, couleurs: {benefice: 'vert'}},
  {debut: 99, couleurs: {secret: 'bleu'}},
  {debut: 111, couleurs: {touche: 'rouge', casse: 'vert'}},
  {debut: 121, couleurs: {lumieres: 'rose'}},
  {debut: 130, couleurs: {video: 'or', fetes: 'rose'}},
  {debut: 146, couleurs: {toi: 'vert'}},
];

const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
const K = [0, coupe(17), coupe(19), coupe(27), coupe(34), coupe(39), coupe(57), coupe(71), coupe(81), coupe(95), coupe(99), coupe(111), coupe(121), coupe(130), coupe(146)];
const FIN_VOIX = 53.84;
const FIN_SCENE = 54.1;
export const DUREE_F05 = FIN_SCENE + 1.2;

/** Ondes sonores : arcs qui partent du haut-parleur et s'effacent, en boucle douce. */
const Ondes: React.FC<{x: number; y: number; a: number; fin?: number; taille?: number; couleur?: string; cotes?: 'deux' | 'droite'}> = ({
  x,
  y,
  a,
  fin = 1e9,
  taille = 1,
  couleur = C.bleu,
  cotes = 'deux',
}) => {
  const t = useT();
  if (t < a || t > fin) return null;
  const o = prog(t, a, 0.3) * (fin < 1e9 ? interpolate(t, [fin - 0.3, fin], [1, 0], clamp) : 1);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: o, filter: halo(couleur, 0.7)}}>
      {[0, 1, 2].map((i) => {
        const ph = ((t - a) * 0.9 + i / 3) % 1;
        const r = (60 + ph * 110) * taille;
        const op = Math.sin(ph * Math.PI);
        const arc = (s: number) => `M ${x + s * r * 0.5} ${y - r * 0.86} A ${r} ${r} 0 0 ${s > 0 ? 1 : 0} ${x + s * r * 0.5} ${y + r * 0.86}`;
        return (
          <g key={i} fill="none" stroke={couleur} strokeWidth={4} strokeLinecap="round" opacity={op}>
            <path d={arc(1)} />
            {cotes === 'deux' && <path d={arc(-1)} />}
          </g>
        );
      })}
    </svg>
  );
};

/** Croix rouge qui se dessine sur un objet. */
const Croix: React.FC<{x: number; y: number; taille: number; a: number}> = ({x, y, taille, a}) => {
  const t = useT();
  return (
    <Flottant x={x} y={y} largeur={taille} hauteur={taille}>
      <IconeNeon nom="croix" couleur="rouge" epaisseur={6} trace={prog(t, a, 0.45)} />
    </Flottant>
  );
};

/* ---------- Scènes ---------- */

// « Il y a un bruit que tout le monde déteste à minuit. Et qui rapporte très bien. »
const S1: React.FC = () => (
  <Plan debut={K[0]} fin={K[1]}>
    <Perso x={230} gris cles={[[0, 'debout'], [w(9), 'mainsTete']]} />
    <ObjetSol x={640} l={150} h={230} a={w(3)} nom="enceinte" epaisseur={5} remplissage={0.06} />
    <Ondes x={640} y={SOL_Y - 150} a={w(4)} />
    <ObjetAir x={910} y={880} l={150} h={150} a={w(11)} nom="horloge" epaisseur={4} remplissage={0.05} aiguille={0} />
    {[0, 1, 2].map((i) => (
      <PieceQuiTombe key={i} x={890 + i * 50} a={w(14) + i * 0.2} y0={1000} yFin={SOL_Y - 6 * i} taille={52} duree={0.6} />
    ))}
  </Plan>
);

// « La sono. »
const S2: React.FC = () => {
  const t = useT();
  const vib = Math.sin(t * 60) * 2.5 * prog(t, w(18), 0.2);
  return (
    <Plan debut={K[1]} fin={K[2]}>
      <SurSol x={540} largeur={240} hauteur={370}>
        <Apparait a={K[1] + 0.1}>
          <div style={{width: '100%', height: '100%', transform: `translateX(${vib}px)`}}>
            <IconeNeon nom="enceinte" epaisseur={6} remplissage={0.08} />
          </div>
        </Apparait>
      </SurSol>
      <Ondes x={540} y={SOL_Y - 140} a={w(18)} taille={1.5} />
    </Plan>
  );
};

// « Mariages, anniversaires, baptêmes, réunions d'association, soirées étudiantes : »
const S3: React.FC = () => {
  const items: Array<{nom: NomIcone; i: number; couleur?: string; l: number; h: number}> = [
    {nom: 'anneaux', i: 19, couleur: 'rose', l: 150, h: 120},
    {nom: 'gateau', i: 20, l: 150, h: 140},
    {nom: 'goutte', i: 21, couleur: 'bleu', l: 100, h: 130},
    {nom: 'reseau', i: 22, l: 150, h: 140},
    {nom: 'ballon', i: 24, couleur: 'rose', l: 90, h: 170},
  ];
  const xs = [140, 340, 540, 740, 940];
  return (
    <Plan debut={K[2]} fin={K[3]}>
      {items.map((it, k) => (
        <ObjetSol key={k} x={xs[k]} l={it.l} h={it.h} a={w(it.i)} nom={it.nom} couleur={it.couleur} epaisseur={4} remplissage={0.08} carre={it.nom === 'ballon' ? false : undefined} />
      ))}
    </Plan>
  );
};

// « personne n'achète d'enceintes pour un seul samedi. »
const S4: React.FC = () => (
  <Plan debut={K[3]} fin={K[4]}>
    <ObjetSol x={360} l={150} h={230} a={K[3] + 0.1} nom="enceinte" epaisseur={5} remplissage={0.06} />
    <ObjetAir x={360} y={1120} l={170} h={100} a={w(28)} nom="etiquette" couleur="or" epaisseur={5} remplissage={0.12} />
    <Croix x={360} y={1230} taille={280} a={w(29)} />
    <ObjetAir x={790} y={1250} l={200} h={190} a={w(32)} nom="calendrier" epaisseur={4} remplissage={0.05} />
    <Etiquette x={790} y={1430} texte="× 1" couleur="rouge" taille={48} a={w(33)} />
  </Plan>
);

// « Tout le monde en loue. »
const S5: React.FC = () => (
  <Plan debut={K[4]} fin={K[5]}>
    {[0, 1, 2].map((i) => (
      <Perso key={i} x={140 + i * 150} echelle={0.6} gris a={w(34) + i * 0.12} />
    ))}
    <Fleche x1={560} y1={1260} x2={700} y2={1260} a={w(37)} d={0.35} couleur="vert" />
    <ObjetSol x={850} l={150} h={230} a={w(34)} nom="enceinte" epaisseur={5} remplissage={0.06} />
    <ObjetAir x={850} y={1150} l={110} h={80} a={w(38)} nom="coche" couleur="vert" epaisseur={7} />
  </Plan>
);

// « Deux enceintes actives, une table de mixage, deux micros, des câbles : environ huit cents euros, une fois. »
const S6: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[5]} fin={K[6]}>
      <ObjetSol x={150} l={150} h={250} a={w(39)} nom="enceinte" epaisseur={5} remplissage={0.06} />
      <ObjetSol x={930} l={150} h={250} a={w(40)} nom="enceinte" epaisseur={5} remplissage={0.06} />
      <ObjetSol x={540} l={220} h={130} a={w(43)} nom="mixage" epaisseur={5} remplissage={0.06} />
      <ObjetSol x={360} l={80} h={170} a={w(46)} nom="micro" epaisseur={4} remplissage={0.06} />
      <ObjetSol x={720} l={80} h={170} a={w(47)} nom="micro" epaisseur={4} remplissage={0.06} />
      {/* les câbles posés au sol */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: halo(C.blanc, 0.4)}}>
        {[
          `M 225 ${SOL_Y - 10} C 300 ${SOL_Y + 10} 380 ${SOL_Y - 10} 430 ${SOL_Y - 8}`,
          `M 650 ${SOL_Y - 8} C 720 ${SOL_Y + 12} 800 ${SOL_Y - 10} 855 ${SOL_Y - 10}`,
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#AEB6C0" strokeWidth={3} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - prog(t, w(49) + i * 0.2, 0.5)} />
        ))}
      </svg>
      <Prix x={540} y={900} texte="800 €" a={w(52)} />
      <Etiquette x={880} y={920} texte="× 1" couleur="vert" taille={52} a={w(56)} />
    </Plan>
  );
};

// « Ça ne mange pas, ça ne dort pas, et ça n'a jamais demandé d'augmentation. »
const S7: React.FC = () => (
  <Plan debut={K[6]} fin={K[7]}>
    <ObjetSol x={540} l={170} h={260} a={K[6] + 0.1} nom="enceinte" epaisseur={5} remplissage={0.06} />
    <Ondes x={540} y={SOL_Y - 160} a={K[6] + 0.3} taille={0.9} />
    <ObjetAir x={200} y={960} l={150} h={130} a={w(59)} nom="couverts" epaisseur={4} remplissage={0.05} />
    <Croix x={200} y={960} taille={170} a={w(60)} />
    <ObjetAir x={540} y={900} l={170} h={120} a={w(63)} nom="lit" epaisseur={4} remplissage={0.05} />
    <Croix x={540} y={900} taille={170} a={w(64)} />
    <ObjetAir x={860} y={960} l={160} h={90} a={w(69)} nom="billet" couleur="#AEB6C0" epaisseur={4} remplissage={0.05} />
    <ObjetAir x={950} y={890} l={30} h={70} a={w(69)} nom="flecheHaut" couleur="#AEB6C0" epaisseur={4} />
    <Croix x={880} y={950} taille={170} a={w(70)} />
  </Plan>
);

// « Une location, c'est soixante à cent cinquante euros la soirée. »
const S8: React.FC = () => (
  <Plan debut={K[7]} fin={K[8]}>
    <ObjetSol x={260} l={160} h={250} a={K[7] + 0.1} nom="enceinte" epaisseur={5} remplissage={0.06} />
    <Ondes x={260} y={SOL_Y - 150} a={w(72)} taille={0.8} couleur={C.rose} />
    <Prix x={720} y={1050} texte="60-150 €" a={w(74)} />
    {[0, 1, 2].map((i) => (
      <PieceQuiTombe key={i} x={660 + i * 70} a={w(78) + i * 0.15} y0={1150} yFin={SOL_Y} taille={54} duree={0.55} />
    ))}
  </Plan>
);

// « Trois week-ends par mois, et le matériel est remboursé en moins de quatre mois. »
const S9: React.FC = () => {
  const t = useT();
  const mois = Math.max(1, Math.min(4, Math.floor(interpolate(t, [w(87), w(94)], [1, 4.99], clamp))));
  const rembourse = Math.round(interpolate(t, [w(87), w(94)], [0, 800], clamp) / 10) * 10;
  return (
    <Plan debut={K[8]} fin={K[9]}>
      <ObjetAir x={250} y={1240} l={220} h={210} a={K[8] + 0.1} nom="calendrier" epaisseur={4} remplissage={0.05} />
      {[0, 1, 2].map((i) => (
        <Flottant key={i} x={190 + i * 60} y={1150} largeur={34} hauteur={34}>
          <div style={{width: '100%', height: '100%', borderRadius: 17, background: C.rose, boxShadow: `0 0 14px ${C.rose}`, opacity: prog(t, w(81) + i * 0.2, 0.3)}} />
        </Flottant>
      ))}
      <Etiquette x={250} y={1420} texte={`MOIS ${mois}`} taille={34} a={w(87)} />
      <Etiquette x={720} y={1100} texte={`${rembourse} € / 800 €`} couleur={rembourse >= 800 ? 'vert' : 'or'} taille={40} a={w(87)} style={{letterSpacing: '0.04em'}} />
      <Barre x={720} y={1180} largeur={400} a={w(87)} d={w(94) - w(87)} couleur="vert" />
      <ObjetAir x={720} y={1300} l={110} h={80} a={w(94) + 0.1} nom="coche" couleur="vert" epaisseur={7} />
    </Plan>
  );
};

// « Ensuite, c'est du bénéfice. »
const S10: React.FC = () => (
  <Plan debut={K[9]} fin={K[10]}>
    <ObjetSol x={330} l={150} h={230} a={K[9] + 0.1} nom="enceinte" epaisseur={5} remplissage={0.06} />
    <PileDePieces x={700} a={w(96)} n={14} d={1.0} largeur={160} />
    <ObjetAir x={860} y={1180} l={40} h={160} a={w(98)} nom="flecheHaut" couleur="vert" epaisseur={6} />
  </Plan>
);

// « Le secret : un contrat simple, une caution, et tu livres toi-même. »
const S11: React.FC = () => {
  const t = useT();
  const x = interpolate(t, [w(108), w(110) + 0.6], [640, 820], clamp);
  return (
    <Plan debut={K[10]} fin={K[11]}>
      <ObjetAir x={170} y={1250} l={170} h={220} a={w(103)} nom="contrat" epaisseur={4} remplissage={0.06} />
      <ObjetAir x={420} y={1280} l={170} h={95} a={w(106)} nom="billet" couleur="or" epaisseur={4} remplissage={0.1} />
      <ObjetAir x={420} y={1180} l={70} h={80} a={w(106) + 0.1} nom="cadenas" epaisseur={4} remplissage={0.06} />
      <Perso x={x} echelle={0.75} cles={[[0, 'debout']]} marche={t > w(108) && t < w(110) + 0.6 ? 10 : 0} a={w(108)} />
      <SurSol x={x + 160} largeur={110} hauteur={170}>
        <Apparait a={w(108)}>
          <IconeNeon nom="enceinte" epaisseur={4} remplissage={0.06} />
        </Apparait>
      </SurSol>
    </Plan>
  );
};

// « Le client ne touche à rien, donc rien ne casse. »
const S12: React.FC = () => (
  <Plan debut={K[11]} fin={K[12]}>
    <Perso x={250} gris cles={[[0, 'debout'], [w(113), 'pointeDroite'], [w(116), 'debout']]} a={K[11] + 0.1} />
    <Croix x={500} y={1080} taille={130} a={w(114)} />
    <ObjetSol x={760} l={170} h={260} a={K[11] + 0.1} nom="enceinte" epaisseur={5} remplissage={0.06} />
    <ObjetAir x={760} y={1120} l={110} h={80} a={w(120)} nom="coche" couleur="vert" epaisseur={7} />
  </Plan>
);

// « Puis tu ajoutes des lumières, puis une deuxième sono. »
const S13: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[12]} fin={K[13]}>
      <ObjetSol x={280} l={150} h={230} a={K[12] + 0.1} nom="enceinte" epaisseur={5} remplissage={0.06} />
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <ObjetAir x={380 + i * 160} y={900} l={80} h={90} a={w(125) + i * 0.15} nom="ampoule" couleur="rose" epaisseur={4} remplissage={0.2} carre />
          <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.14 * prog(t, w(125) + i * 0.15 + 0.2, 0.5)}}>
            <path d={`M ${380 + i * 160} 950 L ${300 + i * 160} ${SOL_Y} L ${460 + i * 160} ${SOL_Y} Z`} fill={C.rose} />
          </svg>
        </React.Fragment>
      ))}
      <ObjetSol x={800} l={150} h={230} a={w(128)} nom="enceinte" epaisseur={5} remplissage={0.06} />
      <Ondes x={280} y={SOL_Y - 150} a={w(125)} taille={0.7} />
      <Ondes x={800} y={SOL_Y - 150} a={w(129)} taille={0.7} />
    </Plan>
  );
};

// « Enregistre cette vidéo et regarde combien de fêtes il y a dans ton quartier ce mois-ci. »
const S14: React.FC = () => {
  const t = useT();
  const fin = w(134) - 0.2;
  const points = [
    [0, 0], [2, 0], [5, 1], [1, 2], [4, 2], [6, 3],
  ];
  return (
    <Plan debut={K[13]} fin={K[14]}>
      <Flottant x={250} y={1150} largeur={180} hauteur={260}>
        <Apparait a={w(130)}>
          <IconeNeon nom="telephone" epaisseur={5} remplissage={0.06} />
        </Apparait>
      </Flottant>
      <Flottant x={250} y={1150} largeur={60} hauteur={70}>
        <Apparait a={w(130) + 0.1}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
            <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
          </svg>
        </Apparait>
      </Flottant>
      <ObjetAir x={312} y={1040} l={56} h={84} a={w(132)} nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
      {/* le mois du quartier : les fêtes s'allument une par une */}
      <Flottant x={740} y={1180} largeur={400} hauteur={330}>
        <Apparait a={fin}>
          <div style={{position: 'absolute', inset: 0, border: `4px solid ${C.blanc}`, borderRadius: 18, background: 'rgba(242,245,248,0.04)', filter: halo(C.blanc, 0.5)}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 60, height: 4, background: C.blanc, opacity: 0.8}} />
          {Array.from({length: 28}).map((_, k) => {
            const col = k % 7;
            const lig = Math.floor(k / 7);
            const fete = points.findIndex(([c, l]) => c === col && l === lig);
            const on = fete >= 0 ? prog(t, w(137) + fete * 0.3, 0.3) : 0;
            return (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: 32 + col * 50,
                  top: 92 + lig * 56,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  background: on > 0.5 ? C.rose : '#AEB6C0',
                  opacity: on > 0.5 ? 1 : 0.35,
                  boxShadow: on > 0.5 ? `0 0 14px ${C.rose}` : 'none',
                }}
              />
            );
          })}
        </Apparait>
      </Flottant>
    </Plan>
  );
};

// « Chacune d'elles cherche encore quelqu'un comme toi. »
const S15: React.FC = () => {
  const pts = [
    {x: 160, y: 880},
    {x: 400, y: 800},
    {x: 680, y: 800},
    {x: 920, y: 880},
  ];
  return (
    <Plan debut={K[14]} fin={FIN_SCENE}>
      <Perso x={540} cles={[[0, 'debout'], [w(152), 'brasOuverts']]} />
      {pts.map((p, i) => (
        <React.Fragment key={i}>
          <ObjetAir x={p.x} y={p.y} l={70} h={130} a={w(146) + i * 0.2} nom="ballon" couleur="rose" epaisseur={4} remplissage={0.15} carre={false} />
          <Fleche x1={p.x + (540 - p.x) * 0.2} y1={p.y + 90} x2={p.x + (540 - p.x) * 0.62} y2={1000} a={w(148) + i * 0.15} d={0.5} couleur="#AEB6C0" opacity={0.7} />
        </React.Fragment>
      ))}
    </Plan>
  );
};

const EFFETS: Array<[number, string]> = [
  [w(4), 'clic-doux'],
  [w(14), 'piece'],
  [w(18), 'pop-leger'],
  [w(19), 'pop-leger'],
  [w(20), 'pop-leger'],
  [w(21), 'pop-leger'],
  [w(22), 'pop-leger'],
  [w(24), 'pop-leger'],
  [w(29), 'clic-doux'],
  [w(52), 'piece'],
  [w(60), 'clic-doux'],
  [w(64), 'clic-doux'],
  [w(70), 'clic-doux'],
  [w(78), 'piece'],
  [w(94), 'pop-leger'],
  [w(96), 'piece'],
  [w(120), 'pop-leger'],
  [w(125), 'pop-leger'],
  [w(128), 'pop-leger'],
  [w(132), 'clic-doux'],
  [w(137), 'pop-leger'],
];

export const Finance05: React.FC = () => (
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
          <S13 />
          <S14 />
          <S15 />
        </>
      }
      texte={<TexteMotAMot mots={MOTS} phrases={PHRASES} fin={FIN_SCENE} />}
      dessus={<FonduNoir coupes={K.slice(1)} finNoir={FIN_SCENE} />}
    />
    <BandeSon voix="voix/finance-05.wav" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
