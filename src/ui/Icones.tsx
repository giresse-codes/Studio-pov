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

const Rond: React.FC<{s: number; fond: string; children: React.ReactNode}> = ({s, fond, children}) => (
  <svg width={s} height={s} viewBox="0 0 120 120">
    <circle cx={60} cy={60} r={56} fill={fond} stroke="#0f1630" strokeWidth={5} />
    {children}
  </svg>
);

/** Étape 1 : éteindre */
export const IconePower: React.FC<{s?: number}> = ({s = 120}) => (
  <Rond s={s} fond="#ef4444">
    <path d="M42,38 A30,30 0 1,0 78,38" stroke="#fff" strokeWidth={11} fill="none" strokeLinecap="round" />
    <line x1={60} y1={24} x2={60} y2={60} stroke="#fff" strokeWidth={11} strokeLinecap="round" />
  </Rond>
);

/** Étape 2 : ne pas brancher (prise barrée) */
export const IconePriseBarree: React.FC<{s?: number}> = ({s = 120}) => (
  <Rond s={s} fond="#f59e0b">
    <rect x={40} y={46} width={40} height={34} rx={8} fill="#fff" />
    <rect x={47} y={30} width={7} height={18} rx={3} fill="#fff" />
    <rect x={66} y={30} width={7} height={18} rx={3} fill="#fff" />
    <path d="M60,80 L60,98" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
    <line x1={24} y1={24} x2={96} y2={96} stroke="#7f1d1d" strokeWidth={10} strokeLinecap="round" />
  </Rond>
);

/** Étape 3 : coque, essuyer, tapoter ports vers le bas */
export const IconeChiffon: React.FC<{s?: number}> = ({s = 120}) => {
  const f = useCurrentFrame();
  const tap = Math.abs(Math.sin(f * 0.4)) * 6;
  return (
    <Rond s={s} fond="#3b82f6">
      <g transform={`translate(0,${tap})`}>
        <rect x={44} y={22} width={32} height={56} rx={7} fill="#111827" stroke="#fff" strokeWidth={3} transform="rotate(180 60 50)" />
        <rect x={54} y={76} width={12} height={4} rx={2} fill="#fff" />
      </g>
      {[0, 1].map((i) => (
        <ellipse key={i} cx={56 + i * 10} cy={92 + ((f * 2 + i * 8) % 14)} rx={4} ry={6} fill="#bae6fd" />
      ))}
    </Rond>
  );
};

/** Étape 4 : sécher à l'air libre 24 h */
export const IconeAir24: React.FC<{s?: number}> = ({s = 120}) => {
  const f = useCurrentFrame();
  return (
    <Rond s={s} fond="#22c55e">
      {[0, 1, 2].map((i) => {
        const o = (f * 1.5 + i * 12) % 36;
        return <path key={i} d={`M${18 + o * 0.4},${36 + i * 18} q12,-8 24,0 t24,0`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={1 - o / 36} />;
      })}
      <text x={60} y={104} textAnchor="middle" fontFamily="'Fredoka', sans-serif" fontWeight={700} fontSize={26} fill="#fff">
        24 h
      </text>
    </Rond>
  );
};

/** Réparateur (clé) */
export const IconeCle: React.FC<{s?: number}> = ({s = 120}) => (
  <Rond s={s} fond="#a855f7">
    <path d="M78,28 a18,18 0 1,0 14,28 l-34,34 a8,8 0 0,1 -12,-12 l34,-34 a18,18 0 0,0 -2,-16 l-10,10 l-8,-2 l-2,-8 Z" fill="#fff" />
  </Rond>
);

/** Bocal de cornichons */
export const IconeBocal: React.FC<{s?: number}> = ({s = 140}) => {
  const f = useCurrentFrame();
  return (
    <svg width={s} height={s * 1.2} viewBox="0 0 100 120" style={{transform: `rotate(${Math.sin(f * 0.6) * 6}deg)`}}>
      <rect x={18} y={6} width={64} height={18} rx={5} fill="#dc2626" stroke="#7f1d1d" strokeWidth={3} />
      <rect x={14} y={22} width={72} height={92} rx={16} fill="#d9f99d" opacity={0.55} stroke="#65a30d" strokeWidth={4} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={24 + (i % 2) * 26} y={36 + Math.floor(i / 2) * 36} width={22} height={34} rx={11} fill="#4d7c0f" transform={`rotate(${i % 2 ? 12 : -10} ${35 + (i % 2) * 26} ${53 + Math.floor(i / 2) * 36})`} />
      ))}
      <rect x={20} y={30} width={8} height={70} rx={4} fill="#fff" opacity={0.4} />
    </svg>
  );
};

/** Empreintes de pas (marcher) */
export const IconePas: React.FC<{s?: number}> = ({s = 120}) => (
  <Rond s={s} fond="#22c55e">
    {[
      [42, 78, -12],
      [72, 46, 12],
    ].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
        <ellipse cx={0} cy={0} rx={10} ry={17} fill="#fff" />
        {[-7, -2, 3, 8].map((dx, j) => (
          <circle key={j} cx={dx} cy={-22 + Math.abs(dx) * 0.3} r={3.5} fill="#fff" />
        ))}
      </g>
    ))}
  </Rond>
);

/** Rester sur place (repère au sol) */
export const IconeRester: React.FC<{s?: number}> = ({s = 120}) => (
  <Rond s={s} fond="#ef4444">
    <path d="M60,92 C40,64 34,54 34,44 A26,26 0 0,1 86,44 C86,54 80,64 60,92 Z" fill="#fff" />
    <circle cx={60} cy={44} r={10} fill="#ef4444" />
    <ellipse cx={60} cy={98} rx={24} ry={6} fill="#fff" opacity={0.6} />
  </Rond>
);
