import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, lerp, rand} from '../lib/anim';
import {C} from '../lib/fonts';

/* ------------------------------------------------------------------ */
/*  Personnage silhouette générique : tête ronde noire, grands yeux    */
/*  blancs, corps simple. Repère local : origine = sol sous le bassin, */
/*  y vers le bas, le personnage regarde vers +x (facing = 1).        */
/* ------------------------------------------------------------------ */

export type Base = 'debout' | 'assis' | 'marche';
export type Bras =
  | 'repos'
  | 'taper'
  | 'telephone'
  | 'panique'
  | 'pointer'
  | 'facepalm'
  | 'croises'
  | 'hanches'
  | 'cafe'
  | 'poser'
  | 'genoux'
  | 'leve'
  | 'coucou'
  | 'reflechit';
export type Expr =
  | 'neutre'
  | 'surpris'
  | 'panique'
  | 'fier'
  | 'coupable'
  | 'soulage'
  | 'triste'
  | 'concentre'
  | 'consterne'
  | 'curieux'
  | 'amuse'
  | 'fache';

export type Etape = {
  f: number;
  base?: Base;
  bras?: Bras;
  expr?: Expr;
  regard?: [number, number];
};

export type Tenue = {
  haut: string;
  hautOmbre: string;
  bas: string;
  basOmbre: string;
  chaussure: string;
  semelle: string;
  mancheCourte?: boolean;
  short?: boolean;
  claquettes?: boolean;
  capuche?: boolean;
  cheveux?: 'aucun' | 'bataille' | 'frises';
  badge?: boolean;
  tache?: boolean;
  chemise?: boolean;
};

type Angles = {
  hipY: number;
  lean: number;
  head: number;
  aB: [number, number];
  aF: [number, number];
  lB: [number, number];
  lF: [number, number];
};

const THIGH = 105;
const SHIN = 100;
const UPPER = 92;
const FORE = 86;
const TORSO = 170;
const R = 80; // rayon de la tête

const d2r = (d: number) => (d * Math.PI) / 180;
const pt = (o: [number, number], len: number, a: number): [number, number] => [
  o[0] + len * Math.sin(d2r(a)),
  o[1] + len * Math.cos(d2r(a)),
];

/* ----------------------------- poses ------------------------------ */

const baseAngles = (base: Base, t: number): Pick<Angles, 'hipY' | 'lean' | 'lB' | 'lF'> => {
  if (base === 'assis') {
    return {hipY: -128, lean: 4, lB: [84, 6], lF: [90, 2]};
  }
  if (base === 'marche') {
    const p = t * 0.42;
    const sw = Math.sin(p) * 28;
    const bendF = Math.max(0, -Math.sin(p)) * 40;
    const bendB = Math.max(0, Math.sin(p)) * 40;
    return {
      hipY: -222 + Math.abs(Math.cos(p)) * 7,
      lean: 5,
      lF: [sw, sw - bendF],
      lB: [-sw, -sw - bendB],
    };
  }
  return {hipY: -222, lean: 0, lB: [-3, -2], lF: [4, 3]};
};

const brasAngles = (bras: Bras, t: number, base: Base): Pick<Angles, 'aB' | 'aF'> => {
  const br = Math.sin(t * 0.08) * 2;
  switch (bras) {
    case 'taper': {
      const k1 = Math.sin(t * 1.9) * 7;
      const k2 = Math.sin(t * 1.9 + 2) * 7;
      return {aF: [42, 96 + k1], aB: [36, 92 + k2]};
    }
    case 'telephone':
      return {aF: [26 + br, 142], aB: [8, 4]};
    case 'panique': {
      const sh = Math.sin(t * 1.3) * 12;
      return {aF: [150 + sh, 172 + sh], aB: [142 - sh, 165 - sh]};
    }
    case 'pointer':
      return {aF: [92, 90], aB: [6, 2]};
    case 'facepalm':
      return {aF: [100, 205], aB: [6 + br, 2]};
    case 'croises':
      return {aF: [18, 102], aB: [14, 96]};
    case 'hanches':
      return {aF: [-32, 34], aB: [32, -34]};
    case 'cafe':
      return {aF: [22 + br, 120], aB: [5, 2]};
    case 'poser':
      return {aF: [60, 86], aB: [6, 3]};
    case 'genoux':
      return {aF: [55, 82], aB: [50, 78]};
    case 'leve':
      return {aF: [168, 176 + Math.sin(t * 0.5) * 6], aB: [6, 2]};
    case 'coucou':
      return {aF: [150, 165 + Math.sin(t * 0.7) * 22], aB: [6, 2]};
    case 'reflechit':
      return {aF: [40, 200], aB: [16, 100]};
    default:
      return base === 'marche'
        ? {aF: [-Math.sin(t * 0.42) * 22, -Math.sin(t * 0.42) * 22 + 10], aB: [Math.sin(t * 0.42) * 22, Math.sin(t * 0.42) * 22 + 10]}
        : {aF: [7 + br, 3], aB: [-6 - br, -2]};
  }
};

