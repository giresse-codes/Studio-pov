import React from 'react';
import {interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-02-mots.json';
import {Bonhomme} from '../composants/Bonhomme';
import {IconeNeon} from '../composants/IconeNeon';
import {Flottant, SurSol} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Etiquette, PieceQuiTombe, PileDePieces, prog, sortie, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {Fleche} from '../composants/Fleche';
import {BandeSon} from '../composants/Sons';
import {ObjetAir, ObjetSol, Perso} from '../composants/raccourcis';
import {C, couleur as resoudreCouleur, halo, SOL_Y} from '../style';

// Script 2 — Pourquoi ton salaire ne te rendra jamais riche
// (dans la voix, « Même » de « Même avec un bon réseau » n'est pas prononcé : il est retiré du texte)
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {plafond: 'rouge'}},
  {debut: 5, couleurs: {contrat: 'bleu'}},
  {debut: 12, couleurs: {temps: 'bleu', largent: 'or'}},
  {debut: 20, couleurs: {vingtquatre: 'bleu', heures: 'bleu'}},
  {debut: 28, couleurs: {vingtcinquieme: 'rouge'}},
  {debut: 37, couleurs: {reseau: 'bleu'}},
  {debut: 41, couleurs: {riches: 'or'}},
  {debut: 50, couleurs: {gagnent: 'vert', sans: 'vert', eux: 'vert'}},
  {debut: 58, couleurs: {actif: 'vert', largent: 'or'}},
  {debut: 75},
  {debut: 86, couleurs: {passif: 'rouge', sort: 'rouge'}},
  {debut: 95, couleurs: {credit: 'rouge'}},
  {debut: 105},
  {debut: 110, couleurs: {salaire: 'or', actifs: 'vert'}},
  {debut: 117, couleurs: {actifs: 'vert', passifs: 'rouge'}},
  {debut: 122, couleurs: {linverse: 'rouge'}},
  {debut: 124, couleurs: {premier: 'vert', grand: 'attenue'}},
  {debut: 132, couleurs: {dexister: 'vert'}},
  {debut: 136, couleurs: {video: 'or', rapporte: 'vert'}},
  {debut: 148, couleurs: {vide: 'rouge', objectif: 'vert'}},
];

const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
// Une scène par idée
const K = [0, coupe(12), coupe(20), coupe(37), coupe(41), coupe(50), coupe(58), coupe(75), coupe(86), coupe(105), coupe(124), coupe(136)];
const FIN_VOIX = 51.52;
const FIN_SCENE = 52.0;
export const DUREE_F02 = FIN_SCENE + 1.2;

/* ---------- Scènes ---------- */

// « Ton salaire a un plafond. Et il est écrit sur ton contrat. »
const S1: React.FC = () => {
  const t = useT();
  const yPlafond = 1080;
  return (
    <Plan debut={K[0]} fin={K[1]}>
      <Perso x={250} cles={[[0, 'debout'], [w(1), 'pointeDroite']]} />
      {/* le salaire monte… puis bute contre le plafond */}
      <PileDePieces x={600} a={w(1)} n={22} d={w(4) - w(1) + 0.15} largeur={160} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: halo(C.rouge)}}>
        <path
          d={`M 470 ${yPlafond} H 730`}
          stroke={C.rouge}
          strokeWidth={6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - prog(t, w(4) - 0.1, 0.4)}
        />
      </svg>
      <ObjetAir x={880} y={1080} l={190} h={240} a={w(8)} nom="contrat" epaisseur={4} remplissage={0.06} />
      <Flottant x={880} y={1112} largeur={110} hauteur={10}>
        <div style={{height: 5, borderRadius: 3, background: C.rouge, boxShadow: `0 0 10px ${C.rouge}`, width: `${prog(t, w(11), 0.4) * 100}%`}} />
      </Flottant>
    </Plan>
  );
};

