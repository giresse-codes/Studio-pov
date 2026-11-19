import React from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {clamp, pop, prog, rand} from '../lib/anim';
import {FONT} from '../lib/fonts';

/** Étincelles d'apparition (coordonnées écran) */
export const Etincelles: React.FC<{debut: number; x: number; y: number; n?: number; r?: number; couleur?: string}> = ({
  debut,
  x,
  y,
  n = 10,
  r = 140,
  couleur = '#ffe14d',
}) => {
  const f = useCurrentFrame();
  const t = f - debut;
  if (t < 0 || t > 24) return null;
  const k = t / 24;
  return (
    <svg style={{position: 'absolute', left: x - r * 1.5, top: y - r * 1.5, overflow: 'visible'}} width={r * 3} height={r * 3}>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + rand(i) * 0.5;
        const d = r * (0.3 + 0.9 * Easing.out(Easing.cubic)(k)) * (0.7 + rand(i + 7) * 0.5);
        const s = 18 * (1 - k);
        const cx = r * 1.5 + Math.cos(a) * d;
        const cy = r * 1.5 + Math.sin(a) * d;
        return (
          <path
            key={i}
            d={`M${cx},${cy - s} L${cx + s * 0.3},${cy - s * 0.3} L${cx + s},${cy} L${cx + s * 0.3},${cy + s * 0.3} L${cx},${cy + s} L${cx - s * 0.3},${cy + s * 0.3} L${cx - s},${cy} L${cx - s * 0.3},${cy - s * 0.3} Z`}
            fill={i % 2 ? couleur : '#ffffff'}
          />
        );
      })}
    </svg>
  );
};

/** Carte d'ouverture (le « Bandeau » du script) : jour, heure, lieu, personnage */
export const CarteOuverture: React.FC<{debut: number; fin: number; ligne1: string; ligne2: string; ligne3?: string}> = ({
  debut,
  fin,
  ligne1,
  ligne2,
  ligne3,
}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 12) return null;
  const p = pop(f, debut, 30, 11);
  const out = prog(f, fin, 12, Easing.in(Easing.cubic));
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        top: 380,
        transform: `translateX(${-out * 1100}px) scale(${0.6 + 0.4 * p})`,
        transformOrigin: 'left center',
        opacity: clamp(p * 2),
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #1a2a66, #0f1630)',
          border: '8px solid #f4c542',
          borderRadius: 30,
          padding: '22px 36px',
          boxShadow: '0 16px 0 rgba(0,0,0,0.35)',
        }}
      >
        <div style={{color: '#f4c542', fontSize: 64, fontWeight: 700, letterSpacing: 3}}>{ligne1}</div>
        <div style={{color: '#fff', fontSize: 50, fontWeight: 700}}>{ligne2}</div>
        {ligne3 && <div style={{color: '#4ade80', fontSize: 40, fontWeight: 600}}>{ligne3}</div>}
      </div>
    </div>
  );
};

