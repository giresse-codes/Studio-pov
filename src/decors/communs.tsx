import React from 'react';
import {mix, rnd} from '../lib/anim';

/** Couleurs du ciel selon l'heure : 0 nuit → 0.5 aube → 1 jour */
export const couleursCiel = (jour: number) => {
  const nuitHaut = '#0b1033', nuitBas = '#2a2f6b';
  const aubeHaut = '#4a5fa8', aubeBas = '#ffae7a';
  const jourHaut = '#4fb3f6', jourBas = '#bfe8ff';
  if (jour < 0.5) {
    const t = jour / 0.5;
    return {haut: mix(nuitHaut, aubeHaut, t), bas: mix(nuitBas, aubeBas, t)};
  }
  const t = (jour - 0.5) / 0.5;
  return {haut: mix(aubeHaut, jourHaut, t), bas: mix(aubeBas, jourBas, t)};
};

/** Ciel + ville vus par une fenêtre (x, y, w, h = zone vitrée) */
export const Ciel: React.FC<{x: number; y: number; w: number; h: number; jour: number; frame: number}> = ({x, y, w, h, jour, frame}) => {
  const {haut, bas} = couleursCiel(jour);
  const id = `ciel-${x}-${y}`;
  const nuit = 1 - jour;
  const soleilY = y + h - 60 - Math.max(0, (jour - 0.25) / 0.75) * (h * 0.62);
  const luneY = y + 110 + Math.max(0, jour - 0.1) * h * 1.2;
  const immeubles = Array.from({length: 9}).map((_, i) => ({
    bx: x - 20 + i * (w / 7.5),
    bw: w / 8 + rnd(i + 2) * 40,
    bh: h * (0.18 + rnd(i * 7) * 0.32),
  }));
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={haut} />
          <stop offset="1" stopColor={bas} />
        </linearGradient>
        <radialGradient id={`${id}-soleil`}>
          <stop offset="0" stopColor="#fff6c8" stopOpacity={0.9} />
          <stop offset="1" stopColor="#ffd27a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
      {/* étoiles */}
      {Array.from({length: 26}).map((_, i) => (
        <circle key={i} cx={x + rnd(i) * w} cy={y + rnd(i + 40) * h * 0.6} r={1.5 + rnd(i + 3) * 2.5}
          fill="#fff" opacity={Math.max(0, nuit * 1.6 - 0.6) * (0.5 + 0.5 * Math.sin(frame / 9 + i))} />
      ))}
      {/* lune */}
      <g opacity={Math.max(0, 1 - jour * 1.8)}>
        <circle cx={x + w * 0.72} cy={luneY} r={44} fill="#f4f1d0" />
        <circle cx={x + w * 0.72 + 20} cy={luneY - 10} r={40} fill={haut} />
      </g>
      {/* soleil */}
      <g opacity={Math.min(1, Math.max(0, (jour - 0.2) * 3))}>
        <circle cx={x + w * 0.3} cy={soleilY} r={150} fill={`url(#${id}-soleil)`} />
        <circle cx={x + w * 0.3} cy={soleilY} r={56} fill="#fff1a8" />
      </g>
      {/* nuages */}
      {[0, 1, 2].map((i) => {
        const cx = x + ((rnd(i + 5) * w + frame * (0.4 + i * 0.2)) % (w + 200)) - 100;
        const cy = y + 80 + i * 90;
        return (
          <g key={i} opacity={0.25 + jour * 0.7} fill={mix('#4a4f80', '#ffffff', jour)}>
            <ellipse cx={cx} cy={cy} rx={70} ry={24} />
            <ellipse cx={cx + 40} cy={cy - 14} rx={44} ry={26} />
            <ellipse cx={cx - 36} cy={cy - 8} rx={34} ry={20} />
          </g>
        );
      })}
      {/* ville au loin */}
      {immeubles.map((b, i) => (
        <rect key={`l${i}`} x={b.bx + 30} y={y + h - b.bh * 1.25} width={b.bw * 0.8} height={b.bh * 1.25} fill={mix('#1a1f45', '#9db4d6', jour)} />
      ))}
      {immeubles.map((b, i) => (
        <g key={i}>
          <rect x={b.bx} y={y + h - b.bh} width={b.bw} height={b.bh} fill={mix('#232a5c', '#6f86ad', jour)} />
          {Array.from({length: 12}).map((_, k) => {
            const col = k % 3, row = Math.floor(k / 3);
            const allume = rnd(i * 31 + k) > 0.45;
            return (
              <rect key={k} x={b.bx + 10 + col * (b.bw / 3.3)} y={y + h - b.bh + 16 + row * 34} width={b.bw / 6} height={16}
                fill={allume ? mix('#ffd86b', '#c9d8ee', jour) : mix('#2e3670', '#8fa6c9', jour)} opacity={allume ? 1 - jour * 0.4 : 1} />
            );
          })}
        </g>
      ))}
    </g>
  );
};

type Lumiere = {x: number; y: number; r: number; couleur: string; force: number};

/**
 * Éclairage global de la pièce : assombrit la nuit (bleu froid), ajoute les halos
 * des sources lumineuses, et le rayon de soleil le jour.
 */
export const LumiereNuit: React.FC<{
  nuit: number; largeur: number; hauteur: number; lumieres: Lumiere[];
  soleil?: {x: number; y: number; jour: number};
  teinte?: string; force?: number;
}> = ({nuit, largeur, hauteur, lumieres, soleil, teinte = '#3b47a8', force = 0.85}) => (
  <g style={{pointerEvents: 'none'}}>
    <defs>
      {lumieres.map((l, i) => (
        <radialGradient key={i} id={`halo-${i}`}>
          <stop offset="0" stopColor={l.couleur} stopOpacity={1} />
          <stop offset="0.45" stopColor={l.couleur} stopOpacity={0.35} />
          <stop offset="1" stopColor={l.couleur} stopOpacity={0} />
        </radialGradient>
      ))}
      <linearGradient id="rayon-soleil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff4c2" stopOpacity={0.55} />
        <stop offset="1" stopColor="#fff4c2" stopOpacity={0} />
      </linearGradient>
    </defs>
    {/* assombrissement bleu froid (multiplication : garde les couleurs franches, sans voile gris) */}
    <rect x={0} y={0} width={largeur} height={hauteur} fill={teinte} opacity={nuit * force} style={{mixBlendMode: 'multiply'}} />
    {lumieres.map((l, i) => (
      <circle key={i} cx={l.x} cy={l.y} r={l.r} fill={`url(#halo-${i})`} opacity={nuit * l.force} style={{mixBlendMode: 'screen'}} />
    ))}
    {soleil && soleil.jour > 0.3 && (
      <path
        d={`M${soleil.x - 220},${soleil.y - 280} L${soleil.x + 200},${soleil.y - 280} L${soleil.x - 300},${soleil.y + 900} L${soleil.x - 1000},${soleil.y + 900} Z`}
        fill="url(#rayon-soleil)" opacity={(soleil.jour - 0.3) * 0.9} style={{mixBlendMode: 'screen'}}
      />
    )}
  </g>
);
