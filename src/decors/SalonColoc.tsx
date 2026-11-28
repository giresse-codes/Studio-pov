import React from 'react';
import {mix} from '../lib/anim';
import {POLICE} from '../lib/theme';
import {Ciel, LumiereNuit} from './communs';

/**
 * Décor « salon-coloc » : salon de colocation en coupe (Astuces).
 * Monde 2400 x 1920, sol (pieds) à SOL_SALON, échelle personnages 1.2.
 * Canapé au centre, télé + console à droite, prise murale à gauche du canapé (chargeur).
 */
export const SALON_COLOC = {largeur: 2400, hauteur: 1920};
export const SOL_SALON = 1610;
export const PRISE = {x: 760, y: 1400};
export const CANAPE = {x: 1000, w: 640, assise: 1440};
export const ZONES_SALON = {
  ensemble: {x: 1200, y: 960, zoom: 1},
  canape: {x: 1300, y: 1200, zoom: 1.45},
  prise: {x: 820, y: 1300, zoom: 1.8},
  fenetre: {x: 470, y: 900, zoom: 1.4},
  tele: {x: 1950, y: 1150, zoom: 1.5},
};

type Props = {
  frame: number;
  jour?: number;
  teleAllumee?: boolean;
  cable?: React.ReactNode; // câble du chargeur (repère monde)
  children?: React.ReactNode; // personnages
  avantPlan?: React.ReactNode;
};

const MUR = '#c9d6f5';
const COUPE = '#3a2a2a';

const Coupe = () => (
  <g>
    <rect x={0} y={0} width={2400} height={96} fill={COUPE} />
    <rect x={0} y={84} width={2400} height={14} fill="#5a4040" />
    {Array.from({length: 40}).map((_, i) => <line key={`h${i}`} x1={i * 64} y1={84} x2={i * 64 + 60} y2={0} stroke="#4a3636" strokeWidth={8} />)}
    <rect x={0} y={1720} width={2400} height={64} fill={COUPE} />
    <rect x={0} y={1720} width={2400} height={12} fill="#5a4040" />
    {Array.from({length: 60}).map((_, i) => <line key={i} x1={i * 44} y1={1784} x2={i * 44 + 50} y2={1732} stroke="#4a3636" strokeWidth={8} />)}
    <rect x={46} y={1784} width={2308} height={136} fill="#bfe3d0" />
    <rect x={46} y={1784} width={2308} height={20} fill="#000" opacity={0.15} />
    <rect x={0} y={0} width={46} height={1920} fill={COUPE} />
    <rect x={2354} y={0} width={46} height={1920} fill={COUPE} />
  </g>
);

const Parquet = () => (
  <g>
    <rect x={0} y={1470} width={2400} height={250} fill="#c08552" />
    {Array.from({length: 6}).map((_, r) => (
      <g key={r}>
        <line x1={0} x2={2400} y1={1470 + r * 42} y2={1470 + r * 42} stroke="#a36d3f" strokeWidth={3} />
        {Array.from({length: 12}).map((__, i) => {
          const x = (i * 210 + r * 89) % 2400;
          return <line key={i} x1={x} x2={x} y1={1470 + r * 42} y2={1512 + r * 42} stroke="#a36d3f" strokeWidth={3} />;
        })}
      </g>
    ))}
    <rect x={0} y={1452} width={2400} height={22} fill="#fff6ea" />
    {/* tapis */}
    <ellipse cx={1330} cy={1650} rx={620} ry={50} fill="#ff8a5c" />
    <ellipse cx={1330} cy={1650} rx={560} ry={38} fill="none" stroke="#fff1a8" strokeWidth={6} strokeDasharray="22 14" />
  </g>
);

const Fenetre: React.FC<{jour: number; frame: number}> = ({jour, frame}) => {
  const x = 240, y = 420, w = 460, h = 600;
  return (
    <g>
      <clipPath id="fen-salon"><rect x={x} y={y} width={w} height={h} /></clipPath>
      <g clipPath="url(#fen-salon)"><Ciel x={x} y={y} w={w} h={h} jour={jour} frame={frame} /></g>
      <rect x={x - 20} y={y - 20} width={w + 40} height={h + 40} fill="none" stroke="#fffaf0" strokeWidth={24} />
      <rect x={x + w / 2 - 7} y={y} width={14} height={h} fill="#fffaf0" />
      <rect x={x} y={y + h * 0.45} width={w} height={14} fill="#fffaf0" />
      <rect x={x - 50} y={y + h + 16} width={w + 100} height={24} rx={6} fill="#fffaf0" />
      {/* rideaux */}
      {[x - 110, x + w + 10].map((cx, i) => (
        <g key={i}>
          <path d={`M${cx},${y - 50} L${cx + 100},${y - 50} Q${cx + 110 + (i ? 20 : -20)},${y + 400} ${cx + 90},${y + h + 120} L${cx + 10},${y + h + 120} Q${cx - 10},${y + 400} ${cx},${y - 50} Z`} fill="#8a4fff" />
          {[25, 50, 75].map((d) => <path key={d} d={`M${cx + d},${y - 40} Q${cx + d + (i ? 8 : -8)},${y + 400} ${cx + d},${y + h + 110}`} stroke="#6b35d6" strokeWidth={7} fill="none" />)}
        </g>
      ))}
      <rect x={x - 130} y={y - 64} width={w + 260} height={16} rx={8} fill="#5b3b2a" />
    </g>
  );
};