// « Un salarié échange son temps contre de l'argent. »
const S2: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[1]} fin={K[2]}>
      <Perso x={230} cles={[[0, 'debout'], [w(14), 'presenteDroite']]} />
      <ObjetAir x={560} y={1150} l={190} h={190} a={w(16)} nom="horloge" couleur="bleu" epaisseur={5} remplissage={0.08} aiguille={(t - w(16)) * 140} />
      <Fleche x1={680} y1={1120} x2={790} y2={1120} a={w(17)} d={0.4} />
      <Fleche x1={790} y1={1185} x2={680} y2={1185} a={w(17) + 0.2} d={0.4} />
      <ObjetAir x={900} y={1150} l={130} h={130} a={w(19)} nom="piece" couleur="or" epaisseur={3} />
    </Plan>
  );
};

// « Le problème, c'est que tu as vingt-quatre heures, et tu ne peux pas en acheter une vingt-cinquième. »
const S3: React.FC = () => {
  const t = useT();
  // l'aiguille fait le tour complet des 24 h, puis bloque
  const tour = interpolate(t, [w(26) - 0.2, w(27) + 0.8], [0, 360], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const bloque = t > w(34) ? Math.sin((t - w(34)) * 40) * 3 * Math.max(0, 1 - (t - w(34)) * 2) : 0;
  return (
    <Plan debut={K[2]} fin={K[3]}>
      <ObjetAir x={430} y={1120} l={340} h={340} a={K[2] + 0.15} nom="horloge" epaisseur={6} remplissage={0.05} aiguille={tour + bloque} />
      <Etiquette x={430} y={1390} texte="24 H" couleur="bleu" taille={50} a={w(26)} />
      <ObjetAir x={820} y={1150} l={170} h={170} a={w(35)} nom="horloge" couleur="#AEB6C0" epaisseur={4} remplissage={0.03} intensite={0.4} aiguille={30} />
      <Etiquette x={820} y={1330} texte="25E" couleur="rouge" taille={40} a={w(35)} />
      <Flottant x={820} y={1150} largeur={220} hauteur={220}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={7} trace={prog(t, w(36), 0.45)} />
      </Flottant>
    </Plan>
  );
};

// « Avec un bon réseau. »
const S4: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[3]} fin={K[4]}>
      <Perso x={260} cles={[[0, 'debout'], [w(38), 'presenteDroite']]} />
      <ObjetAir x={640} y={1200} l={130} h={230} a={K[3] + 0.1} nom="telephone" couleur="bleu" epaisseur={5} remplissage={0.12} />
      <Flottant x={850} y={1080} largeur={120} hauteur={110}>
        <Apparait a={w(39)}>
          <IconeNeon nom="signal" couleur="bleu" epaisseur={4} remplissage={0.3} trace={prog(t, w(39), 0.6)} />
        </Apparait>
      </Flottant>
    </Plan>
  );
};

// « Les gens riches ne gagnent pas plus par heure. »
const S5: React.FC = () => (
  <Plan debut={K[4]} fin={K[5]}>
    <Perso x={290} echelle={0.75} gris a={w(42) - 0.2} />
    <Perso x={790} echelle={0.75} gris a={w(43)} />
    {[290, 790].map((x, i) => (
      <React.Fragment key={x}>
        <ObjetAir x={x - 60} y={850} l={100} h={100} a={w(47) + i * 0.15} nom="horloge" couleur="bleu" epaisseur={4} remplissage={0.05} aiguille={90} />
        <ObjetAir x={x + 60} y={850} l={80} h={80} a={w(47) + i * 0.15} nom="piece" couleur="or" epaisseur={3} />
      </React.Fragment>
    ))}
    <Etiquette x={540} y={1180} texte="=" taille={80} a={w(46)} />
  </Plan>
);

