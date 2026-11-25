import React from 'react';
import {mix, rnd} from '../lib/anim';
import {POLICE, POLICE_CODE} from '../lib/theme';
import {Ciel, LumiereNuit} from './communs';

/**
 * Décor « chambre-dev » : chambre en coupe (maison de poupée), vue de profil.
 * Monde : 2400 x 1920. Sol (pieds des personnages) : y = SOL.
 * Zones utiles pour la caméra : ZONES.
 */
export const CHAMBRE_DEV = {largeur: 2400, hauteur: 1920};
export const SOL = 1610;
export const ZONES = {
  ensemble: {x: 1200, y: 960, zoom: 1},
  lit: {x: 420, y: 1250, zoom: 1.5},
  bureau: {x: 1150, y: 1280, zoom: 1.55},
  ecran: {x: 1310, y: 1130, zoom: 2.4},
  fenetre: {x: 1900, y: 820, zoom: 1.45},
  personnage: {x: 1000, y: 1250, zoom: 1.6},
};
export const POS_CHAISE = 880; // x de Toi assis au bureau
export const ECHELLE_PERSO = 1.2; // échelle des personnages dans ce décor

type Props = {
  jour: number; // 0 = nuit, 1 = plein jour
  frame: number;
  heure?: number; // minutes depuis minuit (horloge murale)
  ecran?: React.ReactNode; // contenu de l'écran (repère 300 x 190)
  ecranAllume?: boolean;
  children?: React.ReactNode; // personnages (entre le mobilier et la lumière)
  avantPlan?: React.ReactNode;
};

const MUR = '#f0b98d';
const MUR_BAS = '#de9a72';
const BOIS = '#a8693f';
const BOIS_CLAIR = '#c98a5a';
const BOIS_FONCE = '#7d4a2b';
const COUPE = '#3a2a2a';

const Parquet = () => (
  <g>
    <rect x={0} y={1470} width={2400} height={250} fill="#b9794a" />
    <rect x={0} y={1470} width={2400} height={250} fill="url(#parquet-degrade)" />
    {Array.from({length: 6}).map((_, r) => (
      <g key={r}>
        <line x1={0} x2={2400} y1={1470 + r * 42} y2={1470 + r * 42} stroke="#9a5f36" strokeWidth={3} />
        {Array.from({length: 14}).map((__, i) => {
          const x = ((i * 190 + r * 97) % 2400);
          return <line key={i} x1={x} x2={x} y1={1470 + r * 42} y2={1512 + r * 42} stroke="#9a5f36" strokeWidth={3} />;
        })}
      </g>
    ))}
    {/* plinthe */}
    <rect x={0} y={1452} width={2400} height={22} fill="#fbe7d4" />
    <rect x={0} y={1470} width={2400} height={6} fill="#000" opacity={0.12} />
  </g>
);

const Coupe = () => (
  <g>
    {/* dalles coupées (effet maison de poupée) */}
    <rect x={0} y={0} width={2400} height={96} fill={COUPE} />
    <rect x={0} y={84} width={2400} height={14} fill="#5a4040" />
    {Array.from({length: 40}).map((_, i) => (
      <line key={`h${i}`} x1={i * 64} y1={84} x2={i * 64 + 60} y2={0} stroke="#4a3636" strokeWidth={8} />
    ))}
    <rect x={0} y={1720} width={2400} height={64} fill={COUPE} />
    <rect x={0} y={1720} width={2400} height={12} fill="#5a4040" />
    {Array.from({length: 60}).map((_, i) => (
      <line key={i} x1={i * 44} y1={1784} x2={i * 44 + 50} y2={1732} stroke="#4a3636" strokeWidth={8} />
    ))}
    {/* aperçu de l'appartement du dessous (plafond, suspension) */}
    <rect x={46} y={1784} width={2308} height={136} fill="#7fb5a8" />
    <rect x={46} y={1784} width={2308} height={20} fill="#000" opacity={0.15} />
    {[420, 1300, 2050].map((x) => (
      <g key={x}>
        <rect x={x - 3} y={1784} width={6} height={60} fill="#2d2d3a" />
        <path d={`M${x - 46},${1880} Q${x},${1810} ${x + 46},${1880} Z`} fill="#f5c542" />
      </g>
    ))}
    <rect x={800} y={1840} width={260} height={80} rx={6} fill="#5f948a" />
    <rect x={1600} y={1830} width={180} height={90} rx={6} fill="#fdf3e7" />
    {/* murs latéraux coupés */}
    <rect x={0} y={0} width={46} height={1920} fill={COUPE} />
    <rect x={2354} y={0} width={46} height={1920} fill={COUPE} />
    <rect x={40} y={96} width={8} height={1624} fill="#5a4040" />
    <rect x={2352} y={96} width={8} height={1624} fill="#5a4040" />
  </g>
);

