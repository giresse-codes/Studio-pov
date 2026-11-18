import React from 'react';
import {useCurrentFrame} from 'remotion';
import {pop} from '../lib/anim';
import {FONT, SERIF_1998} from '../lib/fonts';
import {Etincelles} from './Ecrans';

/* Éléments communs aux épisodes (étiquettes, téléphone qui vibre, mini-sites pour l'écran du bureau, tampon). */

/* ---------- mini site moche affiché sur l'écran du bureau ---------- */
export const SiteMocheMini: React.FC<{censure: number}> = ({censure}) => (
  <g>
    <rect width={300} height={186} fill="#fff" />
    <text x={12} y={30} fontFamily={SERIF_1998} fontWeight={700} fontSize={22} fill="#000">
      Boulangerie Marcel
    </text>
    <rect x={12} y={42} width={110} height={64} fill="#fff" stroke="#000" strokeWidth={2} />
    <line x1={12} y1={42} x2={122} y2={106} stroke="#000" strokeWidth={1.5} />
    <line x1={122} y1={42} x2={12} y2={106} stroke="#000" strokeWidth={1.5} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={12} y={118 + i * 16} width={260 - i * 40} height={7} fill="#000" />
    ))}
    <rect x={12} y={168} width={140} height={6} fill="#0000ee" />
    {censure > 0 && (
      <g transform={`translate(150,93) scale(${censure}) rotate(-8)`}>
        <rect x={-150} y={-34} width={300} height={68} fill="#000" />
        <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#fff">
          CENSURÉ
        </text>
      </g>
    )}
  </g>
);

/* ---------------- étiquette de valeur (pop + étincelles) ---------------- */
export const Etiquette: React.FC<{debut: number; x: number; y: number; texte: string; couleur?: string; rot?: number}> = ({debut, x, y, texte, couleur = '#111827', rot = -4}) => {
  const f = useCurrentFrame();
  const p = pop(f, debut, 30, 8);
  if (p <= 0) return null;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(-50%,-50%) scale(${p}) rotate(${rot}deg)`,
          background: '#ffe14d',
          border: `6px solid ${couleur}`,
          color: couleur,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 50,
          padding: '8px 26px',
          borderRadius: 18,
          boxShadow: '0 10px 0 rgba(0,0,0,0.35)',
          whiteSpace: 'nowrap',
        }}
      >
        {texte}
      </div>
      <Etincelles debut={debut} x={x} y={y} r={120} />
    </>
  );
};

/* -------------------- téléphone qui vibre (monde) -------------------- */
export const TelMonde: React.FC<{x: number; y: number; debut: number; fin: number}> = ({x, y, debut, fin}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin) return null;
  const p = pop(f, debut);
  const r = Math.sin(f * 2.4) * 16;
  return (
    <g transform={`translate(${x},${y}) scale(${p}) rotate(${r})`}>
      <circle r={50} fill="#ffe14d" stroke="#111" strokeWidth={5} />
      <rect x={-16} y={-30} width={32} height={58} rx={7} fill="#111" />
      <rect x={-11} y={-23} width={22} height={40} rx={3} fill="#60a5fa" />
      <path d="M-34,-16 q-8,16 0,32 M34,-16 q8,16 0,32" stroke="#111" strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};


/* ------------- mini site habillé (CSS relié) pour l'écran du bureau ------------- */
export const SiteJoliMini: React.FC = () => (
  <g>
    <rect width={300} height={186} fill="#fff7ed" />
    <defs>
      <linearGradient id="joli-mini" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f472b6" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <rect width={300} height={46} fill="url(#joli-mini)" />
    <text x={150} y={31} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill="#fff">
      Boulangerie Marcel
    </text>
    <rect x={12} y={58} width={120} height={90} rx={10} fill="#fde68a" stroke="#f59e0b" strokeWidth={3} />
    <ellipse cx={72} cy={103} rx={40} ry={18} fill="#d97706" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={146} y={64 + i * 16} width={130 - i * 20} height={8} rx={4} fill="#7c2d12" opacity={0.75} />
    ))}
    <rect x={160} y={130} width={100} height={30} rx={15} fill="#ec4899" />
  </g>
);

/* ------------------------- tampon (gros texte qui s'abat) ------------------------- */
export const Tampon: React.FC<{debut: number; x: number; y: number; texte: React.ReactNode; couleur?: string; taille?: number; rot?: number}> = ({
  debut,
  x,
  y,
  texte,
  couleur = '#dc2626',
  taille = 100,
  rot = -12,
}) => {
  const f = useCurrentFrame();
  const p = pop(f, debut, 30, 7);
  if (p <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${1 + (1 - Math.min(1, p)) * 2}) rotate(${rot}deg)`,
        opacity: Math.min(1, p * 1.5),
        border: `12px solid ${couleur}`,
        color: couleur,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: taille,
        padding: '6px 40px',
        borderRadius: 24,
        background: 'rgba(255,255,255,0.9)',
        lineHeight: 1,
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {texte}
    </div>
  );
};