/** Carte plein écran pour les ellipses : « 9 MINUTES PLUS TARD » */
export const CarteTransition: React.FC<{debut: number; fin: number; texte: string}> = ({debut, fin, texte}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin) return null;
  const a = Math.min(clamp((f - debut) / 6), clamp((fin - f) / 6));
  const p = pop(f, debut + 3);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `rgba(15,22,48,${0.94 * a})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          transform: `scale(${p}) rotate(${-3 + 3 * p}deg)`,
          background: '#f4c542',
          color: '#0f1630',
          fontSize: 96,
          fontWeight: 700,
          padding: '30px 50px',
          borderRadius: 30,
          textAlign: 'center',
          lineHeight: 1.05,
          boxShadow: '0 18px 0 #b8860b',
          opacity: a,
        }}
      >
        {texte}
      </div>
    </div>
  );
};

const Bouton: React.FC<{couleur: string; ombre: string; texte: string; p: number; pulse: number}> = ({couleur, ombre, texte, p, pulse}) => (
  <div
    style={{
      transform: `scale(${p * pulse})`,
      background: `linear-gradient(180deg, ${couleur}, ${ombre})`,
      borderRadius: 40,
      boxShadow: `0 16px 0 ${ombre}, 0 24px 30px rgba(0,0,0,0.4)`,
      padding: '30px 30px',
      display: 'flex',
      alignItems: 'center',
      gap: 26,
      border: '6px solid rgba(255,255,255,0.5)',
    }}
  >
    <div style={{width: 76, height: 76, borderRadius: 38, background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 46, height: 46, borderRadius: 23, background: couleur}} />
    </div>
    <div style={{color: '#fff', fontSize: 62, fontWeight: 700, lineHeight: 1.05, textShadow: '0 4px 0 rgba(0,0,0,0.3)'}}>{texte}</div>
  </div>
);

/**
 * Fin de partie 1 : carte de jeu géante « TU FERAIS QUOI ? » + 2 gros boutons, puis l'appel au commentaire.
 */
export const EcranChoix: React.FC<{debut: number; vert: string; rouge: string; question?: string; cta?: string; ctaDebut?: number}> = ({
  debut,
  vert,
  rouge,
  question = 'TU FERAIS QUOI ?',
  cta = 'Écris-le en commentaire 👇 pour la partie 2',
  ctaDebut,
}) => {
  const f = useCurrentFrame();
  if (f < debut) return null;
  const fond = clamp((f - debut) / 8);
  const flip = prog(f, debut, 22, Easing.out(Easing.back(1.2)));
  const b1 = pop(f, debut + 14, 30, 8);
  const b2 = pop(f, debut + 20, 30, 8);
  const cd = ctaDebut ?? debut + 34;
  const c = pop(f, cd, 30, 10);
  const pulse1 = 1 + 0.03 * Math.sin((f - debut) * 0.25);
  const pulse2 = 1 + 0.03 * Math.sin((f - debut) * 0.25 + Math.PI);
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(8,12,30,${0.6 * fond})`, fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 300, perspective: 1800}}>
        <div
          style={{
            transform: `rotateY(${(1 - flip) * 180}deg) scale(${0.5 + 0.5 * clamp(flip)})`,
            background: 'linear-gradient(180deg, #1a2a66, #0f1630)',
            border: '12px solid #f4c542',
            borderRadius: 50,
            boxShadow: '0 26px 0 rgba(0,0,0,0.4), inset 0 0 0 5px #b8860b',
            padding: '50px 40px 56px',
            textAlign: 'center',
            backfaceVisibility: 'hidden',
          }}
        >
          <div style={{color: '#f4c542', fontSize: 40, fontWeight: 700, letterSpacing: 6}}>★ CHOIX ★</div>
          <div style={{color: '#fff', fontSize: 118, fontWeight: 700, lineHeight: 1, marginTop: 14, textShadow: '0 8px 0 rgba(0,0,0,0.4)'}}>
            {question}
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 44, marginTop: 54}}>
            <Bouton couleur="#22c55e" ombre="#15803d" texte={vert} p={b1} pulse={pulse1} />
            <Bouton couleur="#ef4444" ombre="#b91c1c" texte={rouge} p={b2} pulse={pulse2} />
          </div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 1330,
          textAlign: 'center',
          transform: `scale(${c}) translateY(${Math.sin(f * 0.2) * 6}px)`,
          color: '#fff',
          fontSize: 80,
          fontWeight: 700,
          lineHeight: 1.15,
          WebkitTextStroke: '12px #000',
          paintOrder: 'stroke fill',
          textShadow: '0 8px 0 rgba(0,0,0,0.5)',
        }}
      >
        {cta}
      </div>
    </div>
  );
};

/** Fin de partie 2 */
export const EcranAbonne: React.FC<{debut: number; texte?: string}> = ({debut, texte = 'Abonne-toi pour la prochaine situation'}) => {
  const f = useCurrentFrame();
  if (f < debut) return null;
  const p = pop(f, debut, 30, 9);
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(8,12,30,${0.6 * clamp((f - debut) / 8)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT}}>
      <div style={{transform: `scale(${p})`, background: '#ef4444', color: '#fff', fontSize: 80, fontWeight: 700, padding: '40px 50px', borderRadius: 40, textAlign: 'center', boxShadow: '0 18px 0 #991b1b', margin: 60}}>
        {texte}
      </div>
    </div>
  );
};

