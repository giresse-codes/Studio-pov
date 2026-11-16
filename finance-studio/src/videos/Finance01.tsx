import React from 'react';
import {interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-01-mots.json';
import {IconeNeon} from '../composants/IconeNeon';
import {Flottant, SurSol} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Barre, Etiquette, PieceQuiTombe, PileDePieces, prog, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {BandeSon} from '../composants/Sons';
import {ObjetAir, ObjetSol, Perso} from '../composants/raccourcis';
import {C, halo, SOL_Y} from '../style';

// Script 1 — La machine à laver qui travaille pour toi
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {rapporter: 'or', telephone: 'bleu'}},
  {debut: 15, couleurs: {chaussettes: 'attenue'}},
  {debut: 22, couleurs: {machine: 'or', laver: 'or'}},
  {debut: 26, couleurs: {buanderie: 'rouge'}},
  {debut: 35, couleurs: {deux: 'or', quatre: 'or', euros: 'or'}},
  {debut: 47, couleurs: {mille: 'or', deux: 'or', cents: 'or', euros: 'or'}},
  {debut: 59, couleurs: {telephone: 'bleu', moitie: 'rouge'}},
  {debut: 71, couleurs: {lave: 'vert', toujours: 'vert'}},
  {debut: 76, couleurs: {trois: 'or', euros: 'or'}},
  {debut: 84, couleurs: {'84': 'or', '85': 'or', sept: 'or', cents: 'or', '91': 'or'}},
  {debut: 98, couleurs: {rien: 'rouge', personne: 'rouge'}},
  {debut: 107, couleurs: {garanti: 'vert'}},
  {debut: 114, couleurs: {dix: 'bleu', metres: 'bleu', carres: 'bleu', monnayeur: 'or'}},
  {debut: 126, couleurs: {ouvert: 'vert', employe: 'rouge'}},
  {debut: 133, couleurs: {boucheaoreille: 'bleu', marche: 'vert'}},
  {debut: 148, couleurs: {video: 'or', salaire: 'vert'}},
  {debut: 163, couleurs: {laverie: 'attenue'}},
  {debut: 171, couleurs: {reseau: 'or'}},
];

// Coupes entre scènes (fondu par le noir), calées juste avant la phrase suivante.
const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
const K = [0, coupe(15), coupe(26, 0.3), coupe(35, 0.3), coupe(47), coupe(59), coupe(71), coupe(76), coupe(84), coupe(98), coupe(107, 0.3), coupe(114), coupe(126, 0.3), coupe(133), coupe(148), coupe(163)];
const FIN_VOIX = 66.68;
const FIN_SCENE = 67.2;
export const DUREE_F01 = FIN_SCENE + 1.2;

/* ---------- Scènes ---------- */

// « Il y a un objet chez toi qui pourrait te rapporter plus que ton téléphone. »
const S1: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[0]} fin={K[1]}>
      <Perso x={260} cles={[[0, 'debout'], [w(4), 'presenteDroite'], [w(10) + 0.3, 'debout']]} />
      <ObjetSol x={640} l={210} h={210} a={w(4)} nom="cadeau" epaisseur={5} remplissage={0.08} />
      {[0, 1, 2].map((i) => (
        <PieceQuiTombe key={i} x={600 + i * 40} a={w(10) + i * 0.18} y0={900} yFin={SOL_Y - 215 - i * 4} taille={46} duree={0.6} />
      ))}
      <ObjetAir x={900} y={1180} l={110} h={190} a={w(14)} nom="telephone" couleur="bleu" epaisseur={5} remplissage={0.15} />
      <Flottant x={900} y={1330} largeur={50} hauteur={70}>
        <Apparait a={w(14) + 0.4}>
          <IconeNeon nom="flecheBas" couleur="rouge" epaisseur={5} trace={prog(t, w(14) + 0.4, 0.5)} />
        </Apparait>
      </Flottant>
    </Plan>
  );
};

