import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, pop} from '../lib/anim';
import {C, POLICE} from '../lib/theme';

/**
 * HUD de jeu (haut droite) : grand compteur + barre avec icône.
 * - valeur : nombre affiché (arrondi), unite : « MIN », « € », « % »…
 * - barre : 0..1 ; alerte : 0..1 (passe à l'orange puis au rouge, clignote à 1)
 */
export const HUD: React.FC<{
  valeur: number; unite: string; libelle: string; barre: number; icone: string; alerte?: number; apparition?: number;
  texteValeur?: string; // remplace la valeur (ex. « 02:14 »)
}> = ({valeur, unite, libelle, barre, icone, alerte = 0, apparition = 0, texteValeur}) => {
  const f = useCurrentFrame();
  const s = pop(f, apparition);
  const couleurBarre = alerte < 0.5
    ? interpolateColor(C.vert, C.orange, alerte * 2)
    : interpolateColor(C.orange, C.rouge, (alerte - 0.5) * 2);
  const clignote = alerte >= 0.95 ? (Math.floor(f / 6) % 2 === 0 ? 1 : 0.45) : 1;
  const pulse = 1 + (alerte > 0.5 ? Math.sin(f / 3) * 0.03 * alerte : 0);
  const couleurValeur = alerte > 0.6 ? C.rouge : C.blanc;
  return (
    <div style={{
      position: 'absolute', top: 120, right: 44, width: 360, transform: `scale(${s * pulse})`, transformOrigin: 'top right',
      fontFamily: POLICE,
    }}>
      <div style={{
        background: 'linear-gradient(180deg, rgba(20,25,58,0.92), rgba(12,15,38,0.92))',
        border: `5px solid ${alerte > 0.6 ? C.rouge : C.or}`, borderRadius: 30, padding: '18px 26px 22px',
        boxShadow: '0 10px 0 rgba(0,0,0,0.35)', opacity: clignote,
      }}>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 10}}>
          <span style={{fontSize: 112, fontWeight: 900, color: couleurValeur, lineHeight: 1, letterSpacing: -3,
            textShadow: '0 5px 0 rgba(0,0,0,0.45)'}}>
            {texteValeur ?? Math.round(valeur)}
          </span>
          <span style={{fontSize: 40, fontWeight: 900, color: C.jaune}}>{unite}</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 10}}>
          <span style={{fontSize: 44, lineHeight: 1}}>{icone}</span>
          <div style={{flex: 1, height: 30, borderRadius: 15, background: '#0a0c1e', border: '3px solid #ffffff55', overflow: 'hidden'}}>
            <div style={{width: `${Math.max(0, Math.min(1, barre)) * 100}%`, height: '100%', background: couleurBarre, borderRadius: 12,
              boxShadow: 'inset 0 -6px 0 rgba(0,0,0,0.25), inset 0 6px 0 rgba(255,255,255,0.25)'}} />
          </div>
        </div>
        <div style={{fontSize: 26, fontWeight: 800, color: '#c9d0ff', textAlign: 'right', marginTop: 8, letterSpacing: 1}}>{libelle}</div>
      </div>
    </div>
  );
};

const interpolateColor = (a: string, b: string, t: number) => {
  const k = Math.max(0, Math.min(1, t));
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(',')})`;
};

/** Valeur qui évolue par paliers animés : [[frame, valeur], …] */
export const valeurAnimee = (f: number, points: [number, number][], duree = 12) => {
  let v = points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [a, val] = points[i];
    v = v + (val - v) * interpolate(f, [a, a + duree], [0, 1], clamp);
  }
  return v;
};