/** Confettis (coordonnées écran) */
export const Confettis: React.FC<{debut: number; n?: number; duree?: number}> = ({debut, n = 70, duree = 70}) => {
  const f = useCurrentFrame();
  const t = f - debut;
  if (t < 0 || t > duree) return null;
  const cols = ['#f472b6', '#facc15', '#4ade80', '#60a5fa', '#a78bfa', '#fb923c'];
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
      {Array.from({length: n}).map((_, i) => {
        const a = -Math.PI / 2 + (rand(i) - 0.5) * 2.2;
        const v = 26 + rand(i + 3) * 30;
        const x = 540 + Math.cos(a) * v * t;
        const y = 1100 + Math.sin(a) * v * t + 0.9 * t * t;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 18 + rand(i + 5) * 14,
              height: 10 + rand(i + 6) * 10,
              background: cols[i % cols.length],
              transform: `rotate(${t * (8 + rand(i + 2) * 20)}deg)`,
              borderRadius: 3,
              opacity: clamp((duree - t) / 15),
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Rappel du choix de la partie 1 (petite carte), avec l'état de chaque bouton :
 * 'neutre' | 'faux' (barré, grisé) | 'bon' (brille, « BONNE RÉPONSE »)
 */
export const ChoixRappel: React.FC<{
  debut: number;
  fin: number;
  vert: string;
  rouge: string;
  etatVert?: 'neutre' | 'faux' | 'bon';
  etatRouge?: 'neutre' | 'faux' | 'bon';
  depuisVert?: number;
  depuisRouge?: number;
  titre?: string;
  y?: number;
  labelFaux?: string;
  labelBon?: string;
}> = ({debut, fin, vert, rouge, etatVert = 'neutre', etatRouge = 'neutre', depuisVert = 0, depuisRouge = 0, titre = 'TU AS CHOISI ?', y = 560, labelFaux = '✗ −1 HEURE', labelBon = '✓ BONNE RÉPONSE'}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 12) return null;
  const p = pop(f, debut, 30, 10);
  const out = prog(f, fin, 12, Easing.in(Easing.cubic));
  const btn = (texte: string, c: string, o: string, etat: string, depuis: number) => {
    const k = etat === 'neutre' ? 0 : pop(f, depuis, 30, 8);
    const faux = etat === 'faux' && f >= depuis;
    const bon = etat === 'bon' && f >= depuis;
    return (
      <div style={{position: 'relative'}}>
        <div
          style={{
            background: faux ? '#4b5563' : `linear-gradient(180deg, ${c}, ${o})`,
            borderRadius: 34,
            padding: '24px 28px',
            color: '#fff',
            fontSize: 54,
            fontWeight: 700,
            boxShadow: bon ? `0 0 ${30 + 20 * Math.sin(f * 0.3)}px ${c}, 0 12px 0 ${o}` : `0 12px 0 ${faux ? '#1f2937' : o}`,
            transform: `scale(${bon ? 1 + 0.06 * k : faux ? 1 - 0.06 * k : 1})`,
            border: bon ? '6px solid #fff' : '6px solid rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <div style={{width: 60, height: 60, borderRadius: 30, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
            <div style={{width: 36, height: 36, borderRadius: 18, background: faux ? '#6b7280' : c}} />
          </div>
          <span style={{textDecoration: faux ? 'line-through' : undefined, textDecorationThickness: 6}}>{texte}</span>
        </div>
        {(faux || bon) && (
          <div
            style={{
              position: 'absolute',
              right: -10,
              top: -34,
              transform: `scale(${k}) rotate(${faux ? 8 : -6}deg)`,
              background: faux ? '#111827' : '#facc15',
              color: faux ? '#f87171' : '#111827',
              fontSize: 40,
              fontWeight: 700,
              padding: '6px 20px',
              borderRadius: 16,
              border: `5px solid ${faux ? '#f87171' : '#111827'}`,
              whiteSpace: 'nowrap',
            }}
          >
            {faux ? labelFaux : labelBon}
          </div>
        )}
      </div>
    );
  };
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: y, transform: `scale(${p * (1 - out)})`, fontFamily: FONT}}>
      <div
        style={{
          background: 'linear-gradient(180deg, #1a2a66, #0f1630)',
          border: '10px solid #f4c542',
          borderRadius: 44,
          padding: '34px 36px 44px',
          boxShadow: '0 22px 0 rgba(0,0,0,0.4)',
          textAlign: 'center',
        }}
      >
        <div style={{color: '#f4c542', fontSize: 36, fontWeight: 700, letterSpacing: 5}}>★ PARTIE 1 ★</div>
        <div style={{color: '#fff', fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 8, marginBottom: 40}}>{titre}</div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 46, textAlign: 'left'}}>
          {btn(vert, '#22c55e', '#15803d', etatVert, depuisVert)}
          {btn(rouge, '#ef4444', '#b91c1c', etatRouge, depuisRouge)}
        </div>
      </div>
    </div>
  );
};
