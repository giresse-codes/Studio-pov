import React from 'react';
import {useCurrentFrame} from 'remotion';
import {mixColor, rand} from '../lib/anim';
import {FONT} from '../lib/fonts';
import {Coupe, Eclairage, Ecran, Etagere, Fenetre, Guirlande, Parquet, Plante, Poster, Suspension, Tapis} from './elements';

/*
 * Appartement de la coloc (Astuces) : salon-coloc (x 0 → 1700) et cuisine-coloc (x 1700 → 3400),
 * côte à côte en coupe, séparés par un mur avec une porte. La caméra glisse d'une pièce à l'autre.
 */
export const APPART = {
  W: 3400,
  H: 1920,
  PLAFOND: 300,
  SOL: 1500,
  canape: {x: 640, y: 1500}, // place assise de Toi
  porte: {x: 1700},
  evier: {x: 2440, y: 1258, w: 320, h: 120}, // cuve (vue en coupe)
  frigo: {x: 3060},
};

/* ----------------------------- SALON ----------------------------- */
export const SalonColoc: React.FC<{jour: number; t: number; tele?: React.ReactNode}> = ({jour, t, tele}) => {
  const {PLAFOND, SOL} = APPART;
  const mur = mixColor('#6b4a7a', '#f2a7a0', jour);
  const murBas = mixColor('#5a3d68', '#e0857c', jour);
  return (
    <g>
      <rect x={0} y={PLAFOND} width={1700} height={SOL - PLAFOND} fill={mur} />
      <rect x={0} y={1190} width={1700} height={SOL - 1190} fill={murBas} />
      <rect x={0} y={1180} width={1700} height={12} fill="#fff" opacity={0.35} />
      <Parquet x={0} y={SOL} w={1700} h={70} c="#c08552" />
      <rect x={0} y={SOL - 20} width={1700} height={20} fill="#fff" opacity={0.4} />
      <Fenetre x={150} y={500} w={380} h={440} jour={jour} t={t} id="salon" rideau="#2ec4b6" />
      <path d={`M150,${SOL} L530,${SOL} L760,${SOL + 70} L330,${SOL + 70} Z`} fill="#fff6c8" opacity={jour * 0.3} />
      <Guirlande x1={620} x2={1640} y={400} sag={46} jour={jour} t={t} />
      <Poster x={700} y={520} w={230} h={300} fond="#ffd166" rot={-3}>
        <circle cx={115} cy={120} r={70} fill="#ef476f" />
        <path d="M80,120 L105,145 L155,95" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" />
        <text x={115} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={36} fill="#3d2c2e">
          CHILL
        </text>
      </Poster>
      <Poster x={980} y={560} w={170} h={220} fond="#118ab2" rot={4}>
        <path d="M20,180 L70,90 L100,140 L130,70 L160,180 Z" fill="#06d6a0" />
        <circle cx={130} cy={50} r={20} fill="#ffd166" />
      </Poster>
      <Etagere x={1220} y={760} w={330} />
      {/* meuble TV + télé */}
      <g>
        <rect x={1180} y={1360} width={420} height={140} rx={10} fill="#8d5a3b" />
        <rect x={1200} y={1380} width={180} height={100} rx={6} fill="#a86e48" />
        <rect x={1400} y={1380} width={180} height={100} rx={6} fill="#a86e48" />
        <rect x={1240} y={1420} width={100} height={30} rx={6} fill="#222" />
        <circle cx={1260} cy={1435} r={5} fill="#22c55e" />
        <Ecran x={1210} y={1110} w={360} h={210} glow={0.4 + (1 - jour) * 0.6} pied>
          {tele ?? (
            <g>
              <rect width={360} height={210} fill="#7dd3fc" />
              <rect y={150} width={360} height={60} fill="#4ade80" />
              <circle cx={60 + ((t * 3) % 300)} cy={140 - Math.abs(Math.sin(t * 0.2)) * 60} r={18} fill="#ef4444" />
              <rect x={240} y={100} width={40} height={50} fill="#a16207" />
              <circle cx={300} cy={40} r={22} fill="#fde047" />
            </g>
          )}
        </Ecran>
      </g>
      <Plante x={1630} y={1500} s={0.9} t={t} pot="#ef476f" />
      <Tapis x={300} y={1525} w={800} c1="#ffd166" c2="#06d6a0" />
      {/* lampadaire */}
      <g>
        <rect x={86} y={1080} width={10} height={420} fill="#333" />
        <ellipse cx={91} cy={1500} rx={50} ry={10} fill="#333" />
        <path d="M40,1080 L142,1080 L120,1000 L62,1000 Z" fill="#ffd166" />
      </g>
      {/* canapé */}
      <g>
        <ellipse cx={640} cy={1505} rx={360} ry={16} fill="#000" opacity={0.18} />
        <rect x={300} y={1150} width={700} height={240} rx={50} fill="#3a86ff" />
        <rect x={300} y={1150} width={700} height={60} rx={30} fill="#5b9bff" />
        <rect x={340} y={1372} width={620} height={90} rx={26} fill="#2f6fe0" />
        <rect x={350} y={1362} width={300} height={40} rx={20} fill="#4c8dff" />
        <rect x={660} y={1362} width={290} height={40} rx={20} fill="#4c8dff" />
        <rect x={270} y={1260} width={90} height={210} rx={40} fill="#2f6fe0" />
        <rect x={940} y={1260} width={90} height={210} rx={40} fill="#2f6fe0" />
        <rect x={320} y={1460} width={24} height={40} fill="#5b3a29" />
        <rect x={960} y={1460} width={24} height={40} fill="#5b3a29" />
        {/* coussins */}
        <rect x={380} y={1230} width={130} height={110} rx={30} fill="#ffbe0b" transform="rotate(-8 445 1285)" />
        <rect x={830} y={1236} width={120} height={100} rx={30} fill="#ff006e" transform="rotate(6 890 1286)" />
      </g>
      {/* table basse : chips + manette */}
      <g>
        <rect x={1040} y={1400} width={120} height={14} rx={6} fill="#8d5a3b" />
        <rect x={1050} y={1414} width={10} height={86} fill="#5b3a29" />
        <rect x={1140} y={1414} width={10} height={86} fill="#5b3a29" />
        <path d="M1060,1400 Q1100,1370 1140,1400 Z" fill="#f4a261" />
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={1080 + i * 20} cy={1386 - (i % 2) * 6} rx={12} ry={7} fill="#ffd166" />
        ))}
      </g>
      <Suspension x={650} y={PLAFOND} long={110} jour={jour} c="#ff006e" />
    </g>
  );
};

