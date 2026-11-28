import React from 'react';
import {interpolate} from 'remotion';
import MOTS_JSON from '../donnees/finance-10-mots.json';
import {IconeNeon, NomIcone} from '../composants/IconeNeon';
import {Flottant, SurSol} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, Etiquette, prog, sortie, useT} from '../composants/anim';
import {CadreVideo} from '../composants/Video';
import {BandeSon} from '../composants/Sons';
import {ObjetAir, ObjetSol, Perso, Prix} from '../composants/raccourcis';
import {C, halo, SOL_Y} from '../style';

// Script 10 — Le lavage auto à domicile
const MOTS = MOTS_JSON as Mot[];
const w = (i: number) => MOTS[i].s;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PHRASES: Phrase[] = [
  {debut: 0, couleurs: {paient: 'or'}},
  {debut: 7, couleurs: {rentable: 'vert', paresse: 'attenue'}},
  {debut: 20, couleurs: {lavage: 'bleu', auto: 'bleu'}},
  {debut: 25},
  {debut: 37, couleurs: {trois: 'or', cents: 'or', euros: 'or'}},
  {debut: 42, couleurs: {client: 'bleu'}},
  {debut: 53, couleurs: {vingtcinq: 'or', a: 'or', cinquante: 'or', euros: 'or'}},
  {debut: 62, couleurs: {heure: 'bleu'}},
  {debut: 66, couleurs: {cent: 'vert', cinquante: 'vert', euros: 'vert'}},
  {debut: 76, couleurs: {canape: 'attenue'}},
  {debut: 86, couleurs: {remerciera: 'rose'}},
  {debut: 90, couleurs: {labonnement: 'bleu'}},
  {debut: 95, couleurs: {fixe: 'bleu', gagnes: 'vert'}},
  {debut: 114, couleurs: {vingt: 'vert', abonnes: 'vert', plein: 'vert'}},
  {debut: 127, couleurs: {video: 'or', sales: 'attenue'}},
];

const coupe = (i: number, avant = 0.35) => +(w(i) - avant).toFixed(2);
const K = [0, coupe(20), coupe(25), coupe(42), coupe(53), coupe(66), coupe(76), coupe(90), coupe(114), coupe(127)];
const FIN_VOIX = 44.3;
const FIN_SCENE = 44.6;
export const DUREE_F10 = FIN_SCENE + 1.2;

/** Personne assise sur le canapé (le canapé passe devant). */
const SurCanape: React.FC<{x: number; a?: number}> = ({x, a}) => (
  <>
    <Perso x={x} echelle={0.7} gris cles={[[0, 'assis']]} a={a} />
    <SurSol x={x} largeur={360} hauteur={210}>
      <Apparait a={a ?? 0}>
        <IconeNeon nom="canape" epaisseur={5} remplissage={0.08} />
      </Apparait>
    </SurSol>
  </>
);

/** Petites étincelles (voiture qui brille). */
const Etincelles: React.FC<{x: number; y: number; a: number}> = ({x, y, a}) => {
  const t = useT();
  const pts = [
    [-120, -40, 1],
    [90, -70, 0.8],
    [140, 10, 0.6],
    [-60, -90, 0.7],
  ];
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, filter: halo(C.blanc, 0.8)}}>
      {pts.map(([dx, dy, s], i) => {
        const p = prog(t, a + i * 0.12, 0.3);
        const r = 22 * s * (0.6 + 0.4 * Math.sin((t - a) * 6 + i));
        const cx = x + dx;
        const cy = y + dy;
        return (
          <path
            key={i}
            d={`M ${cx} ${cy - r} Q ${cx} ${cy} ${cx + r} ${cy} Q ${cx} ${cy} ${cx} ${cy + r} Q ${cx} ${cy} ${cx - r} ${cy} Q ${cx} ${cy} ${cx} ${cy - r} Z`}
            fill={C.blanc}
            opacity={p * 0.9}
          />
        );
      })}
    </svg>
  );
};

/* ---------- Scènes ---------- */

