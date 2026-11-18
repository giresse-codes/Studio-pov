import React from 'react';
import {clamp, mixColor, rand} from '../lib/anim';
import {FONT} from '../lib/fonts';

/* Éléments de décor réutilisables (flat, ombres douces). Tous en coordonnées monde. */

/* ------------------------------ ciel ------------------------------ */
export const couleursCiel = (jour: number) => {
  // 0 = nuit, 0.5 = aube/crépuscule, 1 = plein jour
  const haut = jour < 0.5 ? mixColor('#0a1433', '#3b4a8c', jour * 2) : mixColor('#3b4a8c', '#4fb3f6', (jour - 0.5) * 2);
  const bas = jour < 0.5 ? mixColor('#1b2a5c', '#ff9e6b', jour * 2) : mixColor('#ff9e6b', '#c9ecff', (jour - 0.5) * 2);
  return {haut, bas};
};

export const Ciel: React.FC<{x: number; y: number; w: number; h: number; jour: number; t: number; id: string}> = ({
  x,
  y,
  w,
  h,
  jour,
  t,
  id,
}) => {
  const {haut, bas} = couleursCiel(jour);
  const nuit = 1 - clamp(jour * 1.6);
  const sunY = y + h * (1.05 - 0.75 * clamp(jour * 1.3));
  const moonY = y + h * (0.12 + 0.9 * (1 - nuit));
  const bat = [
    [0, 0.42, 0.16],
    [0.14, 0.62, 0.12],
    [0.25, 0.35, 0.15],
    [0.39, 0.7, 0.1],
    [0.48, 0.5, 0.17],
    [0.64, 0.78, 0.12],
    [0.75, 0.4, 0.14],
    [0.88, 0.58, 0.13],
  ];
  return (
    <g>
      <defs>
        <linearGradient id={`ciel-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={haut} />
          <stop offset="1" stopColor={bas} />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#ciel-${id})`} />
        {/* étoiles */}
        {Array.from({length: 26}).map((_, i) => (
          <circle
            key={i}
            cx={x + rand(i + 1) * w}
            cy={y + rand(i + 50) * h * 0.55}
            r={1.5 + rand(i + 9) * 2}
            fill="#fff"
            opacity={nuit * (0.5 + 0.5 * Math.sin(t * 0.1 + i))}
          />
        ))}
        {/* soleil */}
        <circle cx={x + w * 0.72} cy={sunY} r={46} fill="#ffe680" opacity={clamp(jour * 2)} />
        <circle cx={x + w * 0.72} cy={sunY} r={80} fill="#ffe680" opacity={clamp(jour * 2) * 0.25} />
        {/* lune */}
        <g opacity={nuit}>
          <circle cx={x + w * 0.28} cy={moonY} r={34} fill="#f4f1d0" />
          <circle cx={x + w * 0.28 + 14} cy={moonY - 8} r={30} fill={haut} />
        </g>
        {/* nuages */}
        {[0, 1, 2].map((i) => {
          const cx = x + ((rand(i + 3) * w + t * (0.4 + i * 0.15)) % (w + 240)) - 120;
          const cy = y + h * (0.12 + i * 0.13);
          return (
            <g key={i} opacity={0.35 + 0.5 * jour} fill={jour > 0.4 ? '#ffffff' : '#4b5a8f'}>
              <ellipse cx={cx} cy={cy} rx={70} ry={22} />
              <ellipse cx={cx + 40} cy={cy - 14} rx={42} ry={24} />
              <ellipse cx={cx - 30} cy={cy - 8} rx={34} ry={18} />
            </g>
          );
        })}
        {/* ville */}
        {bat.map(([bx, bh, bw], i) => {
          const X = x + bx * w;
          const BW = bw * w + 20;
          const BH = bh * h * 0.75;
          const Y = y + h - BH;
          const col = mixColor('#1a2347', '#7d93b8', jour);
          return (
            <g key={i}>
              <rect x={X} y={Y} width={BW} height={BH} fill={col} />
              {i % 3 === 0 && <rect x={X + BW / 2 - 3} y={Y - 40} width={6} height={40} fill={col} />}
              {Array.from({length: 18}).map((__, j) => {
                const wx = X + 10 + (j % 3) * (BW / 3.2);
                const wy = Y + 16 + Math.floor(j / 3) * 34;
                if (wy > y + h - 12) return null;
                const lit = rand(i * 31 + j) > 0.45;
                return (
                  <rect
                    key={j}
                    x={wx}
                    y={wy}
                    width={BW / 5}
                    height={16}
                    fill={lit ? '#ffd56b' : mixColor('#2a3560', '#a9bdd9', jour)}
                    opacity={lit ? 0.25 + nuit * 0.75 : 0.6}
                  />
                );
              })}
            </g>
          );
        })}
      </g>
    </g>
  );
};

