// Constantes du style Finance « scène sombre néon ».
export const W = 1080;
export const H = 1920;
export const FPS = 30;

/** Ligne d'horizon : 78 % de la hauteur. */
export const SOL_Y = Math.round(H * 0.78);

export const C = {
  blanc: '#F2F5F8',
  texte: '#E8ECF1',
  gris: '#9AA3AE',
  attenue: '#7D8794',
  vert: '#2ECC71',
  rouge: '#FF4D3D',
  or: '#F5B731',
  bleu: '#4DA3FF',
  rose: '#FF5FA2',
} as const;

export type Couleur = keyof typeof C;

export const couleur = (c?: Couleur | string) =>
  c === undefined ? C.blanc : (C as Record<string, string>)[c] ?? c;

/** Halo néon : ombre floue de la couleur du trait. */
export const halo = (hex: string, force = 1) =>
  `drop-shadow(0 0 ${3 * force}px ${hex}dd) drop-shadow(0 0 ${14 * force}px ${hex}77)`;

export const sec = (s: number) => Math.round(s * FPS);