// « Et tu l'utilises juste pour tes chaussettes. La machine à laver. »
const S2: React.FC = () => {
  const t = useT();
  const chausse = interpolate(t, [w(21), w(21) + 0.9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pOr = prog(t, w(23), 0.6);
  return (
    <Plan debut={K[1]} fin={K[2]}>
      <Perso x={250} cles={[[0, 'debout'], [w(16), 'pointeDroite'], [w(22), 'brasOuverts']]} />
      <SurSol x={680} largeur={280} hauteur={330}>
        <div style={{position: 'absolute', inset: 0, opacity: 1 - pOr}}>
          <IconeNeon nom="machineALaver" epaisseur={5} remplissage={0.06} tambour={t * 40} />
        </div>
        <div style={{position: 'absolute', inset: 0, opacity: pOr}}>
          <IconeNeon nom="machineALaver" couleur="or" epaisseur={5} remplissage={0.1} tambour={t * 40} />
        </div>
      </SurSol>
      {/* la chaussette glisse dans le hublot puis disparaît */}
      {t < w(22) && (
        <Flottant x={680 + 140 * (1 - chausse)} y={interpolate(chausse, [0, 1], [930, 1300])} largeur={80} hauteur={90}>
          <Apparait a={w(21) - 0.3} style={{transform: `rotate(${chausse * 25}deg)`}}>
            <div style={{width: '100%', height: '100%', opacity: 1 - Math.max(0, chausse - 0.7) / 0.3}}>
              <IconeNeon nom="chaussette" couleur="#C9D1DB" epaisseur={4} remplissage={0.1} />
            </div>
          </Apparait>
        </Flottant>
      )}
    </Plan>
  );
};

// « Dans les quartiers étudiants et les immeubles sans buanderie, »
const S3: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[2]} fin={K[3]}>
      <ObjetSol x={300} l={200} h={420} a={w(28)} nom="immeuble" epaisseur={5} remplissage={0.05} />
      <ObjetSol x={540} l={240} h={520} a={w(30)} nom="immeuble" epaisseur={5} remplissage={0.05} />
      <ObjetSol x={780} l={200} h={380} a={w(32)} nom="immeuble" epaisseur={5} remplissage={0.05} />
      <ObjetAir x={540} y={760} l={130} h={150} a={w(33)} nom="machineALaver" epaisseur={4} remplissage={0.05} intensite={0.6} />
      <Flottant x={540} y={760} largeur={170} hauteur={170}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={7} trace={prog(t, w(34), 0.5)} />
      </Flottant>
    </Plan>
  );
};

// « les gens paient entre deux et quatre euros pour laver une machine. »
const S4: React.FC = () => (
  <Plan debut={K[3]} fin={K[4]}>
    {[0, 1, 2].map((i) => (
      <Perso key={i} x={170 + i * 150} echelle={0.62} gris a={w(35) + i * 0.15} />
    ))}
    <ObjetSol x={790} l={250} h={300} a={w(37)} nom="machineALaver" epaisseur={5} remplissage={0.06} />
    <ObjetAir x={720} y={1000} l={70} h={70} a={w(39)} nom="piece" couleur="or" epaisseur={3} />
    <Etiquette x={720} y={1110} texte="2 €" couleur="or" taille={46} a={w(39)} />
    <ObjetAir x={880} y={1000} l={70} h={70} a={w(41)} nom="piece" couleur="or" epaisseur={3} />
    <Etiquette x={880} y={1110} texte="4 €" couleur="or" taille={46} a={w(41)} />
  </Plan>
);

// « Une seule machine semi-pro, c'est environ mille deux cents euros, une fois. »
const S5: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[4]} fin={K[5]}>
      <ObjetSol x={540} l={300} h={360} a={K[4] + 0.1} nom="machineALaver" epaisseur={6} remplissage={0.08} tambour={t * 30} />
      <ObjetAir x={800} y={1050} l={300} h={130} a={w(53)} nom="etiquette" couleur="or" epaisseur={5} remplissage={0.12} />
      <Etiquette x={754} y={1064} texte="1 200 €" couleur="or" taille={32} a={w(53) + 0.15} style={{letterSpacing: '0.02em'}} />
      <Etiquette x={300} y={1080} texte="× 1" couleur="vert" taille={60} a={w(58)} />
    </Plan>
  );
};

