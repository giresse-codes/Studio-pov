import React from 'react';
import {C, halo} from '../style';

/**
 * Balance néon (comparaison de deux choses) : pied posé au sol, fléau qui
 * s'incline de `angle` degrés (positif = le plateau droit descend).
 * Les plateaux portent `gauche` et `droite` (contenus de 160 x 120 px).
 */
export const Balance: React.FC<{
  x: number;
  ySol: number;
  hauteur?: number;
  demiLargeur?: number;
  angle: number;
  trace?: number;
  gauche?: React.ReactNode;
  droite?: React.ReactNode;
}> = ({x, ySol, hauteur = 560, demiLargeur = 270, angle, trace = 1, gauche, droite}) => {
  const r = (angle * Math.PI) / 180;
  const yPivot = ySol - hauteur;
  const pg = {x: x - demiLargeur * Math.cos(r), y: yPivot - demiLargeur * Math.sin(r)};
  const pd = {x: x + demiLargeur * Math.cos(r), y: yPivot + demiLargeur * Math.sin(r)};
  const corde = 120;
  const plateau = (p: {x: number; y: number}) => (
    <>
      <path d={`M ${p.x} ${p.y} L ${p.x - 80} ${p.y + corde} M ${p.x} ${p.y} L ${p.x + 80} ${p.y + corde}`} />
      <path d={`M ${p.x - 90} ${p.y + corde} Q ${p.x} ${p.y + corde + 46} ${p.x + 90} ${p.y + corde} Z`} />
    </>
  );
  const dash = {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - trace};
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', filter: halo(C.blanc, 0.6)}} width={1} height={1}>
        <g fill="none" stroke={C.blanc} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={Math.min(1, trace * 2)}>
          <path d={`M ${x} ${ySol} L ${x} ${yPivot}`} {...dash} />
          <path d={`M ${pg.x} ${pg.y} L ${pd.x} ${pd.y}`} {...dash} />
          <circle cx={x} cy={yPivot} r={9} fill={C.blanc} />
          {trace > 0.6 && plateau(pg)}
          {trace > 0.6 && plateau(pd)}
        </g>
      </svg>
      {[{p: pg, c: gauche}, {p: pd, c: droite}].map(({p, c}, i) => (
        <div key={i} style={{position: 'absolute', left: p.x - 80, top: p.y + corde - 110, width: 160, height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
          {c}
        </div>
      ))}
    </>
  );
};
