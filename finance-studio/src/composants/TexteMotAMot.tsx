import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, couleur as resoudreCouleur, H, W} from '../style';

export type Mot = {t: string; s: number; e: number};

/**
 * Une phrase à l'écran : les mots d'indice [debut, fin[ de la liste des mots.
 * `couleurs` associe un mot (forme normalisée, sans accents ni ponctuation)
 * ou un indice absolu à une couleur du code (vert, rouge, or, bleu, rose, attenue).
 * `lignes` force les retours à la ligne (nombre de mots par ligne).
 */
export type Phrase = {
  debut: number;
  couleurs?: Record<string, string>;
  lignes?: number[];
};

export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');

const LARGEUR_MAX = 26; // caractères par ligne (la référence monte à ~26)

/** Coupe une liste de mots en lignes équilibrées. */
const couper = (mots: string[], forcees?: number[]): number[][] => {
  const idx = mots.map((_, i) => i);
  if (forcees) {
    const out: number[][] = [];
    let k = 0;
    for (const n of forcees) {
      out.push(idx.slice(k, k + n));
      k += n;
    }
    if (k < idx.length) out.push(idx.slice(k));
    return out;
  }
  const total = mots.join(' ').length;
  const nLignes = Math.max(1, Math.ceil(total / LARGEUR_MAX));
  const cible = total / nLignes;
  const out: number[][] = [[]];
  let long = 0;
  mots.forEach((m, i) => {
    const ajout = (long ? 1 : 0) + m.length;
    if (long > 0 && (long + ajout > LARGEUR_MAX || (long + ajout / 2 > cible && out.length < nLignes))) {
      out.push([]);
      long = 0;
    }
    out[out.length - 1].push(i);
    long += (long ? 1 : 0) + m.length;
  });
  return out;
};

export const TexteMotAMot: React.FC<{
  mots: Mot[];
  phrases: Phrase[];
  /** décalage (s) : le mot apparaît un poil avant d'être entendu */
  avance?: number;
  /** fin de la dernière phrase (s) */
  fin?: number;
}> = ({mots, phrases, avance = 0.04, fin}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tps = frame / fps;

  return (
    <>
      {phrases.map((ph, pi) => {
        const finIdx = pi + 1 < phrases.length ? phrases[pi + 1].debut : mots.length;
        const brut = mots.slice(ph.debut, finIdx);
        // Les ponctuations isolées (« : ») se collent au mot précédent.
        const groupes: {t: string; s: number; i: number}[] = [];
        brut.forEach((m, k) => {
          if (/^[^\p{L}\p{N}]+$/u.test(m.t) && groupes.length) {
            groupes[groupes.length - 1].t += m.t === ':' ? '' : m.t;
          } else groupes.push({t: m.t, s: m.s, i: ph.debut + k});
        });
        const t0 = groupes[0].s - avance;
        const tFin = pi + 1 < phrases.length ? mots[phrases[pi + 1].debut].s - avance - 0.05 : fin ?? 1e9;
        if (tps < t0 - 0.1 || tps > tFin + 0.05) return null;
        const sortie = interpolate(tps, [tFin - 0.3, tFin], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const lignes = couper(
          groupes.map((g) => g.t),
          ph.lignes,
        );
        return (
          <div
            key={pi}
            style={{
              position: 'absolute',
              left: 60,
              width: W - 120,
              top: H * 0.135,
              opacity: sortie,
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 800,
              fontSize: 35,
              letterSpacing: '0.19em',
              textTransform: 'uppercase',
              lineHeight: '78px',
              textAlign: 'center',
              color: C.texte,
            }}
          >
            {lignes.map((ligne, li) => (
              <div key={li} style={{whiteSpace: 'nowrap'}}>
                {ligne.map((gi, k) => {
                  const g = groupes[gi];
                  const op = interpolate(tps, [g.s - avance, g.s - avance + 0.1], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });
                  const nom = ph.couleurs?.[String(g.i)] ?? ph.couleurs?.[norm(g.t)];
                  const col = nom ? resoudreCouleur(nom) : C.texte;
                  return (
                    <span key={k} style={{opacity: op, color: col}}>
                      {k > 0 ? ' ' : ''}
                      {g.t}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};