const Guirlande: React.FC<{frame: number; nuit: number}> = ({frame, nuit}) => {
  const points: [number, number][] = [];
  const segs = [[110, 1580], [1580, 2320]];
  segs.forEach(([a, b]) => {
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      points.push([a + (b - a) * t, 150 + Math.sin(t * Math.PI) * 90]);
    }
  });
  const couleurs = ['#ffd23f', '#ff6b9a', '#5ad1ff', '#7dff8a', '#ff9f1a'];
  return (
    <g>
      <polyline points={points.map((p) => p.join(',')).join(' ')} fill="none" stroke="#3b2a24" strokeWidth={4} />
      {points.filter((_, i) => i % 2 === 1).map(([x, y], i) => {
        const c = couleurs[i % couleurs.length];
        const scint = 0.65 + 0.35 * Math.sin(frame / 6 + i * 1.7);
        return (
          <g key={i}>
            <circle cx={x} cy={y + 18} r={30} fill={c} opacity={nuit * 0.35 * scint} style={{mixBlendMode: 'screen'}} />
            <rect x={x - 5} y={y} width={10} height={10} fill="#3b2a24" />
            <ellipse cx={x} cy={y + 20} rx={9} ry={13} fill={mix('#d8cfc0', c, 0.35 + nuit * 0.65 * scint)} />
          </g>
        );
      })}
    </g>
  );
};

const Fenetre: React.FC<{jour: number; frame: number}> = ({jour, frame}) => {
  const x = 1660, y = 420, w = 480, h = 620;
  return (
    <g>
      <clipPath id="vitre"><rect x={x} y={y} width={w} height={h} /></clipPath>
      <g clipPath="url(#vitre)">
        <Ciel x={x} y={y} w={w} h={h} jour={jour} frame={frame} />
      </g>
      {/* reflets */}
      <path d={`M${x + 40},${y + 20} L${x + 120},${y + 20} L${x + 40},${y + 140} Z`} fill="#fff" opacity={0.12} />
      {/* cadre et croisillons */}
      <rect x={x - 22} y={y - 22} width={w + 44} height={h + 44} rx={6} fill="none" stroke="#fdf3e7" strokeWidth={26} />
      <rect x={x + w / 2 - 8} y={y} width={16} height={h} fill="#fdf3e7" />
      <rect x={x} y={y + h * 0.42} width={w} height={14} fill="#fdf3e7" />
      {/* rebord */}
      <rect x={x - 50} y={y + h + 14} width={w + 100} height={26} rx={6} fill="#fdf3e7" />
      <rect x={x - 50} y={y + h + 38} width={w + 100} height={8} fill="#000" opacity={0.12} />
      {/* petits pots sur le rebord */}
      <g transform={`translate(${x + 30},${y + h + 14})`}>
        <path d="M0,0 L40,0 L34,-36 L6,-36 Z" fill="#e26d5a" transform="scale(1,-1) translate(0,0)" />
        <path d="M2,-2 L38,-2 L32,-40 L8,-40 Z" fill="#e26d5a" />
        <path d="M20,-40 Q0,-80 8,-96 M20,-40 Q24,-90 36,-100 M20,-40 Q40,-70 52,-74" stroke="#3f9a54" strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
      <g transform={`translate(${x + w - 90},${y + h + 14})`}>
        <rect x={0} y={-44} width={44} height={44} rx={6} fill="#5ac8c8" />
        <circle cx={22} cy={-62} r={26} fill="#4fae5e" />
        <circle cx={10} cy={-74} r={14} fill="#5fc26e" />
      </g>
    </g>
  );
};