// « Les gens paient pour ne pas bouger. C'est le business le plus rentable du monde : la paresse des autres. »
const S1: React.FC = () => (
  <Plan debut={K[0]} fin={K[1]}>
    <SurCanape x={330} a={0.05} />
    <ObjetAir x={740} y={1120} l={90} h={90} a={w(2)} nom="piece" couleur="or" epaisseur={3} />
    <ObjetAir x={820} y={1260} l={230} h={200} a={w(12)} nom="graphique" couleur="#C9D1DB" couleurCourbe="vert" courbe="monte" epaisseur={5} intensite={0.6} />
  </Plan>
);

// « Le lavage auto à domicile. »
const S2: React.FC = () => {
  const t = useT();
  const propre = prog(t, w(23), 0.6);
  return (
    <Plan debut={K[1]} fin={K[2]}>
      <SurSol x={540} largeur={460} hauteur={260}>
        <Apparait a={K[1] + 0.1}>
          <div style={{position: 'absolute', inset: 0, opacity: 1 - propre}}>
            <IconeNeon nom="voiture" couleur="#6B7380" epaisseur={5} remplissage={0.05} intensite={0.3} />
          </div>
          <div style={{position: 'absolute', inset: 0, opacity: propre}}>
            <IconeNeon nom="voiture" epaisseur={6} remplissage={0.08} />
          </div>
        </Apparait>
      </SurSol>
      {/* l'eau qui tombe */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = w(21) + i * 0.12;
        const p = prog(t, a, 0.5);
        if (p <= 0 || p >= 1) return null;
        return (
          <Flottant key={i} x={380 + i * 80} y={interpolate(p, [0, 1], [950, 1300])} largeur={34} hauteur={46} opacity={Math.sin(p * Math.PI)}>
            <IconeNeon nom="goutte" couleur="bleu" epaisseur={3} remplissage={0.3} carre />
          </Flottant>
        );
      })}
      <Etincelles x={540} y={1260} a={w(24)} />
    </Plan>
  );
};

// « Un nettoyeur haute pression, un aspirateur, des produits, un bidon d'eau : moins de trois cents euros. »
const S3: React.FC = () => {
  const items: Array<{nom: NomIcone; i: number; l: number; h: number}> = [
    {nom: 'nettoyeur', i: 26, l: 180, h: 160},
    {nom: 'aspirateur', i: 30, l: 170, h: 160},
    {nom: 'flacon', i: 32, l: 110, h: 170},
    {nom: 'bidon', i: 34, l: 140, h: 170},
  ];
  const xs = [160, 400, 640, 880];
  return (
    <Plan debut={K[2]} fin={K[3]}>
      {items.map((it, k) => (
        <ObjetSol key={k} x={xs[k]} l={it.l} h={it.h} a={w(it.i)} nom={it.nom} couleur={it.nom === 'bidon' ? 'bleu' : undefined} epaisseur={5} remplissage={0.08} />
      ))}
      <Etiquette x={540} y={1050} texte="< 300 €" couleur="or" taille={64} a={w(39)} />
    </Plan>
  );
};

