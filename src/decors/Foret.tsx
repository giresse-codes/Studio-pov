import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, lerp, mixColor, rand} from '../lib/anim';

/*
 * Forêt de montagne (Mode Survie), vue de côté, très large.
 * lumiere : 1 = fin d'après-midi, 0.5 = crépuscule, 0 = nuit noire. Palette froide et sombre, brume.
 */
export const FORET = {
  W: 4200,
  H: 1920,
  SOL: 1500,
  finSentier: 1500,
  reperes: [1950, 2750], // le « même » arbre, deux fois
  buisson: 2560,
};

const ciel = (l: number) => {
  const haut = l > 0.5 ? mixColor('#2c3e66', '#5a7fa8', (l - 0.5) * 2) : mixColor('#03050c', '#2c3e66', l * 2);
  const bas = l > 0.5 ? mixColor('#c0614a', '#e8b07a', (l - 0.5) * 2) : mixColor('#0b1224', '#c0614a', l * 2);
  return {haut, bas};
};

/** Sapin (silhouette) */
const Sapin: React.FC<{x: number; y: number; h: number; c: string; c2?: string; neige?: boolean; branche?: boolean}> = ({x, y, h, c, c2, branche}) => {
  const w = h * 0.42;
  const etages = 5;
  return (
    <g>
      <rect x={x - h * 0.025} y={y - h * 0.18} width={h * 0.05} height={h * 0.18} fill={c2 ?? c} />
      {Array.from({length: etages}).map((_, i) => {
        const k = i / etages;
        const top = y - h + k * h * 0.78;
        const ww = w * (0.35 + k * 0.65);
        return <path key={i} d={`M${x},${top} L${x + ww / 2},${top + h * 0.3} L${x - ww / 2},${top + h * 0.3} Z`} fill={c} />;
      })}
      {c2 &&
        Array.from({length: etages}).map((_, i) => {
          const k = i / etages;
          const top = y - h + k * h * 0.78;
          const ww = w * (0.35 + k * 0.65);
          return <path key={`o${i}`} d={`M${x},${top} L${x + ww / 2},${top + h * 0.3} L${x},${top + h * 0.3} Z`} fill={c2} opacity={0.5} />;
        })}
      {branche && (
        <g>
          {/* branche cassée qui pend : le repère qui revient */}
          <path d={`M${x + h * 0.03},${y - h * 0.32} L${x + h * 0.2},${y - h * 0.28} L${x + h * 0.26},${y - h * 0.12}`} stroke="#3b2f2a" strokeWidth={h * 0.018} fill="none" strokeLinecap="round" />
          <path d={`M${x - h * 0.02},${y - h * 0.24} l${-h * 0.03},0`} stroke="#c9b28a" strokeWidth={h * 0.02} strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

export const Foret: React.FC<{
  lumiere: number;
  brume?: number;
  buissonBouge?: number; // frame où le buisson bouge
  lueur?: {x: number; y: number; force: number}; // lueur du téléphone
  children?: React.ReactNode;
}> = ({lumiere, brume = 0.4, buissonBouge, lueur, children}) => {
  const t = useCurrentFrame();
  const {W, H, SOL} = FORET;
  const l = clamp(lumiere);
  const {haut, bas} = ciel(l);
  const soleilY = lerp(1260, 640, clamp((l - 0.35) / 0.65));
  const nuit = 1 - clamp(l * 2.2);
  const brouillard = mixColor('#0d1424', mixColor('#7a8fae', '#b9a9a8', l), clamp(l * 1.4));
  const montLoin = mixColor(mixColor('#0a1020', '#4a5f82', l), bas, 0.25);
  const montPres = mixColor('#070b16', '#33456a', l);
  const sapinLoin = mixColor('#050912', '#2c3f56', l);
  const sapinMilieu = mixColor('#03060c', '#1b2b33', l);
  const sapinMilieu2 = mixColor('#060a14', '#26383f', l);
  const sol = mixColor('#05070c', '#2a2e2a', l);
  const sentier = mixColor('#0c0d10', '#5b5446', l);
  const bouge = buissonBouge !== undefined && t >= buissonBouge && t < buissonBouge + 45 ? Math.sin((t - buissonBouge) * 1.8) * 10 * (1 - (t - buissonBouge) / 45) : 0;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <linearGradient id="foret-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={haut} />
          <stop offset="0.75" stopColor={bas} />
        </linearGradient>
        <radialGradient id="foret-lueur">
          <stop offset="0" stopColor="#9cc9ff" stopOpacity={0.55} />
          <stop offset="1" stopColor="#9cc9ff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="foret-vignette" cx="50%" cy="50%" r="75%">
          <stop offset="0.55" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.7} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#foret-ciel)" />
      {/* étoiles */}
      {Array.from({length: 60}).map((_, i) => (
        <circle key={i} cx={rand(i) * W} cy={rand(i + 9) * 700} r={1.5 + rand(i + 3) * 2.5} fill="#e5ecff" opacity={nuit * (0.4 + 0.6 * Math.abs(Math.sin(t * 0.05 + i)))} />
      ))}
      {/* soleil bas */}
      <circle cx={2900} cy={soleilY} r={150} fill="#ffcf8a" opacity={0.18 * clamp(l * 1.5)} />
      <circle cx={2900} cy={soleilY} r={70} fill="#ffdca8" opacity={clamp((l - 0.3) * 2)} />
      {/* montagnes */}
      <path d={`M0,1150 L300,820 L560,980 L900,700 L1250,960 L1600,760 L2000,1000 L2400,720 L2800,930 L3200,690 L3600,950 L3900,780 L4200,900 L4200,1300 L0,1300 Z`} fill={montLoin} />
      <path d={`M0,1250 L380,1020 L700,1150 L1100,960 L1500,1140 L1900,990 L2300,1160 L2700,1000 L3100,1170 L3500,1010 L3900,1150 L4200,1060 L4200,1350 L0,1350 Z`} fill={montPres} />
      {/* le lac, au loin */}
      <ellipse cx={3300} cy={1250} rx={620} ry={26} fill={mixColor(bas, haut, 0.4)} opacity={0.8} />
      <ellipse cx={3300} cy={1250} rx={620} ry={26} fill="#fff" opacity={0.08 * l} />
      {/* sapins lointains */}
      {Array.from({length: 46}).map((_, i) => (
        <Sapin key={i} x={i * 95 + rand(i) * 40} y={1330 + rand(i + 1) * 30} h={240 + rand(i + 2) * 140} c={sapinLoin} />
      ))}
      {/* brume lointaine */}
      {Array.from({length: 8}).map((_, i) => (
        <ellipse key={i} cx={((i * 620 + t * (0.4 + i * 0.05)) % (W + 800)) - 400} cy={1320 + (i % 3) * 30} rx={520} ry={70} fill={brouillard} opacity={0.25 + brume * 0.35} />
      ))}
      {/* sapins du milieu (les « mêmes » arbres) */}
      {Array.from({length: 22}).map((_, i) => {
        const x = 100 + i * 200 + rand(i + 20) * 60;
        if (FORET.reperes.some((r) => Math.abs(r - x) < 120)) return null;
        return <Sapin key={i} x={x} y={SOL + 10} h={720 + rand(i + 30) * 260} c={i % 2 ? sapinMilieu : sapinMilieu2} c2={sapinLoin} />;
      })}
      {FORET.reperes.map((x) => (
        <Sapin key={x} x={x} y={SOL + 10} h={880} c={sapinMilieu2} c2={sapinLoin} branche />
      ))}
      {/* sol */}
      <rect x={0} y={SOL} width={W} height={H - SOL} fill={sol} />
      <path d={`M0,${SOL + 8} Q${W / 2},${SOL - 10} ${W},${SOL + 8}`} stroke={mixColor('#0a0d0a', '#3b4636', l)} strokeWidth={18} fill="none" />
      {/* sentier qui s'arrête */}
      <path d={`M0,${SOL + 30} L${FORET.finSentier - 300},${SOL + 30} Q${FORET.finSentier - 120},${SOL + 34} ${FORET.finSentier},${SOL + 40}`} stroke={sentier} strokeWidth={46} fill="none" strokeLinecap="round" />
      {Array.from({length: 10}).map((_, i) => (
        <ellipse key={i} cx={FORET.finSentier - 160 + i * 34} cy={SOL + 36 + (i % 2) * 6} rx={20 - i * 1.6} ry={6} fill={sentier} opacity={1 - i / 10} />
      ))}
      {/* balise de sentier (marque jaune passée) */}
      <g>
        <rect x={1180} y={SOL - 150} width={22} height={160} fill={mixColor('#120d0a', '#5b4636', l)} />
        <rect x={1176} y={SOL - 140} width={30} height={20} fill={mixColor('#2a2410', '#c9a227', l)} />
      </g>
      {/* rochers, fougères, racines */}
      {Array.from({length: 26}).map((_, i) => {
        const x = rand(i + 50) * W;
        const k = rand(i + 60);
        if (k < 0.45) return <ellipse key={i} cx={x} cy={SOL + 14} rx={30 + k * 60} ry={18 + k * 20} fill={mixColor('#07090c', '#3c4148', l)} />;
        return (
          <g key={i}>
            {[-30, -10, 10, 30].map((a, j) => (
              <path key={j} d={`M${x},${SOL + 10} q${a},-40 ${a * 2},-60`} stroke={mixColor('#04070a', '#253a2b', l)} strokeWidth={8} fill="none" strokeLinecap="round" />
            ))}
          </g>
        );
      })}
      {/* buisson (derrière Toi) */}
      <g transform={`translate(${FORET.buisson + bouge},${SOL + 6}) rotate(${bouge * 0.6})`}>
        {[-70, -30, 10, 50, -50, 30].map((dx, i) => (
          <circle key={i} cx={dx} cy={i < 4 ? -40 : -85} r={i < 4 ? 55 : 50} fill={mixColor('#03060a', '#1e3324', l)} />
        ))}
      </g>
      {buissonBouge !== undefined &&
        t >= buissonBouge &&
        t < buissonBouge + 40 &&
        [0, 1, 2, 3].map((i) => {
          const k = (t - buissonBouge) / 40;
          return <ellipse key={i} cx={FORET.buisson - 40 + i * 30 + k * 40 * (i % 2 ? 1 : -1)} cy={SOL - 120 + k * 120} rx={8} ry={4} fill={mixColor('#05080a', '#3a5a3a', l)} opacity={1 - k} transform={`rotate(${k * 200 + i * 40})`} />;
        })}
      {/* lueur du téléphone */}
      {lueur && lueur.force > 0 && <circle cx={lueur.x} cy={lueur.y} r={260} fill="url(#foret-lueur)" opacity={lueur.force} />}
      {children}
      {/* sapins au premier plan (très sombres) */}
      {[380, 2250, 3650, 4080].map((x, i) => (
        <g key={x}>
          <rect x={x - 34} y={0} width={68} height={SOL + 60} fill="#02040a" opacity={0.92} />
          <path d={`M${x - 34},${300 + i * 40} L${x - 260},${520 + i * 40} L${x - 34},${470 + i * 40} Z`} fill="#02040a" opacity={0.92} />
          <path d={`M${x + 34},${200 + i * 30} L${x + 230},${430 + i * 30} L${x + 34},${380 + i * 30} Z`} fill="#02040a" opacity={0.92} />
        </g>
      ))}
      {/* brume au sol */}
      {Array.from({length: 7}).map((_, i) => (
        <ellipse key={i} cx={((i * 700 - t * (0.6 + i * 0.07)) % (W + 900) + W + 900) % (W + 900) - 450} cy={SOL + 30} rx={600} ry={60} fill={brouillard} opacity={brume * 0.45} />
      ))}
      {/* obscurité */}
      <rect width={W} height={H} fill="#030614" opacity={(1 - l) * 0.55} />
    </svg>
  );
};

/** Vignette sombre plein écran (coordonnées écran) */
export const Vignette: React.FC<{force?: number; couleur?: string}> = ({force = 0.7, couleur = '0,0,0'}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 50%, rgba(${couleur},0) 45%, rgba(${couleur},${force}) 100%)`}} />
);
