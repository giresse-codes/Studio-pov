import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {H, W} from '../lib/theme';

/**
 * Caméra 2D : la scène (monde de taille largeur x hauteur) est vue à travers l'écran 1080x1920.
 * Des « plans » (frame, x, y, zoom) définissent où regarder ; la caméra glisse de l'un à l'autre
 * avec une courbe d'accélération, plus une légère dérive permanente (l'image n'est jamais figée).
 * Le cadrage est toujours borné à la scène : jamais de bande noire.
 */
export type Plan = {a: number; x: number; y: number; zoom: number; duree?: number; ease?: (t: number) => number};

export const etatCamera = (plans: Plan[], f: number) => {
  let x = plans[0].x, y = plans[0].y, z = plans[0].zoom;
  for (let i = 1; i < plans.length; i++) {
    const p = plans[i];
    const d = p.duree ?? 24;
    if (f <= p.a) break;
    const t = interpolate(f, [p.a, p.a + d], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: p.ease ?? Easing.bezier(0.65, 0, 0.25, 1),
    });
    x = x + (p.x - x) * t;
    y = y + (p.y - y) * t;
    z = z * Math.pow(p.zoom / z, t); // zoom interpolé en échelle log (plus naturel)
  }
  return {x, y, zoom: z};
};

export const Camera: React.FC<{
  plans: Plan[];
  largeur: number;
  hauteur?: number;
  derive?: number; // amplitude du mouvement permanent (px écran)
  secousse?: number; // 0..1 tremblement ponctuel
  children: React.ReactNode;
}> = ({plans, largeur, hauteur = H, derive = 1, secousse = 0, children}) => {
  const f = useCurrentFrame();
  const c = etatCamera(plans, f);
  // dérive douce + respiration du zoom
  const zoom = Math.max(c.zoom * (1.012 + Math.sin(f / 70) * 0.006 * derive), W / largeur, H / hauteur);
  let x = c.x + Math.sin(f / 53) * 6 * derive + Math.sin(f * 1.7) * 14 * secousse;
  let y = c.y + Math.cos(f / 61) * 5 * derive + Math.cos(f * 2.3) * 12 * secousse;
  // bornes : jamais de vide hors de la scène
  const demiL = W / 2 / zoom;
  const demiH = H / 2 / zoom;
  x = Math.min(Math.max(x, demiL), largeur - demiL);
  y = Math.min(Math.max(y, demiH), hauteur - demiH);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute', left: 0, top: 0, width: largeur, height: hauteur,
          transformOrigin: '0 0',
          transform: `translate(${W / 2}px, ${H / 2}px) scale(${zoom}) translate(${-x}px, ${-y}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
