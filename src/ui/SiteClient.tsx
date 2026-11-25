import React from 'react';
import {interpolate} from 'remotion';
import {clamp, mix} from '../lib/anim';
import {POLICE} from '../lib/theme';

/**
 * Le site du client « Café Paname » affiché dans un navigateur (repère w x h, SVG).
 * style = 0 : page sans CSS (texte noir, fond blanc, Times, liens bleus soulignés)
 * style = 1 : page habillée (couleurs, boutons, mise en page) — les éléments apparaissent en cascade.
 */
export const SiteClient: React.FC<{w: number; h: number; style: number; frame?: number; url?: string}> = ({w, h, style, url = 'cafe-paname.fr'}) => {
  const etape = (i: number) => interpolate(style, [i * 0.18, i * 0.18 + 0.28], [0, 1], clamp);
  const fond = etape(0), header = etape(1), bouton = etape(2), cartes = etape(3);
  const serif = "'Liberation Serif', 'Times New Roman', serif";
  const barre = 26;
  return (
    <g>
      {/* navigateur */}
      <rect x={0} y={0} width={w} height={barre} fill="#e6e7ee" />
      <circle cx={12} cy={13} r={5} fill="#ff5f56" /><circle cx={28} cy={13} r={5} fill="#ffbd2e" /><circle cx={44} cy={13} r={5} fill="#27c93f" />
      <rect x={62} y={5} width={w - 80} height={16} rx={8} fill="#ffffff" />
      <text x={74} y={17} fontFamily={POLICE} fontWeight={700} fontSize={11} fill="#555">🔒 {url}</text>
      <g transform={`translate(0,${barre})`}>
        <rect x={0} y={0} width={w} height={h - barre} fill={mix('#ffffff', '#fff4e6', fond)} />
        {/* version sans style */}
        <g opacity={1 - fond}>
          <text x={10} y={34} fontFamily={serif} fontWeight={700} fontSize={30} fill="#000">Café Paname</text>
          <text x={10} y={62} fontFamily={serif} fontSize={14} fill="#000">Bienvenue au Café Paname, le meilleur café du quartier.</text>
          <text x={10} y={82} fontFamily={serif} fontSize={14} fill="#000">Nos horaires : du lundi au samedi, de 8 h à 19 h.</text>
          <text x={10} y={112} fontFamily={serif} fontWeight={700} fontSize={20} fill="#000">Notre carte</text>
          <text x={10} y={136} fontFamily={serif} fontSize={14} fill="#000">• Expresso — 2 €</text>
          <text x={10} y={156} fontFamily={serif} fontSize={14} fill="#000">• Cappuccino — 3,50 €</text>
          <text x={10} y={176} fontFamily={serif} fontSize={14} fill="#000">• Croissant — 1,20 €</text>
          <text x={10} y={206} fontFamily={serif} fontSize={14} fill="#0000ee" textDecoration="underline">Commander</text>
          <text x={100} y={206} fontFamily={serif} fontSize={14} fill="#551a8b" textDecoration="underline">Contact</text>
          <rect x={10} y={218} width={90} height={36} fill="none" stroke="#999" strokeDasharray="3 3" />
          <text x={16} y={240} fontFamily={serif} fontSize={11} fill="#666">[image]</text>
        </g>
        {/* version habillée */}
        <g opacity={header} transform={`translate(0,${(1 - header) * -20})`}>
          <rect x={0} y={0} width={w} height={40} fill="#3b2418" />
          <text x={16} y={27} fontFamily={POLICE} fontWeight={900} fontSize={18} fill="#ffd9a8">☕ Café Paname</text>
          {['Carte', 'Horaires', 'Contact'].map((t, i) => (
            <text key={t} x={w - 210 + i * 70} y={26} fontFamily={POLICE} fontWeight={700} fontSize={13} fill="#fff">{t}</text>
          ))}
          <rect x={0} y={40} width={w} height={110} fill="url(#hero-paname)" />
          <defs>
            <linearGradient id="hero-paname" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff8a5c" />
              <stop offset="1" stopColor="#c0396b" />
            </linearGradient>
          </defs>
          <text x={20} y={88} fontFamily={POLICE} fontWeight={900} fontSize={30} fill="#fff">Le meilleur café</text>
          <text x={20} y={118} fontFamily={POLICE} fontWeight={900} fontSize={30} fill="#ffd9a8">du quartier.</text>
          <g transform={`translate(${w - 140},70) scale(${0.6 + bouton * 0.4})`} opacity={bouton}>
            <rect x={0} y={0} width={120} height={44} rx={22} fill="#ffd23f" />
            <text x={60} y={28} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={15} fill="#3b2418">Commander</text>
          </g>
          {[['☕', 'Expresso', '2 €'], ['🥛', 'Cappuccino', '3,50 €'], ['🥐', 'Croissant', '1,20 €']].map(([ic, n, p], i) => {
            const cw = (w - 50) / 3;
            return (
              <g key={n} transform={`translate(${14 + i * (cw + 11)},${164 + (1 - cartes) * 30})`} opacity={cartes}>
                <rect x={0} y={0} width={cw} height={88} rx={12} fill="#ffffff" stroke="#f0d9c0" strokeWidth={2} />
                <text x={cw / 2} y={34} textAnchor="middle" fontSize={22}>{ic}</text>
                <text x={cw / 2} y={58} textAnchor="middle" fontFamily={POLICE} fontWeight={800} fontSize={13} fill="#3b2418">{n}</text>
                <text x={cw / 2} y={77} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={13} fill="#c0396b">{p}</text>
              </g>
            );
          })}
        </g>
      </g>
    </g>
  );
};
