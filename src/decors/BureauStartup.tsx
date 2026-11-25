import React from 'react';
import {mix, rnd} from '../lib/anim';
import {POLICE} from '../lib/theme';
import {Ciel, LumiereNuit} from './communs';

/**
 * Décor « bureau-startup » : open space en coupe, vue de profil.
 * Monde 2400 x 1920, sol (pieds) à SOL_STARTUP. Échelle des personnages : 1.2.
 * - Salle de réunion vitrée à gauche (Max y fait les cent pas : `salleReunion`)
 * - Poste de Toi au centre (écran large, contenu libre : `ecran`, repère 440 x 290)
 * - Baie vitrée sur la ville à droite, coin détente.
 */
export const BUREAU_STARTUP = {largeur: 2400, hauteur: 1920};
export const SOL_STARTUP = 1610;
export const POSTE_TOI = 900; // x de Toi assis
export const ECRAN_STARTUP = {x: 1070, y: 960, w: 440, h: 290};
export const ZONES_STARTUP = {
  ensemble: {x: 1200, y: 960, zoom: 1},
  poste: {x: 1150, y: 1240, zoom: 1.5},
  ecran: {x: 1290, y: 1120, zoom: 2.2},
  reunion: {x: 420, y: 1200, zoom: 1.45},
  fenetre: {x: 1950, y: 980, zoom: 1.3},
  entree: {x: 1700, y: 1250, zoom: 1.35},
};

type Props = {
  frame: number;
  jour?: number;
  ecran?: React.ReactNode;
  salleReunion?: React.ReactNode; // personnages derrière la vitre
  children?: React.ReactNode; // personnages au premier plan
  surBureau?: React.ReactNode; // objets posés sur le bureau (repère monde)
  tableau?: string[]; // texte du tableau blanc de la salle de réunion
};

const MUR = '#f6e7cc';
const ACCENT = '#2f8f86';
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
    {/* étage du dessous : accueil de l'immeuble */}
    <rect x={46} y={1784} width={2308} height={136} fill="#d9b8e8" />
    <rect x={46} y={1784} width={2308} height={20} fill="#000" opacity={0.15} />
    {[500, 1250, 2000].map((x) => (
      <g key={x}>
        <rect x={x - 90} y={1804} width={180} height={10} rx={5} fill="#fff8e0" />
      </g>
    ))}
    <rect x={0} y={0} width={46} height={1920} fill={COUPE} />
    <rect x={2354} y={0} width={46} height={1920} fill={COUPE} />
  </g>
);

const Sol = () => (
  <g>
    <rect x={0} y={1470} width={2400} height={250} fill="#d7b48a" />
    {Array.from({length: 6}).map((_, r) => (
      <g key={r}>
        <line x1={0} x2={2400} y1={1470 + r * 42} y2={1470 + r * 42} stroke="#c09a6e" strokeWidth={3} />
        {Array.from({length: 12}).map((__, i) => {
          const x = (i * 230 + r * 113) % 2400;
          return <line key={i} x1={x} x2={x} y1={1470 + r * 42} y2={1512 + r * 42} stroke="#c09a6e" strokeWidth={3} />;
        })}
      </g>
    ))}
    <rect x={0} y={1452} width={2400} height={22} fill="#ffffff" />
    <rect x={0} y={1470} width={2400} height={6} fill="#000" opacity={0.1} />
  </g>
);

const BaieVitree: React.FC<{jour: number; frame: number}> = ({jour, frame}) => {
  const x = 1640, y = 300, w = 680, h = 900;
  return (
    <g>
      <clipPath id="baie"><rect x={x} y={y} width={w} height={h} /></clipPath>
      <g clipPath="url(#baie)"><Ciel x={x} y={y} w={w} h={h} jour={jour} frame={frame} /></g>
      <path d={`M${x + 60},${y + 30} L${x + 200},${y + 30} L${x + 60},${y + 240} Z`} fill="#fff" opacity={0.15} />
      <rect x={x - 16} y={y - 16} width={w + 32} height={h + 32} fill="none" stroke="#2d2d3a" strokeWidth={20} />
      {[1, 2].map((i) => <rect key={i} x={x + (w / 3) * i - 6} y={y} width={12} height={h} fill="#2d2d3a" />)}
      <rect x={x} y={y + h * 0.66} width={w} height={10} fill="#2d2d3a" />
    </g>
  );
};

