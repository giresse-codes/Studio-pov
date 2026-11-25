import React from 'react';
import {C} from '../lib/theme';
import {Expression, Pose, Silhouette, Tenue} from './Silhouette';

/** Toi : sweat à capuche violet, jean gris, baskets blanches. */
const TENUE_TOI: Tenue = {
  haut: C.toiSweat, hautOmbre: C.toiSweatOmbre, bas: C.toiJean, basOmbre: C.toiJeanOmbre,
  chaussure: '#f4f4f6', semelle: '#c9cbd3',
};

const DetailsSweat = () => (
  <g>
    {/* cordons de capuche */}
    <path d="M10,0 L6,44" stroke="#e9e2ff" strokeWidth={5} strokeLinecap="round" />
    <path d="M30,0 L32,40" stroke="#e9e2ff" strokeWidth={5} strokeLinecap="round" />
    <circle cx={6} cy={46} r={5} fill="#e9e2ff" />
    <circle cx={32} cy={42} r={5} fill="#e9e2ff" />
    {/* poche kangourou */}
    <path d="M-30,86 L-22,62 L44,62 L52,86 Z" fill={C.toiSweatOmbre} />
    {/* col de capuche */}
    <path d="M-34,-8 Q4,18 44,-8" stroke={C.toiSweatOmbre} strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);

export const Toi: React.FC<{
  pose: Pose; expression?: Expression; regard?: number; regardY?: number; cligne?: number; parle?: number;
  sens?: 1 | -1; echelle?: number; mainAv?: React.ReactNode; mainAr?: React.ReactNode;
}> = ({expression = 'neutre', mainAv, mainAr, ...rest}) => (
  <Silhouette
    {...rest}
    expression={expression}
    tenue={TENUE_TOI}
    capuche={C.toiSweatOmbre}
    detailsBuste={<DetailsSweat />}
    accessoireMainAv={mainAv}
    accessoireMainAr={mainAr}
  />
);
