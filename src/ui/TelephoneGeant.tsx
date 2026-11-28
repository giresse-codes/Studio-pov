import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../lib/anim';
import {C, POLICE} from '../lib/theme';

/**
 * Téléphone géant à l'écran (gros plan) : batterie, applis qu'on ferme, réglages.
 * mode 'applis' : cartes d'applis qui partent une à une (fermeture)
 * mode 'reglages' : luminosité, mode économie, mode avion
 */
export type ReglagesTel = {aLum?: number; aEco?: number; aAvion?: number};

export const TelephoneGeant: React.FC<{
  debut: number; fin: number; batterie: number; mode: 'applis' | 'reglages' | 'batterie'; aFermeture?: number; reglages?: ReglagesTel; x?: number; y?: number;
  message?: string;
}> = ({debut, fin, batterie, mode, aFermeture = 0, reglages = {}, x = 250, y = 380, message}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < debut || f > fin + 10) return null;
  const s = spring({frame: f - debut, fps, config: {damping: 13}});
  const sortie = interpolate(f, [fin, fin + 10], [0, 1], clamp);
  const rouge = batterie <= 5;
  const clignote = rouge && Math.floor(f / 8) % 2 === 0;
  const v = (a?: number) => (a === undefined ? 0 : interpolate(f, [a, a + 10], [0, 1], clamp));
  const lum = 1 - v(reglages.aLum) * 0.85;
  const apps = [['💬', '#3ee07a'], ['📸', '#ff6b9a'], ['🎵', '#8a4fff'], ['🗺️', '#5ad1ff'], ['🎮', '#ffd23f']];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 580, height: 1020, transform: `translateY(${(1 - s) * 900 + sortie * 900}px) rotate(${(1 - s) * 8}deg)`,
      fontFamily: POLICE}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 70, background: '#1b1c25', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: '6px solid #3a3c4e'}} />
      <div style={{position: 'absolute', left: 22, top: 22, right: 22, bottom: 22, borderRadius: 52, overflow: 'hidden',
        background: mode === 'reglages' ? '#141a33' : 'linear-gradient(160deg, #3a4fd6, #8a4fff)', filter: `brightness(${0.6 + lum * 0.4})`}}>
        {/* barre d'état */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 34px', color: '#fff', fontWeight: 900, fontSize: 34}}>
          <span>19:0{Math.min(9, 2 + Math.floor((f - debut) / 300))}</span>
          <span style={{display: 'flex', alignItems: 'center', gap: 10}}>
            {v(reglages.aAvion) > 0.5 && <span>✈️</span>}
            <span style={{color: rouge ? C.rouge : '#fff', opacity: clignote ? 0.4 : 1}}>{Math.round(batterie)} %</span>
            <span style={{display: 'inline-block', width: 64, height: 30, border: `4px solid ${rouge ? C.rouge : '#fff'}`, borderRadius: 8, position: 'relative', padding: 3}}>
              <span style={{display: 'block', width: `${Math.max(4, batterie)}%`, height: '100%', background: rouge ? C.rouge : v(reglages.aEco) > 0.5 ? C.jaune : C.vert, borderRadius: 3}} />
            </span>
          </span>
        </div>
        {mode === 'applis' && (
          <div style={{position: 'relative', height: 820}}>
            {apps.map(([ic, col], i) => {
              const part = interpolate(f, [aFermeture + i * 8, aFermeture + i * 8 + 8], [0, 1], clamp);
              return (
                <div key={i} style={{position: 'absolute', left: 70 + i * 14, top: 60 + i * 110, width: 400, height: 300, borderRadius: 36, background: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)', transform: `translateY(${-part * 1100}px) rotate(${-part * 10}deg)`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 120, borderTop: `40px solid ${col}`}}>{ic}</div>
              );
            })}
          </div>
        )}
        {mode === 'batterie' && (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 800, gap: 30}}>
            <div style={{width: 260, height: 440, border: `16px solid ${C.rouge}`, borderRadius: 40, position: 'relative', opacity: clignote ? 0.5 : 1}}>
              <div style={{position: 'absolute', left: 80, top: -50, width: 70, height: 34, background: C.rouge, borderRadius: 10}} />
              <div style={{position: 'absolute', left: 14, right: 14, bottom: 14, height: `${Math.max(3, batterie)}%`, background: C.rouge, borderRadius: 12}} />
            </div>
            <div style={{color: C.rouge, fontWeight: 900, fontSize: 120}}>{Math.round(batterie)} %</div>
            {message && <div style={{color: '#fff', fontWeight: 900, fontSize: 44, textAlign: 'center', padding: '0 30px'}}>{message}</div>}
          </div>
        )}
        {mode === 'reglages' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 34, padding: '30px 34px'}}>
            <div style={{background: '#232a4d', borderRadius: 34, padding: '28px 30px'}}>
              <div style={{color: '#fff', fontWeight: 900, fontSize: 40, marginBottom: 20}}>🔅 Luminosité</div>
              <div style={{height: 44, borderRadius: 22, background: '#0b0d1f', overflow: 'hidden'}}>
                <div style={{width: `${lum * 100}%`, height: '100%', background: '#fff', borderRadius: 22}} />
              </div>
            </div>
            {[['🔋', 'Économie d’énergie', reglages.aEco, C.jaune], ['✈️', 'Mode avion', reglages.aAvion, '#ff9f1a']].map(([ic, nom, a, col]) => {
              const on = v(a as number | undefined);
              return (
                <div key={nom as string} style={{background: '#232a4d', borderRadius: 34, padding: '28px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <span style={{color: '#fff', fontWeight: 900, fontSize: 38}}>{ic as string} {nom as string}</span>
                  <span style={{width: 120, height: 64, borderRadius: 32, background: on > 0.5 ? (col as string) : '#4a4f70', position: 'relative'}}>
                    <span style={{position: 'absolute', top: 6, left: 6 + on * 56, width: 52, height: 52, borderRadius: 26, background: '#fff'}} />
                  </span>
                </div>
              );
            })}
            {message && <div style={{color: C.vert, fontWeight: 900, fontSize: 46, textAlign: 'center', marginTop: 20}}>{message}</div>}
          </div>
        )}
      </div>
      <div style={{position: 'absolute', left: 220, top: 36, width: 140, height: 36, borderRadius: 18, background: '#000'}} />
    </div>
  );
};