// « Un téléphone au même prix, lui, vaut la moitié dans un an. »
const S6: React.FC = () => {
  const t = useT();
  const niveau = interpolate(t, [w(65), w(68) + 0.6], [1, 0.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Plan debut={K[5]} fin={K[6]}>
      <ObjetSol x={380} l={170} h={320} a={w(60)} nom="telephone" couleur="bleu" epaisseur={6} remplissage={0.15} />
      <ObjetSol x={620} l={110} h={300} a={w(62)} nom="jauge" couleur={niveau < 0.95 ? 'rouge' : 'vert'} epaisseur={4} remplissage={0.06} niveau={niveau} />
      <ObjetAir x={830} y={1000} l={150} h={140} a={w(68)} nom="calendrier" epaisseur={4} remplissage={0.06} />
      <Etiquette x={620} y={1120} texte="−50 %" couleur="rouge" taille={40} a={w(67) + 0.2} />
    </Plan>
  );
};

// « La machine, elle, lave toujours. »
const S7: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[6]} fin={K[7]}>
      <ObjetSol x={540} l={300} h={360} a={K[6] + 0.1} nom="machineALaver" epaisseur={6} remplissage={0.08} tambour={t * 90} />
      <Flottant x={540} y={1000} largeur={150} hauteur={120}>
        <IconeNeon nom="coche" couleur="vert" epaisseur={8} trace={prog(t, w(74), 0.5)} />
      </Flottant>
    </Plan>
  );
};

// « Mettons huit lavages par jour, à trois euros. »
const S8: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[7]} fin={K[8]}>
      <ObjetSol x={330} l={260} h={310} a={K[7] + 0.1} nom="machineALaver" epaisseur={5} remplissage={0.06} tambour={t * 90} />
      <Etiquette x={720} y={1240} texte="× 8" couleur="blanc" taille={64} a={w(77)} />
      <Flottant x={720} y={1350} largeur={480} hauteur={48}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} style={{width: 44, height: 48, opacity: prog(t, w(77) + i * 0.12, 0.25)}}>
              <IconeNeon nom="machineALaver" epaisseur={2.5} remplissage={0} intensite={0.4} />
            </div>
          ))}
        </div>
      </Flottant>
      <ObjetAir x={660} y={1060} l={80} h={80} a={w(82)} nom="piece" couleur="or" epaisseur={3} />
      <Etiquette x={790} y={1080} texte="3 €" couleur="or" taille={50} a={w(82)} />
    </Plan>
  );
};

// « Vingt-quatre euros par jour, environ sept cents euros par mois, avec une seule machine. »
const S9: React.FC = () => {
  const t = useT();
  const mois = t >= w(89);
  return (
    <Plan debut={K[8]} fin={K[9]}>
      <ObjetSol x={250} l={210} h={250} a={w(94)} nom="machineALaver" epaisseur={5} remplissage={0.06} tambour={t * 90} />
      <ObjetAir x={540} y={880} l={150} h={140} a={w(84)} nom="calendrier" epaisseur={4} remplissage={0.06} />
      <Etiquette x={540} y={1060} texte={mois ? '700 € / MOIS' : '24 € / JOUR'} couleur="or" taille={40} a={w(84) + 0.1} style={{letterSpacing: '0.12em'}} />
      <Barre x={540} y={1130} largeur={460} a={w(84) + 0.2} d={w(93) - w(84)} couleur="or" />
      <PileDePieces x={780} a={w(86)} n={14} d={w(93) - w(86)} largeur={150} />
    </Plan>
  );
};

// « Tu ne vends rien, tu ne convaincs personne : »
const S10: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[9]} fin={K[10]}>
      <Perso x={260} cles={[[0, 'mainsHanches']]} />
      <ObjetAir x={600} y={1060} l={170} h={110} a={w(100)} nom="etiquette" epaisseur={5} remplissage={0.06} intensite={0.6} />
      <Flottant x={600} y={1060} largeur={150} hauteur={150}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={6} trace={prog(t, w(101), 0.45)} />
      </Flottant>
      <Perso x={860} echelle={0.62} gris a={w(104)} />
      <Flottant x={860} y={1180} largeur={190} hauteur={190}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={6} trace={prog(t, w(105), 0.45)} />
      </Flottant>
    </Plan>
  );
};

// « le linge sale, c'est garanti chaque semaine. »
const S11: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[10]} fin={K[11]}>
      <ObjetSol x={380} l={260} h={230} a={w(108)} nom="panierLinge" epaisseur={5} remplissage={0.08} />
      <ObjetAir x={740} y={1220} l={210} h={200} a={w(112)} nom="calendrier" epaisseur={5} remplissage={0.06} />
      <Flottant x={740} y={1040} largeur={130} hauteur={100}>
        <IconeNeon nom="coche" couleur="vert" epaisseur={8} trace={prog(t, w(111), 0.5)} />
      </Flottant>
    </Plan>
  );
};

