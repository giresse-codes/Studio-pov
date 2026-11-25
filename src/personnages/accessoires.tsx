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