const SalleReunion: React.FC<{children?: React.ReactNode; frame: number; tableau?: string[]}> = ({children, frame, tableau}) => (
  <g>
    {/* intérieur */}
    <rect x={70} y={330} width={660} height={1140} fill="#dcefff" />
    <rect x={70} y={1180} width={660} height={290} fill="#c8dff5" />
    {/* tableau blanc DEADLINE */}
    <g transform="translate(130,520)">
      <rect x={0} y={0} width={360} height={230} rx={8} fill="#fff" stroke="#9aa3b5" strokeWidth={10} />
      {(tableau ?? ['LANCEMENT', '10 H 12']).map((l, i) => (
        <text key={l} x={180} y={i === 0 ? 86 : 156} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={i === 0 ? 46 : 56} fill={i === 0 ? '#e23b4e' : '#2d2d3a'}>{l}</text>
      ))}
      <path d="M40,190 Q180,170 320,190" stroke="#3570b8" strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
    {/* table de réunion */}
    <rect x={150} y={1320} width={480} height={26} rx={8} fill="#ffffff" />
    <rect x={370} y={1346} width={30} height={264} fill="#9aa3b5" />
    <rect x={300} y={1600} width={170} height={12} rx={6} fill="#9aa3b5" />
    <rect x={470} y={1280} width={70} height={40} rx={6} fill="#2d2d3a" />
    {children}
    {/* vitre + cadre */}
    <rect x={70} y={330} width={660} height={1280} fill="#bfe6ff" opacity={0.28} />
    <path d="M120,380 L260,380 L120,600 Z M300,380 L340,380 L160,700 L120,700 Z" fill="#fff" opacity={0.22} />
    <rect x={60} y={320} width={680} height={1290} fill="none" stroke="#2d2d3a" strokeWidth={18} />
    <rect x={392} y={330} width={12} height={1280} fill="#2d2d3a" />
    {/* bande dépolie */}
    <rect x={70} y={1236} width={660} height={56} fill="#ffffff" opacity={0.55} />
    <text x={400} y={1276} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={34} fill={ACCENT} opacity={0.8}>SALLE « PIVOT »</text>
    {/* néon au-dessus */}
    <text x={400} y={270} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={70} fill="#ff4fa0"
      style={{filter: 'drop-shadow(0 0 12px #ff4fa0)'}} opacity={0.85 + 0.15 * Math.sin(frame / 4)}>MEETING</text>
  </g>
);

const Guirlande: React.FC<{frame: number}> = ({frame}) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    pts.push([760 + t * 860, 150 + Math.sin(t * Math.PI * 2) ** 2 * 60]);
  }
  const cols = ['#ffd23f', '#ff6b9a', '#5ad1ff', '#7dff8a'];
  return (
    <g>
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#3b2a24" strokeWidth={4} />
      {pts.filter((_, i) => i % 2).map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y + 16} rx={8} ry={12} fill={mix('#ffffff', cols[i % 4], 0.6 + 0.4 * Math.sin(frame / 7 + i))} />
      ))}
    </g>
  );
};

