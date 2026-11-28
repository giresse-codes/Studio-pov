import React from 'react';
import {mix, rnd} from '../lib/anim';
import {POLICE} from '../lib/theme';
import {Ciel, LumiereNuit} from './communs';

/**
 * Décor « cuisine-coloc » : cuisine de colocation en coupe, vue de profil (Astuces).
 * Monde 2400 x 1920, sol (pieds) à SOL_CUISINE, échelle personnages 1.2.
 * L'évier est dessiné en coupe : on voit le bac, l'eau de vaisselle et ce qui est au fond (`fondEvier`).
 */
export const CUISINE_COLOC = {largeur: 2400, hauteur: 1920};
export const SOL_CUISINE = 1610;
export const PLAN_TRAVAIL = 1330; // hauteur du plan de travail et de la table
export const EVIER = {x: 1390, w: 260, haut: 1352, bas: 1500};
export const ZONES_CUISINE = {
  ensemble: {x: 1200, y: 960, zoom: 1},
  table: {x: 470, y: 1250, zoom: 1.7},
  evier: {x: 1520, y: 1380, zoom: 2.4},
  plaques: {x: 1060, y: 1230, zoom: 1.6},
  frigo: {x: 2000, y: 1150, zoom: 1.5},
  etagere: {x: 1880, y: 950, zoom: 1.8},
};

type Props = {
  frame: number;
  jour?: number;
  fondEvier?: React.ReactNode; // objets au fond de l'évier (repère monde), dessinés sous l'eau
  surTable?: React.ReactNode; // objets sur la table (repère monde)
  surPlaques?: React.ReactNode; // casserole, etc. (repère monde)
  bocal?: React.ReactNode; // remplace le bocal de cornichons de l'étagère
  children?: React.ReactNode; // personnages
};

const MUR = '#bfe3d0';
const BOIS = '#c8925e';
const COUPE = '#3a2a2a';

const Coupe = () => (
  <g>
    <rect x={0} y={0} width={2400} height={96} fill={COUPE} />
    <rect x={0} y={84} width={2400} height={14} fill="#5a4040" />
    {Array.from({length: 40}).map((_, i) => <line key={`h${i}`} x1={i * 64} y1={84} x2={i * 64 + 60} y2={0} stroke="#4a3636" strokeWidth={8} />)}
    <rect x={0} y={1720} width={2400} height={64} fill={COUPE} />
    <rect x={0} y={1720} width={2400} height={12} fill="#5a4040" />
    {Array.from({length: 60}).map((_, i) => <line key={i} x1={i * 44} y1={1784} x2={i * 44 + 50} y2={1732} stroke="#4a3636" strokeWidth={8} />)}
    <rect x={46} y={1784} width={2308} height={136} fill="#f2c6a0" />
    <rect x={46} y={1784} width={2308} height={20} fill="#000" opacity={0.15} />
    {[600, 1500].map((x) => <g key={x}><rect x={x - 3} y={1784} width={6} height={50} fill="#2d2d3a" /><circle cx={x} cy={1850} r={22} fill="#fff1a8" /></g>)}
    <rect x={0} y={0} width={46} height={1920} fill={COUPE} />
    <rect x={2354} y={0} width={46} height={1920} fill={COUPE} />
  </g>
);

const Sol = () => (
  <g>
    <rect x={0} y={1470} width={2400} height={250} fill="#e9d8c0" />
    {Array.from({length: 22}).map((_, i) => Array.from({length: 4}).map((__, r) => (
      <rect key={`${i}-${r}`} x={i * 112 + (r % 2) * 56} y={1474 + r * 62} width={110} height={60} fill={(i + r) % 2 ? '#e2cdb0' : '#efe1cc'} />
    )))}
    <rect x={0} y={1452} width={2400} height={22} fill="#ffffff" />
  </g>
);