// « Ils possèdent des choses qui gagnent sans eux. »
const S6: React.FC = () => {
  const t = useT();
  const allonge = prog(t, w(56) - 0.2, 0.8);
  return (
    <Plan debut={K[5]} fin={K[6]}>
      <SurSol x={90} largeur={640 * 0.6} hauteur={700 * 0.6}>
        <div style={{width: '100%', height: '100%', opacity: prog(t, K[5], 0.4)}}>
          <PersoBrut allonge={allonge} />
        </div>
      </SurSol>
      <ObjetSol x={580} l={190} h={160} a={w(51)} nom="maison" epaisseur={5} remplissage={0.06} />
      <ObjetSol x={770} l={150} h={180} a={w(52) + 0.1} nom="machineALaver" epaisseur={5} remplissage={0.06} tambour={t * 80} />
      <ObjetSol x={950} l={170} h={145} a={w(53)} nom="ordinateur" epaisseur={5} remplissage={0.06} />
      {[580, 770, 950].map((x, i) => (
        <PieceQuiTombe key={x} x={x} a={w(55) + i * 0.2} y0={880} yFin={SOL_Y - 190 - (i === 1 ? 10 : 0)} taille={50} duree={0.6} />
      ))}
    </Plan>
  );
};

const PersoBrut: React.FC<{allonge: number}> = ({allonge}) => <Bonhomme pose="debout" couleur={C.gris} allonge={allonge} />;

// « Un actif, c'est tout ce qui met de l'argent dans ta poche pendant que tu dors : »
const S7: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[6]} fin={K[7]}>
      <Etiquette x={540} y={760} texte="ACTIF" couleur="vert" taille={52} a={w(59)} style={{letterSpacing: '0.2em'}} />
      <SurSol x={130} largeur={640 * 0.7} hauteur={700 * 0.7}>
        <div style={{width: '100%', height: '100%', opacity: prog(t, w(70), 0.4)}}>
          <Bonhomme pose="debout" allonge={1} />
        </div>
      </SurSol>
      <ObjetSol x={820} l={230} h={190} a={w(65)} nom="portefeuille" epaisseur={5} remplissage={0.08} />
      <Flottant x={820} y={1050} largeur={50} hauteur={150}>
        <Apparait a={w(66)}>
          <IconeNeon nom="flecheBas" couleur="vert" epaisseur={6} />
        </Apparait>
      </Flottant>
      {[0, 1, 2, 3].map((i) => (
        <PieceQuiTombe key={i} x={795 + (i % 2) * 50} a={w(67) + i * 0.45} y0={850} yFin={SOL_Y - 140} taille={48} duree={0.55} />
      ))}
    </Plan>
  );
};

// « une chambre louée, une machine, un contenu publié, une part d'entreprise. »
const S8: React.FC = () => {
  const t = useT();
  const items: Array<{nom: React.ComponentProps<typeof IconeNeon>['nom']; a: number; l: number; h: number}> = [
    {nom: 'lit', a: w(76), l: 190, h: 140},
    {nom: 'machineALaver', a: w(79), l: 130, h: 160},
    {nom: 'video', a: w(81), l: 180, h: 150},
    {nom: 'camembert', a: w(84), l: 150, h: 150},
  ];
  const xs = [170, 400, 650, 900];
  return (
    <Plan debut={K[7]} fin={K[8]}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <ObjetSol x={xs[i]} l={it.l} h={it.h} a={it.a} nom={it.nom} epaisseur={5} remplissage={0.08} tambour={t * 80} />
          <ObjetAir x={xs[i]} y={SOL_Y - it.h - 90} l={34} h={90} a={it.a + 0.3} nom="flecheHaut" couleur="vert" epaisseur={5} />
        </React.Fragment>
      ))}
    </Plan>
  );
};

