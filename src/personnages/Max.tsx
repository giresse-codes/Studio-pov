import React from 'react';
import {C} from '../lib/theme';
import {Expression, Pose, Silhouette, Tenue} from './Silhouette';

/** Max : chef de projet stressé — chemise bleue froissée, badge, café, cheveux en bataille. */
const TENUE_MAX: Tenue = {
  haut: C.maxChemise, hautOmbre: C.maxChemiseOmbre, bas: C.maxPantalon, basOmbre: '#2c3040',
  chaussure: '#4a2f22', semelle: '#2a1a12',
};

export const CheveuxMax: React.FC = () => (
  <g fill="#3b2416">
    {[-80, -55, -28, 0, 26, 52, 78].map((a, i) => (
      <path key={i} transform={`rotate(${a})`} d={`M-16,-86 L${i % 2 ? 6 : -4},${-130 - (i % 3) * 10} L16,-86 Z`} />
    ))}
    <path d="M-70,-62 Q-110,-60 -100,-20 L-78,-30 Z" />
  </g>
);

const DetailsChemise = () => (
  <g>
    {/* col */}
    <path d="M-28,-10 L0,20 L4,-10 Z" fill="#dbe9fb" />
    <path d="M34,-10 L8,20 L4,-10 Z" fill="#dbe9fb" />
    {/* boutons */}
    {[34, 62, 90, 118].map((y) => <circle key={y} cx={6} cy={y} r={4} fill="#dbe9fb" />)}
    {/* plis de chemise froissée */}
    <path d="M-36,50 L-14,62 L-30,76" stroke={C.maxChemiseOmbre} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M26,92 L44,80 L32,110" stroke={C.maxChemiseOmbre} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d="M-20,112 L-4,104" stroke={C.maxChemiseOmbre} strokeWidth={4} strokeLinecap="round" />
    {/* badge */}
    <path d="M20,0 L28,38" stroke="#e23b4e" strokeWidth={4} />
    <rect x={18} y={36} width={30} height={38} rx={5} fill="#fff" />
    <rect x={22} y={42} width={22} height={12} rx={2} fill="#4a8fe0" />
    <rect x={22} y={58} width={22} height={4} fill="#9aa3b5" />
    <rect x={22} y={65} width={14} height={4} fill="#9aa3b5" />
  </g>
);

/** Gobelet de café (repère main) */
export const Cafe: React.FC<{vapeur?: number}> = ({vapeur = 0}) => (
  <g transform="translate(-4,-46)">
    <path d="M-18,0 L18,0 L14,52 L-14,52 Z" fill="#f2ede4" />
    <rect x={-20} y={-8} width={40} height={10} rx={3} fill="#5b3b2a" />
    <rect x={-17} y={18} width={34} height={16} fill="#c58b4a" />
    {[0, 1].map((i) => (
      <path key={i} d={`M${-6 + i * 12},-14 q-8,-12 0,-24 q8,-12 0,-24`} stroke="#ffffff" strokeWidth={4} fill="none" opacity={0.45}
        transform={`translate(0,${-((vapeur * 2 + i * 10) % 20)})`} strokeLinecap="round" />
    ))}
  </g>
);

export const Max: React.FC<{
  pose: Pose; expression?: Expression; regard?: number; regardY?: number; cligne?: number; parle?: number;
  sens?: 1 | -1; echelle?: number; cafe?: boolean; frame?: number;
}> = ({expression = 'panique', cafe = true, frame = 0, ...rest}) => (
  <Silhouette
    {...rest}
    expression={expression}
    tenue={TENUE_MAX}
    cheveux={<CheveuxMax />}
    detailsBuste={<DetailsChemise />}
    accessoireMainAr={cafe ? <Cafe vapeur={frame} /> : undefined}
  />
);
