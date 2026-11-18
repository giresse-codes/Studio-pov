import React from 'react';
import {useCurrentFrame} from 'remotion';
import {mixColor} from '../lib/anim';
import {FONT, MONO} from '../lib/fonts';
import {
  Bureau,
  ChaiseGaming,
  Clavier,
  CodeLignes,
  Coupe,
  Eclairage,
  Ecran,
  Fenetre,
  Parquet,
  Plante,
  Poster,
  Suspension,
  Tapis,
} from './elements';

/** Bureau de startup : open space, grande baie vitrée, néon, tableau blanc de Max, machine à café. */
export const STARTUP = {
  W: 2000,
  H: 1920,
  PLAFOND: 300,
  SOL: 1500,
  chaise: {x: 860, y: 1500},
  ecran: {x: 1090, y: 1040, w: 300, h: 186},
  fenetre: {x: 150, y: 500, w: 560, h: 560},
  tableau: {x: 1500, y: 560, w: 420, h: 300},
  cafe: {x: 1770, y: 1290},
};

const Horloge: React.FC<{x: number; y: number; h: number; m: number}> = ({x, y, h, m}) => {
  const am = (m / 60) * 360;
  const ah = ((h % 12) / 12) * 360 + m * 0.5;
  return (
    <g>
      <circle cx={x + 4} cy={y + 6} r={56} fill="#000" opacity={0.12} />
      <circle cx={x} cy={y} r={56} fill="#fff" stroke="#334155" strokeWidth={8} />
      {Array.from({length: 12}).map((_, i) => (
        <rect key={i} x={x - 2} y={y - 48} width={4} height={10} fill="#334155" transform={`rotate(${i * 30} ${x} ${y})`} />
      ))}
      <line x1={x} y1={y} x2={x} y2={y - 28} stroke="#111" strokeWidth={7} strokeLinecap="round" transform={`rotate(${ah} ${x} ${y})`} />
      <line x1={x} y1={y} x2={x} y2={y - 42} stroke="#111" strokeWidth={4} strokeLinecap="round" transform={`rotate(${am} ${x} ${y})`} />
      <circle cx={x} cy={y} r={5} fill="#ef4444" />
    </g>
  );
};

