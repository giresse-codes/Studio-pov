import React from 'react';
import {Audio, interpolate, staticFile} from 'remotion';
import {Bonhomme, HAUTEUR_BONHOMME, LARGEUR_BOITE} from '../composants/Bonhomme';
import {IconeNeon} from '../composants/IconeNeon';
import {Flottant, SurSol} from '../composants/Scene';
import {TexteMotAMot, Mot, Phrase} from '../composants/TexteMotAMot';
import {FonduNoir, Plan} from '../composants/FonduNoir';
import {Apparait, PieceQuiTombe, PileDePieces, prog, useT} from '../composants/anim';
import {Balance} from '../composants/Balance';
import {CadreVideo} from '../composants/Video';
import {SOL_Y} from '../style';

// Test de calibrage : les ~11 premières secondes de finance/reference.mp4,
// avec la voix de la référence. Timings issus de whisper sur la référence.
const MOTS: Mot[] = [
  ['Les', 0.0], ['business', 0.4], ['qui', 0.84], ['ne', 1.12], ['semblent', 1.26], ['pas', 1.36], ['rentables,', 1.6],
  ['mais', 2.14], ['qui', 2.38], ['rapportent', 2.54], ['énormément', 3.24], ["d'argent.", 3.88],
  ['La', 4.94], ['location', 5.4], ['de', 5.84], ['chaises', 6.1], ['en', 6.44], ['plastique,', 6.6],
  ['Acheter', 7.52], ['cinquante', 7.96], ['chaises', 8.26], ['en', 8.54], ['plastique', 8.6], ['te', 8.96], ['coûte', 9.04],
  ['moins', 9.26], ['cher', 9.38], ['que', 9.58], ['ce', 9.74], ['téléphone', 9.9], ['dont', 10.26], ['tu', 10.48], ['rêves', 10.66], ['tant.', 10.9],
].map(([t, s]) => ({t: t as string, s: s as number, e: (s as number) + 0.3}));

const PHRASES: Phrase[] = [
  {debut: 0, lignes: [3, 4, 3], couleurs: {rentables: 'attenue', enormement: 'vert', dargent: 'vert'}},
  {debut: 12, lignes: [4, 2], couleurs: {chaises: 'or', plastique: 'or'}},
  {debut: 18, lignes: [3, 4, 5, 4], couleurs: {cinquante: 'or', moins: 'vert', cher: 'vert', telephone: 'bleu', reves: 'rouge'}},
];

export const DUREE_CALIBRAGE = 11.4;

const Toi: React.FC<{x: number; echelle?: number; cles?: Array<[number, string]>; couleur?: string}> = ({x, echelle = 1, cles, couleur}) => (
  <SurSol x={x} largeur={LARGEUR_BOITE * echelle} hauteur={HAUTEUR_BONHOMME * echelle}>
    <Bonhomme cles={cles ?? [[0, 'debout']]} couleur={couleur} />
  </SurSol>
);

const Scene1: React.FC = () => {
  const t = useT();
  const or = t > 2.6;
  const pMaison = prog(t, 2.5, 0.5);
  return (
    <Plan debut={0} fin={4.75}>
      <Toi x={300} cles={[[0, 'debout'], [1.05, 'pointeDroite'], [3.2, 'brasLeves']]} />
      <SurSol x={705} largeur={340} hauteur={255}>
        <div style={{position: 'absolute', inset: 0, opacity: 1 - pMaison}}>
          <IconeNeon nom="maison" couleur="#C9D1DB" epaisseur={6} remplissage={0.05} intensite={0.5} />
        </div>
        <div style={{position: 'absolute', inset: 0, opacity: pMaison}}>
          <IconeNeon nom="maison" couleur="or" epaisseur={6} remplissage={0.08} />
        </div>
      </SurSol>
      <Flottant x={705} y={892} largeur={372} hauteur={218}>
        <Apparait a={0.95}>
          <IconeNeon
            nom="tableauCourbe"
            couleur="#C9D1DB"
            epaisseur={4}
            intensite={0.3}
            courbe={t < 2.2 ? 'baisse' : 'monte'}
            couleurCourbe={t < 2.2 ? '#AEB6C0' : 'vert'}
            progresCourbe={t < 2.2 ? prog(t, 1.0, 0.6) : prog(t, 2.25, 1.0)}
          />
        </Apparait>
      </Flottant>
      {/* flèche rouge : pas rentable */}
      <Flottant x={850} y={800} largeur={40} hauteur={60}>
        <Apparait a={1.6} disparait={2.15}>
          <IconeNeon nom="flecheBas" couleur="rouge" epaisseur={6} />
        </Apparait>
      </Flottant>
      {/* pièces qui tombent et s'empilent */}
      {or && [3.3, 3.45, 3.6, 3.75, 3.9].map((a, i) => <PieceQuiTombe key={i} x={950 + (i % 2) * 24} a={a} y0={940} yFin={SOL_Y - 60 - i * 8} taille={50} duree={0.5} />)}
      <PileDePieces x={960} a={3.7} n={5} d={0.8} largeur={170} />
      <Flottant x={945} y={1080} largeur={36} hauteur={110}>
        <Apparait a={3.5}>
          <IconeNeon nom="flecheHaut" couleur="vert" epaisseur={6} />
        </Apparait>
      </Flottant>
    </Plan>
  );
};

