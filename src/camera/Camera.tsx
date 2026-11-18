import React from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {clamp, H, lerp, W, wobble} from '../lib/anim';

/**
 * Plan caméra : à la frame `f`, la caméra part vers (x, y) = centre visé en coordonnées monde,
 * avec le zoom `z`, en `d` frames (courbe ease-in-out). d petit = zoom rapide.
 */
export type Plan = {f: number; x: number; y: number; z: number; d?: number; ease?: (t: number) => number};

export const camAt = (plans: Plan[], frame: number) => {
  let cur = {x: plans[0].x, y: plans[0].y, z: plans[0].z};
  for (let i = 1; i < plans.length; i++) {
    const p = plans[i];
    if (frame < p.f) break;
    const d = p.d ?? 20;
    const e = (p.ease ?? Easing.inOut(Easing.cubic))(clamp((frame - p.f) / d));
    cur = {x: lerp(cur.x, p.x, e), y: lerp(cur.y, p.y, e), z: lerp(cur.z, p.z, e)};
  }
  return cur;
};

export const Camera: React.FC<{
  plans: Plan[];
  mondeW: number;
  mondeH: number;
  /** partie visible du monde en hauteur (coupe la dalle du plafond / du sol) */
  haut?: number;
  bas?: number;
  secousse?: number; // amplitude de tremblement à cette frame
  children: React.ReactNode;
}> = ({plans, mondeW, mondeH, haut = 0, bas, secousse = 0, children}) => {
  const frame = useCurrentFrame();
  const c = camAt(plans, frame);
  // léger mouvement permanent ("caméra à l'épaule" très doux)
  const dx = wobble(frame * 0.03, 1) * 6 + (secousse ? Math.sin(frame * 3.1) * secousse : 0);
  const dy = wobble(frame * 0.03, 5) * 5 + (secousse ? Math.cos(frame * 2.7) * secousse : 0);
  const yb = bas ?? mondeH;
  const zMin = Math.max(W / mondeW, H / (yb - haut));
  const z = Math.max(zMin, c.z) * (1 + wobble(frame * 0.02, 9) * 0.004);
  // garder la caméra dans le monde
  const halfW = W / 2 / z;
  const halfH = H / 2 / z;
  const cx = clamp(c.x + dx / z, halfW, mondeW - halfW);
  const cy = clamp(c.y + dy / z, haut + halfH, yb - halfH);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: mondeW,
          height: mondeH,
          transformOrigin: '0 0',
          transform: `translate(${W / 2}px, ${H / 2}px) scale(${z}) translate(${-cx}px, ${-cy}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
