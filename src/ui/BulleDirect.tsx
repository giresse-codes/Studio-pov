import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, pop} from '../lib/anim';
import {C, POLICE} from '../lib/theme';

/**
 * Bulle d'appel vidéo « EN DIRECT » : cadre arrondi avec le personnage qui appelle,
 * badge rouge, nom, durée d'appel. `children` = le personnage dans son décor (SVG 520x560).
 */
export const BulleDirect: React.FC<{
  debut: number; fin: number; nom: string; children: React.ReactNode; x?: number; y?: number; fond?: string;
  sonnerie?: number; // frames de sonnerie avant décrochage
}> = ({debut, fin, nom, children, x = 60, y = 150, fond = '#cfe3ff', sonnerie = 18}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 14) return null;
  const s = pop(f, debut, 30, 160);
  const sortie = interpolate(f, [fin, fin + 14], [0, 1], clamp);
  const vibre = f - debut < sonnerie ? Math.sin(f * 2.4) * 6 : 0;
  const secondes = Math.max(0, Math.floor((f - debut - sonnerie) / 30));
  const decroche = f - debut >= sonnerie;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 560, fontFamily: POLICE,
      transform: `translateX(${vibre}px) scale(${s * (1 - sortie)}) rotate(${(1 - s) * -10 + vibre * 0.3}deg)`, transformOrigin: 'top left'}}>
      <div style={{borderRadius: 48, overflow: 'hidden', border: '8px solid #fff', boxShadow: '0 20px 50px rgba(0,0,0,0.45)', background: fond, position: 'relative', height: 600}}>
        <svg width={544} height={584} viewBox="0 0 544 584" style={{position: 'absolute', inset: 0}}>{children}</svg>
        {/* badge EN DIRECT */}
        <div style={{position: 'absolute', top: 22, left: 22, background: C.rouge, color: '#fff', fontWeight: 900, fontSize: 34,
          padding: '8px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: 1}}>
          <span style={{width: 18, height: 18, borderRadius: 9, background: '#fff', opacity: Math.floor(f / 10) % 2 ? 1 : 0.35}} />
          EN DIRECT
        </div>
        {/* bas : nom + durée */}
        <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 26px', background: 'linear-gradient(0deg, rgba(0,0,0,0.75), transparent)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 96}}>
          <span style={{color: '#fff', fontWeight: 900, fontSize: 48}}>{nom}</span>
          <span style={{color: '#fff', fontWeight: 800, fontSize: 32, opacity: 0.85}}>
            {decroche ? `00:${String(secondes).padStart(2, '0')}` : 'Appel…'}
          </span>
        </div>
      </div>
      {/* bouton raccrocher */}
      <div style={{position: 'absolute', right: -20, bottom: -26, width: 96, height: 96, borderRadius: 48, background: C.rouge, border: '6px solid #fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, boxShadow: '0 8px 20px rgba(0,0,0,0.4)'}}>📞</div>
    </div>
  );
};
