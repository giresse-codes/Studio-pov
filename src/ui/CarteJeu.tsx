import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../lib/anim';
import {C, POLICE} from '../lib/theme';

/** Dos de carte (motif doré) */
const Dos: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, borderRadius: 40, background: `repeating-linear-gradient(45deg, ${C.nuit} 0 26px, ${C.nuit2} 26px 52px)`,
    border: `10px solid ${C.or}`, boxShadow: `inset 0 0 0 6px ${C.orFonce}`, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
    display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <div style={{width: 170, height: 170, borderRadius: 85, border: `8px solid ${C.or}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 110, color: C.or, fontWeight: 900, fontFamily: POLICE}}>★</div>
  </div>
);

/**
 * Carte de jeu qui surgit en tournant : `ASTUCE N° X`, `NOTION : CSS`, `RÈGLE : S.T.O.P.`…
 * - surTitre : petite étiquette (ex. « NOTION »), titre : blanc gras, detail : vert.
 */
export const CarteJeu: React.FC<{
  debut: number; fin: number; titre: string; surTitre?: string; detail?: string; contenu?: React.ReactNode;
  y?: number; largeur?: number; icone?: string;
}> = ({debut, fin, titre, surTitre, detail, contenu, y = 640, largeur = 860, icone}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < debut || f > fin + 12) return null;
  const s = spring({frame: f - debut, fps, config: {damping: 13, stiffness: 90, mass: 0.9}});
  const rot = interpolate(s, [0, 1], [540, 0]); // 1,5 tour : effet carte retournée
  const echelle = interpolate(s, [0, 1], [0.2, 1]);
  const sortie = interpolate(f, [fin, fin + 12], [0, 1], clamp);
  const flotte = Math.sin((f - debut) / 18) * 6;
  // reflet qui balaie la carte une fois retournée
  const reflet = interpolate(f, [debut + 22, debut + 44], [-60, 160], clamp);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y + flotte, display: 'flex', justifyContent: 'center', perspective: 2200,
      opacity: 1 - sortie}}>
      <div style={{width: largeur, position: 'relative', transformStyle: 'preserve-3d',
        transform: `translateY(${sortie * -120}px) scale(${echelle * (1 - sortie * 0.3)}) rotateY(${rot}deg) rotateZ(${interpolate(s, [0, 1], [-14, -2])}deg)`}}>
        <div style={{position: 'relative', borderRadius: 40, background: `linear-gradient(160deg, ${C.nuit2}, ${C.nuit})`,
          border: `10px solid ${C.or}`, boxShadow: `inset 0 0 0 6px ${C.orFonce}, 0 30px 60px rgba(0,0,0,0.5)`, padding: '44px 50px 50px',
          backfaceVisibility: 'hidden', overflow: 'hidden', fontFamily: POLICE}}>
          <div style={{position: 'absolute', top: 0, bottom: 0, left: `${reflet}%`, width: '30%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)', transform: 'skewX(-20deg)'}} />
          {surTitre && (
            <div style={{display: 'inline-block', background: C.or, color: C.nuit, fontWeight: 900, fontSize: 40, padding: '8px 24px', borderRadius: 16, letterSpacing: 3}}>
              {icone ? `${icone} ` : ''}{surTitre}
            </div>
          )}
          <div style={{color: C.blanc, fontWeight: 900, fontSize: 104, lineHeight: 1.02, marginTop: 18, letterSpacing: -2, textShadow: '0 6px 0 rgba(0,0,0,0.4)'}}>{titre}</div>
          {detail && <div style={{color: C.vert, fontWeight: 800, fontSize: 50, lineHeight: 1.2, marginTop: 22}}>{detail}</div>}
          {contenu}
          {/* coins décoratifs */}
          {[{top: 14, left: 14}, {top: 14, right: 14}, {bottom: 14, left: 14}, {bottom: 14, right: 14}].map((pos, i) => (
            <div key={i} style={{position: 'absolute', ...pos, width: 22, height: 22, borderRadius: 11, background: C.or}} />
          ))}
        </div>
        <Dos />
      </div>
    </div>
  );
};

/** Bloc de code affiché dans une carte ou à l'écran (DevsTeach) */
export const BlocCode: React.FC<{lignes: {t: string; c?: string}[][]; taille?: number; apparition?: number; debut?: number}> = ({
  lignes, taille = 44, debut = 0, apparition = 6,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{marginTop: 26, background: '#0b0d1f', borderRadius: 22, padding: '22px 28px', border: '3px solid #2f3770',
      fontFamily: "'JetBrains Studio', 'JetBrains Mono', monospace", fontSize: taille, fontWeight: 700, lineHeight: 1.45}}>
      {lignes.map((l, i) => (
        <div key={i} style={{opacity: interpolate(f, [debut + i * apparition, debut + i * apparition + 6], [0, 1], clamp), whiteSpace: 'pre'}}>
          {l.map((m, k) => <span key={k} style={{color: m.c ?? '#e6e8ff'}}>{m.t}</span>)}
        </div>
      ))}
    </div>
  );
};