/* ----------------------------- CUISINE ----------------------------- */
export const CuisineColoc: React.FC<{jour: number; t: number; evier?: React.ReactNode; mousse?: number; riz?: boolean}> = ({jour, t, evier, mousse = 0.3, riz = true}) => {
  const {PLAFOND, SOL, evier: E} = APPART;
  const X = 1700;
  const mur = mixColor('#3f6a5c', '#bfe3c9', jour);
  return (
    <g>
      <rect x={X} y={PLAFOND} width={1700} height={SOL - PLAFOND} fill={mur} />
      {/* crédence en carreaux */}
      <rect x={1900} y={960} width={1120} height={300} fill="#fff" />
      {Array.from({length: 6}).map((_, r) =>
        Array.from({length: 19}).map((__, c) => (
          <rect key={`${r}-${c}`} x={1902 + c * 59} y={962 + r * 50} width={55} height={46} rx={4} fill={(r + c) % 2 ? '#e0f2fe' : '#bae6fd'} />
        )),
      )}
      {/* placards hauts */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={1920 + i * 270} y={520} width={250} height={300} rx={10} fill="#f4a261" />
          <rect x={1940 + i * 270} y={540} width={210} height={260} rx={8} fill="#f7b77a" />
          <rect x={1920 + i * 270 + (i % 2 ? 30 : 200)} y={650} width={14} height={60} rx={6} fill="#5b3a29" />
        </g>
      ))}
      {/* étagère à épices + casseroles */}
      <rect x={2020} y={900} width={300} height={12} rx={4} fill="#8d5a3b" />
      {['#ef4444', '#facc15', '#22c55e', '#a855f7'].map((c, i) => (
        <g key={c}>
          <rect x={2040 + i * 70} y={846} width={44} height={54} rx={8} fill="#fff" opacity={0.85} />
          <rect x={2040 + i * 70} y={866} width={44} height={34} rx={6} fill={c} />
          <rect x={2044 + i * 70} y={838} width={36} height={12} rx={3} fill="#5b3a29" />
        </g>
      ))}
      {/* frigo */}
      <g>
        <ellipse cx={3175} cy={1505} rx={150} ry={12} fill="#000" opacity={0.15} />
        <rect x={3060} y={880} width={230} height={620} rx={24} fill="#e5e7eb" />
        <rect x={3060} y={1080} width={230} height={8} fill="#9ca3af" />
        <rect x={3080} y={960} width={12} height={90} rx={6} fill="#9ca3af" />
        <rect x={3080} y={1120} width={12} height={140} rx={6} fill="#9ca3af" />
        {/* magnets + dessin */}
        <rect x={3150} y={930} width={90} height={110} fill="#fff" transform="rotate(5 3195 985)" />
        <circle cx={3190} cy={975} r={22} fill="#facc15" />
        <circle cx={3240} cy={1150} r={14} fill="#ef4444" />
        <circle cx={3160} cy={1200} r={14} fill="#3b82f6" />
      </g>
      {/* plaques + casserole */}
      <g>
        <rect x={1900} y={1258} width={360} height={242} fill="#e76f51" />
        <rect x={1890} y={1240} width={380} height={24} rx={6} fill="#264653" />
        <rect x={1930} y={1300} width={300} height={170} rx={10} fill="#d65f43" />
        <rect x={1960} y={1330} width={240} height={30} rx={6} fill="#1f2937" />
        <path d="M1960,1240 L1960,1170 Q1960,1150 1980,1150 L2120,1150 Q2140,1150 2140,1170 L2140,1240 Z" fill="#9ca3af" />
        <rect x={2140} y={1170} width={70} height={12} rx={6} fill="#374151" />
        {[0, 1].map((i) => (
          <path key={i} d={`M${2010 + i * 50},1140 q-10,-20 0,-40 q10,-20 0,-40`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.4 + 0.3 * Math.sin(t * 0.2 + i)} />
        ))}
      </g>
      {/* plan de travail + évier */}
      <g>
        <rect x={2270} y={1258} width={770} height={242} fill="#e76f51" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={2290 + i * 250} y={1390} width={230} height={95} rx={8} fill="#d65f43" />
            <rect x={2380 + i * 250} y={1400} width={50} height={10} rx={5} fill="#5b3a29" />
          </g>
        ))}
        {/* cuve de l'évier en coupe : fond, eau, contenu, reflet */}
        <rect x={E.x} y={E.y} width={E.w} height={E.h} rx={12} fill="#94a3b8" />
        <rect x={E.x + 10} y={E.y + 4} width={E.w - 20} height={E.h - 14} rx={10} fill="#cbd5e1" />
        <rect x={E.x + 10} y={E.y + 18} width={E.w - 20} height={E.h - 28} rx={8} fill="#7dd3fc" opacity={0.75} />
        {/* assiettes empilées */}
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={E.x + 250} cy={E.y + 86 - i * 12} rx={50} ry={9} fill="#fff" stroke="#cbd5e1" strokeWidth={2} />
        ))}
        {evier}
        {/* bulles */}
        {Array.from({length: 9}).map((_, i) => {
          const by = E.y + E.h - 14 - (((t * (1 + rand(i) * 1.5)) + rand(i + 3) * 100) % (E.h - 20));
          return <circle key={i} cx={E.x + 30 + rand(i + 9) * (E.w - 60)} cy={by} r={4 + rand(i + 2) * 5} fill="#fff" opacity={0.7} />;
        })}
        <rect x={E.x + 10} y={E.y + 18} width={E.w - 20} height={E.h - 28} rx={8} fill="#bae6fd" opacity={0.25} />
        <path d={`M${E.x + 20},${E.y + 30} L${E.x + 60},${E.y + 30} L${E.x + 30},${E.y + 90} Z`} fill="#fff" opacity={0.25} />
        {/* mousse */}
        {Array.from({length: 12}).map((_, i) => (
          <circle
            key={i}
            cx={E.x + 10 + i * ((E.w - 20) / 11)}
            cy={E.y + 16 - Math.sin(i * 1.7 + t * 0.1) * 6 - mousse * 30 * (0.6 + rand(i) * 0.6)}
            r={14 + mousse * 22 * rand(i + 4)}
            fill="#ffffff"
            opacity={0.95}
          />
        ))}
        {/* robinet */}
        <path d={`M${E.x + 150},${E.y} L${E.x + 150},${E.y - 110} Q${E.x + 150},${E.y - 150} ${E.x + 110},${E.y - 150} L${E.x + 80},${E.y - 150}`} stroke="#9ca3af" strokeWidth={16} fill="none" strokeLinecap="round" />
        <rect x={E.x + 170} y={E.y - 40} width={34} height={14} rx={6} fill="#9ca3af" />
        <rect x={2260} y={1240} width={790} height={24} rx={6} fill="#264653" />
        {/* éponge + liquide vaisselle */}
        <rect x={2790} y={1210} width={60} height={30} rx={6} fill="#facc15" />
        <rect x={2790} y={1200} width={60} height={12} rx={4} fill="#22c55e" />
        <path d="M2880,1240 L2880,1150 Q2880,1130 2900,1130 L2920,1130 Q2940,1130 2940,1150 L2940,1240 Z" fill="#4ade80" />
        <rect x={2900} y={1110} width={20} height={22} fill="#16a34a" />
        {/* paquet de riz */}
        {riz && (
          <g>
            <path d="M2960,1240 L2965,1120 L3030,1120 L3035,1240 Z" fill="#fef3c7" stroke="#d97706" strokeWidth={4} />
            <text x={2998} y={1190} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill="#b45309">
              RIZ
            </text>
          </g>
        )}
      </g>
      <Plante x={1820} y={1500} s={0.8} t={t} pot="#2a9d8f" />
      <Suspension x={2600} y={PLAFOND} long={180} jour={jour} c="#2a9d8f" />
    </g>
  );
};