const Rideaux: React.FC = () => {
  const plis = (x0: number, sensPli: number) => (
    <g>
      <path d={`M${x0},360 L${x0 + 130},360 Q${x0 + 130 + sensPli * 30},760 ${x0 + 110 + sensPli * 20},1160 L${x0 + 10},1160 Q${x0 - 10},760 ${x0},360 Z`} fill="#3f7d8c" />
      {[30, 62, 94].map((d) => (
        <path key={d} d={`M${x0 + d},372 Q${x0 + d + sensPli * 16},760 ${x0 + d + sensPli * 10},1150`} stroke="#2f6170" strokeWidth={8} fill="none" />
      ))}
      <rect x={x0 + 4} y={820} width={122} height={22} rx={10} fill="#e8c46a" transform={`rotate(${sensPli * 4},${x0 + 65},831)`} />
    </g>
  );
  return (
    <g>
      <rect x={1580} y={346} width={640} height={16} rx={8} fill="#5b3b2a" />
      <circle cx={1578} cy={354} r={16} fill="#5b3b2a" />
      <circle cx={2222} cy={354} r={16} fill="#5b3b2a" />
      {plis(1570, -1)}
      {plis(2100, 1)}
    </g>
  );
};

const Etageres: React.FC = () => {
  const livres = (x0: number, y0: number, n: number, seed: number) => {
    const cols = ['#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#2ecc71', '#e67e22', '#1abc9c', '#34495e'];
    let x = x0;
    return Array.from({length: n}).map((_, i) => {
      const w = 22 + rnd(seed + i) * 16;
      const hh = 70 + rnd(seed + i * 3) * 40;
      const penche = i === n - 1 ? 14 : 0;
      const el = (
        <g key={i} transform={`rotate(${penche},${x + w},${y0})`}>
          <rect x={x} y={y0 - hh} width={w} height={hh} rx={3} fill={cols[(i + seed) % cols.length]} />
          <rect x={x + 4} y={y0 - hh + 14} width={w - 8} height={6} fill="#fff" opacity={0.5} />
        </g>
      );
      x += w + 3;
      return el;
    });
  };
  return (
    <g>
      {[760, 960].map((y) => (
        <g key={y}>
          <rect x={120} y={y} width={500} height={20} rx={4} fill={BOIS} />
          <rect x={120} y={y + 18} width={500} height={8} fill="#000" opacity={0.15} />
          <path d={`M160,${y + 20} L160,${y + 50} L190,${y + 20} Z`} fill={BOIS_FONCE} />
          <path d={`M580,${y + 20} L580,${y + 50} L550,${y + 20} Z`} fill={BOIS_FONCE} />
        </g>
      ))}
      {livres(140, 760, 8, 3)}
      {/* plante retombante */}
      <g transform="translate(470,760)">
        <path d="M0,0 L70,0 L62,-58 L8,-58 Z" fill="#f3f0ea" />
        {[[-10, 90], [20, 150], [50, 120], [80, 70]].map(([dx, l], i) => (
          <g key={i}>
            <path d={`M${30 + dx / 3},-50 Q${dx},${l / 2} ${dx},${l}`} stroke="#3f9a54" strokeWidth={5} fill="none" />
            {Array.from({length: 4}).map((__, k) => (
              <ellipse key={k} cx={dx + (k % 2 ? 8 : -8)} cy={(l / 4) * k + 10} rx={12} ry={8} fill={k % 2 ? '#4fae5e' : '#62c472'} />
            ))}
          </g>
        ))}
      </g>
      {/* manette de jeu + trophée */}
      <g transform="translate(150,960)">
        <rect x={0} y={-36} width={90} height={36} rx={18} fill="#2d2d3a" />
        <circle cx={22} cy={-18} r={7} fill="#5ad1ff" />
        <circle cx={68} cy={-22} r={5} fill="#ff6b9a" />
        <circle cx={76} cy={-12} r={5} fill="#7dff8a" />
      </g>
      <g transform="translate(300,960)">
        <rect x={10} y={-20} width={50} height={20} fill="#b8862b" />
        <path d="M0,-90 L70,-90 Q66,-40 35,-34 Q4,-40 0,-90 Z" fill="#f5c542" />
        <rect x={30} y={-36} width={10} height={18} fill="#d9a83a" />
      </g>
      {livres(400, 960, 6, 11)}
    </g>
  );
};

