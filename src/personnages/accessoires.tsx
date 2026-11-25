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