/* ---------------------------- fenêtre ----------------------------- */
export const Fenetre: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  jour: number;
  t: number;
  id: string;
  rideau?: string;
  cadre?: string;
}> = ({x, y, w, h, jour, t, id, rideau = '#e85d75', cadre = '#f8fafc'}) => (
  <g>
    <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={8} fill="#000" opacity={0.12} transform="translate(8,10)" />
    <rect x={x - 14} y={y - 14} width={w + 28} height={h + 28} rx={8} fill={cadre} />
    <Ciel x={x} y={y} w={w} h={h} jour={jour} t={t} id={id} />
    <rect x={x + w / 2 - 6} y={y} width={12} height={h} fill={cadre} />
    <rect x={x} y={y + h * 0.45 - 6} width={w} height={12} fill={cadre} />
    <rect x={x - 30} y={y + h + 8} width={w + 60} height={22} rx={6} fill={cadre} />
    <rect x={x - 30} y={y + h + 26} width={w + 60} height={8} fill="#000" opacity={0.12} />
    {/* reflet */}
    <path d={`M${x + 20},${y + h - 30} L${x + 90},${y + 20} L${x + 130},${y + 20} L${x + 60},${y + h - 30} Z`} fill="#fff" opacity={0.12} />
    {/* tringle + rideaux */}
    <rect x={x - 80} y={y - 46} width={w + 160} height={10} rx={5} fill="#5b3a29" />
    {[-1, 1].map((side) => {
      const bx = side < 0 ? x - 76 : x + w + 76;
      const sway = Math.sin(t * 0.05 + side) * 6;
      return (
        <g key={side}>
          <path
            d={`M${bx},${y - 40} L${bx - side * 120},${y - 40} Q${bx - side * 100 + sway},${y + h * 0.5} ${bx - side * 130},${y + h + 60} L${bx},${y + h + 60} Z`}
            fill={rideau}
          />
          {[0.3, 0.6].map((k) => (
            <path
              key={k}
              d={`M${bx - side * 120 * k},${y - 40} Q${bx - side * (100 * k) + sway},${y + h * 0.5} ${bx - side * 128 * k},${y + h + 60}`}
              stroke="#000"
              strokeOpacity={0.12}
              strokeWidth={6}
              fill="none"
            />
          ))}
        </g>
      );
    })}
  </g>
);

/* --------------------------- guirlande ---------------------------- */
export const Guirlande: React.FC<{x1: number; x2: number; y: number; sag?: number; jour: number; t: number}> = ({
  x1,
  x2,
  y,
  sag = 60,
  jour,
  t,
}) => {
  const n = 14;
  const cols = ['#ffd166', '#ff6b9a', '#7ee0ff', '#a3ff8f'];
  const pts = Array.from({length: n + 1}).map((_, i) => {
    const k = i / n;
    return [x1 + (x2 - x1) * k, y + Math.sin(k * Math.PI) * sag];
  });
  const glow = 0.35 + 0.65 * (1 - jour);
  return (
    <g>
      <path d={`M${x1},${y} Q${(x1 + x2) / 2},${y + sag * 2} ${x2},${y}`} stroke="#3a2f2a" strokeWidth={3} fill="none" />
      {pts.slice(1, -1).map(([px, py], i) => {
        const c = cols[i % 4];
        const tw = 0.7 + 0.3 * Math.sin(t * 0.15 + i * 1.3);
        return (
          <g key={i}>
            <circle cx={px} cy={py + 12} r={22} fill={c} opacity={glow * 0.3 * tw} />
            <ellipse cx={px} cy={py + 12} rx={7} ry={10} fill={c} opacity={0.6 + 0.4 * tw} />
            <rect x={px - 4} y={py} width={8} height={6} fill="#3a2f2a" />
          </g>
        );
      })}
    </g>
  );
};