const Posters: React.FC = () => (
  <g>
    <g transform="translate(800,330) rotate(-2)">
      <rect x={0} y={0} width={280} height={190} rx={8} fill="#2d2d3a" />
      <text x={140} y={88} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={58} fill="#ffd23f">SHIP IT</text>
      <text x={140} y={150} textAnchor="middle" fontFamily={POLICE} fontWeight={800} fontSize={40} fill="#ffffff">🚀</text>
    </g>
    <g transform="translate(1150,360) rotate(2)">
      <rect x={0} y={0} width={200} height={200} rx={100} fill={ACCENT} />
      <text x={100} y={92} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={40} fill="#fff">MVP</text>
      <text x={100} y={136} textAnchor="middle" fontFamily={POLICE} fontWeight={800} fontSize={24} fill="#ffd23f">OU RIEN</text>
    </g>
    {/* horloge 09:12 */}
    <g transform="translate(1460,600)">
      <circle r={56} fill="#fff" stroke="#2d2d3a" strokeWidth={10} />
      <rect x={-5} y={-30} width={10} height={34} rx={5} fill="#2d2d3a" transform="rotate(276)" />
      <rect x={-3} y={-44} width={6} height={48} rx={3} fill="#e74c3c" transform="rotate(72)" />
      <circle r={6} fill="#2d2d3a" />
    </g>
  </g>
);

const Poste: React.FC<{frame: number; ecran?: React.ReactNode}> = ({frame}) => {
  const E = ECRAN_STARTUP;
  return (
    <g>
      {/* caisson */}
      <rect x={1230} y={1364} width={150} height={246} rx={8} fill="#e8e8ee" />
      {[1400, 1480, 1560].map((y) => <rect key={y} x={1290} y={y} width={30} height={8} rx={4} fill="#9aa3b5" />)}
      {/* bureau blanc */}
      <rect x={780} y={1330} width={760} height={34} rx={6} fill="#ffffff" />
      <rect x={780} y={1360} width={760} height={8} fill="#000" opacity={0.12} />
      <rect x={800} y={1364} width={20} height={246} fill="#9aa3b5" />
      <rect x={1500} y={1364} width={20} height={246} fill="#9aa3b5" />
      {/* écran large */}
      <rect x={E.x + E.w / 2 - 22} y={E.y + E.h + 10} width={44} height={44} fill="#2d2d3a" />
      <rect x={E.x + E.w / 2 - 80} y={1318} width={160} height={14} rx={6} fill="#2d2d3a" />
      <rect x={E.x - 12} y={E.y - 12} width={E.w + 24} height={E.h + 28} rx={14} fill="#1b1c25" />
      <rect x={E.x} y={E.y} width={E.w} height={E.h} fill="#ffffff" />
      {/* clavier, souris */}
      <rect x={1010} y={1310} width={200} height={20} rx={6} fill="#e0e0e8" />
      {Array.from({length: 9}).map((_, i) => <rect key={i} x={1018 + i * 21} y={1314} width={16} height={7} rx={2} fill="#b8bccb" />)}
      <ellipse cx={1250} cy={1322} rx={20} ry={10} fill="#e0e0e8" />
      {/* plante + carnet */}
      <g transform="translate(1470,1330)">
        <path d="M-24,0 L24,0 L20,-40 L-20,-40 Z" fill="#f3f0ea" />
        {[[-24, -90], [0, -110], [24, -88]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={16} ry={34} fill={i % 2 ? '#4fae5e' : '#3f9a54'} transform={`rotate(${x},${x},${y})`} />)}
      </g>
      <rect x={830} y={1318} width={70} height={12} rx={3} fill="#ff6b9a" transform="rotate(-4,865,1324)" />
      {/* fauteuil de bureau (dossier à gauche) */}
      <g transform={`translate(${POSTE_TOI},0)`}>
        <path d="M-120,1110 Q-146,1100 -140,1136 L-112,1482 L-68,1482 L-74,1130 Q-76,1106 -120,1110 Z" fill={ACCENT} />
        <rect x={-120} y={1476} width={200} height={36} rx={16} fill="#2d2d3a" />
        <rect x={-30} y={1512} width={20} height={70} fill="#555866" />
        <path d="M-100,1582 L60,1582" stroke="#555866" strokeWidth={14} strokeLinecap="round" />
        {[-100, -20, 60].map((x) => <circle key={x} cx={x} cy={1598} r={13} fill="#2d2d3a" />)}
      </g>
      <g opacity={0}>{frame}</g>
    </g>
  );
};