export const BureauStartup: React.FC<{
  jour: number;
  ecran?: React.ReactNode;
  children?: React.ReactNode;
  heure?: [number, number];
  tableau?: React.ReactNode;
}> = ({jour, ecran, children, heure = [9, 12], tableau}) => {
  const t = useCurrentFrame();
  const {W, H, PLAFOND, SOL, ecran: E, fenetre: F, tableau: T} = STARTUP;
  const mur = mixColor('#3b5f63', '#8fd3c7', jour);
  const brique = mixColor('#6b3a32', '#c8735e', jour);
  const neon = 0.75 + 0.25 * Math.sin(t * 0.3) * Math.sin(t * 0.13);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <rect x={0} y={PLAFOND} width={W} height={SOL - PLAFOND} fill={mur} />
      {/* pan de briques derrière la zone de Max */}
      <rect x={1440} y={PLAFOND} width={560} height={SOL - PLAFOND} fill={brique} />
      {Array.from({length: 34}).map((_, r) =>
        Array.from({length: 9}).map((__, c) => (
          <rect
            key={`${r}-${c}`}
            x={1440 + c * 66 - (r % 2) * 33}
            y={PLAFOND + r * 34}
            width={62}
            height={30}
            rx={3}
            fill="#000"
            opacity={0.08 + ((r * 7 + c * 3) % 5) * 0.012}
          />
        )),
      )}
      <rect x={0} y={1200} width={1440} height={SOL - 1200} fill="#000" opacity={0.06} />
      <Parquet x={0} y={SOL} w={W} h={70} c="#a8754a" />
      <rect x={0} y={SOL - 20} width={W} height={20} fill="#fff" opacity={0.35} />

      <Fenetre {...F} jour={jour} t={t} id="startup" rideau="#f2c14e" cadre="#2d3748" />
      <path d={`M${F.x},${SOL} L${F.x + F.w},${SOL} L${F.x + F.w + 300},${SOL + 70} L${F.x + 200},${SOL + 70} Z`} fill="#fff6c8" opacity={jour * 0.3} />

      {/* néon */}
      <g>
        <rect x={880} y={500} width={460} height={130} rx={24} fill="#1a1325" opacity={0.85} />
        <text x={1110} y={590} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={74} fill="#ff4fa3" opacity={neon * 0.35} stroke="#ff4fa3" strokeWidth={14}>
          START-UP
        </text>
        <text x={1110} y={590} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={74} fill="#ffd1ea" opacity={neon}>
          START-UP
        </text>
      </g>
      <Poster x={890} y={700} w={190} h={240} fond="#fbbf24" rot={-4}>
        <text x={95} y={90} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#1f2937">
          MOVE
        </text>
        <text x={95} y={140} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#1f2937">
          FAST
        </text>
        <path d="M60,175 L95,205 L130,175" stroke="#ef4444" strokeWidth={10} fill="none" strokeLinecap="round" />
      </Poster>
      <Horloge x={1300} y={800} h={heure[0]} m={heure[1]} />

      {/* tableau blanc de Max */}
      <g>
        <rect x={T.x + 8} y={T.y + 12} width={T.w} height={T.h} fill="#000" opacity={0.15} />
        <rect x={T.x} y={T.y} width={T.w} height={T.h} rx={8} fill="#f8fafc" stroke="#94a3b8" strokeWidth={10} />
        {tableau ?? (
          <g>
            <text x={T.x + 30} y={T.y + 60} fontFamily={FONT} fontWeight={700} fontSize={40} fill="#ef4444">
              DEADLINE !!!
            </text>
            {['#fde047', '#86efac', '#f9a8d4', '#93c5fd', '#fde047', '#fdba74'].map((c, i) => (
              <rect key={i} x={T.x + 30 + (i % 3) * 125} y={T.y + 100 + Math.floor(i / 3) * 90} width={100} height={70} fill={c} transform={`rotate(${(i % 2 ? 3 : -3)} ${T.x + 80 + (i % 3) * 125} ${T.y + 135})`} />
            ))}
          </g>
        )}
        <rect x={T.x + 40} y={T.y + T.h + 4} width={T.w - 80} height={14} rx={4} fill="#94a3b8" />
      </g>

      {/* comptoir + machine à café */}
      <g>
        <rect x={1620} y={1290} width={360} height={210} fill="#e5e7eb" />
        <rect x={1610} y={1276} width={380} height={22} rx={6} fill="#cbd5e1" />
        <rect x={1640} y={1330} width={150} height={150} rx={8} fill="#d1d5db" />
        <rect x={1810} y={1330} width={150} height={150} rx={8} fill="#d1d5db" />
        <rect x={1700} y={1110} width={150} height={166} rx={14} fill="#1f2937" />
        <rect x={1718} y={1130} width={114} height={40} rx={6} fill="#22d3ee" opacity={0.8} />
        <rect x={1745} y={1200} width={60} height={20} rx={4} fill="#4b5563" />
        <rect x={1755} y={1232} width={40} height={44} rx={4} fill="#fff" />
        <circle cx={1880} cy={1240} r={28} fill="#16a34a" />
        <rect x={1868} y={1240} width={24} height={36} fill="#7c4a1e" />
      </g>

      <Plante x={110} y={1500} s={1.3} t={t} pot="#f4a261" />
      <Plante x={1500} y={1500} s={1.0} t={t} pot="#e76f51" />
      {/* pouf */}
      <g>
        <ellipse cx={500} cy={1505} rx={130} ry={14} fill="#000" opacity={0.15} />
        <path d="M380,1500 Q370,1380 470,1370 Q560,1360 610,1420 Q640,1470 620,1500 Z" fill="#ef476f" />
        <path d="M420,1420 Q480,1400 560,1420" stroke="#000" strokeOpacity={0.15} strokeWidth={6} fill="none" />
      </g>
      <Tapis x={620} y={1520} w={700} c1="#ffd166" c2="#06d6a0" />
      <Suspension x={1180} y={PLAFOND} long={120} jour={jour} c="#111827" />
      <Suspension x={1700} y={PLAFOND} long={160} jour={jour} c="#f4c542" />

      {/* poste de Toi */}
      <ChaiseGaming x={STARTUP.chaise.x} y={STARTUP.chaise.y} couleur="#7c3aed" />
      <Bureau x={940} y={1300} w={540} h={200} couleur="#f1f5f9" />
      <Ecran x={E.x} y={E.y} w={E.w} h={E.h} glow={0.4 + (1 - jour) * 0.6}>
        {ecran ?? <CodeLignes w={E.w} h={E.h} t={t} seed={7} />}
      </Ecran>
      <Clavier x={1010} y={1300} t={t} />
      <g>
        <rect x={1400} y={1250} width={50} height={50} rx={6} fill="#94a3b8" />
        <text x={1425} y={1284} textAnchor="middle" fontFamily={MONO} fontSize={18} fill="#fff">
          {'{}'}
        </text>
      </g>
      {children}
      <Eclairage
        w={W}
        h={H}
        jour={jour}
        id="startup"
        lampes={[
          {x: E.x + E.w / 2, y: E.y + E.h / 2, r: 420},
          {x: 1110, y: 560, r: 380},
          {x: 1180, y: 520, r: 300},
          {x: 1700, y: 560, r: 300},
        ]}
      />
      <Coupe w={W} plafond={PLAFOND} sol={SOL} couleur="#24303d" />
    </svg>
  );
};
