import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, FPS} from '../lib/anim';
import {FONT} from '../lib/fonts';

export type Mot = {w: string; s: number; e: number; p: number};

const norm = (w: string) =>
  w
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

/** Découpe en blocs courts (même phrase, 4 mots / 20 caractères max) */
export const blocs = (mots: Mot[]) => {
  const out: Mot[][] = [];
  let cur: Mot[] = [];
  for (const m of mots) {
    const len = cur.reduce((a, x) => a + x.w.length + 1, 0);
    if (cur.length && (cur[0].p !== m.p || cur.length >= 4 || len + m.w.length > 20)) {
      out.push(cur);
      cur = [];
    }
    cur.push(m);
  }
  if (cur.length) out.push(cur);
  return out;
};

/**
 * Sous-titres mot à mot, police grasse blanche contour noir, mots clés en jaune.
 * Les balises [..] ne sont jamais dans `mots` (retirées par outils/timing.py).
 */
export const SousTitres: React.FC<{mots: Mot[]; motsCles?: string[]; y?: number; decalage?: number}> = ({
  mots,
  motsCles = [],
  y = 1330,
  decalage = 0,
}) => {
  const f = useCurrentFrame();
  const t = f / FPS - decalage;
  const cles = new Set(motsCles.map(norm));
  const bs = blocs(mots);
  const idx = bs.findIndex((b, i) => {
    const debut = b[0].s - 0.05;
    const fin = i + 1 < bs.length ? Math.min(bs[i + 1][0].s - 0.05, b[b.length - 1].e + 0.9) : b[b.length - 1].e + 0.9;
    return t >= debut && t < fin;
  });
  if (idx < 0) return null;
  const b = bs[idx];
  const entree = clamp((t - b[0].s + 0.05) / 0.12);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: y,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0 22px',
        fontFamily: FONT,
        transform: `scale(${0.85 + 0.15 * entree})`,
      }}
    >
      {b.map((m, i) => {
        const dit = t >= m.s - 0.03;
        const actif = dit && t < m.e + 0.05;
        const cle = cles.has(norm(m.w));
        const k = clamp((t - m.s + 0.03) / 0.1);
        return (
          <span
            key={i}
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.12,
              color: cle ? '#ffe14d' : '#ffffff',
              WebkitTextStroke: '14px #000',
              paintOrder: 'stroke fill',
              textShadow: '0 8px 0 rgba(0,0,0,0.55)',
              opacity: dit ? 1 : 0,
              transform: `scale(${dit ? (actif ? 1 + 0.12 * Math.sin(k * Math.PI) + 0.04 : 1) : 0.6})`,
              display: 'inline-block',
            }}
          >
            {m.w.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};