const Posters: React.FC = () => (
  <g>
    {/* poster code */}
    <g transform="translate(170,380) rotate(-3)">
      <rect x={0} y={0} width={260} height={320} rx={6} fill="#1e2a4a" />
      <rect x={10} y={10} width={240} height={300} rx={4} fill="none" stroke="#5ad1ff" strokeWidth={4} />
      <text x={130} y={170} textAnchor="middle" fontFamily={POLICE_CODE} fontWeight={700} fontSize={90} fill="#5ad1ff">{'</>'}</text>
      <text x={130} y={250} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={34} fill="#ffd23f">CODE</text>
      <text x={130} y={288} textAnchor="middle" fontFamily={POLICE} fontWeight={800} fontSize={22} fill="#ffffff">EAT · SLEEP · REPEAT</text>
      <circle cx={130} cy={14} r={7} fill="#e74c3c" />
    </g>
    {/* poster pixel art */}
    <g transform="translate(470,420) rotate(2)">
      <rect x={0} y={0} width={190} height={250} rx={6} fill="#ffd23f" />
      {[
        '..XXXX..', '.XXXXXX.', 'XX.XX.XX', 'XXXXXXXX', '..X..X..', '.X.XX.X.', 'X.X..X.X',
      ].map((row, r) => row.split('').map((c, i) => (c === 'X' ? <rect key={`${r}-${i}`} x={31 + i * 16} y={40 + r * 16} width={16} height={16} fill="#7b4fd6" /> : null)))}
      <text x={95} y={220} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={28} fill="#7b4fd6">GAME ON</text>
      <circle cx={95} cy={12} r={7} fill="#3498db" />
    </g>
    {/* poster au-dessus du bureau */}
    <g transform="translate(860,360) rotate(-1.5)">
      <rect x={0} y={0} width={300} height={200} rx={6} fill="#ffffff" />
      <rect x={14} y={14} width={272} height={172} rx={4} fill="#ff6b9a" />
      <text x={150} y={92} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={44} fill="#fff">HELLO</text>
      <text x={150} y={148} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={44} fill="#ffd23f">WORLD!</text>
    </g>
    {/* post-it */}
    {[[1200, 400, '#ffe66d', -6], [1250, 470, '#a0e7a0', 5], [1190, 540, '#8fd3ff', -3]].map(([x, y, c, r], i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
        <rect x={0} y={0} width={80} height={80} fill={c as string} />
        <rect x={10} y={22} width={56} height={6} fill="#555" opacity={0.4} />
        <rect x={10} y={38} width={44} height={6} fill="#555" opacity={0.4} />
      </g>
    ))}
  </g>
);