// « Tu viens chez le client, sur son parking, à son bureau. »
const S4: React.FC = () => {
  const t = useT();
  const x = interpolate(t, [w(43), w(46) + 0.4], [150, 330], clamp);
  return (
    <Plan debut={K[3]} fin={K[4]}>
      <Perso x={x} echelle={0.8} cles={[[0, 'debout']]} marche={t > w(43) && t < w(46) + 0.4 ? 10 : 0} />
      <ObjetSol x={x + 150} l={90} h={110} a={K[3] + 0.1} nom="bidon" couleur="bleu" epaisseur={4} remplissage={0.1} />
      <ObjetSol x={650} l={300} h={170} a={w(46)} nom="voiture" epaisseur={5} remplissage={0.06} />
      <Flottant x={650} y={1070} largeur={80} hauteur={80}>
        <Apparait a={w(49)}>
          <div style={{width: '100%', height: '100%', border: `4px solid ${C.bleu}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"JetBrains Mono", monospace', fontWeight: 800, fontSize: 48, color: C.bleu, filter: halo(C.bleu, 0.6)}}>P</div>
        </Apparait>
      </Flottant>
      <ObjetSol x={930} l={140} h={300} a={w(51)} nom="immeuble" epaisseur={5} remplissage={0.05} />
    </Plan>
  );
};

// « Un lavage intérieur-extérieur se facture vingt-cinq à cinquante euros, et dure une heure. »
const S5: React.FC = () => (
  <Plan debut={K[4]} fin={K[5]}>
    <ObjetSol x={300} l={340} h={190} a={K[4] + 0.1} nom="voiture" epaisseur={6} remplissage={0.08} />
    <Etincelles x={300} y={1340} a={w(55)} />
    <Prix x={780} y={1000} texte="25-50 €" a={w(58)} taille={40} />
    <ObjetAir x={780} y={1300} l={170} h={170} a={w(63)} nom="horloge" couleur="bleu" epaisseur={5} remplissage={0.05} aiguille={0} />
    <Etiquette x={950} y={1320} texte="1 H" couleur="bleu" taille={42} a={w(65)} />
  </Plan>
);

// « Cinq voitures par jour, c'est plus de cent cinquante euros. »
const S6: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[5]} fin={K[6]}>
      {[0, 1, 2, 3, 4].map((i) => {
        const on = prog(t, w(66) + i * 0.15, 0.3);
        return (
          <Flottant key={i} x={150 + i * 195} y={1330} largeur={170} hauteur={95}>
            <div style={{position: 'absolute', inset: 0, opacity: on}}>
              <IconeNeon nom="voiture" epaisseur={4} remplissage={0.08} />
            </div>
          </Flottant>
        );
      })}
      <Etiquette x={540} y={1180} texte="5 × 30 €" taille={46} a={w(68)} />
      <Etiquette x={540} y={1010} texte="+150 € / JOUR" couleur="vert" taille={54} a={w(73)} style={{letterSpacing: '0.06em'}} />
    </Plan>
  );
};

// « Le client, lui, a passé son samedi sur son canapé. Et il te remerciera. »
const S7: React.FC = () => (
  <Plan debut={K[6]} fin={K[7]}>
    <SurCanape x={330} a={w(77)} />
    <ObjetAir x={780} y={1180} l={220} h={210} a={w(82)} nom="calendrier" epaisseur={4} remplissage={0.05} />
    <Etiquette x={780} y={1370} texte="SAMEDI" taille={34} a={w(82)} style={{color: '#AEB6C0'}} />
    <ObjetAir x={330} y={980} l={90} h={80} a={w(89)} nom="coeur" couleur="rose" epaisseur={3} />
  </Plan>
);

// « Le secret, c'est l'abonnement : un lavage toutes les deux semaines, tarif fixe, et tu sais déjà ce que tu gagnes le mois prochain. »
const S8: React.FC = () => {
  const t = useT();
  // 4 semaines × 7 jours : chaque client revient tous les 14 jours
  const clients = [
    [0, 1], [2, 3], [4, 0], [1, 5], [3, 2], [5, 4],
  ];
  return (
    <Plan debut={K[7]} fin={K[8]}>
      <Etiquette x={540} y={790} texte="ABONNEMENT" couleur="bleu" taille={44} a={w(93)} style={{letterSpacing: '0.2em'}} />
      <Flottant x={540} y={1150} largeur={560} hauteur={420}>
        <Apparait a={w(95)}>
          <div style={{position: 'absolute', inset: 0, border: `4px solid ${C.blanc}`, borderRadius: 18, background: 'rgba(242,245,248,0.04)', filter: halo(C.blanc, 0.5)}} />
          <div style={{position: 'absolute', left: 0, right: 0, top: 64, height: 4, background: C.blanc, opacity: 0.8}} />
          {Array.from({length: 28}).map((_, k) => {
            const col = k % 7;
            const lig = Math.floor(k / 7);
            const idx = clients.findIndex(([c, l]) => c === col && (l === lig || l + 2 === lig || l - 2 === lig));
            const on = idx >= 0 ? prog(t, w(97) + idx * 0.35 + (lig >= 2 ? 0.2 : 0), 0.3) : 0;
            return (
              <div
                key={k}
                style={{
                  position: 'absolute',
                  left: 42 + col * 72,
                  top: 100 + lig * 76,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  background: on > 0.5 ? C.vert : '#AEB6C0',
                  opacity: on > 0.5 ? 1 : 0.3,
                  boxShadow: on > 0.5 ? `0 0 14px ${C.vert}` : 'none',
                }}
              />
            );
          })}
        </Apparait>
      </Flottant>
      <ObjetAir x={170} y={1450} l={150} h={80} a={w(101)} nom="etiquette" couleur="bleu" epaisseur={4} remplissage={0.1} />
      <ObjetAir x={250} y={1400} l={50} h={60} a={w(102)} nom="cadenas" couleur="bleu" epaisseur={4} remplissage={0.1} />
      <ObjetAir x={900} y={1440} l={70} h={70} a={w(110)} nom="piece" couleur="or" epaisseur={3} />
    </Plan>
  );
};

// « Vingt abonnés, et ton agenda est plein avant même de commencer le mois. »
const S9: React.FC = () => {
  const t = useT();
  return (
    <Plan debut={K[8]} fin={K[9]}>
      {Array.from({length: 20}).map((_, i) => {
        const c = i % 5;
        const l = Math.floor(i / 5);
        const on = prog(t, w(114) + i * 0.06, 0.25);
        return (
          <Flottant key={i} x={170 + c * 110} y={880 + l * 120} largeur={70} hauteur={80}>
            <div style={{position: 'absolute', inset: 0, opacity: 0.35 * prog(t, K[8] + 0.1, 0.3) * (1 - on)}}>
              <IconeNeon nom="personne" couleur="#AEB6C0" epaisseur={3} remplissage={0} intensite={0.2} />
            </div>
            <div style={{position: 'absolute', inset: 0, opacity: on}}>
              <IconeNeon nom="personne" couleur="vert" epaisseur={4} remplissage={0.15} />
            </div>
          </Flottant>
        );
      })}
      <ObjetAir x={880} y={1180} l={200} h={190} a={w(118)} nom="calendrier" couleur="vert" epaisseur={5} remplissage={0.12} />
      <ObjetAir x={880} y={1380} l={100} h={75} a={w(120)} nom="coche" couleur="vert" epaisseur={7} />
    </Plan>
  );
};

// « Enregistre cette vidéo, et regarde le nombre de voitures sales dans ton immeuble. »
const S10: React.FC = () => {
  const t = useT();
  const fin = w(131) - 0.2;
  return (
    <Plan debut={K[9]} fin={FIN_SCENE}>
      <Flottant x={540} y={1150} largeur={180} hauteur={260} opacity={sortie(t, fin)}>
        <Apparait a={w(127)}>
          <IconeNeon nom="telephone" epaisseur={5} remplissage={0.06} />
        </Apparait>
      </Flottant>
      <Flottant x={540} y={1150} largeur={60} hauteur={70} opacity={sortie(t, fin)}>
        <Apparait a={w(127) + 0.1}>
          <svg viewBox="0 0 100 100" width="100%" height="100%" style={{filter: halo(C.bleu)}}>
            <path d="M25 12 L85 50 L25 88 Z" fill={C.bleu} fillOpacity={0.9} />
          </svg>
        </Apparait>
      </Flottant>
      <Flottant x={602} y={1040} largeur={56} hauteur={84} opacity={sortie(t, fin)}>
        <Apparait a={w(129)}>
          <IconeNeon nom="favori" couleur="or" epaisseur={5} remplissage={0.3} />
        </Apparait>
      </Flottant>
      <ObjetSol x={540} l={220} h={480} a={w(131)} nom="immeuble" epaisseur={5} remplissage={0.04} />
      {[0, 1, 2].map((i) => (
        <ObjetSol key={i} x={[120, 300, 880][i]} l={170} h={95} a={w(135) + i * 0.2} nom="voiture" couleur="#6B7380" epaisseur={4} remplissage={0.04} intensite={0.3} />
      ))}
    </Plan>
  );
};

const EFFETS: Array<[number, string]> = [
  [w(2), 'piece'],
  [w(23), 'pop-leger'],
  [w(26), 'pop-leger'],
  [w(30), 'pop-leger'],
  [w(32), 'pop-leger'],
  [w(34), 'pop-leger'],
  [w(39), 'piece'],
  [w(58), 'piece'],
  [w(73), 'piece'],
  [w(89), 'pop-leger'],
  [w(97), 'clic-doux'],
  [w(114), 'pop-leger'],
  [w(120), 'pop-leger'],
  [w(129), 'clic-doux'],
];

export const Finance10: React.FC = () => (
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
    <BandeSon voix="voix/finance-10.mp3" mots={MOTS} effets={EFFETS} fin={FIN_VOIX + 1} />
  </>
);