const CoinDetente: React.FC = () => (
  <g>
    {/* pouf */}
    <path d="M1720,1610 Q1700,1470 1820,1450 Q1950,1440 1960,1610 Z" fill="#ff9f1a" />
    <path d="M1760,1500 Q1830,1480 1900,1500" stroke="#e0850b" strokeWidth={8} fill="none" />
    {/* machine à café sur meuble */}
    <rect x={2040} y={1330} width={280} height={280} rx={8} fill={BOIS} />
    <rect x={2060} y={1360} width={110} height={220} rx={6} fill="#b07e4e" />
    <rect x={2190} y={1360} width={110} height={220} rx={6} fill="#b07e4e" />
    <rect x={2080} y={1190} width={130} height={140} rx={12} fill="#2d2d3a" />
    <rect x={2100} y={1210} width={90} height={30} rx={6} fill="#5ad1ff" />
    <rect x={2125} y={1280} width={40} height={50} fill="#1b1c25" />
    <path d="M2240,1330 L2290,1330 L2284,1280 L2246,1280 Z" fill="#fff" />
    {/* grande plante */}
    <g transform="translate(1590,1610)">
      <path d="M-46,0 L46,0 L38,-100 L-38,-100 Z" fill="#2d2d3a" />
      {[[-60, -290, -35], [10, -340, 5], [64, -270, 38], [-10, -220, -15]].map(([x, y, r], i) => (
        <g key={i}>
          <path d={`M0,-100 Q${x / 2},${(y - 100) / 2} ${x},${y}`} stroke="#2f7a40" strokeWidth={7} fill="none" />
          <path d="M0,0 Q-46,-40 0,-104 Q46,-40 0,0 Z" fill={i % 2 ? '#3f9a54' : '#4fae5e'} transform={`translate(${x},${y}) rotate(${r})`} />
        </g>
      ))}
    </g>
  </g>
);

const Suspensions: React.FC = () => (
  <g>
    {[1000, 1400, 1980].map((x) => (
      <g key={x}>
        <rect x={x - 3} y={96} width={6} height={150} fill="#2d2d3a" />
        <path d={`M${x - 70},${310} Q${x},${210} ${x + 70},${310} Z`} fill="#2d2d3a" />
        <ellipse cx={x} cy={310} rx={70} ry={10} fill="#fff6d8" opacity={0.6} />
      </g>
    ))}
  </g>
);

export const BureauStartup: React.FC<Props> = ({frame, jour = 1, ecran, salleReunion, children, surBureau, tableau}) => (
  <svg width={2400} height={1920} viewBox="0 0 2400 1920" style={{display: 'block'}}>
    <rect x={0} y={0} width={2400} height={1470} fill={MUR} />
    {/* bande d'accent */}
    <rect x={740} y={1180} width={1660} height={290} fill={ACCENT} opacity={0.9} />
    <rect x={740} y={1170} width={1660} height={14} fill="#ffffff" />
    {Array.from({length: 24}).map((_, i) => (
      <circle key={i} cx={760 + ((i * 151) % 1600)} cy={150 + ((i * 89) % 900)} r={4} fill="#000" opacity={0.05 + rnd(i) * 0.04} />
    ))}
    <BaieVitree jour={jour} frame={frame} />
    <Posters />
    <Sol />
    <SalleReunion frame={frame} tableau={tableau}>{salleReunion}</SalleReunion>
    <CoinDetente />
    <Poste frame={frame} ecran={ecran} />
    {/* écran : contenu libre, au-dessus du reste du poste */}
    <g transform={`translate(${ECRAN_STARTUP.x},${ECRAN_STARTUP.y})`}>
      <clipPath id="ecran-startup"><rect x={0} y={0} width={ECRAN_STARTUP.w} height={ECRAN_STARTUP.h} /></clipPath>
      <g clipPath="url(#ecran-startup)">{ecran}</g>
    </g>
    {surBureau}
    <Suspensions />
    <Guirlande frame={frame} />
    {children}
    <LumiereNuit nuit={1 - jour} largeur={2400} hauteur={1920} lumieres={[]} soleil={{x: 1980, y: 600, jour}} />
    <Coupe />
  </svg>
);
