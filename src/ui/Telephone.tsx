import React from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {clamp, pop, prog} from '../lib/anim';
import {FONT} from '../lib/fonts';

/** Portrait d'un personnage (buste) pour la bulle d'appel : passer le personnage placé en (0,0). */
export const Portrait: React.FC<{children: React.ReactNode; fond?: string; viewBox?: string}> = ({children, fond = '#93c5fd', viewBox = '-190 -620 380 470'}) => (
  <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
    <rect x={-190} y={-620} width={380} height={470} fill={fond} />
    <circle cx={120} cy={-560} r={90} fill="#fff" opacity={0.15} />
    {children}
  </svg>
);

/**
 * Bulle de téléphone « EN DIRECT » : appel vidéo avec le personnage dans un cadre arrondi, badge rouge.
 * `texte` : la réplique (affichée dans la bulle, la voix off la lit).
 */
export const AppelDirect: React.FC<{
  debut: number;
  fin: number;
  nom: string;
  portrait: React.ReactNode;
  texte?: string;
  texteDebut?: number;
  x?: number;
  y?: number;
}> = ({debut, fin, nom, portrait, texte, texteDebut, x = 60, y = 330}) => {
  const f = useCurrentFrame();
  if (f < debut - 2 || f > fin + 14) return null;
  const p = pop(f, debut, 30, 10);
  const out = prog(f, fin, 12, Easing.in(Easing.back(1.5)));
  const sc = p * (1 - out);
  const ring = f - debut < 24 ? Math.sin((f - debut) * 1.6) * 6 * (1 - (f - debut) / 24) : 0;
  const tp = texteDebut !== undefined ? pop(f, texteDebut, 30, 12) : 0;
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 560,
        transform: `scale(${sc}) rotate(${ring}deg)`,
        transformOrigin: 'top left',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: '#111827',
          borderRadius: 48,
          padding: 16,
          border: '6px solid #374151',
          boxShadow: '0 18px 0 rgba(0,0,0,0.35)',
        }}
      >
        <div style={{position: 'relative', height: 470, borderRadius: 34, overflow: 'hidden'}}>
          {portrait}
          <div
            style={{
              position: 'absolute',
              top: 18,
              left: 18,
              background: '#ef4444',
              color: '#fff',
              fontWeight: 700,
              fontSize: 30,
              padding: '6px 18px',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{width: 16, height: 16, borderRadius: 8, background: '#fff', opacity: blink ? 1 : 0.3}} />
            EN DIRECT
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 18,
              color: '#fff',
              fontWeight: 700,
              fontSize: 40,
              textShadow: '0 3px 6px rgba(0,0,0,0.7)',
            }}
          >
            {nom}
          </div>
          {/* forme d'onde */}
          <div style={{position: 'absolute', bottom: 24, right: 20, display: 'flex', gap: 5, alignItems: 'center'}}>
            {Array.from({length: 7}).map((_, i) => (
              <div key={i} style={{width: 8, height: 10 + Math.abs(Math.sin(f * 0.5 + i * 1.1)) * 30, background: '#4ade80', borderRadius: 4}} />
            ))}
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 40, marginTop: 14}}>
          <div style={{width: 74, height: 74, borderRadius: 37, background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width={40} height={40} viewBox="0 0 40 40">
              <path d="M4,22 Q20,8 36,22 L32,28 L26,24 L26,19 Q20,17 14,19 L14,24 L8,28 Z" fill="#fff" />
            </svg>
          </div>
          <div style={{width: 74, height: 74, borderRadius: 37, background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width={36} height={36} viewBox="0 0 36 36">
              <rect x={12} y={4} width={12} height={20} rx={6} fill="#fff" />
              <path d="M7,17 Q7,29 18,29 Q29,29 29,17" stroke="#fff" strokeWidth={3} fill="none" />
            </svg>
          </div>
        </div>
      </div>
      {texte && tp > 0 && (
        <div
          style={{
            marginTop: 18,
            marginLeft: 30,
            background: '#fff',
            borderRadius: 30,
            padding: '20px 28px',
            fontSize: 44,
            fontWeight: 700,
            color: '#111827',
            transform: `scale(${tp})`,
            transformOrigin: 'top left',
            boxShadow: '0 10px 0 rgba(0,0,0,0.25)',
            position: 'relative',
            lineHeight: 1.15,
          }}
        >
          <div style={{position: 'absolute', top: -18, left: 50, width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderBottom: '20px solid #fff'}} />
          {texte}
        </div>
      )}
    </div>
  );
};

/** Notification SMS qui glisse depuis le haut */
export const NotifSMS: React.FC<{debut: number; fin: number; de: string; texte: string; y?: number; urgent?: boolean}> = ({
  debut,
  fin,
  de,
  texte,
  y = 330,
  urgent = false,
}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 14) return null;
  const inP = prog(f, debut, 14, Easing.out(Easing.back(1.6)));
  const out = prog(f, fin, 12, Easing.in(Easing.cubic));
  const shake = f - debut < 20 ? Math.sin((f - debut) * 2.2) * 8 * (1 - (f - debut) / 20) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 50,
        right: 50,
        top: y,
        transform: `translateY(${(1 - inP) * -500 - out * 500}px) translateX(${shake}px)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 40,
          padding: '24px 30px',
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          boxShadow: '0 16px 0 rgba(0,0,0,0.3)',
          border: urgent ? '6px solid #ef4444' : '6px solid transparent',
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 26,
            background: '#22c55e',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width={60} height={60} viewBox="0 0 60 60">
            <path d="M8,12 Q8,6 14,6 L46,6 Q52,6 52,12 L52,36 Q52,42 46,42 L24,42 L12,52 L14,42 Q8,42 8,36 Z" fill="#fff" />
          </svg>
        </div>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', justifyContent: 'space-between', color: '#6b7280', fontSize: 30, fontWeight: 600}}>
            <span>MESSAGES • {de}</span>
            <span>maintenant</span>
          </div>
          <div style={{color: urgent ? '#dc2626' : '#111827', fontSize: 46, fontWeight: 700, lineHeight: 1.15, marginTop: 4}}>{texte}</div>
        </div>
      </div>
    </div>
  );
};

/** Petite icône de téléphone qui vibre (coordonnées écran) */
export const TelVibre: React.FC<{debut: number; fin: number; x: number; y: number}> = ({debut, fin, x, y}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin) return null;
  const p = pop(f, debut);
  const o = clamp((fin - f) / 6);
  const r = Math.sin(f * 2.4) * 14;
  return (
    <div style={{position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 120, transform: `scale(${p}) rotate(${r}deg)`, opacity: o}}>
      <svg width={120} height={120} viewBox="0 0 120 120">
        <circle cx={60} cy={60} r={56} fill="#ffe14d" stroke="#111" strokeWidth={5} />
        <rect x={42} y={26} width={36} height={66} rx={8} fill="#111" />
        <rect x={47} y={34} width={26} height={46} rx={3} fill="#60a5fa" />
        <path d="M24,44 q-8,16 0,32 M96,44 q8,16 0,32" stroke="#111" strokeWidth={5} fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};
