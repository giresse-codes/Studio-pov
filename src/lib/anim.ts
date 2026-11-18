import {Easing, interpolate, spring} from 'remotion';

export const FPS = 30;
export const W = 1080;
export const H = 1920;

/** secondes -> frames */
export const s = (sec: number) => Math.round(sec * FPS);

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** progression 0..1 entre deux frames, avec easing */
export const prog = (
  frame: number,
  start: number,
  dur: number,
  ease: (t: number) => number = Easing.inOut(Easing.cubic),
) => ease(clamp((frame - start) / Math.max(1, dur)));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** valeur qui suit une liste de clés [frame, valeur], interpolation douce */
export const keys = (
  frame: number,
  k: [number, number][],
  ease: (t: number) => number = Easing.inOut(Easing.cubic),
) => {
  if (k.length === 1) return k[0][1];
  return interpolate(
    frame,
    k.map((x) => x[0]),
    k.map((x) => x[1]),
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease},
  );
};

/** rebond d'apparition (0 -> 1 avec dépassement) */
export const pop = (frame: number, start: number, fps = FPS, damping = 9) =>
  frame < start
    ? 0
    : spring({frame: frame - start, fps, config: {damping, stiffness: 180, mass: 0.6}});

/** visible entre deux frames, avec fondu entrée/sortie */
export const window01 = (frame: number, start: number, end: number, fade = 6) => {
  if (frame < start || frame > end) return 0;
  return Math.min(clamp((frame - start) / fade), clamp((end - frame) / fade));
};

/** bruit doux pseudo-aléatoire (somme de sinus) */
export const wobble = (t: number, seed = 0) =>
  Math.sin(t * 0.9 + seed) * 0.5 + Math.sin(t * 2.3 + seed * 1.7) * 0.3 + Math.sin(t * 0.37 + seed * 3.1) * 0.2;

/** nombre pseudo aléatoire stable */
export const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const mixColor = (c1: string, c2: string, t: number) => {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1);
  const b = p(c2);
  const r = a.map((v, i) => Math.round(lerp(v, b[i], clamp(t))));
  return `#${r.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};
