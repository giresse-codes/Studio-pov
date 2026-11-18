import React from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {clamp, lerp, pop, prog} from '../lib/anim';
import {FONT, MONO, SERIF_1998} from '../lib/fonts';

/* Éléments de schémas animés (DevsTeach) */

/** Fond « plan d'architecte » bleu nuit quadrillé, plein écran */
export const FondPlan: React.FC<{opacite?: number}> = ({opacite = 1}) => {
  const f = useCurrentFrame();
  const o = (f * 0.6) % 60;
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: opacite,
        background: `radial-gradient(circle at 50% 45%, #1d3a8a 0%, #0f1630 75%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(125,211,252,0.12) 2px, transparent 2px), linear-gradient(90deg, rgba(125,211,252,0.12) 2px, transparent 2px)',
          backgroundSize: '60px 60px',
          backgroundPosition: `${o}px ${o}px`,
        }}
      />
    </div>
  );
};

export const COUL_FICHIER: Record<string, string> = {html: '#f97316', css: '#3b82f6', js: '#facc15', php: '#8b5cf6', sql: '#10b981'};

/** Icône de fichier avec son extension */
export const Fichier: React.FC<{nom: string; ext: string; taille?: number; barre?: boolean}> = ({nom, ext, taille = 200, barre = false}) => {
  const c = COUL_FICHIER[ext] ?? '#94a3b8';
  return (
    <div style={{width: taille, fontFamily: FONT, textAlign: 'center', position: 'relative'}}>
      <svg width={taille} height={taille * 1.2} viewBox="0 0 100 120">
        <path d="M10,4 L66,4 L90,28 L90,112 Q90,116 86,116 L14,116 Q10,116 10,112 Z" fill="#f8fafc" />
        <path d="M66,4 L66,28 L90,28 Z" fill="#cbd5e1" />
        <rect x={4} y={56} width={80} height={34} rx={8} fill={c} />
        <text x={44} y={80} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={20} fill={ext === 'js' ? '#1f2937' : '#fff'}>
          {ext.toUpperCase()}
        </text>
        {[0, 1].map((i) => (
          <rect key={i} x={20} y={98 + i * 0} width={50 - i * 10} height={5} rx={2} fill="#cbd5e1" />
        ))}
        {barre && <line x1={0} y1={120} x2={100} y2={0} stroke="#ef4444" strokeWidth={8} />}
      </svg>
      <div style={{color: '#fff', fontSize: taille * 0.15, fontWeight: 700, fontFamily: MONO, marginTop: 4}}>{nom}</div>
    </div>
  );
};

/** Os (icône HTML = squelette) */
export const IconeOs: React.FC<{s?: number}> = ({s = 120}) => (
  <svg width={s} height={s * 0.6} viewBox="0 0 100 60">
    <g fill="#f8fafc">
      <circle cx={14} cy={18} r={12} />
      <circle cx={14} cy={42} r={12} />
      <circle cx={86} cy={18} r={12} />
      <circle cx={86} cy={42} r={12} />
      <rect x={14} y={20} width={72} height={20} rx={6} />
    </g>
  </svg>
);
/** T-shirt (icône CSS = vêtements) */
export const IconeTshirt: React.FC<{s?: number}> = ({s = 120}) => (
  <svg width={s} height={s * 0.8} viewBox="0 0 100 80">
    <path d="M30,4 Q50,16 70,4 L96,18 L86,38 L76,32 L76,78 L24,78 L24,32 L14,38 L4,18 Z" fill="#ec4899" />
    <path d="M30,4 Q50,16 70,4" stroke="#fff" strokeWidth={4} fill="none" />
    <circle cx={50} cy={46} r={10} fill="#fde047" />
  </svg>
);
/** Biceps (icône JS = muscles) */
export const IconeMuscle: React.FC<{s?: number}> = ({s = 120}) => (
  <svg width={s} height={s * 0.8} viewBox="0 0 100 80">
    <path
      d="M10,74 L10,52 Q14,34 34,30 L40,14 Q44,4 56,8 L62,12 Q66,18 58,22 L52,24 L52,34 Q70,24 86,36 Q98,50 88,64 Q76,78 50,74 Z"
      fill="#facc15"
      stroke="#1f2937"
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <path d="M58,46 Q66,40 74,46" stroke="#1f2937" strokeWidth={4} fill="none" strokeLinecap="round" />
  </svg>
);

/**
 * Maquette de site dans une fenêtre de navigateur, qui évolue :
 *  - html : 0..1 apparition du squelette (titres, textes, image)
 *  - couleurs / tailles / miseEnPage : 0..1 (CSS)
 *  - clic : frame du clic JS (curseur + bouton qui réagit)
 *  - surbrillance : 'titres' | 'textes' | 'images' | null
 */
export const MaquetteSite: React.FC<{
  html: number;
  couleurs: number;
  tailles: number;
  miseEnPage: number;
  clic?: number;
  curseur?: number;
  surbrillance?: string | null;
  largeur?: number;
}> = ({html, couleurs, tailles, miseEnPage, clic, curseur, surbrillance, largeur = 900}) => {
  const f = useCurrentFrame();
  const W = 900;
  const H = 640;
  const c = couleurs;
  const col = (a: string, b: string) => (c > 0.5 ? b : a);
  const ink = (k: number) => clamp(html * 3 - k);
  // mise en page : en colonne (0) -> image à gauche + texte à droite (1)
  const m = Easing.inOut(Easing.cubic)(miseEnPage);
  const titreSize = lerp(34, 62, tailles);
  const hl = (k: string) => (surbrillance === k ? 1 : 0);
  const clicK = clic !== undefined ? clamp((f - clic) / 10) : 0;
  const apresClic = clic !== undefined && f >= clic;
  const btnScale = clic !== undefined && f >= clic && f < clic + 10 ? 0.88 : 1;
  const coeur = clic !== undefined ? pop(f, clic + 2) : 0;
  const curP = curseur !== undefined ? prog(f, curseur, 24) : 0;
  const curX = lerp(W + 60, 640, curP);
  const curY = lerp(H + 40, 540, curP);
  return (
    <div style={{width: largeur, height: (largeur / W) * (H + 70), position: 'relative'}}>
      <div style={{transform: `scale(${largeur / W})`, transformOrigin: 'top left', width: W, position: 'absolute'}}>
        {/* chrome du navigateur */}
        <div style={{background: '#e2e8f0', borderRadius: '24px 24px 0 0', height: 70, display: 'flex', alignItems: 'center', gap: 12, padding: '0 22px'}}>
          {['#ef4444', '#f59e0b', '#22c55e'].map((cc) => (
            <div key={cc} style={{width: 22, height: 22, borderRadius: 11, background: cc}} />
          ))}
          <div style={{flex: 1, marginLeft: 16, background: '#fff', borderRadius: 18, height: 40, fontFamily: MONO, fontSize: 22, color: '#475569', display: 'flex', alignItems: 'center', padding: '0 18px'}}>
            boulangerie-marcel.fr
          </div>
        </div>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{display: 'block', borderRadius: '0 0 24px 24px'}}>
          <defs>
            <linearGradient id="mq-head" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f472b6" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <rect width={W} height={H} fill={c > 0 ? `rgba(255,247,237,${c})` : '#fff'} />
          <rect width={W} height={H} fill="#fff" opacity={1 - c} />
          {/* bandeau titre */}
          <rect x={0} y={0} width={W} height={150} fill="url(#mq-head)" opacity={c} />
          <g opacity={ink(0)}>
            <text
              x={lerp(40, W / 2, m)}
              y={lerp(80, 95, tailles)}
              textAnchor={m > 0.5 ? 'middle' : 'start'}
              fontFamily={c > 0.5 ? FONT : SERIF_1998}
              fontWeight={700}
              fontSize={titreSize}
              fill={col('#000', '#fff')}
            >
              Boulangerie Marcel
            </text>
            {hl('titres') > 0 && <rect x={24} y={30} width={W - 48} height={80} rx={10} fill="none" stroke="#facc15" strokeWidth={8} strokeDasharray="20 12" />}
          </g>
          {/* image */}
          <g opacity={ink(1)} transform={`translate(${lerp(40, 40, m)},${lerp(130, 190, m)})`}>
            <rect width={lerp(300, 360, m)} height={lerp(170, 300, m)} rx={c * 24} fill={col('#fff', '#fde68a')} stroke={col('#000', '#f59e0b')} strokeWidth={4} />
            {c < 0.5 ? (
              <>
                <line x1={0} y1={0} x2={lerp(300, 360, m)} y2={lerp(170, 300, m)} stroke="#000" strokeWidth={3} />
                <line x1={lerp(300, 360, m)} y1={0} x2={0} y2={lerp(170, 300, m)} stroke="#000" strokeWidth={3} />
              </>
            ) : (
              <g transform={`translate(${lerp(150, 180, m)},${lerp(85, 150, m)})`}>
                <ellipse rx={110} ry={50} fill="#d97706" />
                <path d="M-70,-20 q10,30 20,0 M-20,-30 q10,30 20,0 M30,-30 q10,30 20,0" stroke="#fde68a" strokeWidth={8} fill="none" strokeLinecap="round" />
              </g>
            )}
            {hl('images') > 0 && <rect x={-14} y={-14} width={lerp(300, 360, m) + 28} height={lerp(170, 300, m) + 28} rx={12} fill="none" stroke="#facc15" strokeWidth={8} strokeDasharray="20 12" />}
          </g>
          {/* textes */}
          <g opacity={ink(2)} transform={`translate(${lerp(40, 440, m)},${lerp(350, 200, m)})`}>
            {(m > 0.5
              ? ['Pain frais tous les', 'matins depuis 1962.', 'Croissants, baguettes', 'et tartes maison.', 'Ouvert 7j/7 !']
              : ['Bienvenue sur notre site internet.', 'Pain frais tous les matins depuis 1962.', 'Croissants, baguettes et tartes maison.', 'Accueil | Nos pains | Contact']
            ).map((l, i, arr) => (
              <text
                key={i}
                x={0}
                y={i * (m > 0.5 ? 46 : 40) + 26}
                fontFamily={c > 0.5 ? FONT : SERIF_1998}
                fontWeight={c > 0.5 ? 600 : 400}
                fontSize={c > 0.5 ? 34 : 32}
                fill={c > 0.5 ? '#7c2d12' : i === arr.length - 1 && m <= 0.5 ? '#0000ee' : '#000'}
                textDecoration={c <= 0.5 && i === arr.length - 1 ? 'underline' : undefined}
              >
                {l}
              </text>
            ))}
            {hl('textes') > 0 && <rect x={-14} y={-10} width={m > 0.5 ? 430 : 810} height={186} rx={12} fill="none" stroke="#facc15" strokeWidth={8} strokeDasharray="20 12" />}
          </g>
          {/* bouton */}
          <g opacity={ink(2.5)} transform={`translate(${lerp(40, 560, m)},${lerp(540, 510, m)}) scale(${btnScale})`}>
            <rect width={220} height={70} rx={c * 35} fill={col('#e5e7eb', '#ec4899')} stroke={col('#000', '#be185d')} strokeWidth={c > 0.5 ? 0 : 2} />
            <text x={110} y={46} textAnchor="middle" fontFamily={c > 0.5 ? FONT : SERIF_1998} fontWeight={c > 0.5 ? 700 : 400} fontSize={30} fill={col('#000', '#fff')}>
              {apresClic ? 'Ajouté ✓' : 'Commander'}
            </text>
          </g>
          {/* effet JS : panier qui rebondit + compteur */}
          {apresClic && (
            <g transform={`translate(${W - 110},${60}) scale(${coeur})`}>
              <circle r={44} fill="#22c55e" />
              <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#fff">
                1
              </text>
            </g>
          )}
          {apresClic && clicK < 1 && <circle cx={670} cy={545} r={20 + clicK * 70} fill="none" stroke="#facc15" strokeWidth={8 * (1 - clicK)} />}
          {/* curseur */}
          {curseur !== undefined && f >= curseur && (
            <path transform={`translate(${curX},${curY}) scale(1.6)`} d="M0,0 L0,34 L9,26 L15,40 L21,37 L15,24 L27,24 Z" fill="#fff" stroke="#000" strokeWidth={2.5} />
          )}
        </svg>
      </div>
    </div>
  );
};

/** Lien entre deux éléments : trait animé (ok) ou chaîne cassée */
export const Lien: React.FC<{longueur: number; casse?: number; progres?: number}> = ({longueur, casse = 0, progres = 1}) => {
  const f = useCurrentFrame();
  const gap = casse * 70;
  return (
    <svg width={longueur} height={80} viewBox={`0 0 ${longueur} 80`} style={{overflow: 'visible'}}>
      <line x1={0} y1={40} x2={longueur / 2 - gap / 2} y2={40} stroke={casse > 0 ? '#ef4444' : '#4ade80'} strokeWidth={10} strokeDasharray="18 12" strokeDashoffset={-f * 2} strokeLinecap="round" opacity={progres} />
      <line x1={longueur / 2 + gap / 2} y1={40} x2={longueur} y2={40} stroke={casse > 0 ? '#ef4444' : '#4ade80'} strokeWidth={10} strokeDasharray="18 12" strokeDashoffset={-f * 2} strokeLinecap="round" opacity={progres} />
      {casse > 0.3 && (
        <text x={longueur / 2} y={58} textAnchor="middle" fontSize={54} fontFamily={FONT} fontWeight={700} fill="#ef4444" opacity={clamp(casse * 2 - 0.6)}>
          ✕
        </text>
      )}
    </svg>
  );
};

/** Icône de navigateur (personnage-fenêtre avec des yeux) */
export const IconeNavigateur: React.FC<{s?: number; regard?: number; perdu?: boolean}> = ({s = 300, regard = 0, perdu = false}) => {
  const f = useCurrentFrame();
  return (
    <svg width={s} height={s * 0.8} viewBox="0 0 200 160">
      <rect x={4} y={4} width={192} height={152} rx={18} fill="#e2e8f0" stroke="#0f1630" strokeWidth={6} />
      <rect x={4} y={4} width={192} height={34} rx={16} fill="#94a3b8" />
      {['#ef4444', '#f59e0b', '#22c55e'].map((c, i) => (
        <circle key={c} cx={24 + i * 20} cy={21} r={7} fill={c} />
      ))}
      {[70, 130].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={92} rx={20} ry={26} fill="#fff" stroke="#0f1630" strokeWidth={5} />
          <circle cx={x + regard * 9} cy={96} r={9} fill="#0f1630" />
        </g>
      ))}
      {perdu ? (
        <path d="M84,138 q8,-8 16,0 q8,8 16,0" stroke="#0f1630" strokeWidth={5} fill="none" strokeLinecap="round" />
      ) : (
        <path d="M84,134 Q100,146 116,134" stroke="#0f1630" strokeWidth={5} fill="none" strokeLinecap="round" />
      )}
      {perdu &&
        [0, 1].map((i) => (
          <text key={i} x={150 + i * 26} y={60 - i * 14 + Math.sin(f * 0.2 + i) * 4} fontFamily={FONT} fontWeight={700} fontSize={36} fill="#facc15" stroke="#0f1630" strokeWidth={2}>
            ?
          </text>
        ))}
    </svg>
  );
};
