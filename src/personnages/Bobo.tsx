import React from 'react';
import {C} from '../lib/theme';
import {Expression, Pose, Silhouette, Tenue} from './Silhouette';

/** Bobo : colocataire maladroit — t-shirt jaune taché, short, claquettes, cheveux frisés. */
const TENUE_BOBO: Tenue = {
  haut: C.boboTshirt, hautOmbre: C.boboTshirtOmbre, bas: C.boboShort, basOmbre: '#2f8a6e',
  chaussure: '#2e86de', semelle: '#1b5fa8', manchesCourtes: true, jambesNues: true,
};

export const CheveuxBobo: React.FC = () => (
  <g fill="#2a1c12">
    {Array.from({length: 13}).map((_, i) => {
      const a = -100 + i * 16;
      const r = 92;
      const x = Math.sin((a * Math.PI) / 180) * r;
      const y = -Math.cos((a * Math.PI) / 180) * r;
      return <circle key={i} cx={x} cy={y} r={26 + (i % 3) * 3} />;
    })}
  </g>
);

const Taches = () => (
  <g>
    <path d="M-24,46 q8,-10 16,0 q6,10 -6,14 q-14,2 -10,-14 Z" fill="#c0392b" opacity={0.75} />
    <ellipse cx={30} cy={96} rx={12} ry={8} fill="#8e5b2a" opacity={0.6} />
    <circle cx={40} cy={110} r={4} fill="#8e5b2a" opacity={0.6} />
    <path d="M-30,-6 Q4,14 40,-6" stroke={C.boboTshirtOmbre} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

export const Bobo: React.FC<{
  pose: Pose; expression?: Expression; regard?: number; regardY?: number; cligne?: number; parle?: number;
  sens?: 1 | -1; echelle?: number; mainAv?: React.ReactNode; mainAr?: React.ReactNode;
}> = ({expression = 'content', mainAv, mainAr, ...rest}) => (
  <Silhouette
    {...rest}
    expression={expression}
    tenue={TENUE_BOBO}
    cheveux={<CheveuxBobo />}
    detailsBuste={<Taches />}
    accessoireMainAv={mainAv}
    accessoireMainAr={mainAr}
  />
);