/* ----------------------------- plante ----------------------------- */
export const Plante: React.FC<{x: number; y: number; s?: number; t: number; pot?: string}> = ({x, y, s = 1, t, pot = '#e07a5f'}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={60} ry={10} fill="#000" opacity={0.15} />
    {[-50, -25, 0, 25, 50, -38, 38].map((a, i) => {
      const sw = Math.sin(t * 0.05 + i) * 3;
      return (
        <path
          key={i}
          d={`M0,-70 Q${a * 0.6},${-140 - (i % 3) * 30} ${a * 1.6 + sw},${-170 - (i % 2) * 40} Q${a * 0.3},${-120} 0,-70 Z`}
          fill={i % 2 ? '#2f9e5b' : '#3fbf6f'}
        />
      );
    })}
    <path d="M-40,-80 L40,-80 L32,0 L-32,0 Z" fill={pot} />
    <rect x={-46} y={-88} width={92} height={16} rx={5} fill={pot} />
    <rect x={-46} y={-88} width={92} height={16} rx={5} fill="#000" opacity={0.1} />
  </g>
);

/* ----------------------------- poster ----------------------------- */
export const Poster: React.FC<{x: number; y: number; w: number; h: number; fond: string; children?: React.ReactNode; rot?: number}> = ({
  x,
  y,
  w,
  h,
  fond,
  children,
  rot = 0,
}) => (
  <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
    <rect x={x + 6} y={y + 8} width={w} height={h} fill="#000" opacity={0.15} />
    <rect x={x} y={y} width={w} height={h} fill={fond} stroke="#fff" strokeWidth={6} />
    <svg x={x} y={y} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {children}
    </svg>
    <circle cx={x + w / 2} cy={y + 8} r={5} fill="#d64545" />
  </g>
);

/* ---------------------------- étagère ----------------------------- */
export const Etagere: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => {
  const livres = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#14b8a6'];
  return (
    <g>
      <rect x={x} y={y + 6} width={w} height={14} fill="#000" opacity={0.12} />
      {Array.from({length: Math.floor((w * 0.55) / 22)}).map((_, i) => {
        const hh = 60 + rand(i + 4) * 30;
        return <rect key={i} x={x + 10 + i * 22} y={y - hh} width={18} height={hh} rx={2} fill={livres[i % livres.length]} />;
      })}
      {/* figurine / cube */}
      <rect x={x + w * 0.66} y={y - 46} width={46} height={46} rx={6} fill="#f97316" />
      <rect x={x + w * 0.66 + 10} y={y - 34} width={10} height={10} fill="#fff" />
      <rect x={x + w * 0.66 + 26} y={y - 34} width={10} height={10} fill="#fff" />
      <circle cx={x + w * 0.9} cy={y - 30} r={28} fill="#22c55e" />
      <rect x={x} y={y} width={w} height={16} rx={3} fill="#8b5e3c" />
    </g>
  );
};

/* ---------------------- écran (avec contenu) ---------------------- */
export const Ecran: React.FC<{x: number; y: number; w: number; h: number; children?: React.ReactNode; glow?: number; pied?: boolean}> = ({
  x,
  y,
  w,
  h,
  children,
  glow = 0.5,
  pied = true,
}) => (
  <g>
    {pied && (
      <>
        <rect x={x + w / 2 - 12} y={y + h + 10} width={24} height={50} fill="#2b2f3a" />
        <rect x={x + w / 2 - 60} y={y + h + 56} width={120} height={12} rx={6} fill="#2b2f3a" />
      </>
    )}
    <rect x={x - 30} y={y - 30} width={w + 60} height={h + 60} rx={30} fill="#7dd3fc" opacity={glow * 0.18} />
    <rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} rx={10} fill="#1f2330" />
    <svg x={x} y={y} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <rect width={w} height={h} fill="#0f172a" />
      {children}
    </svg>
    <path d={`M${x},${y} L${x + w * 0.3},${y} L${x},${y + h * 0.5} Z`} fill="#fff" opacity={0.05} />
  </g>
);

/* ------------------------ code factice ---------------------------- */
export const CodeLignes: React.FC<{w: number; h: number; t: number; seed?: number}> = ({w, h, t, seed = 0}) => {
  const cols = ['#c084fc', '#7dd3fc', '#86efac', '#fda4af', '#fde68a'];
  const n = Math.floor(h / 22);
  const scroll = Math.floor(t / 6);
  return (
    <g>
      <rect width={w} height={h} fill="#111827" />
      {Array.from({length: n}).map((_, i) => {
        const r = (k: number) => rand(seed + i + scroll + k * 13);
        return (
          <g key={i} transform={`translate(${14 + r(1) * 3 * 18},${16 + i * 22})`}>
            <rect width={30 + r(2) * 80} height={9} rx={4} fill={cols[Math.floor(r(3) * 5)]} />
            <rect x={40 + r(2) * 80} width={20 + r(4) * 90} height={9} rx={4} fill={cols[Math.floor(r(5) * 5)]} opacity={0.8} />
          </g>
        );
      })}
    </g>
  );
};

