import {Easing, interpolate, spring} from 'remotion';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0 → 1 entre deux frames, avec courbe douce */
export const prog = (f: number, debut: number, fin: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [debut, fin], [0, 1], {...clamp, easing: ease});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Petit rebond d'apparition (pop) */
export const pop = (f: number, debut: number, fps = 30, raideur = 180) =>
  spring({frame: f - debut, fps, config: {damping: 11, stiffness: raideur, mass: 0.7}});

/** Mélange de deux couleurs hex */
export const mix = (a: string, b: string, t: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => [(s >> 16) & 255, (s >> 8) & 255, s & 255];
  const [r1, g1, b1] = ch(pa);
  const [r2, g2, b2] = ch(pb);
  const k = Math.max(0, Math.min(1, t));
  const r = Math.round(r1 + (r2 - r1) * k);
  const g = Math.round(g1 + (g2 - g1) * k);
  const bl = Math.round(b1 + (b2 - b1) * k);
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
};

/** Pseudo-aléatoire déterministe */
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