const Fenetre: React.FC<{jour: number; frame: number}> = ({jour, frame}) => {
  const x = 1320, y = 430, w = 420, h = 470;
  return (
    <g>
      <clipPath id="fen-cuisine"><rect x={x} y={y} width={w} height={h} /></clipPath>
      <g clipPath="url(#fen-cuisine)"><Ciel x={x} y={y} w={w} h={h} jour={jour} frame={frame} /></g>
      <rect x={x - 18} y={y - 18} width={w + 36} height={h + 36} fill="none" stroke="#fffaf0" strokeWidth={22} />
      <rect x={x + w / 2 - 7} y={y} width={14} height={h} fill="#fffaf0" />
      {/* store bateau */}
      <path d={`M${x - 30},${y - 34} L${x + w + 30},${y - 34} L${x + w + 30},${y + 70} Q${x + w / 2},${y + 110} ${x - 30},${y + 70} Z`} fill="#ff8a5c" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={x - 30 + i * 80} y={y - 34} width={40} height={100} fill="#ffb088" opacity={0.6} />)}
      {/* plantes aromatiques */}
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${x + 60 + i * 140},${y + h + 18})`}>
          <rect x={-26} y={-40} width={52} height={40} rx={6} fill={['#e26d5a', '#f5c542', '#5ac8c8'][i]} />
          {[-14, 0, 14].map((dx) => <ellipse key={dx} cx={dx} cy={-62} rx={12} ry={24} fill="#4fae5e" />)}
        </g>
      ))}
    </g>
  );
};

const Guirlande: React.FC<{frame: number}> = ({frame}) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    pts.push([80 + t * 1180, 150 + Math.sin(t * Math.PI * 3) ** 2 * 60]);
  }
  const cols = ['#ffd23f', '#ff6b9a', '#5ad1ff', '#7dff8a'];
  return (
    <g>
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#3b2a24" strokeWidth={4} />
      {pts.filter((_, i) => i % 2).map(([x, y], i) => <ellipse key={i} cx={x} cy={y + 16} rx={8} ry={12} fill={mix('#ffffff', cols[i % 4], 0.6 + 0.4 * Math.sin(frame / 7 + i))} />)}
    </g>
  );
};

const CoinRepas: React.FC<{surTable?: React.ReactNode}> = ({surTable}) => (
  <g>
    {/* posters + horloge */}
    <g transform="translate(150,420) rotate(-3)">
      <rect x={0} y={0} width={230} height={300} rx={8} fill="#2d2d3a" />
      <text x={115} y={130} textAnchor="middle" fontSize={90}>🍕</text>
      <text x={115} y={220} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={40} fill="#ffd23f">PIZZA</text>
      <text x={115} y={262} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={30} fill="#fff">PARTY</text>
    </g>
    <g transform="translate(470,470) rotate(3)">
      <rect x={0} y={0} width={200} height={140} rx={8} fill="#fff" />
      <text x={100} y={50} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={24} fill="#e23b4e">RÈGLES COLOC</text>
      {['1. Vaisselle', '2. Poubelles', '3. PAS BOBO'].map((t, i) => (
        <text key={t} x={20} y={82 + i * 22} fontFamily={POLICE} fontWeight={800} fontSize={17} fill="#2d2d3a">{t}</text>
      ))}
    </g>
    <g transform="translate(560,720)">
      <circle r={50} fill="#fff" stroke="#2d2d3a" strokeWidth={9} />
      <rect x={-4} y={-28} width={8} height={30} rx={4} fill="#2d2d3a" transform="rotate(60)" />
      <rect x={-3} y={-40} width={6} height={42} rx={3} fill="#e74c3c" transform="rotate(18)" />
    </g>
    {/* table + chaises */}
    <rect x={180} y={PLAN_TRAVAIL} width={520} height={30} rx={8} fill={BOIS} />
    <rect x={180} y={PLAN_TRAVAIL + 26} width={520} height={8} fill="#000" opacity={0.15} />
    <rect x={220} y={PLAN_TRAVAIL + 30} width={22} height={SOL_CUISINE - PLAN_TRAVAIL - 30} fill="#8a5a3a" />
    <rect x={640} y={PLAN_TRAVAIL + 30} width={22} height={SOL_CUISINE - PLAN_TRAVAIL - 30} fill="#8a5a3a" />
    {[120, 760].map((x, i) => (
      <g key={x}>
        <rect x={x - 6} y={1150} width={14} height={340} fill="#e26d5a" transform={i ? '' : ''} />
        <rect x={x - 50} y={1460} width={100} height={20} rx={6} fill="#e26d5a" />
        <rect x={x - 44} y={1480} width={10} height={130} fill="#b8503f" />
        <rect x={x + 34} y={1480} width={10} height={130} fill="#b8503f" />
      </g>
    ))}
    {/* nappe vichy */}
    <path d={`M200,${PLAN_TRAVAIL - 2} L680,${PLAN_TRAVAIL - 2} L700,${PLAN_TRAVAIL + 60} L180,${PLAN_TRAVAIL + 60} Z`} fill="#e74c3c" opacity={0.9} />
    {Array.from({length: 12}).map((_, i) => <rect key={i} x={190 + i * 42} y={PLAN_TRAVAIL} width={20} height={58} fill="#fff" opacity={0.45} />)}
    {surTable}
  </g>
);

const PlanDeTravail: React.FC<{frame: number; fondEvier?: React.ReactNode; surPlaques?: React.ReactNode; bocal?: React.ReactNode}> = ({frame, fondEvier, surPlaques, bocal}) => {
  const E = EVIER;
  return (
    <g>
      {/* crédence en carreaux */}
      <rect x={850} y={980} width={1210} height={350} fill="#ffffff" />
      {Array.from({length: 17}).map((_, i) => Array.from({length: 5}).map((__, r) => (
        <rect key={`${i}-${r}`} x={852 + i * 71} y={982 + r * 70} width={67} height={66} rx={4} fill={(i + r) % 5 === 0 ? '#ffd9a8' : '#f4f8fb'} />
      )))}
      {/* meubles hauts */}
      {[850, 1050].map((x) => (
        <g key={x}><rect x={x} y={420} width={190} height={300} rx={8} fill="#ff8a5c" /><rect x={x + 150} y={550} width={12} height={50} rx={6} fill="#fff" /></g>
      ))}
      {/* étagère ouverte avec bocaux */}
      <rect x={1780} y={880} width={290} height={18} rx={4} fill={BOIS} />
      <rect x={1780} y={700} width={290} height={18} rx={4} fill={BOIS} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${1800 + i * 90},700)`}>
          <rect x={0} y={-90} width={64} height={90} rx={10} fill="#ffffff" opacity={0.7} />
          <rect x={4} y={-60} width={56} height={56} rx={8} fill={['#f5c542', '#e74c3c', '#8e5b2a'][i]} />
          <rect x={-2} y={-100} width={68} height={14} rx={4} fill="#2d2d3a" />
        </g>
      ))}
      {bocal ?? <BocalCornichons x={1860} y={880} />}
      <g transform="translate(2010,880)"><rect x={-24} y={-60} width={48} height={60} rx={6} fill="#5ac8c8" /><circle cx={0} cy={-78} r={26} fill="#4fae5e" /></g>
      {/* barre à ustensiles */}
      <rect x={880} y={860} width={360} height={10} rx={5} fill="#9aa3b5" />
      {[920, 990, 1060, 1130, 1200].map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y={860} width={4} height={20} fill="#9aa3b5" />
          {i % 2 ? <ellipse cx={x} cy={920} rx={18} ry={30} fill="#2d2d3a" /> : <rect x={x - 6} y={880} width={12} height={80} rx={6} fill={i ? '#e26d5a' : '#c8925e'} />}
        </g>
      ))}
      {/* plaques de cuisson + four */}
      <rect x={900} y={PLAN_TRAVAIL - 10} width={300} height={12} rx={4} fill="#2d2d3a" />
      <rect x={900} y={1364} width={300} height={246} rx={8} fill="#e8e8ee" />
      <rect x={925} y={1400} width={250} height={140} rx={10} fill="#2d2d3a" />
      <rect x={945} y={1416} width={210} height={108} rx={8} fill="#4a4c5e" />
      <rect x={960} y={1378} width={180} height={10} rx={5} fill="#9aa3b5" />
      {surPlaques}
      {/* meubles bas */}
      <rect x={1200} y={1364} width={860} height={246} fill="#ff8a5c" />
      {[1200, 1420, 1640, 1860].map((x) => (
        <g key={x}><rect x={x + 10} y={1374} width={200} height={226} rx={8} fill="#ff9d74" /><rect x={x + 96} y={1388} width={30} height={10} rx={5} fill="#fff" /></g>
      ))}
      {/* évier en coupe : bac, eau, fond */}
      <rect x={E.x - 10} y={E.haut - 22} width={E.w + 20} height={E.bas - E.haut + 34} rx={10} fill="#c9cfdb" />
      <rect x={E.x} y={E.haut - 12} width={E.w} height={E.bas - E.haut + 12} rx={8} fill="#e8ecf2" />
      {/* vaisselle sale */}
      <ellipse cx={E.x + 60} cy={E.bas - 30} rx={50} ry={14} fill="#ffffff" stroke="#c9cfdb" strokeWidth={4} transform={`rotate(-20,${E.x + 60},${E.bas - 30})`} />
      <rect x={E.x + 200} y={E.bas - 70} width={34} height={60} rx={6} fill="#5ad1ff" opacity={0.7} transform={`rotate(14,${E.x + 217},${E.bas - 40})`} />
      {fondEvier}
      <rect x={E.x} y={E.haut + 18} width={E.w} height={E.bas - E.haut - 18} fill="#7fc6ff" opacity={0.45} />
      {/* mousse */}
      {Array.from({length: 14}).map((_, i) => (
        <circle key={i} cx={E.x + 12 + i * 18} cy={E.haut + 18 + Math.sin(frame / 8 + i) * 3} r={10 + rnd(i) * 8} fill="#ffffff" opacity={0.9} />
      ))}
      {Array.from({length: 6}).map((_, i) => {
        const yb = E.bas - ((frame * 1.5 + i * 23) % (E.bas - E.haut - 20));
        return <circle key={`b${i}`} cx={E.x + 30 + i * 40} cy={yb} r={5} fill="none" stroke="#ffffff" strokeWidth={2} opacity={0.8} />;
      })}
      {/* plan de travail */}
      <rect x={850} y={PLAN_TRAVAIL} width={1210} height={34} rx={6} fill="#f2ede4" />
      <rect x={E.x - 10} y={PLAN_TRAVAIL} width={E.w + 20} height={22} fill="#c9cfdb" />
      <rect x={850} y={PLAN_TRAVAIL + 30} width={1210} height={8} fill="#000" opacity={0.12} />
      {/* robinet */}
      <g transform={`translate(${E.x + E.w / 2 + 60},${PLAN_TRAVAIL})`}>
        <rect x={-10} y={-140} width={20} height={140} rx={8} fill="#9aa3b5" />
        <path d="M0,-140 Q0,-190 -60,-190 L-90,-190 L-90,-170" stroke="#9aa3b5" strokeWidth={18} fill="none" strokeLinecap="round" />
        <rect x={10} y={-90} width={40} height={12} rx={6} fill="#c9cfdb" />
      </g>
      {/* liquide vaisselle */}
      <g transform={`translate(${E.x + E.w + 50},${PLAN_TRAVAIL})`}>
        <rect x={-20} y={-90} width={40} height={90} rx={10} fill="#7dff8a" />
        <rect x={-8} y={-110} width={16} height={22} fill="#2d2d3a" />
      </g>
    </g>
  );
};

