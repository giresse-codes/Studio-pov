import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {IconeNeon} from './IconeNeon';
import {C, couleur as resoudreCouleur, halo, SOL_Y} from '../style';

/** Temps courant en secondes. */
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Progression 0 → 1 entre a et a + d (secondes), adoucie. */
export const prog = (t: number, a: number, d = 0.5, easing = Easing.inOut(Easing.cubic)) =>
  interpolate(t, [a, a + d], [0, 1], {...clamp, easing});

/** Apparition douce : fondu + léger glissement + petit rebond discret. */
export const entree = (t: number, a: number, d = 0.45, glisse = 18) => {
  const p = interpolate(t, [a, a + d], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.2))});
  const o = interpolate(t, [a, a + d * 0.7], [0, 1], clamp);
  return {opacity: o, transform: `translateY(${(1 - p) * glisse}px)`};
};

/** Sortie douce. */
export const sortie = (t: number, a: number, d = 0.35) => interpolate(t, [a, a + d], [1, 0], clamp);

/** Conteneur qui apparaît à l'instant a. */
export const Apparait: React.FC<{a: number; d?: number; glisse?: number; disparait?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  a,
  d,
  glisse,
  disparait,
  children,
  style,
}) => {
  const t = useT();
  const e = entree(t, a, d, glisse);
  const o = disparait !== undefined ? sortie(t, disparait) : 1;
  return <div style={{width: '100%', height: '100%', ...style, opacity: e.opacity * o, transform: e.transform}}>{children}</div>;
};

/** Pièce d'or qui tombe de (x, y0) jusqu'au sol (ou yFin), avec petit rebond. */
export const PieceQuiTombe: React.FC<{x: number; a: number; y0?: number; yFin?: number; taille?: number; duree?: number}> = ({
  x,
  a,
  y0 = SOL_Y - 700,
  yFin = SOL_Y,
  taille = 44,
  duree = 0.7,
}) => {
  const t = useT();
  if (t < a) return null;
  const y = interpolate(t, [a, a + duree], [y0, yFin - taille], {...clamp, easing: Easing.bounce});
  const o = interpolate(t, [a, a + 0.15], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x - taille / 2, top: y, width: taille, height: taille, opacity: o}}>
      <IconeNeon nom="piece" couleur="or" epaisseur={3} />
    </div>
  );
};

/** Pile de pièces vue de profil, qui monte jusqu'à n étages. */
export const PileDePieces: React.FC<{x: number; a: number; n: number; d?: number; largeur?: number; yBas?: number}> = ({
  x,
  a,
  n,
  d = 1,
  largeur = 110,
  yBas = SOL_Y,
}) => {
  const t = useT();
  const k = Math.floor(interpolate(t, [a, a + d], [0, n], clamp) + 0.0001);
  const h = 18;
  return (
    <>
      {Array.from({length: k}).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x - largeur / 2,
            top: yBas - (i + 1) * (h - 3),
            width: largeur,
            height: h,
            borderRadius: '50%',
            background: `linear-gradient(180deg, #F7C64A 0%, #C98F12 100%)`,
            boxShadow: `0 0 12px ${C.or}66`,
            border: `2px solid #FFD970`,
          }}
        />
      ))}
    </>
  );
};

/** Barre de progression néon qui se remplit. */
export const Barre: React.FC<{x: number; y: number; largeur: number; a: number; d?: number; couleur?: string; valeur?: number}> = ({
  x,
  y,
  largeur,
  a,
  d = 1.2,
  couleur = 'vert',
  valeur = 1,
}) => {
  const t = useT();
  const c = resoudreCouleur(couleur);
  const p = prog(t, a, d) * valeur;
  return (
    <div style={{position: 'absolute', left: x - largeur / 2, top: y - 14, width: largeur, height: 28, borderRadius: 14, border: `3px solid ${C.blanc}`, opacity: entree(t, a - 0.3).opacity, filter: halo(C.blanc, 0.6)}}>
      <div style={{position: 'absolute', left: 4, top: 4, height: 14, width: (largeur - 14) * p, borderRadius: 7, background: c, filter: halo(c)}} />
    </div>
  );
};

/** Texte néon court posé dans la scène (chiffres, « × 1 »). Monospace gras. */
export const Etiquette: React.FC<{x: number; y: number; texte: string; couleur?: string; taille?: number; a: number; style?: React.CSSProperties}> = ({
  x,
  y,
  texte,
  couleur = 'blanc',
  taille = 44,
  a,
  style,
}) => {
  const t = useT();
  const c = resoudreCouleur(couleur);
  const e = entree(t, a);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 300,
        top: y - taille,
        width: 600,
        textAlign: 'center',
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 800,
        fontSize: taille,
        letterSpacing: '0.08em',
        color: c,
        textShadow: `0 0 10px ${c}88`,
        ...e,
        ...style,
      }}
    >
      {texte}
    </div>
  );
};