/* ------------------------------ PC -------------------------------- */
export const TourPC: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => {
  const hue = (t * 4) % 360;
  return (
    <g>
      <ellipse cx={x + 60} cy={y + 4} rx={80} ry={10} fill="#000" opacity={0.18} />
      <rect x={x} y={y - 230} width={120} height={230} rx={10} fill="#1e1f29" />
      <rect x={x + 12} y={y - 214} width={80} height={180} rx={6} fill="#0b0c12" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={x + 52} cy={y - 175 + i * 58} r={22} fill="none" stroke={`hsl(${(hue + i * 60) % 360} 90% 60%)`} strokeWidth={5} />
          <circle cx={x + 52} cy={y - 175 + i * 58} r={36} fill={`hsl(${(hue + i * 60) % 360} 90% 60%)`} opacity={0.12} />
        </g>
      ))}
      <rect x={x + 100} y={y - 214} width={8} height={180} rx={3} fill={`hsl(${hue} 90% 60%)`} />
    </g>
  );
};

/* ---------------------------- bureau ------------------------------ */
export const Bureau: React.FC<{x: number; y: number; w: number; couleur?: string; h?: number}> = ({x, y, w, couleur = '#c98b5a', h = 200}) => (
  <g>
    <ellipse cx={x + w / 2} cy={y + h} rx={w * 0.55} ry={16} fill="#000" opacity={0.16} />
    <rect x={x + 20} y={y + 20} width={18} height={h - 20} fill="#5b4636" />
    <rect x={x + w - 38} y={y + 20} width={18} height={h - 20} fill="#5b4636" />
    <rect x={x + w - 200} y={y + 26} width={160} height={h * 0.6} rx={6} fill={couleur} />
    <rect x={x + w - 180} y={y + 26 + h * 0.15} width={120} height={9} rx={4} fill="#000" opacity={0.15} />
    <rect x={x + w - 180} y={y + 26 + h * 0.4} width={120} height={9} rx={4} fill="#000" opacity={0.15} />
    <rect x={x} y={y} width={w} height={28} rx={6} fill={couleur} />
    <rect x={x} y={y + 22} width={w} height={8} fill="#000" opacity={0.15} />
  </g>
);

export const Clavier: React.FC<{x: number; y: number; t: number}> = ({x, y, t}) => (
  <g>
    <rect x={x} y={y - 14} width={150} height={16} rx={4} fill="#2b2f3a" />
    <rect x={x + 6} y={y - 12} width={138} height={6} rx={2} fill={`hsl(${(t * 4) % 360} 80% 60%)`} opacity={0.6} />
    <rect x={x + 170} y={y - 12} width={30} height={14} rx={7} fill="#2b2f3a" />
  </g>
);

/* ----------------------------- chaise ----------------------------- */
export const ChaiseGaming: React.FC<{x: number; y: number; couleur?: string}> = ({x, y, couleur = '#e11d48'}) => (
  <g>
    <ellipse cx={x} cy={y + 4} rx={80} ry={10} fill="#000" opacity={0.18} />
    <rect x={x - 6} y={y - 110} width={12} height={100} fill="#333" />
    <path d={`M${x - 60},${y - 6} L${x + 60},${y - 6}`} stroke="#333" strokeWidth={10} strokeLinecap="round" />
    <circle cx={x - 60} cy={y - 2} r={8} fill="#222" />
    <circle cx={x + 60} cy={y - 2} r={8} fill="#222" />
    {/* dossier (derrière le personnage) */}
    <rect x={x - 92} y={y - 380} width={60} height={250} rx={24} fill={couleur} />
    <rect x={x - 84} y={y - 330} width={44} height={22} rx={8} fill="#111" opacity={0.5} />
    <rect x={x - 80} y={y - 145} width={150} height={30} rx={12} fill={couleur} />
  </g>
);