const Horloge: React.FC<{heure: number}> = ({heure}) => {
  const h = ((heure / 60) % 12) * 30;
  const m = (heure % 60) * 6;
  return (
    <g transform="translate(1460,560)">
      <circle r={62} fill="#fdf3e7" stroke="#5b3b2a" strokeWidth={10} />
      {Array.from({length: 12}).map((_, i) => (
        <rect key={i} x={-3} y={-52} width={6} height={12} fill="#5b3b2a" transform={`rotate(${i * 30})`} />
      ))}
      <rect x={-5} y={-32} width={10} height={36} rx={5} fill="#2d2d3a" transform={`rotate(${h})`} />
      <rect x={-3} y={-48} width={6} height={52} rx={3} fill="#e74c3c" transform={`rotate(${m})`} />
      <circle r={7} fill="#2d2d3a" />
    </g>
  );
};

const Lit: React.FC = () => (
  <g>
    <rect x={70} y={1250} width={30} height={SOL - 1250} fill={BOIS_FONCE} />
    <rect x={70} y={1230} width={40} height={40} rx={10} fill={BOIS} />
    <rect x={90} y={1380} width={560} height={150} rx={10} fill={BOIS} />
    <rect x={96} y={SOL - 80} width={30} height={80} fill={BOIS_FONCE} />
    <rect x={610} y={SOL - 80} width={30} height={80} fill={BOIS_FONCE} />
    {/* matelas, couette, oreiller */}
    <rect x={100} y={1330} width={545} height={70} rx={24} fill="#f6f1ea" />
    <path d="M230,1320 Q420,1290 650,1330 L650,1420 Q440,1440 230,1420 Z" fill="#4a7bd0" />
    <path d="M230,1320 Q420,1290 650,1330 L650,1350 Q440,1320 230,1345 Z" fill="#6b98e6" />
    {[300, 400, 500, 600].map((x) => <circle key={x} cx={x} cy={1380} r={10} fill="#ffffff" opacity={0.35} />)}
    <rect x={110} y={1290} width={150} height={60} rx={28} fill="#ffffff" />
    <path d="M130,1300 Q180,1310 240,1300" stroke="#e2dbd0" strokeWidth={5} fill="none" />
    {/* peluche */}
    <g transform="translate(300,1306)">
      <circle cx={0} cy={0} r={26} fill="#c98a5a" />
      <circle cx={-18} cy={-22} r={10} fill="#c98a5a" />
      <circle cx={18} cy={-22} r={10} fill="#c98a5a" />
      <circle cx={-8} cy={-4} r={4} fill="#2d2d3a" />
      <circle cx={8} cy={-4} r={4} fill="#2d2d3a" />
    </g>
  </g>
);