const anglesAt = (base: Base, bras: Bras, t: number): Angles => {
  const b = baseAngles(base, t);
  const a = brasAngles(bras, t, base);
  let lean = b.lean;
  if (bras === 'taper') lean += 6;
  if (bras === 'facepalm') lean += 6;
  return {...b, ...a, lean, head: 0};
};

const mixA = (A: Angles, B: Angles, k: number): Angles => {
  const m2 = (x: [number, number], y: [number, number]): [number, number] => [lerp(x[0], y[0], k), lerp(x[1], y[1], k)];
  return {
    hipY: lerp(A.hipY, B.hipY, k),
    lean: lerp(A.lean, B.lean, k),
    head: lerp(A.head, B.head, k),
    aB: m2(A.aB, B.aB),
    aF: m2(A.aF, B.aF),
    lB: m2(A.lB, B.lB),
    lF: m2(A.lF, B.lF),
  };
};

/* --------------------------- expressions -------------------------- */

type ExprDef = {
  eye: number; // échelle des yeux
  lid: number; // paupière supérieure 0..1
  browY: number;
  browA: number; // + = intérieur relevé (inquiet)
  mouth: 'none' | 'smile' | 'O' | 'frown' | 'flat' | 'wavy' | 'grin' | 'cri';
  pupil: number;
  happy?: boolean; // yeux fermés en arc
  sweat?: boolean;
  lookDown?: boolean;
};

const EXPR: Record<Expr, ExprDef> = {
  neutre: {eye: 1, lid: 0.08, browY: 0, browA: 0, mouth: 'none', pupil: 1},
  surpris: {eye: 1.22, lid: 0, browY: -12, browA: 4, mouth: 'O', pupil: 0.75},
  panique: {eye: 1.25, lid: 0, browY: -10, browA: 22, mouth: 'wavy', pupil: 0.55, sweat: true},
  fier: {eye: 1, lid: 0.3, browY: -4, browA: -6, mouth: 'grin', pupil: 1},
  coupable: {eye: 0.95, lid: 0.25, browY: -2, browA: 18, mouth: 'flat', pupil: 1, sweat: true},
  soulage: {eye: 1, lid: 0, browY: -4, browA: 10, mouth: 'smile', pupil: 1, happy: true},
  triste: {eye: 0.95, lid: 0.35, browY: 2, browA: 20, mouth: 'frown', pupil: 1, lookDown: true},
  concentre: {eye: 0.95, lid: 0.32, browY: 4, browA: -16, mouth: 'flat', pupil: 1},
  consterne: {eye: 1, lid: 0.5, browY: 2, browA: 0, mouth: 'flat', pupil: 0.9},
  curieux: {eye: 1.1, lid: 0, browY: -8, browA: -4, mouth: 'none', pupil: 1},
  amuse: {eye: 1, lid: 0.2, browY: -6, browA: 6, mouth: 'smile', pupil: 1},
  fache: {eye: 1.05, lid: 0.28, browY: 6, browA: -30, mouth: 'cri', pupil: 0.6},
};

/* ------------------------------ rendu ----------------------------- */

const Limb: React.FC<{a: [number, number]; b: [number, number]; w: number; c: string}> = ({a, b, w, c}) => (
  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth={w} strokeLinecap="round" />
);

