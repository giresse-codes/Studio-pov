import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, keys, lerp, mixColor, pop} from '../lib/anim';
import {FONT} from '../lib/fonts';

export type IconeHUD = 'chrono' | 'maison' | 'coeur';

const Icone: React.FC<{type: IconeHUD; c: string}> = ({type, c}) => {
  if (type === 'chrono')
    return (
      <svg width={46} height={46} viewBox="0 0 46 46">
        <rect x={18} y={2} width={10} height={6} rx={2} fill={c} />
        <circle cx={23} cy={26} r={16} fill="none" stroke={c} strokeWidth={5} />
        <line x1={23} y1={26} x2={23} y2={16} stroke={c} strokeWidth={4} strokeLinecap="round" />
        <line x1={23} y1={26} x2={30} y2={30} stroke={c} strokeWidth={4} strokeLinecap="round" />
      </svg>
    );
  if (type === 'maison')
    return (
      <svg width={46} height={46} viewBox="0 0 46 46">
        <path d="M5,22 L23,6 L41,22" stroke={c} strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M10,20 L10,40 L36,40 L36,20" fill={c} />
        <rect x={19} y={28} width={8} height={12} fill="#0f1630" />
      </svg>
    );
  return (
    <svg width={46} height={46} viewBox="0 0 46 46">
      <path d="M23,40 C8,30 3,22 3,14 C3,7 9,3 14,3 C18,3 21,5 23,9 C25,5 28,3 32,3 C37,3 43,7 43,14 C43,22 38,30 23,40 Z" fill={c} />
    </svg>
  );
};

/**
 * HUD de jeu en haut à droite : grand compteur + barre avec icône.
 * compteur : paliers [frame, valeur] (le chiffre défile quand il change)
 * barre : clés [frame, 0..1] (interpolées) ; au-dessus de `alerte` la barre rougit et clignote.
 */
export const HUD: React.FC<{
  compteur: [number, number][];
  barre: [number, number][];
  unite: string;
  label: string;
  icone: IconeHUD;
  format?: (v: number) => string;
  inverse?: boolean; // true : barre pleine = bien (énergie, patience)
  alerte?: number;
  debut?: number;
}> = ({compteur, barre, unite, label, icone, format = (v) => String(Math.round(v)), inverse = false, alerte = 0.7, debut = 0}) => {
  const f = useCurrentFrame();
  // compteur avec défilement
  let v = compteur[0][1];
  let lastChange = -999;
  for (let i = 1; i < compteur.length; i++) {
    const [cf, cv] = compteur[i];
    if (f < cf) break;
    const k = clamp((f - cf) / 14);
    v = lerp(compteur[i - 1][1], cv, k);
    lastChange = cf;
  }
  const bump = f - lastChange < 18 ? 1 + 0.25 * Math.sin(((f - lastChange) / 18) * Math.PI) : 1;
  const b = keys(f, barre);
  const danger = inverse ? 1 - b : b;
  const enAlerte = danger >= alerte;
  const blink = enAlerte ? 0.55 + 0.45 * Math.abs(Math.sin(f * 0.25)) : 1;
  const col = danger < 0.5 ? mixColor('#4ade80', '#facc15', danger * 2) : mixColor('#facc15', '#ef4444', (danger - 0.5) * 2);
  const enter = pop(f, debut);
  const valCol = enAlerte ? '#ff6b6b' : '#ffffff';
  return (
    <div
      style={{
        position: 'absolute',
        right: 40,
        top: 150,
        width: 330,
        transform: `scale(${enter})`,
        transformOrigin: 'top right',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(20,32,74,0.92), rgba(12,18,44,0.92))',
          border: `5px solid ${enAlerte ? `rgba(239,68,68,${blink})` : '#f4c542'}`,
          borderRadius: 26,
          padding: '14px 22px 18px',
          boxShadow: enAlerte ? `0 0 ${30 * blink}px rgba(239,68,68,0.8), 0 10px 0 rgba(0,0,0,0.35)` : '0 10px 0 rgba(0,0,0,0.35)',
        }}
      >
        <div style={{color: '#9fb3ff', fontSize: 26, fontWeight: 600, letterSpacing: 2, textAlign: 'right'}}>{label}</div>
        <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'baseline', gap: 8}}>
          <span
            style={{
              color: valCol,
              fontSize: 104,
              fontWeight: 700,
              lineHeight: 1,
              transform: `scale(${bump})`,
              display: 'inline-block',
              transformOrigin: 'right bottom',
              textShadow: '0 6px 0 rgba(0,0,0,0.4)',
              opacity: enAlerte ? blink : 1,
            }}
          >
            {format(v)}
          </span>
          <span style={{color: valCol, fontSize: 40, fontWeight: 700}}>{unite}</span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 10}}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: col,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 -5px 0 rgba(0,0,0,0.25)',
              transform: enAlerte ? `rotate(${Math.sin(f * 0.9) * 10}deg)` : undefined,
            }}
          >
            <Icone type={icone} c="#0f1630" />
          </div>
          <div style={{flex: 1, height: 34, borderRadius: 17, background: '#0a0f26', border: '4px solid #2b3a7a', overflow: 'hidden'}}>
            <div
              style={{
                width: `${clamp(b) * 100}%`,
                height: '100%',
                background: `linear-gradient(180deg, ${col}, ${mixColor(col.length === 7 ? col : '#4ade80', '#000000', 0.25)})`,
                borderRadius: 13,
                opacity: enAlerte ? blink : 1,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
