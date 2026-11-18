import React from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {clamp, prog} from '../lib/anim';
import {FONT} from '../lib/fonts';

/** Dos de carte : fond bleu nuit, motif doré */
const Dos: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      borderRadius: 34,
      background: 'radial-gradient(circle at 50% 40%, #233a8a, #0f1630 70%)',
      border: '10px solid #f4c542',
      backfaceVisibility: 'hidden',
      transform: 'rotateY(180deg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 24px 0 rgba(0,0,0,0.35)',
    }}
  >
    <svg width="70%" height="70%" viewBox="0 0 100 100">
      <rect x={10} y={10} width={80} height={80} rx={10} fill="none" stroke="#f4c542" strokeWidth={3} />
      <path d="M50,22 L58,42 L80,44 L63,58 L68,80 L50,68 L32,80 L37,58 L20,44 L42,42 Z" fill="#f4c542" />
    </svg>
  </div>
);

/**
 * Carte de jeu qui surgit en tournant (carte retournée), bord doré, fond bleu nuit.
 * surtitre : « NOTION : CSS » / « ASTUCE N° 3 » ; titre en blanc gras ; detail en vert.
 */
export const CarteJeu: React.FC<{
  debut: number;
  fin: number;
  surtitre: string;
  titre: string;
  detail?: string;
  icone?: React.ReactNode;
  x?: number; // centre écran
  y?: number;
  largeur?: number;
  couleurSurtitre?: string;
  hauteur?: number;
}> = ({debut, fin, surtitre, titre, detail, icone, x = 540, y = 760, largeur = 760, couleurSurtitre = '#f4c542', hauteur}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 12) return null;
  const inP = prog(f, debut, 16, Easing.out(Easing.back(1.4)));
  const flip = prog(f, debut, 22, Easing.out(Easing.cubic));
  const out = prog(f, fin, 12, Easing.in(Easing.cubic));
  const rotY = 180 * (1 - flip) + 90 * out;
  const sc = (0.3 + 0.7 * inP) * (1 - 0.3 * out);
  const flott = Math.sin((f - debut) * 0.08) * 6;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - largeur / 2,
        top: y - (hauteur ?? 0) / 2,
        width: largeur,
        perspective: 1600,
        opacity: clamp(1 - out * 1.2),
        transform: `translateY(${flott + (1 - inP) * 200}px) scale(${sc})`,
      }}
    >
      <div style={{position: 'relative', transformStyle: 'preserve-3d', transform: `rotateY(${rotY}deg) rotateZ(${-2 + 2 * flip}deg)`}}>
        <div
          style={{
            position: 'relative',
            borderRadius: 34,
            background: 'linear-gradient(180deg, #1a2a66 0%, #0f1630 100%)',
            border: '10px solid #f4c542',
            boxShadow: '0 24px 0 rgba(0,0,0,0.35), inset 0 0 0 4px #b8860b',
            padding: '34px 40px 40px',
            backfaceVisibility: 'hidden',
            fontFamily: FONT,
            textAlign: 'center',
            minHeight: hauteur,
          }}
        >
          <div
            style={{
              display: 'inline-block',
              background: couleurSurtitre,
              color: '#0f1630',
              fontWeight: 700,
              fontSize: 40,
              padding: '6px 26px',
              borderRadius: 40,
              letterSpacing: 2,
            }}
          >
            {surtitre}
          </div>
          {icone && <div style={{marginTop: 20, display: 'flex', justifyContent: 'center'}}>{icone}</div>}
          <div style={{color: '#fff', fontWeight: 700, fontSize: 70, lineHeight: 1.08, marginTop: 22, textShadow: '0 5px 0 rgba(0,0,0,0.4)'}}>
            {titre}
          </div>
          {detail && <div style={{color: '#4ade80', fontWeight: 600, fontSize: 44, marginTop: 16, lineHeight: 1.2}}>{detail}</div>}
          {/* reflet */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 24,
              background: `linear-gradient(115deg, transparent ${30 + flip * 40}%, rgba(255,255,255,0.18) ${36 + flip * 40}%, transparent ${44 + flip * 40}%)`,
              pointerEvents: 'none',
            }}
          />
        </div>
        <Dos />
      </div>
    </div>
  );
};