// « Un local de dix mètres carrés, deux machines, un sèche-linge, un monnayeur. »
const S12: React.FC = () => {
  const t = useT();
  const pLocal = prog(t, w(115), 1.0);
  return (
    <Plan debut={K[11]} fin={K[12]}>
      {/* le local en schéma : un cadre tracé au sol */}
      <SurSol x={540} largeur={900} hauteur={470}>
        <svg width="100%" height="100%" viewBox="0 0 900 470" style={{overflow: 'visible', filter: halo(C.bleu, 0.6)}}>
          <path
            d="M 20 470 L 20 20 L 880 20 L 880 470"
            fill="none"
            stroke={C.bleu}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - pLocal}
          />
        </svg>
      </SurSol>
      <Etiquette x={540} y={990} texte="10 m²" couleur="bleu" taille={44} a={w(117)} />
      <ObjetSol x={160} l={160} h={200} a={w(120)} nom="machineALaver" epaisseur={4} remplissage={0.06} tambour={t * 90} />
      <ObjetSol x={350} l={160} h={200} a={w(121)} nom="machineALaver" epaisseur={4} remplissage={0.06} tambour={t * 90 + 40} />
      <ObjetSol x={570} l={160} h={200} a={w(123)} nom="secheLinge" epaisseur={4} remplissage={0.06} tambour={t * 60} />
      <ObjetSol x={850} l={110} h={240} a={w(125)} nom="monnayeur" couleur="or" epaisseur={4} remplissage={0.08} />
    </Plan>
  );
};

// « Ouvert vingt-quatre heures sur vingt-quatre, sans employé. »
const S13: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[12]} fin={K[13]}>
      <ObjetAir x={380} y={1150} l={260} h={260} a={w(126)} nom="horloge" epaisseur={5} remplissage={0.05} aiguille={(t - w(126)) * 260} />
      <Etiquette x={380} y={1360} texte="24/24" couleur="vert" taille={46} a={w(127)} />
      <Perso x={780} echelle={0.7} gris a={w(131) - 0.3} />
      <Flottant x={780} y={1230} largeur={220} hauteur={220}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={6} trace={prog(t, w(132), 0.45)} />
      </Flottant>
    </Plan>
  );
};

// « Le bouche-à-oreille fait le reste, parce que personne ne change de laverie quand elle marche. »
const S14: React.FC = () => {
  const t = useT();
  const xs = [200, 420, 660, 880];
  const echelle = 0.55;
  const yTete = SOL_Y - 700 * echelle + 40;
  return (
    <Plan debut={K[13]} fin={K[14]}>
      {xs.map((x, i) => (
        <Perso key={i} x={x} echelle={echelle} gris={i > 0} a={w(133) + i * 0.35} />
      ))}
      {/* le bouche-à-oreille : arcs qui relient les têtes un à un */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: halo(C.bleu, 0.6)}}>
        {xs.slice(0, -1).map((x, i) => {
          const x2 = xs[i + 1];
          const p = prog(t, w(134) + i * 0.45, 0.5);
          return (
            <path
              key={i}
              d={`M ${x + 40} ${yTete - 30} Q ${(x + x2) / 2} ${yTete - 150} ${x2 - 40} ${yTete - 30}`}
              fill="none"
              stroke={C.bleu}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray="10 12"
              strokeDashoffset={0}
              opacity={p}
              clipPath={undefined}
            />
          );
        })}
      </svg>
      <ObjetAir x={540} y={850} l={150} h={180} a={w(144)} nom="machineALaver" epaisseur={4} remplissage={0.06} tambour={t * 90} />
      <Flottant x={660} y={800} largeur={90} hauteur={70}>
        <IconeNeon nom="coche" couleur="vert" epaisseur={7} trace={prog(t, w(147), 0.45)} />
      </Flottant>
    </Plan>
  );
};