/** Bocal de cornichons (repère monde, pieds du bocal) */
export const BocalCornichons: React.FC<{x: number; y: number; rot?: number; ouvert?: number}> = ({x, y, rot = 0, ouvert = 0}) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`}>
    <rect x={-40} y={-130} width={80} height={130} rx={14} fill="#dff5e0" opacity={0.85} stroke="#a8d8b0" strokeWidth={4} />
    {[[-18, -40], [10, -60], [-8, -90], [18, -30], [-20, -105]].map(([cx, cy], i) => (
      <ellipse key={i} cx={cx} cy={cy} rx={11} ry={24} fill="#5a8a2a" transform={`rotate(${i * 30},${cx},${cy})`} />
    ))}
    <rect x={-18} y={-80} width={36} height={26} rx={4} fill="#fff" />
    <text x={0} y={-62} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={11} fill="#2f7a40">CORNICHONS</text>
    <g transform={`translate(0,${-140 - ouvert * 60}) rotate(${ouvert * 40})`}>
      <rect x={-46} y={-14} width={92} height={24} rx={6} fill="#e23b4e" />
    </g>
  </g>
);

const Frigo: React.FC = () => (
  <g>
    <rect x={2090} y={860} width={240} height={750} rx={20} fill="#e8f4ff" />
    <rect x={2090} y={1110} width={240} height={8} fill="#c9d8e8" />
    <rect x={2110} y={950} width={12} height={110} rx={6} fill="#9aa3b5" />
    <rect x={2110} y={1160} width={12} height={160} rx={6} fill="#9aa3b5" />
    {/* aimants et mots */}
    <circle cx={2200} cy={930} r={14} fill="#e74c3c" />
    <circle cx={2280} cy={1000} r={12} fill="#f5c542" />
    <g transform="translate(2180,1170) rotate(5)">
      <rect x={0} y={0} width={110} height={120} fill="#ffe66d" />
      <text x={10} y={34} fontFamily={POLICE} fontWeight={900} fontSize={16} fill="#2d2d3a">BOBO :</text>
      <text x={10} y={62} fontFamily={POLICE} fontWeight={800} fontSize={14} fill="#2d2d3a">racheter</text>
      <text x={10} y={86} fontFamily={POLICE} fontWeight={800} fontSize={14} fill="#2d2d3a">TOUT 🙏</text>
    </g>
  </g>
);

export const CuisineColoc: React.FC<Props> = ({frame, jour = 1, fondEvier, surTable, surPlaques, bocal, children}) => (
  <svg width={2400} height={1920} viewBox="0 0 2400 1920" style={{display: 'block'}}>
    <rect x={0} y={0} width={2400} height={1470} fill={MUR} />
    {Array.from({length: 40}).map((_, i) => <circle key={i} cx={(i * 157) % 2400} cy={140 + ((i * 83) % 820)} r={6} fill="#ffffff" opacity={0.25} />)}
    <Fenetre jour={jour} frame={frame} />
    <Sol />
    <CoinRepas surTable={surTable} />
    <PlanDeTravail frame={frame} fondEvier={fondEvier} surPlaques={surPlaques} bocal={bocal} />
    <Frigo />
    {/* suspension */}
    <g transform="translate(440,96)">
      <rect x={-3} y={0} width={6} height={200} fill="#2d2d3a" />
      <path d="M-80,280 Q0,180 80,280 Z" fill="#f5c542" />
      <ellipse cx={0} cy={280} rx={80} ry={12} fill="#fff6d8" opacity={0.6} />
    </g>
    <LumiereNuit nuit={1 - jour} largeur={2400} hauteur={1920} soleil={{x: 1530, y: 700, jour}} lumieres={[
      {x: 440, y: 520, r: 620, couleur: '#ffd59a', force: 0.7},
      {x: 1100, y: 1000, r: 420, couleur: '#ffcf7a', force: 0.35},
      {x: 2200, y: 1100, r: 300, couleur: '#bfe4ff', force: 0.25},
    ]} />
    <Guirlande frame={frame} />
    {/* personnages : au-dessus de l'éclairage, légèrement teintés la nuit (les yeux restent blancs) */}
    <g style={{filter: `brightness(${1 - (1 - jour) * 0.12}) saturate(${1 - (1 - jour) * 0.1})`}}>{children}</g>
    <Coupe />
  </svg>
);