const Bureau: React.FC<{frame: number; nuit: number; ecran?: React.ReactNode; ecranAllume: boolean}> = ({frame, nuit, ecran, ecranAllume}) => {
  const rgb = (i: number) => ['#ff3b7a', '#7b4fd6', '#3bd1ff', '#3ee07a'][Math.floor(frame / 12 + i) % 4];
  return (
    <g>
      {/* tour PC gaming sous le bureau, à droite */}
      <g transform="translate(1395,1380)">
        <rect x={0} y={0} width={130} height={SOL - 1380} rx={10} fill="#22232e" />
        <rect x={12} y={14} width={106} height={180} rx={6} fill="#2f3140" />
        {[62, 150].map((y, i) => (
          <g key={y} transform={`translate(65,${y - 10})`}>
            <circle r={38} fill="none" stroke={rgb(i)} strokeWidth={6} />
            <g transform={`rotate(${frame * 25})`}>
              {[0, 72, 144, 216, 288].map((a) => <path key={a} d="M0,0 L10,-30 L-6,-30 Z" fill="#4a4c5e" transform={`rotate(${a})`} />)}
            </g>
            <circle r={8} fill="#4a4c5e" />
          </g>
        ))}
        <circle cx={65} cy={212} r={6} fill="#3ee07a" />
      </g>
      {/* pieds du bureau */}
      <rect x={790} y={1364} width={26} height={SOL - 1364} fill={BOIS_FONCE} />
      <rect x={1360} y={1364} width={20} height={SOL - 1364} fill={BOIS_FONCE} />
      <g transform="translate(0,120)">
      {/* plateau du bureau */}
      <rect x={760} y={1210} width={790} height={34} rx={6} fill={BOIS_CLAIR} />
      <rect x={760} y={1240} width={790} height={10} fill="#000" opacity={0.15} />
      {/* tiroir */}
      <rect x={1150} y={1250} width={200} height={70} rx={6} fill={BOIS} />
      <rect x={1225} y={1278} width={50} height={10} rx={5} fill={BOIS_FONCE} />
      {/* écran */}
      <g transform="translate(1160,890)">
        <rect x={130} y={240} width={40} height={80} fill="#2d2d3a" />
        <rect x={90} y={312} width={120} height={14} rx={6} fill="#2d2d3a" />
        <rect x={-10} y={-10} width={320} height={252} rx={14} fill="#1b1c25" />
        <rect x={0} y={0} width={300} height={232} rx={6} fill="#08080c" />
        <rect x={6} y={248} width={288} height={6} rx={3} fill={rgb(2)} opacity={0.8} />
      </g>
      {/* lampe de bureau */}
      <g transform="translate(1480,1210)">
        <rect x={-30} y={-12} width={60} height={12} rx={6} fill="#2d2d3a" />
        <path d="M0,-12 L-30,-150 L40,-200" stroke="#2d2d3a" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20,-224 L80,-188 L50,-160 Z" fill="#ffb347" />
        <ellipse cx={64} cy={-172} rx={14} ry={6} fill="#fff3c4" opacity={0.4 + nuit * 0.6} />
      </g>
      {/* clavier RGB, souris, tasse, cactus */}
      <rect x={1000} y={1188} width={220} height={24} rx={6} fill="#2d2d3a" />
      {Array.from({length: 10}).map((_, i) => (
        <rect key={i} x={1010 + i * 20.5} y={1193} width={16} height={8} rx={2} fill={rgb(i % 4)} opacity={0.5 + nuit * 0.5} />
      ))}
      <ellipse cx={1270} cy={1202} rx={22} ry={12} fill="#2d2d3a" />
      <rect x={1268} y={1192} width={4} height={8} fill={rgb(1)} />
      <g transform="translate(930,1210)">
        <rect x={-30} y={-62} width={60} height={62} rx={8} fill="#e74c3c" />
        <path d="M30,-48 q24,0 24,20 q0,18 -24,18" stroke="#e74c3c" strokeWidth={9} fill="none" />
        <text x={0} y={-24} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={22} fill="#fff">{'{ }'}</text>
      </g>
      <g transform="translate(830,1210)">
        <path d="M-24,0 L24,0 L20,-34 L-20,-34 Z" fill="#c98a5a" />
        <rect x={-10} y={-96} width={20} height={64} rx={10} fill="#4fae5e" />
        <rect x={-30} y={-80} width={14} height={30} rx={7} fill="#4fae5e" />
        <rect x={16} y={-70} width={14} height={26} rx={7} fill="#4fae5e" />
      </g>
      </g>
    </g>
  );
};

/** Lignes de code colorées qui défilent (écran par défaut) */
export const CodeParDefaut: React.FC<{frame: number}> = ({frame}) => {
  const cols = ['#ff79c6', '#8be9fd', '#50fa7b', '#f1fa8c', '#bd93f9', '#ffb86c'];
  const decal = (frame * 1.2) % 26;
  return (
    <g transform={`translate(0,${-decal})`}>
      {Array.from({length: 11}).map((_, i) => {
        const ind = (i % 4) * 18;
        return (
          <g key={i}>
            <rect x={14 + ind} y={16 + i * 26} width={30 + rnd(i) * 50} height={10} rx={4} fill={cols[i % 6]} />
            <rect x={54 + ind + rnd(i) * 50} y={16 + i * 26} width={40 + rnd(i + 9) * 90} height={10} rx={4} fill={cols[(i + 2) % 6]} opacity={0.8} />
          </g>
        );
      })}
    </g>
  );
};