// « Un passif, c'est tout ce qui en sort : la voiture à crédit, l'abonnement oublié, le téléphone dernier cri. »
const S9: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[8]} fin={K[9]}>
      <Etiquette x={540} y={760} texte="PASSIF" couleur="rouge" taille={52} a={w(87)} style={{letterSpacing: '0.2em'}} />
      <ObjetAir x={540} y={1000} l={200} h={165} a={w(86)} nom="portefeuille" epaisseur={5} remplissage={0.06} />
      {[0, 1, 2].map((i) => {
        const a = w(93) + i * 0.25;
        const p = prog(t, a, 0.9);
        return p > 0 && p < 1 ? (
          <Flottant key={i} x={540 + (i - 1) * 60 + p * (i - 1) * 120} y={980 - p * 200} largeur={44} hauteur={44} opacity={1 - p}>
            <IconeNeon nom="piece" couleur="or" epaisseur={3} />
          </Flottant>
        ) : null;
      })}
      <ObjetSol x={210} l={240} h={140} a={w(96)} nom="voiture" epaisseur={5} remplissage={0.06} />
      <ObjetSol x={540} l={200} h={130} a={w(99)} nom="carteBancaire" couleur="#AEB6C0" epaisseur={4} remplissage={0.04} intensite={0.5} />
      <ObjetSol x={860} l={110} h={200} a={w(102)} nom="telephone" couleur="bleu" epaisseur={5} remplissage={0.12} />
      {[210, 540, 860].map((x, i) => (
        <ObjetAir key={x} x={x} y={1240} l={30} h={70} a={[w(98), w(100), w(104)][i]} nom="flecheHaut" couleur="rouge" epaisseur={5} />
      ))}
    </Plan>
  );
};

// « La règle est simple : ton salaire sert à acheter des actifs. Les actifs paient tes passifs. Pas l'inverse. »
const S10: React.FC = () => {
  const t = useT();
  const xA = 280;
  const xP = 800;
  return (
    <Plan debut={K[9]} fin={K[10]}>
      <Etiquette x={xA} y={1030} texte="ACTIFS" couleur="vert" taille={42} a={K[9] + 0.2} style={{letterSpacing: '0.18em'}} />
      <Etiquette x={xP} y={1030} texte="PASSIFS" couleur="rouge" taille={42} a={K[9] + 0.4} style={{letterSpacing: '0.18em'}} />
      <ObjetSol x={xA - 80} l={150} h={125} a={K[9] + 0.3} nom="maison" epaisseur={4} remplissage={0.06} />
      <ObjetSol x={xA + 85} l={105} h={130} a={K[9] + 0.4} nom="machineALaver" epaisseur={4} remplissage={0.06} tambour={t * 80} />
      <ObjetSol x={xP - 70} l={170} h={100} a={K[9] + 0.5} nom="voiture" epaisseur={4} remplissage={0.06} />
      <ObjetSol x={xP + 90} l={70} h={130} a={K[9] + 0.6} nom="telephone" epaisseur={4} remplissage={0.06} />
      {/* le salaire */}
      <ObjetAir x={540} y={760} l={180} h={100} a={w(111)} nom="billet" couleur="or" epaisseur={5} remplissage={0.12} />
      <Fleche x1={440} y1={790} x2={xA + 20} y2={950} a={w(114)} courbe={40} couleur="or" />
      {/* les actifs paient les passifs */}
      <Fleche x1={xA + 120} y1={1180} x2={xP - 140} y2={1180} a={w(119)} courbe={90} couleur="vert" />
      {/* pas l'inverse */}
      <Fleche x1={xP - 140} y1={1300} x2={xA + 120} y2={1300} a={w(122)} d={0.45} courbe={-60} couleur="#AEB6C0" opacity={0.7} />
      <Flottant x={540} y={1330} largeur={120} hauteur={120}>
        <IconeNeon nom="croix" couleur="rouge" epaisseur={7} trace={prog(t, w(123), 0.4)} />
      </Flottant>
    </Plan>
  );
};

