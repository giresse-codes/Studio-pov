import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {H, SOL_Y, W} from '../style';

/**
 * Décor commun : fond presque noir, halo bleu nuit, sol brillant avec horizon
 * à 78 %, vignette forte et léger grain. Les enfants sont posés par-dessus.
 */
export const Decor: React.FC = () => {
  const frame = useCurrentFrame();
  // Grain : la graine change toutes les 2 images pour un grain « vivant » discret.
  const graine = Math.floor(frame / 2);
  const decalX = Math.floor(random(`gx${graine}`) * 200);
  const decalY = Math.floor(random(`gy${graine}`) * 200);
  return (
    <AbsoluteFill style={{background: '#05070B'}}>
      {/* Mur : dégradé vertical très sombre */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, #05070B 0%, #0A0F18 45%, #0B111C ${(SOL_Y / H) * 100}%, #070A10 ${(SOL_Y / H) * 100}%, #05070B 100%)`,
        }}
      />
      {/* Halo bleu nuit au centre */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 62% 42% at 50% 50%, rgba(22,35,58,0.75) 0%, rgba(22,35,58,0.35) 45%, rgba(22,35,58,0) 100%)`,
        }}
      />
      {/* Sol : léger reflet du halo sous l'horizon */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: SOL_Y,
          width: W,
          height: H - SOL_Y,
          background: `radial-gradient(ellipse 70% 40% at 50% 0%, rgba(30,42,62,0.35) 0%, rgba(20,28,42,0) 100%)`,
        }}
      />
      {/* Ligne d'horizon */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: SOL_Y,
          width: W,
          height: 1,
          background: `linear-gradient(90deg, rgba(150,168,195,0.05), rgba(150,168,195,0.22) 30%, rgba(150,168,195,0.22) 70%, rgba(150,168,195,0.05))`,
        }}
      />
      {/* Grain */}
      <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'screen'}}>
        <filter id="grain" x="0" y="0">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={graine % 50} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect x={-decalX} y={-decalY} width={W + 200} height={H + 200} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Vignette forte sur les bords (au-dessus des objets, sous le texte). */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 85% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.88) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/**
 * Objet posé sur le sol, avec son reflet : le même dessin retourné, ~25 %,
 * qui s'efface en dégradé.
 * x = centre horizontal, largeur/hauteur = boîte du dessin (bas posé sur le sol).
 * y = décalage vertical (négatif = au-dessus du sol, ex : objet flottant ; pas de reflet si flottant).
 */
export const SurSol: React.FC<{
  x: number;
  largeur: number;
  hauteur: number;
  y?: number;
  reflet?: number;
  opacity?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({x, largeur, hauteur, y = 0, reflet = 0.25, opacity = 1, style, children}) => {
  const bas = SOL_Y + y;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - largeur / 2,
          top: bas - hauteur,
          width: largeur,
          height: hauteur,
          opacity,
          ...style,
        }}
      >
        {children}
      </div>
      {reflet > 0 && (
        <div
          style={{
            position: 'absolute',
            left: x - largeur / 2,
            // le reflet part de la ligne du sol, symétrique de l'objet
            top: SOL_Y + (SOL_Y - bas),
            width: largeur,
            height: hauteur,
            opacity: opacity * reflet,
            transform: 'scaleY(-1)',
            transformOrigin: 'center',
            filter: 'blur(1.5px)',
            WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0) 70%)',
            maskImage: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 35%, rgba(0,0,0,0) 70%)',
            ...style,
          }}
        >
          {children}
        </div>
      )}
    </>
  );
};

/** Objet flottant (pas de reflet) positionné par son centre. */
export const Flottant: React.FC<{
  x: number;
  y: number;
  largeur: number;
  hauteur: number;
  opacity?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({x, y, largeur, hauteur, opacity = 1, style, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x - largeur / 2,
      top: y - hauteur / 2,
      width: largeur,
      height: hauteur,
      opacity,
      ...style,
    }}
  >
    {children}
  </div>
);
