import React from 'react';
import {POLICE} from '../lib/theme';

/** Accessoires à mettre dans une main (repère main : origine = main, axe = avant-bras) */
export const Smartphone: React.FC<{ecran?: string}> = ({ecran = '#5ad1ff'}) => (
  <g transform="rotate(-10) translate(-16,-60)">
    <rect x={0} y={0} width={36} height={66} rx={8} fill="#2d2d3a" />
    <rect x={4} y={6} width={28} height={52} rx={4} fill={ecran} />
  </g>
);

/** Pancarte tenue à bout de bras */
export const Pancarte: React.FC<{lignes: string[]; couleur?: string; echelle?: number}> = ({lignes, couleur = '#e23b4e', echelle = 1}) => (
  <g transform={`scale(${echelle}) translate(-20,-250)`}>
    <rect x={14} y={150} width={14} height={110} fill="#8a5a3a" />
    <rect x={-140} y={0} width={320} height={170} rx={12} fill="#fff" stroke={couleur} strokeWidth={10} />
    {lignes.map((l, i) => (
      <text key={i} x={20} y={lignes.length === 1 ? 118 : 72 + i * 68} textAnchor="middle" fontFamily={POLICE} fontWeight={900}
        fontSize={lignes.length === 1 ? 110 : 62} fill={i === 0 ? couleur : '#2d2d3a'}>{l}</text>
    ))}
  </g>
);

/** Saladier de riz (repère : fond du saladier) */
export const SaladierRiz: React.FC<{echelle?: number; telephone?: boolean}> = ({echelle = 1, telephone}) => (
  <g transform={`scale(${echelle})`}>
    {telephone && (
      <g transform="translate(6,-62) rotate(12)">
        <rect x={-20} y={-40} width={40} height={74} rx={8} fill="#2d2d3a" />
        <rect x={-15} y={-34} width={30} height={60} rx={4} fill="#5ad1ff" />
      </g>
    )}
    <ellipse cx={0} cy={-52} rx={78} ry={18} fill="#fffaf0" />
    {Array.from({length: 18}).map((_, i) => (
      <ellipse key={i} cx={-60 + (i % 9) * 15} cy={-56 + Math.floor(i / 9) * 8} rx={5} ry={2.5} fill="#e9e1cf" transform={`rotate(${i * 20},${-60 + (i % 9) * 15},${-56 + Math.floor(i / 9) * 8})`} />
    ))}
    <path d="M-82,-52 Q-76,0 0,0 Q76,0 82,-52 Z" fill="#5ac8c8" />
    <path d="M-70,-36 Q0,-24 70,-36" stroke="#ffffff" strokeWidth={6} fill="none" opacity={0.6} />
  </g>
);

/** Téléphone posé à plat (vu de côté, écran qui peut clignoter) */
export const TelephoneAPlat: React.FC<{allume?: boolean; rot?: number}> = ({allume = true, rot = 0}) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-70} y={-12} width={140} height={20} rx={8} fill="#2d2d3a" />
    <rect x={-64} y={-14} width={128} height={6} rx={3} fill={allume ? '#5ad1ff' : '#1b1c25'} />
  </g>
);

/** Fourchette (repère : centre) */
export const Fourchette: React.FC<{rot?: number}> = ({rot = 0}) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-80} y={-5} width={110} height={10} rx={5} fill="#c9cfdb" />
    <rect x={30} y={-14} width={20} height={28} rx={6} fill="#c9cfdb" />
    {[-12, -4, 4, 12].map((dy) => <rect key={dy} x={48} y={dy - 2} width={36} height={4} rx={2} fill="#c9cfdb" />)}
  </g>
);

/** Casserole (repère : fond, posée sur la plaque) */
export const Casserole: React.FC<{vapeur?: number; riz?: boolean}> = ({vapeur = 0, riz}) => (
  <g>
    {riz && <ellipse cx={0} cy={-96} rx={80} ry={14} fill="#fffaf0" />}
    <rect x={-90} y={-100} width={180} height={100} rx={10} fill="#9aa3b5" />
    <rect x={-90} y={-100} width={180} height={14} rx={6} fill="#c9cfdb" />
    <rect x={90} y={-86} width={110} height={16} rx={8} fill="#2d2d3a" />
    {vapeur > 0 && [0, 1, 2].map((i) => (
      <path key={i} d={`M${-40 + i * 40},-120 q-14,-22 0,-44 q14,-22 0,-44`} stroke="#ffffff" strokeWidth={6} fill="none" opacity={0.55}
        transform={`translate(0,${-((vapeur * 1.5 + i * 15) % 30)})`} strokeLinecap="round" />
    ))}
  </g>
);

