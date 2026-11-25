import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../lib/anim';
import {POLICE} from '../lib/theme';

/** Notification SMS qui glisse depuis le haut */
export const NotificationSMS: React.FC<{debut: number; fin: number; de: string; texte: string; y?: number}> = ({debut, fin, de, texte, y = 560}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < debut || f > fin + 12) return null;
  const s = spring({frame: f - debut, fps, config: {damping: 14, stiffness: 140}});
  const sortie = interpolate(f, [fin, fin + 12], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: y + (1 - s) * -400 - sortie * 400, fontFamily: POLICE, opacity: 1 - sortie}}>
      <div style={{background: 'rgba(250,250,255,0.97)', borderRadius: 36, padding: '24px 30px', display: 'flex', gap: 24, alignItems: 'center',
        boxShadow: '0 16px 40px rgba(0,0,0,0.4)'}}>
        <div style={{width: 96, height: 96, borderRadius: 26, background: '#3ee07a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56}}>💬</div>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span style={{fontWeight: 900, fontSize: 40, color: '#141418'}}>{de}</span>
            <span style={{fontWeight: 700, fontSize: 28, color: '#888'}}>maintenant</span>
          </div>
          <div style={{fontWeight: 700, fontSize: 40, color: '#333', marginTop: 4, lineHeight: 1.2}}>{texte}</div>
        </div>
      </div>
    </div>
  );
};

/** Petite icône de téléphone qui vibre */
export const TelephoneVibre: React.FC<{debut: number; fin: number; x: number; y: number}> = ({debut, fin, x, y}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin) return null;
  const v = Math.sin(f * 2.6) * 10;
  return (
    <div style={{position: 'absolute', left: x, top: y, fontSize: 90, transform: `rotate(${v}deg)`}}>
      📱
      <span style={{position: 'absolute', left: -30, top: 10, fontSize: 50, opacity: 0.8}}>(</span>
      <span style={{position: 'absolute', right: -30, top: 10, fontSize: 50, opacity: 0.8}}>)</span>
    </div>
  );
};