export type PersonnageProps = {
  tenue: Tenue;
  timeline: Etape[];
  x: number;
  y: number;
  scale?: number;
  facing?: 1 | -1;
  saut?: number; // décalage vertical (sursaut), px
  tremble?: number;
  accessoire?: 'cafe' | 'telephone' | 'saladier' | null;
  ombre?: boolean;
  t0?: number;
  ecranTel?: string; // couleur de l'écran du téléphone tenu
  sac?: boolean; // sac à dos (randonnée)
  rotation?: number; // bascule autour des pieds (chute), en degrés
};

const resolve = (timeline: Etape[], frame: number) => {
  let base: Base = 'debout';
  let bras: Bras = 'repos';
  let expr: Expr = 'neutre';
  let regard: [number, number] = [0.4, 0];
  let prevBase: Base = base;
  let prevBras: Bras = bras;
  let since = -999;
  for (const e of timeline) {
    if (e.f > frame) break;
    if ((e.base && e.base !== base) || (e.bras && e.bras !== bras)) {
      prevBase = base;
      prevBras = bras;
      since = e.f;
    }
    if (e.base) base = e.base;
    if (e.bras) bras = e.bras;
    if (e.expr) expr = e.expr;
    if (e.regard) regard = e.regard;
  }
  return {base, bras, expr, regard, prevBase, prevBras, since};
};

