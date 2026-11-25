import React from 'react';
import {POLICE, POLICE_CODE} from '../lib/theme';

/** Contenus d'écran de PC (SVG, repère w x h) réutilisables pour DevsTeach */

/** Barre de navigateur */
export const BarreNavigateur: React.FC<{w: number; url: string}> = ({w, url}) => (
  <g>
    <rect x={0} y={0} width={w} height={26} fill="#e6e7ee" />
    <circle cx={12} cy={13} r={5} fill="#ff5f56" /><circle cx={28} cy={13} r={5} fill="#ffbd2e" /><circle cx={44} cy={13} r={5} fill="#27c93f" />
    <rect x={62} y={5} width={w - 80} height={16} rx={8} fill="#ffffff" />
    <text x={74} y={17} fontFamily={POLICE} fontWeight={700} fontSize={11} fill="#555">🔒 {url}</text>
  </g>
);

export type LigneCode = {t: string; c?: string}[];

/** Éditeur de code sombre : lignes colorées, une ligne surlignée en option */
export const EditeurCode: React.FC<{w: number; h: number; fichier: string; lignes: LigneCode[]; surligne?: number; taille?: number; visibles?: number}> = ({
  w, h, fichier, lignes, surligne, taille = 17, visibles,
}) => (
  <g>
    <rect x={0} y={0} width={w} height={h} fill="#1e1f2e" />
    <rect x={0} y={0} width={w} height={26} fill="#2a2c40" />
    <circle cx={12} cy={13} r={5} fill="#ff5f56" /><circle cx={28} cy={13} r={5} fill="#ffbd2e" /><circle cx={44} cy={13} r={5} fill="#27c93f" />
    <rect x={62} y={4} width={110} height={22} rx={4} fill="#1e1f2e" />
    <text x={72} y={20} fontFamily={POLICE_CODE} fontSize={12} fontWeight={700} fill="#c9cde0">{fichier}</text>
    {lignes.slice(0, visibles ?? lignes.length).map((l, i) => {
      const y = 50 + i * (taille + 9);
      return (
        <g key={i}>
          {surligne === i && <rect x={30} y={y - taille} width={w - 36} height={taille + 8} rx={4} fill="#ffd23f" opacity={0.18} />}
          <text x={10} y={y} fontFamily={POLICE_CODE} fontSize={taille - 4} fill="#5c6080">{i + 1}</text>
          <text x={34} y={y} fontFamily={POLICE_CODE} fontWeight={700} fontSize={taille} style={{whiteSpace: 'pre'}}>
            {l.map((m, k) => <tspan key={k} fill={m.c ?? '#e6e8ff'}>{m.t}</tspan>)}
          </text>
        </g>
      );
    })}
  </g>
);

/** Page du site avec un grand titre (taille du titre en px du repère) ; photos : 'ok' | 'cassees' */
export const SiteTitre: React.FC<{w: number; h: number; titre: string; tailleTitre: number; photos?: 'ok' | 'cassees' | 'aucune'; couleurTitre?: string}> = ({
  w, h, titre, tailleTitre, photos = 'aucune', couleurTitre = '#3b2418',
}) => (
  <g>
    <rect x={0} y={0} width={w} height={h} fill="#fff4e6" />
    <BarreNavigateur w={w} url="cafe-paname.fr" />
    <rect x={0} y={26} width={w} height={32} fill="#3b2418" />
    <text x={14} y={48} fontFamily={POLICE} fontWeight={900} fontSize={14} fill="#ffd9a8">☕ Café Paname</text>
    <text x={w / 2} y={70 + tailleTitre * 0.85} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={tailleTitre} fill={couleurTitre}>{titre}</text>
    {[0, 1, 2].map((i) => <rect key={i} x={30} y={90 + tailleTitre + i * 14} width={i === 2 ? 200 : w - 60} height={7} rx={3} fill="#d9c3ab" />)}
    {photos !== 'aucune' && [0, 1, 2].map((i) => {
      const cw = (w - 60) / 3;
      const x = 20 + i * (cw + 10);
      const y = h - 86;
      return photos === 'ok' ? (
        <g key={i}>
          <rect x={x} y={y} width={cw} height={70} rx={8} fill={['#ffb88a', '#a8d8ff', '#c9f2b0'][i]} />
          <text x={x + cw / 2} y={y + 46} textAnchor="middle" fontSize={30}>{['☕', '🥐', '🍰'][i]}</text>
        </g>
      ) : (
        <g key={i}>
          <rect x={x} y={y} width={cw} height={70} rx={8} fill="#ffffff" stroke="#c9cde0" strokeWidth={2} strokeDasharray="5 4" />
          <text x={x + cw / 2} y={y + 44} textAnchor="middle" fontSize={26}>🖼️</text>
          <path d={`M${x + cw / 2 - 18},${y + 20} L${x + cw / 2 + 18},${y + 52} M${x + cw / 2 + 18},${y + 20} L${x + cw / 2 - 18},${y + 52}`} stroke="#ff4757" strokeWidth={5} strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);