// « Le premier actif n'a pas besoin d'être grand. Il a besoin d'exister. »
const S11: React.FC = () => {
  const t = useT();
  const vert = prog(t, w(135), 0.5);
  return (
    <Plan debut={K[10]} fin={K[11]}>
      <SurSol x={720} largeur={400} hauteur={330} opacity={sortie(t, w(131) + 0.3, 0.6)}>
        <Apparait a={w(129)}>
          <IconeNeon nom="maison" couleur="#AEB6C0" epaisseur={4} remplissage={0.02} intensite={0.3} />
        </Apparait>
      </SurSol>
      <SurSol x={380} largeur={150} hauteur={125}>
        <Apparait a={w(125)}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - vert}}>
            <IconeNeon nom="maison" epaisseur={4} remplissage={0.06} />
          </div>
          <div style={{position: 'absolute', inset: 0, opacity: vert}}>
            <IconeNeon nom="maison" couleur="vert" epaisseur={4} remplissage={0.12} />
          </div>
        </Apparait>
      </SurSol>
      <Flottant x={380} y={1250} largeur={110} hauteur={90}>
        <IconeNeon nom="coche" couleur="vert" epaisseur={7} trace={prog(t, w(135) + 0.2, 0.5)} />
      </Flottant>
    </Plan>
  );
};

// « Enregistre cette vidéo, et liste ce que tu possèdes qui te rapporte.
//   Si la liste est vide, tu viens de trouver ton prochain objectif. »
const S12: React.FC = () => {
  const t = useT();
  const lignes = [w(149), w(150) + 0.15, w(152)];
  return (
    <Plan debut={K[11]} fin={FIN_SCENE}>
      {/* vidéo enregistrée, puis le « toi » qui réfléchit */}
      <Flottant x={250} y={1060} largeur={180} hauteur={260} opacity={sortie(t, w(148) - 0.4)}>
        <Apparait a={w(136)}>
          <IconeNeon nom="telephone" epaisseur={5} remplissage={0.06} />
        </Apparait>
      </Flottant>
      <Flottant x={250} y={1060} largeur={60} hauteur={70} opacity={sortie(t, w(148) - 0.4)}>
        <Apparait a={w(136) + 0.1}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
            <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
          </svg>
        </Apparait>
      </Flottant>
      <Flottant x={312} y={950} largeur={56} hauteur={84} opacity={sortie(t, w(148) - 0.4)}>
        <Apparait a={w(138)}>
          <IconeNeon nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
        </Apparait>
      </Flottant>
      <Perso x={250} echelle={0.85} cles={[[0, 'reflechit']]} a={w(148) - 0.1} />
      {/* la liste, ligne par ligne, avec des « ? » */}
      <Flottant x={730} y={1180} largeur={340} hauteur={440}>
        <Apparait a={w(140)}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              border: `4px solid ${C.blanc}`,
              borderRadius: 14,
              background: 'rgba(242,245,248,0.05)',
              filter: halo(C.blanc, 0.6),
            }}
          />
          {lignes.map((a, i) => (
            <div key={i} style={{position: 'absolute', left: 40, top: 80 + i * 110, width: 260, height: 60, display: 'flex', alignItems: 'center', gap: 26}}>
              <div style={{width: 160 * prog(t, w(141) + i * 0.25, 0.5), height: 5, borderRadius: 3, background: '#AEB6C0', opacity: 0.6}} />
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 800,
                  fontSize: 46,
                  color: '#AEB6C0',
                  opacity: prog(t, a, 0.25),
                }}
              >
                ?
              </div>
            </div>
          ))}
        </Apparait>
      </Flottant>
      <ObjetAir x={730} y={860} l={140} h={140} a={w(157)} nom="cible" couleur="vert" epaisseur={5} remplissage={0.08} />
    </Plan>
  );
};

const EFFETS: Array<[number, string]> = [
  [w(4), 'clic-doux'],
  [w(11), 'clic-doux'],
  [w(19), 'piece'],
  [w(36), 'clic-doux'],
  [w(39), 'pop-leger'],
  [w(55), 'piece'],
  [w(67), 'piece'],
  [w(76), 'pop-leger'],
  [w(79), 'pop-leger'],
  [w(81), 'pop-leger'],
  [w(84), 'pop-leger'],
  [w(93), 'clic-doux'],
  [w(111), 'piece'],
  [w(123), 'clic-doux'],
  [w(135), 'pop-leger'],
  [w(138), 'clic-doux'],
  [w(157), 'pop-leger'],
];

export const Finance02: React.FC = () => (
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
    <BandeSon voix="voix/finance-02.wav" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
