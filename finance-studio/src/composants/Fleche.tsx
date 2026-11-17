import React from 'react';
import {couleur as resoudreCouleur, halo} from '../style';
import {prog, useT} from './anim';

/** Trait néon (flèche) qui se dessine de (x1,y1) à (x2,y2), courbé de `courbe` px. */
export const Fleche: React.FC<{x1: number; y1: number; x2: number; y2: number; a: number; d?: number; couleur?: string; courbe?: number; opacity?: number}> = ({
  x1,
  y1,
  x2,
  y2,
  a,
  d = 0.6,
  couleur = 'blanc',
  courbe = 0,
  opacity = 1,
}) => {
  const t = useT();
  const p = prog(t, a, d);
  if (p <= 0) return null;
  const c = resoudreCouleur(couleur);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - courbe;
  // pointe orientée selon la tangente d'arrivée
  const ang = Math.atan2(y2 - my, x2 - mx);
  const L = 26;
  const pointe = `M ${x2 - L * Math.cos(ang - 0.5)} ${y2 - L * Math.sin(ang - 0.5)} L ${x2} ${y2} L ${x2 - L * Math.cos(ang + 0.5)} ${y2 - L * Math.sin(ang + 0.5)}`;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', filter: halo(c, 0.7), opacity}}>
      <g fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        <path d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        {p > 0.95 && <path d={pointe} />}
      </g>
    </svg>
  );
};

