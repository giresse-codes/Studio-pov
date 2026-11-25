import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../lib/anim';
import {C, POLICE} from '../lib/theme';

/**
 * Écran « TU FERAIS QUOI ? » : carte géante + 2 boutons (vert / rouge) + compte à rebours de 3 s
 * + « Réponds en commentaire 👇 ». À `revelation`, le bon bouton s'allume, le mauvais se grise.
 */
export const EcranChoix: React.FC<{
  debut: number; fin: number; vert: string; rouge: string; bonne: 'vert' | 'rouge'; revelation?: number;
}> = ({debut, fin, vert, rouge, bonne, revelation}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < debut || f > fin + 10) return null;
  const t = f - debut;
  const s = spring({frame: t, fps, config: {damping: 12, stiffness: 110}});
  const rot = interpolate(s, [0, 1], [180, 0]);
  const sortie = interpolate(f, [fin, fin + 10], [0, 1], clamp);
  const revele = revelation !== undefined && f >= revelation;
  const debutDecompte = debut + 14;
  const reste = Math.max(0, 3 - Math.floor((f - debutDecompte) / fps));
  const dansSeconde = ((f - debutDecompte) % fps) / fps;
  const finDecompte = debutDecompte + 3 * fps;

  const bouton = (couleur: 'vert' | 'rouge', texte: string, i: number) => {
    const bon = couleur === bonne;
    const sb = spring({frame: t - 8 - i * 4, fps, config: {damping: 11}});
    const fond = couleur === 'vert' ? C.vert : C.rouge;
    const ombre = couleur === 'vert' ? C.vertFonce : C.rougeFonce;
    const gris = revele && !bon;
    const allume = revele && bon;
    const sr = revele ? spring({frame: f - (revelation ?? 0), fps, config: {damping: 8}}) : 0;
    return (
      <div style={{
        transform: `scale(${sb * (allume ? 1 + sr * 0.08 : gris ? 0.94 : 1)})`,
        background: gris ? '#6b6f80' : fond, borderRadius: 34, padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 24,
        boxShadow: `0 14px 0 ${gris ? '#4a4d5a' : ombre}${allume ? `, 0 0 ${40 + sr * 30}px ${fond}` : ''}`,
        border: allume ? '8px solid #fff' : '8px solid transparent', opacity: gris ? 0.6 : 1,
      }}>
        <div style={{width: 76, height: 76, borderRadius: 38, background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, fontWeight: 900, color: gris ? '#6b6f80' : ombre}}>{allume ? '✓' : gris ? '✗' : couleur === 'vert' ? 'A' : 'B'}</div>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 54, lineHeight: 1.1, textShadow: '0 4px 0 rgba(0,0,0,0.25)'}}>{texte}</div>
      </div>
    );
  };

  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: POLICE, opacity: 1 - sortie}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(8,10,30,0.55)', opacity: Math.min(1, t / 8)}} />
      <div style={{position: 'absolute', left: 50, right: 50, top: 330, perspective: 2400}}>
        <div style={{transform: `scale(${interpolate(s, [0, 1], [0.3, 1])}) rotateX(${rot}deg)`, background: `linear-gradient(160deg, ${C.nuit2}, ${C.nuit})`,
          border: `12px solid ${C.or}`, borderRadius: 50, padding: '50px 44px 46px', boxShadow: `inset 0 0 0 6px ${C.orFonce}, 0 40px 80px rgba(0,0,0,0.6)`,
          backfaceVisibility: 'hidden'}}>
          <div style={{color: '#fff', fontWeight: 900, fontSize: 116, textAlign: 'center', letterSpacing: -3, lineHeight: 1, textShadow: '0 8px 0 rgba(0,0,0,0.45)'}}>
            TU FERAIS<br /><span style={{color: C.jaune}}>QUOI ?</span>
          </div>
          {/* compte à rebours */}
          <div style={{display: 'flex', justifyContent: 'center', margin: '30px 0 34px'}}>
            {f < finDecompte && f >= debutDecompte && !revele ? (
              <div style={{width: 170, height: 170, position: 'relative'}}>
                <svg width={170} height={170} style={{position: 'absolute', inset: 0}}>
                  <circle cx={85} cy={85} r={74} stroke="#ffffff33" strokeWidth={14} fill="none" />
                  <circle cx={85} cy={85} r={74} stroke={reste === 1 ? C.rouge : C.jaune} strokeWidth={14} fill="none" strokeLinecap="round"
                    strokeDasharray={`${(1 - dansSeconde) * 465} 465`} transform="rotate(-90 85 85)" />
                </svg>
                <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900,
                  fontSize: 110, transform: `scale(${1.3 - Math.min(1, dansSeconde * 4) * 0.3})`}}>{reste}</div>
              </div>
            ) : (
              <div style={{height: 170, display: 'flex', alignItems: 'center', color: revele ? C.vert : '#fff', fontWeight: 900, fontSize: 70}}>
                {revele ? 'BONNE RÉPONSE !' : f < debutDecompte ? '' : 'TEMPS ÉCOULÉ !'}
              </div>
            )}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
            {bouton('vert', vert, 0)}
            {bouton('rouge', rouge, 1)}
          </div>
          <div style={{color: '#c9d0ff', fontWeight: 800, fontSize: 46, textAlign: 'center', marginTop: 36, opacity: interpolate(t, [16, 24], [0, 1], clamp)}}>
            Réponds en commentaire 👇
          </div>
        </div>
      </div>
    </div>
  );
};
