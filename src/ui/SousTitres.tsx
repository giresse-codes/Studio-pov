import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../lib/anim';
import {C, POLICE} from '../lib/theme';

/** Un mot de la voix off avec son timing (en frames). `cle` = mot clé en jaune. */
export type Mot = {t: string; d: number; f: number; cle?: boolean};

/** Retire les indications de jeu entre crochets ([complice], [pause]…) : jamais affichées */
export const sansBalises = (texte: string) => texte.replace(/\[[^\]]*\]/g, ' ').replace(/\s+/g, ' ').trim();

/** Regroupe les mots en lignes courtes (max `parGroupe` mots, coupe aux ponctuations) */
export const grouper = (mots: Mot[], parGroupe = 4) => {
  const groupes: Mot[][] = [];
  let cur: Mot[] = [];
  mots.forEach((m, i) => {
    cur.push(m);
    const suivant = mots[i + 1];
    const pause = suivant ? suivant.d - m.f > 8 : true;
    if (cur.length >= parGroupe || /[.!?,:…]$/.test(m.t) || pause) {
      groupes.push(cur);
      cur = [];
    }
  });
  if (cur.length) groupes.push(cur);
  return groupes;
};

/** Sous-titres mot à mot, bas de l'écran, blanc gras contour noir, mot clé en jaune */
export const SousTitres: React.FC<{mots: Mot[]; y?: number; taille?: number}> = ({mots, y = 1330, taille = 84}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const groupes = grouper(mots);
  const g = groupes.find((gr) => f >= gr[0].d - 2 && f <= gr[gr.length - 1].f + 6);
  if (!g) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 22px',
      fontFamily: POLICE, fontWeight: 900, fontSize: taille, lineHeight: 1.12, textAlign: 'center'}}>
      {g.map((m, i) => {
        const visible = f >= m.d;
        const actif = f >= m.d && f <= m.f;
        const s = spring({frame: f - m.d, fps, config: {damping: 12, stiffness: 220}});
        return (
          <span key={i} style={{
            color: m.cle ? C.jaune : C.blanc,
            WebkitTextStroke: '14px #000', paintOrder: 'stroke fill',
            textShadow: '0 8px 0 rgba(0,0,0,0.55)',
            opacity: visible ? 1 : 0,
            transform: `scale(${visible ? interpolate(s, [0, 1], [0.85, actif ? 1.06 : 1]) : 0.85})`,
            display: 'inline-block',
          }}>{m.t}</span>
        );
      })}
    </div>
  );
};

/** Texte du hook (2 premières secondes) : gros texte au centre */
export const TexteHook: React.FC<{texte: string; debut?: number; fin: number; y?: number}> = ({texte, debut = 0, fin, y = 300}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f > fin + 10) return null;
  const s = spring({frame: f - debut, fps, config: {damping: 9, stiffness: 200}});
  const sortie = interpolate(f, [fin, fin + 10], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: y, textAlign: 'center', fontFamily: POLICE, fontWeight: 900, fontSize: 118, lineHeight: 1.02,
      color: '#fff', WebkitTextStroke: '18px #000', paintOrder: 'stroke fill', textShadow: '0 12px 0 rgba(0,0,0,0.5)', letterSpacing: -2,
      transform: `scale(${s * (1 + sortie * 0.3)}) rotate(-3deg)`, opacity: 1 - sortie}}>
      {texte}
    </div>
  );
};