const Guirlande: React.FC<{frame: number; nuit: number}> = ({frame, nuit}) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 36; i++) {
    const t = i / 36;
    pts.push([820 + t * 1500, 150 + Math.sin(t * Math.PI * 3) ** 2 * 70]);
  }
  const cols = ['#ffd23f', '#ff6b9a', '#5ad1ff', '#7dff8a'];
  return (
    <g>
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#3b2a24" strokeWidth={4} />
      {pts.filter((_, i) => i % 2).map(([x, y], i) => {
        const sc = 0.6 + 0.4 * Math.sin(frame / 7 + i);
        return (
          <g key={i}>
            <circle cx={x} cy={y + 18} r={26} fill={cols[i % 4]} opacity={nuit * 0.35 * sc} style={{mixBlendMode: 'screen'}} />
            <ellipse cx={x} cy={y + 16} rx={8} ry={12} fill={mix('#ffffff', cols[i % 4], 0.5 + 0.5 * sc)} />
          </g>
        );
      })}
    </g>
  );
};

const Meubles: React.FC<{frame: number; teleAllumee: boolean}> = ({frame, teleAllumee}) => (
  <g>
    {/* posters */}
    <g transform="translate(900,330) rotate(-2)">
      <rect x={0} y={0} width={260} height={180} rx={8} fill="#2d2d3a" />
      <text x={130} y={84} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={52} fill="#ff6b9a">GAME</text>
      <text x={130} y={142} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={52} fill="#5ad1ff">OVER</text>
    </g>
    <g transform="translate(1250,360) rotate(3)">
      <rect x={0} y={0} width={200} height={240} rx={8} fill="#ffd23f" />
      <text x={100} y={130} textAnchor="middle" fontSize={100}>🌴</text>
      <text x={100} y={210} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={30} fill="#2d2d3a">VACANCES</text>
    </g>
    {/* étagère murale */}
    <rect x={1550} y={640} width={360} height={16} rx={4} fill="#a36d3f" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={1570 + i * 34} y={560} width={28} height={80} rx={3} fill={['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'][i]} />)}
    <g transform="translate(1810,640)"><rect x={-26} y={-50} width={52} height={50} rx={8} fill="#5ac8c8" /><circle cx={0} cy={-70} r={30} fill="#4fae5e" /></g>
    {/* canapé */}
    <g>
      <rect x={CANAPE.x - 30} y={1250} width={CANAPE.w + 60} height={220} rx={40} fill="#e8643c" />
      <rect x={CANAPE.x} y={1180} width={CANAPE.w} height={140} rx={36} fill="#f07a50" />
      <rect x={CANAPE.x - 60} y={1280} width={90} height={190} rx={36} fill="#d4542e" />
      <rect x={CANAPE.x + CANAPE.w - 30} y={1280} width={90} height={190} rx={36} fill="#d4542e" />
      <rect x={CANAPE.x + 20} y={CANAPE.assise - 40} width={CANAPE.w - 40} height={60} rx={24} fill="#f58a62" />
      <rect x={CANAPE.x + 10} y={1470} width={30} height={40} fill="#5b3b2a" />
      <rect x={CANAPE.x + CANAPE.w - 40} y={1470} width={30} height={40} fill="#5b3b2a" />
      {/* coussins */}
      <rect x={CANAPE.x + 40} y={1220} width={130} height={110} rx={30} fill="#ffd23f" transform={`rotate(-8,${CANAPE.x + 105},1275)`} />
      <rect x={CANAPE.x + CANAPE.w - 170} y={1220} width={130} height={110} rx={30} fill="#5ad1ff" transform={`rotate(8,${CANAPE.x + CANAPE.w - 105},1275)`} />
    </g>
    {/* prise murale */}
    <g transform={`translate(${PRISE.x},${PRISE.y})`}>
      <rect x={-34} y={-34} width={68} height={68} rx={12} fill="#ffffff" stroke="#c9cfdb" strokeWidth={4} />
      <circle cx={-10} cy={0} r={6} fill="#2d2d3a" /><circle cx={10} cy={0} r={6} fill="#2d2d3a" />
    </g>
    {/* table basse */}
    <rect x={1150} y={1530} width={360} height={24} rx={8} fill="#a36d3f" />
    <rect x={1170} y={1554} width={16} height={56} fill="#7d4a2b" />
    <rect x={1474} y={1554} width={16} height={56} fill="#7d4a2b" />
    <g transform="translate(1260,1530)"><rect x={-30} y={-20} width={60} height={20} rx={4} fill="#e74c3c" /><text x={0} y={-4} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={12} fill="#fff">PIZZA</text></g>
    {/* meuble télé + télé + console */}
    <rect x={1780} y={1400} width={480} height={210} rx={10} fill="#5b3b2a" />
    <rect x={1800} y={1420} width={210} height={170} rx={8} fill="#7d4a2b" />
    <rect x={2030} y={1420} width={210} height={170} rx={8} fill="#7d4a2b" />
    <rect x={1810} y={1080} width={440} height={270} rx={14} fill="#1b1c25" />
    <rect x={1824} y={1094} width={412} height={242} rx={8} fill={teleAllumee ? '#2a6fdb' : '#0b0c12'} />
    {teleAllumee && (
      <g>
        <rect x={1824} y={1260} width={412} height={76} fill="#3ee07a" />
        <rect x={1900 + ((frame * 6) % 260)} y={1210} width={40} height={50} rx={6} fill="#ffd23f" />
        <text x={2030} y={1170} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={34} fill="#fff">LEVEL 99</text>
      </g>
    )}
    <rect x={2000} y={1350} width={60} height={50} fill="#1b1c25" />
    <rect x={1880} y={1370} width={120} height={30} rx={8} fill="#f4f4f6" />
    <circle cx={1980} cy={1385} r={5} fill="#3ee07a" />
    {/* lampe sur pied */}
    <g transform="translate(2300,0)">
      <rect x={-6} y={980} width={12} height={630} fill="#2d2d3a" />
      <path d="M-60,980 L60,980 L40,880 L-40,880 Z" fill="#ffe0a3" />
    </g>
    {/* plante */}
    <g transform="translate(860,1610)">
      <path d="M-46,0 L46,0 L38,-100 L-38,-100 Z" fill="#f3f0ea" />
      {[[-60, -290, -35], [10, -340, 5], [64, -270, 38], [-10, -220, -15]].map(([x, y, r], i) => (
        <g key={i}>
          <path d={`M0,-100 Q${x / 2},${(y - 100) / 2} ${x},${y}`} stroke="#2f7a40" strokeWidth={7} fill="none" />
          <path d="M0,0 Q-46,-40 0,-104 Q46,-40 0,0 Z" fill={i % 2 ? '#3f9a54' : '#4fae5e'} transform={`translate(${x},${y}) rotate(${r})`} />
        </g>
      ))}
    </g>
  </g>
);

