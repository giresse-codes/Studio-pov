import React from 'react';
import {POLICE} from '../lib/theme';

/** Fond de l'appel vidéo de Max : coin du bureau de la startup (repère 544 x 584) */
export const FondBureauStartup: React.FC<{frame: number}> = ({frame}) => (
  <g>
    <rect x={0} y={0} width={544} height={584} fill="#bcd3f2" />
    <rect x={0} y={430} width={544} height={154} fill="#8aa3c8" />
    {/* tableau blanc */}
    <g transform="translate(30,96) rotate(-2)">
      <rect x={0} y={0} width={270} height={170} rx={8} fill="#ffffff" stroke="#9aa3b5" strokeWidth={8} />
      <text x={135} y={66} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={40} fill="#e23b4e">DEADLINE</text>
      <text x={135} y={118} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={44} fill="#e23b4e">9 H !!!</text>
      <path d="M30,140 L240,140" stroke="#3570b8" strokeWidth={6} strokeLinecap="round" />
    </g>
    {/* plante et lampe néon */}
    <rect x={20} y={40} width={150} height={20} rx={10} fill="#ff6b9a" opacity={0.6 + 0.4 * Math.sin(frame / 5)} />
    <g transform="translate(80,430)">
      <path d="M-30,0 L30,0 L24,-60 L-24,-60 Z" fill="#f3f0ea" />
      <ellipse cx={0} cy={-90} rx={36} ry={44} fill="#4fae5e" />
    </g>
  </g>
);
