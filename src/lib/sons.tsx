import React from 'react';
import {Audio, Sequence, staticFile, interpolate} from 'remotion';
import {clamp} from './anim';

// Niveaux de mixage du studio (CLAUDE.md)
export const MIX = {voix: 1, effet: 0.5, ambiance: 0.18, musique: 0.13, musiqueSousVoix: 0.05};

export type NomEffet =
  | 'notification' | 'vibration' | 'whoosh' | 'pop' | 'clic-bouton' | 'carte' | 'sparkle'
  | 'appel' | 'compteur' | 'frappe-clavier' | 'pas' | 'pas-feuilles' | 'buisson' | 'eau-plouf'
  | 'coeur' | 'gag-boing' | 'ding-bonne-reponse' | 'buzzer-erreur';
export type NomAmbiance = 'bureau' | 'appartement' | 'foret-soir' | 'vent';
export type NomMusique = 'comique' | 'tech-leger' | 'suspense' | 'documentaire';

// Début utile de certains fichiers (en secondes) : ex. carte.mp3 contient un mélange puis des retournements
const DEBUT_UTILE: Partial<Record<NomEffet, number>> = {carte: 5.4};

export const fichierSon = (chemin: string) => staticFile(`sons/${chemin}.mp3`);

/** Un effet sonore ponctuel à la frame `a` */
export const Effet: React.FC<{nom: NomEffet; a: number; duree?: number; volume?: number; fps?: number}> = ({
  nom, a, duree, volume = MIX.effet, fps = 30,
}) => (
  <Sequence from={a} durationInFrames={duree ?? 150} layout="none">
    <Audio
      src={fichierSon(`effets/${nom}`)}
      startFrom={Math.round((DEBUT_UTILE[nom] ?? 0) * fps)}
      volume={(f) => (duree ? volume * interpolate(f, [duree - 8, duree], [1, 0], clamp) : volume)}
    />
  </Sequence>
);

/** Ambiance en boucle, fondu d'entrée/sortie */
export const Ambiance: React.FC<{nom: NomAmbiance; duree: number; volume?: number}> = ({nom, duree, volume = MIX.ambiance}) => (
  <Audio
    src={fichierSon(`ambiances/${nom}`)}
    loop
    volume={(f) => volume * interpolate(f, [0, 20, duree - 20, duree], [0, 1, 1, 0], clamp)}
  />
);

/** Segments de voix [debut, fin] en frames, pour le ducking de la musique */
export type Segments = [number, number][];

export const niveauDucking = (f: number, segments: Segments, marge = 6) => {
  // 1 = voix active, 0 = silence ; transitions douces sur `marge` frames
  let v = 0;
  for (const [d, fi] of segments) {
    v = Math.max(v, interpolate(f, [d - marge, d, fi, fi + marge], [0, 1, 1, 0], clamp));
  }
  return v;
};

/** Musique en boucle avec ducking automatique pendant la voix */
export const Musique: React.FC<{nom: NomMusique; duree: number; voix?: Segments; volume?: number}> = ({
  nom, duree, voix = [], volume = MIX.musique,
}) => (
  <Audio
    src={fichierSon(`musiques/${nom}`)}
    loop
    volume={(f) => {
      const fondu = interpolate(f, [0, 15, duree - 25, duree], [0, 1, 1, 0], clamp);
      const d = niveauDucking(f, voix);
      return fondu * (volume + (MIX.musiqueSousVoix - volume) * d);
    }}
  />
);