const Chaise: React.FC<{x: number; a: number; echelle?: number}> = ({x, a, echelle = 1}) => (
  <SurSol x={x} largeur={200 * echelle} hauteur={290 * echelle}>
    <Apparait a={a} glisse={30}>
      <IconeNeon nom="chaise" epaisseur={6} remplissage={0.1} />
    </Apparait>
  </SurSol>
);

const Scene2: React.FC = () => (
  <Plan debut={4.8} fin={7.4}>
    <Toi x={150} cles={[[0, 'pointeDroite']]} />
    {[0, 1, 2, 3].map((i) => (
      <Chaise key={i} x={392 + i * 200} a={5.45 + i * 0.3} />
    ))}
    <Flottant x={690} y={1105} largeur={170} hauteur={112}>
      <Apparait a={6.05}>
        <IconeNeon nom="etiquette" couleur="or" epaisseur={6} remplissage={0.15} />
      </Apparait>
    </Flottant>
  </Plan>
);

const MiniChaises: React.FC = () => (
  <div style={{display: 'flex', gap: 2, width: 150, height: 60}}>
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{width: 36, height: 54}}>
        <IconeNeon nom="chaise" epaisseur={3} remplissage={0.1} intensite={0.5} />
      </div>
    ))}
  </div>
);

const Scene3: React.FC = () => {
  const t = useT();
  const pBal = prog(t, 8.9, 0.6);
  const angle = interpolate(t, [9.25, 9.9], [0, 13], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Les chaises passent de la main au plateau gauche
  const dansLaMain = t < 8.95;
  return (
    <Plan debut={7.4} fin={DUREE_CALIBRAGE + 1}>
      <Toi x={150} echelle={0.92} cles={[[0, 'debout']]} />
      {dansLaMain && (
        <Flottant x={330} y={1185} largeur={150} hauteur={60}>
          <Apparait a={7.95}>
            <MiniChaises />
          </Apparait>
        </Flottant>
      )}
      <Flottant x={dansLaMain ? 330 : 345} y={dansLaMain ? 1075 : 870 - 270 * Math.sin((angle * Math.PI) / 180)} largeur={96} hauteur={58}>
        <Apparait a={7.6}>
          <IconeNeon nom="etiquette" couleur="or" epaisseur={5} remplissage={0.15} />
        </Apparait>
      </Flottant>
      {pBal > 0 && (
        <Balance
          x={610}
          ySol={SOL_Y}
          hauteur={560}
          demiLargeur={270}
          angle={angle}
          trace={pBal}
          gauche={t >= 8.95 ? <MiniChaises /> : null}
          droite={
            t >= 9.85 ? (
              <div style={{width: 64, height: 110, position: 'relative'}}>
                <Apparait a={9.85}>
                  <IconeNeon nom="telephone" couleur="bleu" epaisseur={5} remplissage={0.25} />
                </Apparait>
                <div style={{position: 'absolute', left: -46, top: -10, width: 40, height: 40}}>
                  <Apparait a={10.66}>
                    <IconeNeon nom="coeur" couleur="rouge" epaisseur={3} />
                  </Apparait>
                </div>
              </div>
            ) : null
          }
        />
      )}
    </Plan>
  );
};

export const Calibrage: React.FC = () => (
  <>
    <CadreVideo
      scenes={
        <>
          <Scene1 />
          <Scene2 />
          <Scene3 />
        </>
      }
      texte={<TexteMotAMot mots={MOTS} phrases={PHRASES} fin={DUREE_CALIBRAGE} />}
      dessus={<FonduNoir coupes={[4.78, 7.4]} />}
    />
    <Audio src={staticFile('finance/reference-voix.wav')} endAt={Math.round(DUREE_CALIBRAGE * 30)} />
  </>
);