/* ----------------------- tapis, lampe, etc. ----------------------- */
export const Tapis: React.FC<{x: number; y: number; w: number; c1?: string; c2?: string}> = ({x, y, w, c1 = '#f2a65a', c2 = '#e76f51'}) => (
  <g>
    <ellipse cx={x + w / 2} cy={y} rx={w / 2} ry={34} fill={c1} />
    <ellipse cx={x + w / 2} cy={y} rx={w / 2 - 30} ry={22} fill={c2} />
    <ellipse cx={x + w / 2} cy={y} rx={w / 2 - 70} ry={12} fill={c1} />
  </g>
);

export const Suspension: React.FC<{x: number; y: number; long: number; jour: number; c?: string}> = ({x, y, long, jour, c = '#f4c542'}) => (
  <g>
    <line x1={x} y1={y} x2={x} y2={y + long} stroke="#333" strokeWidth={3} />
    <path d={`M${x - 50},${y + long + 50} L${x - 24},${y + long} L${x + 24},${y + long} L${x + 50},${y + long + 50} Z`} fill={c} />
    <ellipse cx={x} cy={y + long + 52} rx={20} ry={8} fill="#fff8d0" />
    <path
      d={`M${x - 50},${y + long + 52} L${x - 260},${y + long + 700} L${x + 260},${y + long + 700} L${x + 50},${y + long + 52} Z`}
      fill="#fff2b0"
      opacity={0.05 + (1 - jour) * 0.12}
    />
  </g>
);

export const Parquet: React.FC<{x: number; y: number; w: number; h: number; c?: string}> = ({x, y, w, h, c = '#b9824f'}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill={c} />
    {Array.from({length: Math.ceil(h / 34)}).map((_, i) => (
      <g key={i}>
        <line x1={x} y1={y + i * 34} x2={x + w} y2={y + i * 34} stroke="#000" strokeOpacity={0.12} strokeWidth={2} />
        {Array.from({length: Math.ceil(w / 220) + 1}).map((__, j) => (
          <line
            key={j}
            x1={x + j * 220 + (i % 2) * 110}
            y1={y + i * 34}
            x2={x + j * 220 + (i % 2) * 110}
            y2={y + i * 34 + 34}
            stroke="#000"
            strokeOpacity={0.1}
            strokeWidth={2}
          />
        ))}
      </g>
    ))}
  </g>
);

/** Coupe de la maison de poupée : dalle du plafond, dalle du sol, murs extérieurs */
export const Coupe: React.FC<{w: number; plafond: number; sol: number; couleur?: string}> = ({w, plafond, sol, couleur = '#2a2438'}) => (
  <g>
    <rect x={0} y={0} width={w} height={plafond} fill={couleur} />
    <rect x={0} y={plafond - 26} width={w} height={26} fill="#3a3350" />
    {/* étage du dessus suggéré */}
    {Array.from({length: Math.ceil(w / 300)}).map((_, i) => (
      <rect key={i} x={60 + i * 300} y={plafond - 150} width={160} height={90} rx={6} fill="#ffffff" opacity={0.04} />
    ))}
    <rect x={0} y={sol + 70} width={w} height={2000} fill={couleur} />
    <rect x={0} y={sol + 70} width={w} height={22} fill="#3a3350" />
    <rect x={0} y={plafond} width={26} height={sol + 70 - plafond} fill="#3a3350" />
    <rect x={w - 26} y={plafond} width={26} height={sol + 70 - plafond} fill="#3a3350" />
  </g>
);

/** Voile d'éclairage selon jour / nuit */
export const Eclairage: React.FC<{w: number; h: number; jour: number; lampes?: {x: number; y: number; r: number}[]; id: string}> = ({
  w,
  h,
  jour,
  lampes = [],
  id,
}) => (
  <g style={{pointerEvents: 'none'}}>
    <defs>
      <radialGradient id={`lamp-${id}`}>
        <stop offset="0" stopColor="#ffcf7a" stopOpacity={0.5} />
        <stop offset="1" stopColor="#ffcf7a" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={w} height={h} fill="#141a45" opacity={(1 - jour) * 0.42} style={{mixBlendMode: 'multiply'}} />
    {lampes.map((l, i) => (
      <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={`url(#lamp-${id})`} opacity={0.35 + (1 - jour) * 0.65} />
    ))}
  </g>
);

export const Texte: React.FC<React.SVGProps<SVGTextElement>> = (p) => <text fontFamily={FONT} fontWeight={700} {...p} />;
