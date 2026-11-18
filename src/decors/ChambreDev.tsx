import React from 'react';
import {useCurrentFrame} from 'remotion';
import {mixColor} from '../lib/anim';
import {MONO} from '../lib/fonts';
import {
  Bureau,
  ChaiseGaming,
  Clavier,
  CodeLignes,
  Coupe,
  Eclairage,
  Ecran,
  Etagere,
  Fenetre,
  Guirlande,
  Parquet,
  Plante,
  Poster,
  Suspension,
  Tapis,
  TourPC,
} from './elements';

/** Chambre de dev : bureau + PC gaming, fenêtre sur la ville, guirlande. */
export const CHAMBRE = {
  W: 1800,
  H: 1920,
  PLAFOND: 300,
  SOL: 1500,
  chaise: {x: 1000, y: 1500},
  ecran: {x: 1250, y: 1040, w: 300, h: 186},
  fenetre: {x: 230, y: 520, w: 420, h: 480},
};

export const ChambreDev: React.FC<{jour: number; ecran?: React.ReactNode; children?: React.ReactNode}> = ({jour, ecran, children}) => {
  const t = useCurrentFrame();
  const {W, H, PLAFOND, SOL, ecran: E, fenetre: F} = CHAMBRE;
  const mur = mixColor('#3f3a7a', '#7d72d8', jour);
  const murBas = mixColor('#332f66', '#655bc0', jour);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* murs */}
      <rect x={0} y={PLAFOND} width={W} height={SOL - PLAFOND} fill={mur} />
      <rect x={0} y={1180} width={W} height={SOL - 1180} fill={murBas} />
      <rect x={0} y={1170} width={W} height={14} fill="#fff" opacity={0.25} />
      <Parquet x={0} y={SOL} w={W} h={70} />
      <rect x={0} y={SOL - 22} width={W} height={22} fill="#f1e7ff" opacity={0.6} />
      <Fenetre {...F} jour={jour} t={t} id="chambre" rideau="#ff7a8a" />
      {/* lumière du jour au sol */}
      <path d={`M${F.x},${SOL} L${F.x + F.w},${SOL} L${F.x + F.w + 260},${SOL + 70} L${F.x + 180},${SOL + 70} Z`} fill="#fff6c8" opacity={jour * 0.35} />
      <Guirlande x1={120} x2={900} y={410} sag={50} jour={jour} t={t} />
      {/* lit */}
      <g>
        <rect x={40} y={1330} width={520} height={130} rx={18} fill="#5b3f8f" />
        <rect x={40} y={1300} width={520} height={60} rx={20} fill="#f8f4ff" />
        <rect x={60} y={1270} width={140} height={60} rx={24} fill="#fff" />
        <path d="M230,1300 L560,1300 L560,1380 L250,1380 Z" fill="#22c1c3" />
        <rect x={40} y={1450} width={20} height={50} fill="#3b2a5f" />
        <rect x={540} y={1450} width={20} height={50} fill="#3b2a5f" />
        <rect x={30} y={1180} width={30} height={290} rx={10} fill="#3b2a5f" />
      </g>
      <Tapis x={560} y={1520} w={520} />
      <Plante x={720} y={1500} s={1.1} t={t} />
      <Suspension x={860} y={PLAFOND} long={140} jour={jour} c="#ff8fab" />
      {/* posters */}
      <Poster x={1110} y={420} w={200} h={260} fond="#111827" rot={-3}>
        <text x={100} y={120} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={44} fill="#4ade80">
          {'</>'}
        </text>
        <text x={100} y={180} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={24} fill="#fff">
          CODE
        </text>
        <text x={100} y={210} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={24} fill="#fff">
          SLEEP
        </text>
      </Poster>
      <Poster x={1370} y={390} w={240} h={170} fond="#f97316" rot={4}>
        <circle cx={70} cy={85} r={45} fill="#fde047" />
        <rect x={130} y={50} width={80} height={18} rx={9} fill="#fff" />
        <rect x={130} y={84} width={60} height={18} rx={9} fill="#fff" />
        <rect x={130} y={118} width={70} height={18} rx={9} fill="#fff" />
      </Poster>
      <Etagere x={1330} y={800} w={330} />
      {/* bureau */}
      <ChaiseGaming x={CHAMBRE.chaise.x} y={CHAMBRE.chaise.y} couleur="#e11d48" />
      <Bureau x={1080} y={1300} w={560} h={200} couleur="#d39b6a" />
      <Ecran x={E.x} y={E.y} w={E.w} h={E.h} glow={0.4 + (1 - jour) * 0.6}>
        {ecran ?? <CodeLignes w={E.w} h={E.h} t={t} />}
      </Ecran>
      <Clavier x={1150} y={1300} t={t} />
      {/* lampe de bureau */}
      <g>
        <rect x={1560} y={1290} width={60} height={10} rx={5} fill="#334155" />
        <path d="M1590,1290 L1570,1200 L1520,1180" stroke="#334155" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M1490,1160 L1550,1170 L1535,1205 Z" fill="#fbbf24" />
      </g>
      {/* mug */}
      <g>
        <rect x={1100} y={1262} width={34} height={38} rx={6} fill="#facc15" />
        <path d="M1134,1272 q16,0 16,12 q0,12 -16,12" stroke="#facc15" strokeWidth={6} fill="none" />
      </g>
      <TourPC x={1655} y={SOL} t={t} />
      {children}
      <Eclairage
        w={W}
        h={H}
        jour={jour}
        id="chambre"
        lampes={[
          {x: E.x + E.w / 2, y: E.y + E.h / 2, r: 420},
          {x: 520, y: 470, r: 360},
          {x: 1520, y: 1230, r: 260},
          {x: 860, y: 520, r: 300},
        ]}
      />
      <Coupe w={W} plafond={PLAFOND} sol={SOL} />
    </svg>
  );
};