/** Couteau de cuisine (repère main) */
export const Couteau: React.FC<{rot?: number}> = ({rot = 0}) => (
  <g transform={`rotate(${rot})`}>
    <rect x={-10} y={-50} width={20} height={56} rx={6} fill="#5b3b2a" />
    <path d="M-10,-50 L-10,-160 Q4,-150 12,-50 Z" fill="#dfe4ee" stroke="#9aa3b5" strokeWidth={3} />
  </g>
);

/** Bouteille de sauce piquante (repère main) */
export const SaucePiquante: React.FC = () => (
  <g transform="translate(0,-40)">
    <rect x={-22} y={-60} width={44} height={110} rx={12} fill="#e23b2e" />
    <rect x={-10} y={-92} width={20} height={34} rx={4} fill="#2d2d3a" />
    <rect x={-18} y={-30} width={36} height={40} rx={6} fill="#fff" />
    <text x={0} y={-2} textAnchor="middle" fontSize={24}>🌶️</text>
  </g>
);

/** Verre (repère main ou table : fond du verre) ; contenu eau / lait / vide */
export const Verre: React.FC<{contenu?: 'eau' | 'lait' | 'vide'; niveau?: number; echelle?: number}> = ({contenu = 'eau', niveau = 0.8, echelle = 1}) => {
  const h = 90, w = 56;
  const c = contenu === 'lait' ? '#ffffff' : '#7fc6ff';
  return (
    <g transform={`scale(${echelle}) translate(0,-${h})`}>
      {contenu !== 'vide' && <path d={`M${-w / 2 + 4 + (1 - niveau) * 3},${h * (1 - niveau)} L${w / 2 - 4 - (1 - niveau) * 3},${h * (1 - niveau)} L${w / 2 - 8},${h - 4} L${-w / 2 + 8},${h - 4} Z`} fill={c} opacity={contenu === 'lait' ? 0.95 : 0.7} />}
      <path d={`M${-w / 2},0 L${w / 2},0 L${w / 2 - 6},${h} L${-w / 2 + 6},${h} Z`} fill="#ffffff" opacity={0.25} stroke="#dff2ff" strokeWidth={4} />
      <rect x={-w / 2 + 8} y={10} width={6} height={h - 24} rx={3} fill="#fff" opacity={0.6} />
    </g>
  );
};

/** Taco (repère main) */
export const Taco: React.FC<{croque?: boolean}> = ({croque}) => (
  <g transform="translate(0,-30)">
    <path d="M-60,20 Q0,-70 60,20 Z" fill="#f5c542" />
    <path d="M-48,10 Q0,-50 48,10" stroke="#4fae5e" strokeWidth={12} fill="none" />
    <path d="M-40,14 Q0,-30 40,14" stroke="#e74c3c" strokeWidth={8} fill="none" />
    {croque && <circle cx={52} cy={0} r={22} fill="#14141800" stroke="none" />}
    {croque && <path d="M40,-10 a14,14 0 0,0 0,28 a14,14 0 0,0 0,-28" fill="#bfe3d0" />}
  </g>
);

/** Flammes animées (repère : base des flammes), pour une bouche en feu */
export const Flammes: React.FC<{frame: number; echelle?: number}> = ({frame, echelle = 1}) => (
  <g transform={`scale(${echelle})`}>
    {[-36, 0, 36].map((dx, i) => {
      const h = 90 + Math.sin(frame / 2 + i * 2) * 22;
      return (
        <g key={i} transform={`translate(${dx},0)`}>
          <path d={`M-26,0 Q-30,${-h * 0.5} 0,${-h} Q30,${-h * 0.5} 26,0 Z`} fill="#ff4a1c" />
          <path d={`M-15,0 Q-16,${-h * 0.4} 0,${-h * 0.7} Q16,${-h * 0.4} 15,0 Z`} fill="#ffb21c" />
          <path d={`M-7,0 Q-6,${-h * 0.25} 0,${-h * 0.4} Q6,${-h * 0.25} 7,0 Z`} fill="#fff3a8" />
        </g>
      );
    })}
  </g>
);
