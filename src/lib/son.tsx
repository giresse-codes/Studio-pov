import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import dispo from '../sons-dispo.json';
import {FPS} from './anim';
import type {Mot} from '../ui/SousTitres';

/* Mixage : voix 100 %, effets 40-60 %, ambiance 15-20 %, musique 10-15 % avec ducking sous la voix. */

export type Effet = {f: number; son: string; vol?: number; dur?: number};

const existe = (p: string) => (dispo as string[]).includes(p);

/** vrai si la voix parle à l'instant t (secondes) */
const parle = (mots: Mot[], t: number) => mots.some((m) => t >= m.s - 0.15 && t <= m.e + 0.25);

export const Bande: React.FC<{
  voix: string; // chemin dans public/, ex. videos/devsteach-1a/voix.wav
  mots: Mot[];
  effets?: Effet[];
  ambiance?: string; // ex. 'ambiances/bureau.mp3'
  musique?: string; // ex. 'musiques/tech-leger.mp3'
  volAmbiance?: number;
  volMusique?: number;
}> = ({voix, mots, effets = [], ambiance, musique, volAmbiance = 0.17, volMusique = 0.13}) => {
  useCurrentFrame();
  return (
    <>
      <Audio src={staticFile(voix)} volume={1} />
      {ambiance && existe(ambiance) && <Audio src={staticFile(`sons/${ambiance}`)} volume={volAmbiance} loop />}
      {musique && existe(musique) && (
        <Audio
          src={staticFile(`sons/${musique}`)}
          loop
          volume={(f) => {
            // ducking doux : moyenne sur ±0,3 s
            let k = 0;
            for (let i = -3; i <= 3; i++) k += parle(mots, f / FPS + i * 0.1) ? 1 : 0;
            return volMusique * (1 - 0.55 * (k / 7));
          }}
        />
      )}
      {effets
        .filter((e) => existe(`effets/${e.son}.mp3`))
        .map((e, i) => (
          <Sequence key={i} from={e.f} durationInFrames={e.dur ?? 90}>
            <Audio src={staticFile(`sons/effets/${e.son}.mp3`)} volume={e.vol ?? 0.5} />
          </Sequence>
        ))}
    </>
  );
};
