import React from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {clamp, pop, prog} from '../lib/anim';
import {FONT} from '../lib/fonts';

/**
 * Bulle de BD (coordonnées écran) pour une réplique rapportée par le narrateur.
 * cri : bord en étoile (quelqu'un qui crie depuis une autre pièce).
 * pointe : point visé par la queue de la bulle.
 */
export const BulleBD: React.FC<{
  debut: number;
  fin: number;
  x: number;
  y: number;
  largeur?: number;
  texte: string;
  pointe?: [number, number];
  cri?: boolean;
  auteur?: string;
  taille?: number;
}> = ({debut, fin, x, y, largeur = 760, texte, pointe, cri = false, auteur, taille = 58}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 10) return null;
  const p = pop(f, debut, 30, 9);
  const out = prog(f, fin, 10, Easing.in(Easing.cubic));
  const sc = p * (1 - out);
  const wob = cri ? Math.sin(f * 1.4) * 2 : 0;
  const h = 260;
  const n = 22;
  const etoile = Array.from({length: n * 2})
    .map((_, i) => {
      const a = (i / (n * 2)) * Math.PI * 2;
      const r = i % 2 ? 1 : 1.13;
      return `${largeur / 2 + Math.cos(a) * (largeur / 2) * r},${h / 2 + Math.sin(a) * (h / 2) * r}`;
    })
    .join(' ');
  return (
    <div style={{position: 'absolute', left: x - largeur / 2, top: y - h / 2, width: largeur, height: h, transform: `scale(${sc}) rotate(${wob}deg)`, fontFamily: FONT}}>
      <svg style={{position: 'absolute', left: -largeur * 0.1, top: -h * 0.1, overflow: 'visible'}} width={largeur * 1.2} height={h * 1.2} viewBox={`${-largeur * 0.1} ${-h * 0.1} ${largeur * 1.2} ${h * 1.2}`}>
        {pointe && (
          <path
            d={`M${largeur / 2 - 50},${h / 2} L${pointe[0] - (x - largeur / 2)},${pointe[1] - (y - h / 2)} L${largeur / 2 + 50},${h / 2} Z`}
            fill="#fff"
            stroke="#111"
            strokeWidth={8}
            strokeLinejoin="round"
          />
        )}
        {cri ? (
          <polygon points={etoile} fill="#fff" stroke="#111" strokeWidth={8} strokeLinejoin="round" />
        ) : (
          <ellipse cx={largeur / 2} cy={h / 2} rx={largeur / 2} ry={h / 2} fill="#fff" stroke="#111" strokeWidth={8} />
        )}
        {pointe && !cri && <ellipse cx={largeur / 2} cy={h / 2} rx={largeur / 2 - 4} ry={h / 2 - 4} fill="#fff" />}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: '30px 70px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#111',
          fontWeight: 700,
          fontSize: taille,
          lineHeight: 1.05,
        }}
      >
        {auteur && <div style={{fontSize: 30, color: '#d97706', letterSpacing: 2}}>{auteur}</div>}
        {texte}
      </div>
    </div>
  );
};

/** Petit commentaire façon réseau social (« tout le monde en parle ») */
export const Commentaire: React.FC<{debut: number; fin: number; x: number; y: number; nom: string; texte: string; couleur?: string; rot?: number}> = ({
  debut,
  fin,
  x,
  y,
  nom,
  texte,
  couleur = '#f472b6',
  rot = 0,
}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 8) return null;
  const p = pop(f, debut, 30, 9) * (1 - prog(f, fin, 8));
  const coeurs = Math.floor(clamp((f - debut) / 40) * 900) + 12;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${p}) rotate(${rot}deg)`,
        background: '#fff',
        borderRadius: 28,
        padding: '14px 22px',
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        boxShadow: '0 10px 0 rgba(0,0,0,0.3)',
        fontFamily: FONT,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{width: 60, height: 60, borderRadius: 30, background: couleur, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 30}}>
        {nom[0]}
      </div>
      <div>
        <div style={{color: '#6b7280', fontSize: 24, fontWeight: 600}}>@{nom}</div>
        <div style={{color: '#111', fontSize: 38, fontWeight: 700}}>{texte}</div>
      </div>
      <div style={{color: '#ef4444', fontSize: 28, fontWeight: 700, marginLeft: 8}}>♥ {coeurs}</div>
    </div>
  );
};