// « Enregistre cette vidéo, et calcule combien de machines il te faut pour remplacer ton salaire. »
const S15: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[14]} fin={K[15]}>
      <ObjetAir x={250} y={960} l={200} h={290} a={w(148)} nom="telephone" epaisseur={5} remplissage={0.06} />
      <Flottant x={250} y={960} largeur={70} hauteur={80}>
        <Apparait a={w(148) + 0.1}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
            <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
          </svg>
        </Apparait>
      </Flottant>
      <ObjetAir x={320} y={840} l={60} h={90} a={w(150)} nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
      {[0, 1, 2, 3].map((i) => (
        <ObjetSol key={i} x={190 + i * 150} l={130} h={160} a={w(155) + i * 0.2} nom="machineALaver" epaisseur={4} remplissage={0.06} tambour={t * 90 + i * 30} />
      ))}
      <Etiquette x={770} y={1360} texte="=" couleur="blanc" taille={60} a={w(160)} />
      <ObjetSol x={900} l={200} h={120} a={w(161)} nom="billet" couleur="vert" epaisseur={5} remplissage={0.12} />
    </Plan>
  );
};

// « Un jour, ce ne sera plus une laverie. Ce sera ton réseau. »
const S16: React.FC = () => {
  const t = useT();
  const reseau = prog(t, w(171), 0.8);
  // une laverie au centre, puis d'autres qui s'allument autour et se relient
  const pts = [
    {x: 540, y: 1180},
    {x: 220, y: 900},
    {x: 860, y: 900},
    {x: 240, y: 1330},
    {x: 840, y: 1330},
  ];
  return (
    <Plan debut={K[15]} fin={FIN_SCENE}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: halo(C.or, 0.6)}}>
        {pts.slice(1).map((p, i) => (
          <line
            key={i}
            x1={pts[0].x}
            y1={pts[0].y}
            x2={pts[0].x + (p.x - pts[0].x) * prog(t, w(172) + i * 0.15, 0.5)}
            y2={pts[0].y + (p.y - pts[0].y) * prog(t, w(172) + i * 0.15, 0.5)}
            stroke={C.or}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.8}
          />
        ))}
      </svg>
      {pts.map((p, i) => {
        const a = i === 0 ? K[15] + 0.1 : w(169) + i * 0.2;
        const doree = i === 0 ? reseau : prog(t, w(171) + i * 0.15, 0.5);
        const taille = i === 0 ? 200 : 130;
        return (
          <Flottant key={i} x={p.x} y={p.y} largeur={taille} hauteur={taille * 1.2}>
            <Apparait a={a}>
              <div style={{position: 'absolute', inset: 0, opacity: 1 - doree}}>
                <IconeNeon nom="machineALaver" epaisseur={4} remplissage={0.06} tambour={t * 60 + i * 50} intensite={0.7} />
              </div>
              <div style={{position: 'absolute', inset: 0, opacity: doree}}>
                <IconeNeon nom="machineALaver" couleur="or" epaisseur={4} remplissage={0.1} tambour={t * 60 + i * 50} />
              </div>
            </Apparait>
          </Flottant>
        );
      })}
    </Plan>
  );
};

const EFFETS: Array<[number, string]> = [
  [w(4), 'clic-doux'],
  [w(10), 'piece'],
  [w(14), 'clic-doux'],
  [w(23), 'pop-leger'],
  [w(34), 'clic-doux'],
  [w(39), 'piece'],
  [w(41), 'piece'],
  [w(53), 'piece'],
  [w(74), 'pop-leger'],
  [w(82), 'piece'],
  [w(89), 'piece'],
  [w(101), 'clic-doux'],
  [w(105), 'clic-doux'],
  [w(111), 'pop-leger'],
  [w(120), 'clic-doux'],
  [w(121), 'clic-doux'],
  [w(123), 'clic-doux'],
  [w(125), 'piece'],
  [w(132), 'clic-doux'],
  [w(147), 'pop-leger'],
  [w(150), 'clic-doux'],
  [w(161), 'piece'],
  [w(171), 'pop-leger'],
];

export const Finance01: React.FC = () => (
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
          <S16 />
        </>
      }
      texte={<TexteMotAMot mots={MOTS} phrases={PHRASES} fin={FIN_SCENE} />}
      dessus={<FonduNoir coupes={K.slice(1)} finNoir={FIN_SCENE} />}
    />
    <BandeSon voix="voix/finance-01.wav" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