/** Écran du PC : dessiné au-dessus de l'éclairage nocturne (il émet sa propre lumière) */
const EcranPC: React.FC<{frame: number; ecran?: React.ReactNode; allume: boolean}> = ({frame, ecran, allume}) => (
  <g transform="translate(1160,1010)">
    <clipPath id="ecran-pc"><rect x={0} y={0} width={300} height={232} rx={6} /></clipPath>
    <g clipPath="url(#ecran-pc)">
      <rect x={0} y={0} width={300} height={232} fill={allume ? '#1e1f2e' : '#08080c'} />
      {allume && (ecran ?? <CodeParDefaut frame={frame} />)}
    </g>
  </g>
);

const Chaise: React.FC = () => (
  <g transform={`translate(${POS_CHAISE},0)`}>
    {/* chaise gaming vue de profil (dossier à gauche, Toi regarde vers la droite) */}
    <path d="M-110,1080 Q-140,1070 -134,1110 L-108,1482 L-60,1482 L-66,1100 Q-68,1076 -110,1080 Z" fill="#2d2d3a" />
    <path d="M-112,1110 L-96,1440 L-76,1440 L-84,1110 Z" fill="#e74c3c" />
    <rect x={-120} y={1476} width={200} height={36} rx={16} fill="#2d2d3a" />
    <rect x={-30} y={1512} width={20} height={70} fill="#555866" />
    <path d="M-100,1582 L60,1582" stroke="#555866" strokeWidth={14} strokeLinecap="round" />
    <circle cx={-100} cy={1598} r={13} fill="#2d2d3a" />
    <circle cx={60} cy={1598} r={13} fill="#2d2d3a" />
    <circle cx={-20} cy={1600} r={13} fill="#2d2d3a" />
  </g>
);

const Tapis = () => (
  <g>
    <ellipse cx={1180} cy={1640} rx={560} ry={52} fill="#7b4fd6" opacity={0.85} />
    <ellipse cx={1180} cy={1640} rx={500} ry={40} fill="none" stroke="#ffd23f" strokeWidth={6} strokeDasharray="20 14" />
  </g>
);

const LampeSurPied: React.FC<{nuit: number}> = ({nuit}) => (
  <g transform="translate(2260,0)">
    <rect x={-6} y={980} width={12} height={SOL - 980} fill="#2d2d3a" />
    <ellipse cx={0} cy={SOL} rx={46} ry={10} fill="#2d2d3a" />
    <path d="M-60,980 L60,980 L40,880 L-40,880 Z" fill="#ffe0a3" />
    <path d="M-60,980 L60,980 L58,970 L-58,970 Z" fill="#e6b866" />
    <ellipse cx={0} cy={980} rx={50} ry={8} fill="#fff6d8" opacity={0.5 + nuit * 0.5} />
  </g>
);

const GrandePlante = () => (
  <g transform="translate(1580,1610)">
    <path d="M-50,0 L50,0 L40,-110 L-40,-110 Z" fill="#f3f0ea" />
    <rect x={-44} y={-118} width={88} height={16} rx={6} fill="#e0dcd3" />
    {[[-70, -300, -40], [10, -360, 5], [70, -280, 40], [-20, -230, -20], [50, -200, 25]].map(([x, y, r], i) => (
      <g key={i}>
        <path d={`M0,-110 Q${x / 2},${(y - 110) / 2} ${x},${y}`} stroke="#2f7a40" strokeWidth={7} fill="none" />
        <g transform={`translate(${x},${y}) rotate(${r})`}>
          <path d="M0,0 Q-50,-40 0,-110 Q50,-40 0,0 Z" fill={i % 2 ? '#3f9a54' : '#4fae5e'} />
          <path d="M0,-6 L0,-100" stroke="#2f7a40" strokeWidth={4} />
          <path d="M-16,-40 L-6,-50 M16,-60 L6,-70" stroke="#f0b98d" strokeWidth={5} />
        </g>
      </g>
    ))}
  </g>
);

