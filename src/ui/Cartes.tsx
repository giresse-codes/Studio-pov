import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp, rnd} from '../lib/anim';
import {C, POLICE} from '../lib/theme';

/** Carte de transition plein écran pour les ellipses : « 9 MINUTES PLUS TARD » */
export const CarteTransition: React.FC<{debut: number; duree?: number; texte: string}> = ({debut, duree = 36, texte}) => {
  const f = useCurrentFrame();
  if (f < debut || f > debut + duree) return null;
  const t = f - debut;
  const entree = interpolate(t, [0, 8], [-1, 0], {...clamp});
  const sortie = interpolate(t, [duree - 8, duree], [0, 1], clamp);
  const x = (entree + sortie) * 1200;
  return (
    <div style={{position: 'absolute', inset: 0, background: C.nuit, transform: `translateX(${x}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: POLICE}}>
      <div style={{position: 'absolute', inset: 30, border: `10px solid ${C.or}`, borderRadius: 50}} />
      <div style={{color: '#fff', fontWeight: 900, fontSize: 130, textAlign: 'center', lineHeight: 1.05, padding: 60, letterSpacing: -2}}>{texte}</div>
    </div>
  );
};

/** Carte d'ouverture (le « Bandeau » du script : jour, heure, lieu) */
export const CarteOuverture: React.FC<{debut: number; fin: number; lignes: string[]; y?: number}> = ({debut, fin, lignes, y = 1000}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < debut || f > fin + 10) return null;
  const s = spring({frame: f - debut, fps, config: {damping: 14}});
  const sortie = interpolate(f, [fin, fin + 10], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 60, top: y, transform: `translateX(${(1 - s) * -900 - sortie * 900}px)`, fontFamily: POLICE}}>
      <div style={{background: C.nuit, border: `6px solid ${C.or}`, borderRadius: 24, padding: '18px 30px'}}>
        {lignes.map((l, i) => (
          <div key={i} style={{color: i === 0 ? C.jaune : '#fff', fontWeight: 900, fontSize: i === 0 ? 48 : 40, lineHeight: 1.25}}>{l}</div>
        ))}
      </div>
    </div>
  );
};

/** Carte finale « Abonne-toi pour la suite » */
export const CarteAbonne: React.FC<{debut: number; fin: number}> = ({debut, fin}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < debut || f > fin) return null;
  const s = spring({frame: f - debut, fps, config: {damping: 10}});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', fontFamily: POLICE}}>
      <div style={{transform: `scale(${s})`, background: C.rouge, color: '#fff', fontWeight: 900, fontSize: 64, padding: '26px 50px', borderRadius: 40,
        border: '8px solid #fff', boxShadow: '0 14px 0 rgba(0,0,0,0.35)'}}>🔔 Abonne-toi pour la suite</div>
    </div>
  );
};

/** Étincelles autour d'un objet qui apparaît (repère écran) */
export const Etincelles: React.FC<{debut: number; x: number; y: number; n?: number; rayon?: number; couleur?: string}> = ({
  debut, x, y, n = 10, rayon = 160, couleur = C.jaune,
}) => {
  const f = useCurrentFrame();
  const t = f - debut;
  if (t < 0 || t > 24) return null;
  const k = t / 24;
  return (
    <svg style={{position: 'absolute', left: x - rayon * 1.5, top: y - rayon * 1.5}} width={rayon * 3} height={rayon * 3}>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(i) * 0.5;
        const d = rayon * (0.4 + k * (0.8 + rnd(i + 3) * 0.4));
        const cx = rayon * 1.5 + Math.cos(a) * d;
        const cy = rayon * 1.5 + Math.sin(a) * d;
        const r = 16 * (1 - k);
        return <path key={i} d={`M${cx},${cy - r} L${cx + r * 0.3},${cy - r * 0.3} L${cx + r},${cy} L${cx + r * 0.3},${cy + r * 0.3} L${cx},${cy + r} L${cx - r * 0.3},${cy + r * 0.3} L${cx - r},${cy} L${cx - r * 0.3},${cy - r * 0.3} Z`} fill={couleur} />;
      })}
    </svg>
  );
};