export const Personnage: React.FC<PersonnageProps> = ({
  tenue,
  timeline,
  x,
  y,
  scale = 1,
  facing = 1,
  saut = 0,
  tremble = 0,
  accessoire = null,
  ombre = true,
  t0 = 0,
  ecranTel = '#60a5fa',
  sac = false,
  rotation = 0,
}) => {
  const frame = useCurrentFrame();
  const t = frame + t0;
  const st = resolve(timeline, frame);
  const k = clamp((frame - st.since) / 7);
  const kk = k * k * (3 - 2 * k);
  const A = mixA(anglesAt(st.prevBase, st.prevBras, t), anglesAt(st.base, st.bras, t), kk);
  const ex = EXPR[st.expr];

  // respiration
  const breath = Math.sin(t * 0.09) * 2.2;
  const shake = tremble ? Math.sin(t * 2.7) * tremble : 0;

  const hip: [number, number] = [0, A.hipY];
  const lean = A.lean;
  const neck = pt(hip, TORSO, 180 + lean);
  neck[1] += breath * 0.5;
  const shoulderF: [number, number] = [neck[0] + 12, neck[1] + 18];
  const shoulderB: [number, number] = [neck[0] - 16, neck[1] + 20];
  const headC = pt(neck, 72, 180 + lean * 1.4 + A.head);

  const hipF: [number, number] = [hip[0] + 10, hip[1]];
  const hipB: [number, number] = [hip[0] - 12, hip[1]];
  const kneeF = pt(hipF, THIGH, A.lF[0]);
  const footF = pt(kneeF, SHIN, A.lF[1]);
  const kneeB = pt(hipB, THIGH, A.lB[0]);
  const footB = pt(kneeB, SHIN, A.lB[1]);

  const elbF = pt(shoulderF, UPPER, A.aF[0] + lean);
  const handF = pt(elbF, FORE, A.aF[1] + lean);
  const elbB = pt(shoulderB, UPPER, A.aB[0] + lean);
  const handB = pt(elbB, FORE, A.aB[1] + lean);

  const sleeveFore = tenue.mancheCourte ? C.tete : tenue.haut;
  const sleeveForeB = tenue.mancheCourte ? '#0d0d14' : tenue.hautOmbre;
  const shinCol = tenue.short ? C.tete : tenue.bas;
  const shinColB = tenue.short ? '#0d0d14' : tenue.basOmbre;

  // clignement
  const blinkCycle = (t + Math.floor(rand(t0 + 3) * 50)) % 105;
  const blink = blinkCycle < 4 ? 1 - Math.abs(blinkCycle - 2) / 2 : 0;
  const lid = clamp(Math.max(ex.lid, blink));

  const shoe = (f: [number, number], back: boolean) => {
    if (tenue.claquettes) {
      return (
        <g>
          <rect x={f[0] - 18} y={f[1] + 6} width={56} height={10} rx={5} fill={tenue.semelle} />
          <rect x={f[0] - 6} y={f[1] - 2} width={24} height={10} rx={4} fill={back ? tenue.basOmbre : tenue.chaussure} />
        </g>
      );
    }
    return (
      <g>
        <rect x={f[0] - 22} y={f[1] - 8} width={58} height={26} rx={12} fill={back ? '#d9dbe4' : tenue.chaussure} />
        <rect x={f[0] - 22} y={f[1] + 10} width={58} height={8} rx={4} fill={tenue.semelle} />
      </g>
    );
  };

  /* ---------------- tête ---------------- */
  const gx = st.regard[0] * 7;
  const gy = (ex.lookDown ? 6 : 0) + st.regard[1] * 6;
  const eyes = [
    {cx: 6, cy: -4, inner: 1},
    {cx: 44, cy: -4, inner: -1},
  ];
  const head = (
    <g transform={`translate(${headC[0]},${headC[1]})`}>
      {tenue.capuche && <ellipse cx={-30} cy={22} rx={86} ry={80} fill={tenue.hautOmbre} />}
      {tenue.cheveux === 'bataille' && (
        <path
          d="M-70,-30 L-96,-58 L-62,-62 L-70,-100 L-34,-80 L-22,-120 L4,-88 L26,-124 L36,-84 L70,-106 L62,-64 L96,-62 L72,-36 Z"
          fill={C.tete}
        />
      )}
      {tenue.cheveux === 'frises' &&
        Array.from({length: 11}).map((_, i) => {
          const a = d2r(-170 + i * 16);
          return <circle key={i} cx={Math.cos(a) * 74} cy={Math.sin(a) * 74 - 4} r={24} fill={C.tete} />;
        })}
      <circle r={R} fill={C.tete} />
      <ellipse cx={-26} cy={-34} rx={22} ry={13} fill="#ffffff" opacity={0.07} transform="rotate(-30 -26 -34)" />
      {eyes.map((e, i) => {
        const rx = 17 * ex.eye;
        const ry = 23 * ex.eye;
        if (ex.happy) {
          return (
            <path
              key={i}
              d={`M${e.cx - rx},${e.cy + 4} Q${e.cx},${e.cy - ry} ${e.cx + rx},${e.cy + 4}`}
              stroke="#fff"
              strokeWidth={7}
              fill="none"
              strokeLinecap="round"
            />
          );
        }
        const pr = 7.5 * ex.pupil;
        return (
          <g key={i}>
            <ellipse cx={e.cx} cy={e.cy} rx={rx} ry={ry} fill="#fff" />
            <circle cx={e.cx + gx + 2} cy={e.cy + gy + 3} r={pr} fill={C.tete} />
            <circle cx={e.cx + gx + 4} cy={e.cy + gy} r={pr * 0.3} fill="#fff" />
            {lid > 0.01 && (
              <rect x={e.cx - rx - 2} y={e.cy - ry - 2} width={rx * 2 + 4} height={(ry * 2 + 4) * lid} fill={C.tete} />
            )}
          </g>
        );
      })}
      {!ex.happy &&
        eyes.map((e, i) => {
          const by = e.cy - 34 * ex.eye + ex.browY;
          const ang = ex.browA * e.inner;
          return (
            <line
              key={`b${i}`}
              x1={e.cx - 15}
              y1={by}
              x2={e.cx + 15}
              y2={by}
              stroke="#fff"
              strokeWidth={6.5}
              strokeLinecap="round"
              transform={`rotate(${-ang} ${e.cx} ${by})`}
            />
          );
        })}
      <g transform="translate(26,44)">
        {ex.mouth === 'smile' && <path d="M-13,-3 Q0,10 13,-3" stroke="#fff" strokeWidth={5.5} fill="none" strokeLinecap="round" />}
        {ex.mouth === 'grin' && <path d="M-15,-5 Q0,16 15,-5 Z" fill="#fff" />}
        {ex.mouth === 'O' && <ellipse rx={9} ry={12} fill="#fff" />}
        {ex.mouth === 'cri' && (
          <g>
            <path d="M-26,-8 Q0,-14 26,-8 Q22,30 0,32 Q-22,30 -26,-8 Z" fill="#fff" />
            <path d="M-12,20 Q0,10 12,20 Q6,28 0,28 Q-6,28 -12,20 Z" fill="#ef4444" />
            {[-18, -6, 6, 18].map((x) => (
              <path key={x} d={`M${x - 5},-9 L${x},0 L${x + 5},-9 Z`} fill={C.tete} />
            ))}
          </g>
        )}
        {ex.mouth === 'frown' && <path d="M-12,6 Q0,-6 12,6" stroke="#fff" strokeWidth={5.5} fill="none" strokeLinecap="round" />}
        {ex.mouth === 'flat' && <line x1={-10} y1={2} x2={10} y2={2} stroke="#fff" strokeWidth={5.5} strokeLinecap="round" />}
        {ex.mouth === 'wavy' && (
          <path d="M-16,4 q4,-8 8,0 q4,8 8,0 q4,-8 8,0 q4,8 8,0" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" />
        )}
      </g>
      {ex.sweat && (
        <path
          d={`M${-66},${-30 + ((t * 1.2) % 30)} q-9,14 0,18 q9,-4 0,-18 Z`}
          fill="#7dd3fc"
          opacity={0.9}
        />
      )}
    </g>
  );

  /* ---------------- torse ---------------- */
  const torso = (
    <g transform={`translate(${hip[0]},${hip[1]}) rotate(${-lean})`}>
      {sac && (
        <g>
          <rect x={-96} y={-158} width={62} height={146} rx={18} fill="#9a3412" />
          <rect x={-104} y={-90} width={30} height={62} rx={10} fill="#7c2d12" />
          <rect x={-90} y={-170} width={48} height={22} rx={10} fill="#7c2d12" />
        </g>
      )}
      <path
        d={`M-50,8 L-56,${-TORSO + 40} Q-56,${-TORSO - 4} -10,${-TORSO - 4} L18,${-TORSO - 4} Q60,${-TORSO - 4} 58,${-TORSO + 40} L52,8 Q0,20 -50,8 Z`}
        fill={tenue.haut}
      />
      {/* ombre latérale */}
      <path d={`M-50,8 L-56,${-TORSO + 40} Q-56,${-TORSO} -30,${-TORSO - 2} L-34,10 Z`} fill={tenue.hautOmbre} opacity={0.8} />
      {tenue.capuche && (
        <>
          <path d={`M-20,-60 L24,-60 L28,-22 L-24,-22 Z`} fill={tenue.hautOmbre} opacity={0.7} />
          <line x1={-4} y1={-TORSO + 6} x2={-6} y2={-TORSO + 58} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
          <line x1={16} y1={-TORSO + 6} x2={18} y2={-TORSO + 52} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
        </>
      )}
      {tenue.chemise && (
        <>
          <path d={`M-14,${-TORSO - 2} L4,${-TORSO + 26} L22,${-TORSO - 2}`} fill="#e8eefc" stroke={tenue.hautOmbre} strokeWidth={3} />
          <line x1={4} y1={-TORSO + 26} x2={4} y2={6} stroke={tenue.hautOmbre} strokeWidth={3} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={10} cy={-TORSO + 50 + i * 36} r={3.2} fill="#e8eefc" />
          ))}
          <path d={`M-40,-70 l18,10 M28,-40 l16,-8 M-30,-20 l14,6`} stroke={tenue.hautOmbre} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
      {tenue.tache && (
        <>
          <path d="M8,-80 q12,-10 22,2 q8,12 -6,16 q-14,6 -18,-6 q-4,-6 2,-12 Z" fill="#b7791f" opacity={0.75} />
          <circle cx={-14} cy={-46} r={6} fill="#b7791f" opacity={0.7} />
        </>
      )}
      {tenue.badge && (
        <>
          <path d={`M-12,${-TORSO} L22,-74 L40,${-TORSO}`} stroke="#ef4444" strokeWidth={3.5} fill="none" />
          <rect x={10} y={-80} width={26} height={34} rx={4} fill="#fff" />
          <rect x={10} y={-80} width={26} height={10} rx={3} fill="#2563eb" />
          <rect x={15} y={-64} width={16} height={3} fill="#94a3b8" />
          <rect x={15} y={-57} width={12} height={3} fill="#94a3b8" />
        </>
      )}
      {sac && <path d={`M14,${-TORSO + 2} Q22,-110 18,-40`} stroke="#7c2d12" strokeWidth={10} fill="none" strokeLinecap="round" />}
      {/* ceinture / bas du haut */}
      <rect x={-52} y={0} width={106} height={22} rx={10} fill={tenue.bas} />
    </g>
  );

  const cafe = (h: [number, number]) => (
    <g transform={`translate(${h[0] + 4},${h[1] - 30})`}>
      <path d="M-16,0 L16,0 L12,40 L-12,40 Z" fill="#fff" />
      <rect x={-15} y={12} width={30} height={14} fill="#a16207" />
      <rect x={-18} y={-6} width={36} height={8} rx={3} fill="#e5e7eb" />
      {[0, 1].map((i) => (
        <path
          key={i}
          d={`M${-6 + i * 12},-12 q-7,-10 0,-20 q7,-10 0,-20`}
          stroke="#fff"
          strokeWidth={3}
          fill="none"
          opacity={0.5 + 0.3 * Math.sin(t * 0.2 + i)}
          strokeLinecap="round"
        />
      ))}
    </g>
  );

  const phone = (h: [number, number]) => (
    <g transform={`translate(${h[0] + 6},${h[1] - 26}) rotate(${-8})`}>
      <rect x={-15} y={-28} width={30} height={54} rx={6} fill="#1f2937" stroke="#9ca3af" strokeWidth={2} />
      <rect x={-12} y={-24} width={24} height={44} rx={3} fill={ecranTel} opacity={0.9} />
    </g>
  );

  const showPhone = accessoire === 'telephone' || st.bras === 'telephone';
  const showSaladier = accessoire === 'saladier';
  const showCafe = !showSaladier && (accessoire === 'cafe' || st.bras === 'cafe');
  const saladier = (h: [number, number]) => (
    <g transform={`translate(${h[0] + 10},${h[1] - 6})`}>
      <ellipse cx={0} cy={-18} rx={62} ry={18} fill="#fefce8" />
      {Array.from({length: 14}).map((_, i) => (
        <ellipse key={i} cx={-48 + i * 7.5} cy={-24 - Math.sin(i * 1.3) * 7} rx={5} ry={3} fill="#fff" stroke="#e7e5e4" strokeWidth={1} />
      ))}
      <path d="M-66,-18 Q-60,34 0,36 Q60,34 66,-18 Z" fill="#ef4444" />
      <path d="M-50,0 Q0,14 50,0" stroke="#fff" strokeWidth={5} fill="none" opacity={0.6} />
    </g>
  );

  return (
    <g transform={`translate(${x + shake},${y - saut}) rotate(${rotation * facing}) scale(${scale * facing},${scale})`}>
      {ombre && <ellipse cx={st.base === 'assis' ? 40 : 6} cy={6} rx={st.base === 'assis' ? 110 : 80} ry={14} fill="#000" opacity={0.18} />}
      {/* bras arrière */}
      <Limb a={shoulderB} b={elbB} w={30} c={tenue.hautOmbre} />
      <Limb a={elbB} b={handB} w={27} c={sleeveForeB} />
      <circle cx={handB[0]} cy={handB[1]} r={16} fill="#0d0d14" />
      {/* jambe arrière */}
      <Limb a={hipB} b={kneeB} w={40} c={tenue.basOmbre} />
      <Limb a={kneeB} b={footB} w={36} c={shinColB} />
      {shoe(footB, true)}
      {torso}
      {/* jambe avant */}
      <Limb a={hipF} b={kneeF} w={40} c={tenue.bas} />
      <Limb a={kneeF} b={footF} w={36} c={shinCol} />
      {shoe(footF, false)}
      {head}
      {/* bras avant */}
      <Limb a={shoulderF} b={elbF} w={30} c={tenue.haut} />
      <Limb a={elbF} b={handF} w={27} c={sleeveFore} />
      {showCafe && cafe(handF)}
      {showSaladier && saladier(handF)}
      <circle cx={handF[0]} cy={handF[1]} r={17} fill={C.tete} />
      {showPhone && phone(handF)}
    </g>
  );
};