export const ChambreDev: React.FC<Props> = ({jour, frame, heure = 120, ecran, ecranAllume = true, children, avantPlan}) => {
  const nuit = 1 - jour;
  return (
    <svg width={CHAMBRE_DEV.largeur} height={CHAMBRE_DEV.hauteur} viewBox={`0 0 ${CHAMBRE_DEV.largeur} ${CHAMBRE_DEV.hauteur}`} style={{display: 'block'}}>
      <defs>
        <linearGradient id="parquet-degrade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.15} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="mur-degrade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.12} />
          <stop offset="0.3" stopColor="#000" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* mur */}
      <rect x={0} y={0} width={2400} height={1470} fill={MUR} />
      <rect x={0} y={1180} width={2400} height={290} fill={MUR_BAS} />
      <rect x={0} y={1170} width={2400} height={16} fill="#fbe7d4" />
      {/* motif discret du mur */}
      {Array.from({length: 30}).map((_, i) => (
        <circle key={i} cx={(i * 173) % 2400} cy={160 + ((i * 97) % 960)} r={5} fill="#ffffff" opacity={0.18} />
      ))}
      {/* panneaux du soubassement */}
      {Array.from({length: 8}).map((_, i) => (
        <rect key={i} x={70 + i * 290} y={1210} width={250} height={220} rx={8} fill="none" stroke="#c98763" strokeWidth={5} />
      ))}
      <rect x={0} y={0} width={2400} height={1470} fill="url(#mur-degrade)" />
      <Posters />
      <Etageres />
      <Horloge heure={heure} />
      <Fenetre jour={jour} frame={frame} />
      <Rideaux />
      <Parquet />
      <Tapis />
      <Lit />
      <LampeSurPied nuit={nuit} />
      <GrandePlante />
      <Chaise />
      <Bureau frame={frame} nuit={nuit} ecran={ecran} ecranAllume={ecranAllume} />
      {/* suspension au plafond */}
      <g transform="translate(1200,96)">
        <rect x={-3} y={0} width={6} height={110} fill="#2d2d3a" />
        <path d="M-60,170 Q0,90 60,170 Z" fill="#2d2d3a" />
        <ellipse cx={0} cy={170} rx={60} ry={10} fill="#fff6d8" opacity={0.3 + jour * 0.2} />
      </g>
      <LumiereNuit
        nuit={nuit}
        largeur={2400}
        hauteur={1920}
        lumieres={[
          {x: 1310, y: 1120, r: 440, couleur: '#5ab0ff', force: ecranAllume ? 0.55 : 0},
          {x: 1545, y: 1230, r: 300, couleur: '#ffcf7a', force: 0.45},
          {x: 2260, y: 1000, r: 380, couleur: '#ffd59a', force: 0.4},
          {x: 1460, y: 1490, r: 180, couleur: '#b06bff', force: 0.35},
        ]}
        soleil={{x: 1900, y: 730, jour}}
      />
      <EcranPC frame={frame} ecran={ecran} allume={ecranAllume} />
      {/* personnages : au-dessus de l'éclairage, légèrement teintés la nuit (les yeux restent blancs) */}
      <g style={{filter: `brightness(${1 - nuit * 0.12}) saturate(${1 - nuit * 0.1})`}}>{children}</g>
      <Guirlande frame={frame} nuit={nuit} />
      <Coupe />
      {avantPlan}
    </svg>
  );
};