export const SalonColoc: React.FC<Props> = ({frame, jour = 1, teleAllumee = true, cable, children, avantPlan}) => {
  const nuit = 1 - jour;
  return (
    <svg width={2400} height={1920} viewBox="0 0 2400 1920" style={{display: 'block'}}>
      <rect x={0} y={0} width={2400} height={1470} fill={MUR} />
      {Array.from({length: 30}).map((_, i) => <rect key={i} x={(i * 173) % 2400} y={140 + ((i * 97) % 900)} width={10} height={10} rx={2} fill="#ffffff" opacity={0.25} transform={`rotate(45,${(i * 173) % 2400},${140 + ((i * 97) % 900)})`} />)}
      <Fenetre jour={jour} frame={frame} />
      <Parquet />
      <Meubles frame={frame} teleAllumee={teleAllumee} />
      {cable}
      <LumiereNuit nuit={nuit} largeur={2400} hauteur={1920} soleil={{x: 470, y: 700, jour}} lumieres={[
        {x: 2300, y: 950, r: 520, couleur: '#ffd59a', force: 0.7},
        {x: 2030, y: 1215, r: 420, couleur: '#5ab0ff', force: teleAllumee ? 0.6 : 0},
      ]} />
      <Guirlande frame={frame} nuit={nuit} />
      <g style={{filter: `brightness(${1 - nuit * 0.12}) saturate(${1 - nuit * 0.1})`}}>{children}</g>
      {avantPlan}
      <Coupe />
    </svg>
  );
};