/* ------------------------- appartement complet ------------------------- */
export const AppartColoc: React.FC<{
  jour: number;
  tele?: React.ReactNode;
  evier?: React.ReactNode;
  mousse?: number;
  riz?: boolean;
  children?: React.ReactNode;
}> = ({jour, tele, evier, mousse, riz, children}) => {
  const t = useCurrentFrame();
  const {W, H, PLAFOND, SOL, porte} = APPART;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <SalonColoc jour={jour} t={t} tele={tele} />
      <CuisineColoc jour={jour} t={t} evier={evier} mousse={mousse} riz={riz} />
      {/* mur de séparation avec porte ouverte */}
      <g>
        <rect x={porte.x - 24} y={PLAFOND} width={48} height={780} fill="#3a3350" />
        <rect x={porte.x - 40} y={1060} width={80} height={16} fill="#8d5a3b" />
        <rect x={porte.x - 34} y={1076} width={10} height={SOL - 1076} fill="#8d5a3b" />
        <rect x={porte.x + 24} y={1076} width={10} height={SOL - 1076} fill="#8d5a3b" />
        <path d={`M${porte.x + 30},1076 L${porte.x + 110},1100 L${porte.x + 110},${SOL + 10} L${porte.x + 30},${SOL}`} fill="#b07a52" />
        <circle cx={porte.x + 96} cy={1300} r={8} fill="#facc15" />
      </g>
      {children}
      <Eclairage
        w={W}
        h={H}
        jour={jour}
        id="appart"
        lampes={[
          {x: 650, y: 520, r: 360},
          {x: 1390, y: 1215, r: 360},
          {x: 91, y: 1050, r: 260},
          {x: 2600, y: 560, r: 380},
        ]}
      />
      <Coupe w={W} plafond={PLAFOND} sol={SOL} couleur="#2b2238" />
    </svg>
  );
};
