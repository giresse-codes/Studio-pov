import React from 'react';
import {Audio, getStaticFiles, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Mot} from './TexteMotAMot';

const existe = (chemin: string) => getStaticFiles().some((f) => f.name === chemin);

/**
 * Bande son Finance : voix 100 %, musique ambiante ~9 % avec ducking pendant
 * la voix, petits sons doux à ~25 %. Les sons absents de sons/ sont ignorés.
 */
export const BandeSon: React.FC<{voix: string; mots: Mot[]; effets?: Array<[number, string]>; fin: number}> = ({voix, mots, effets = [], fin}) => {
  const {fps} = useVideoConfig();
  const musique = 'sons/musiques/finance-ambient.mp3';
  const parle = (t: number) => mots.some((m) => t >= m.s - 0.15 && t <= m.e + 0.25);
  return (
    <>
      <Audio src={staticFile(voix)} />
      {existe(musique) && (
        <Audio
          src={staticFile(musique)}
          loop
          volume={(f) => {
            const t = f / fps;
            const base = parle(t) ? 0.06 : 0.1;
            return base * interpolate(t, [0, 1, fin - 1.5, fin], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          }}
        />
      )}
      {effets
        .filter(([, s]) => existe(`sons/effets/${s}.mp3`))
        .map(([t, s], i) => (
          <Sequence key={i} from={Math.round(t * fps)} layout="none">
            <Audio src={staticFile(`sons/effets/${s}.mp3`)} volume={0.25} />
          </Sequence>
        ))}
    </>
  );
};
