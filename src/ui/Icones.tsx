import React from 'react';
import {useCurrentFrame} from 'remotion';

/* Icônes dessinées (Astuces) */

export const IconeRiz: React.FC<{s?: number}> = ({s = 140}) => (
  <svg width={s} height={s * 0.75} viewBox="0 0 140 105">
    <ellipse cx={70} cy={40} rx={60} ry={18} fill="#fefce8" />
    {Array.from({length: 16}).map((_, i) => (
      <ellipse key={i} cx={18 + i * 6.8} cy={36 - Math.sin(i * 1.3) * 8} rx={5} ry={3} fill="#fff" stroke="#d6d3d1" strokeWidth={1} />
    ))}
    <path d="M6,40 Q12,100 70,100 Q128,100 134,40 Z" fill="#ef4444" />
    <path d="M24,60 Q70,76 116,60" stroke="#fff" strokeWidth={5} fill="none" opacity={0.6} />
  </svg>
);

/** Téléphone éteint + courant d'air */
export const IconeSecherAir: React.FC<{s?: number}> = ({s = 160}) => {
  const f = useCurrentFrame();
  return (
    <svg width={s} height={s * 0.75} viewBox="0 0 160 120">
      <rect x={20} y={10} width={56} height={100} rx={10} fill="#1f2937" stroke="#9ca3af" strokeWidth={4} />
      <rect x={27} y={20} width={42} height={76} rx={4} fill="#111827" />
      <circle cx={48} cy={58} r={14} fill="none" stroke="#f87171" strokeWidth={5} />
      <line x1={48} y1={40} x2={48} y2={56} stroke="#f87171" strokeWidth={5} strokeLinecap="round" />
      {[0, 1, 2].map((i) => {
        const o = (f * 2 + i * 14) % 40;
        return (
          <path
            key={i}
            d={`M${88 + o * 0.5},${30 + i * 28} q14,-10 28,0 t28,0`}
            stroke="#7dd3fc"
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            opacity={1 - o / 40}
          />
        );
      })}
    </svg>
  );
};
