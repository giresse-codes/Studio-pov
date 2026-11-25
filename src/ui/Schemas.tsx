import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp} from '../lib/anim';
import {C, POLICE, POLICE_CODE} from '../lib/theme';

/** Panneau plein écran façon tableau de jeu (fond bleu nuit, bord doré) qui glisse depuis la droite */
export const Panneau: React.FC<{debut: number; fin: number; titre?: string; children: React.ReactNode; top?: number; bottom?: number}> = ({
  debut, fin, titre, children, top = 300, bottom = 600,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < debut || f > fin + 12) return null;
  const s = spring({frame: f - debut, fps, config: {damping: 15, stiffness: 120}});
  const sortie = interpolate(f, [fin, fin + 12], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top, bottom, transform: `translateX(${(1 - s) * 1100 - sortie * 1100}px) rotate(${(1 - s) * 6}deg)`,
      background: `linear-gradient(160deg, ${C.nuit2}, ${C.nuit})`, border: `10px solid ${C.or}`, borderRadius: 46,
      boxShadow: `inset 0 0 0 6px ${C.orFonce}, 0 30px 60px rgba(0,0,0,0.5)`, fontFamily: POLICE, overflow: 'hidden'}}>
      {titre && <div style={{textAlign: 'center', color: '#fff', fontWeight: 900, fontSize: 70, marginTop: 30, letterSpacing: -1}}>{titre}</div>}
      {children}
    </div>
  );
};

/** Icône de fichier (index.html, style.css…) */
export const IconeFichier: React.FC<{nom: string; couleur: string; taille?: number; barre?: boolean}> = ({nom, couleur, taille = 1, barre}) => (
  <div style={{position: 'relative', width: 150 * taille, height: 186 * taille, flexShrink: 0}}>
    <svg width={150 * taille} height={186 * taille} viewBox="0 0 150 186">
      <path d="M10,0 L105,0 L150,45 L150,176 Q150,186 140,186 L10,186 Q0,186 0,176 L0,10 Q0,0 10,0 Z" fill="#fff" />
      <path d="M105,0 L105,45 L150,45 Z" fill="#d6d9e6" />
      <rect x={0} y={110} width={150} height={56} fill={couleur} />
      <text x={75} y={148} textAnchor="middle" fontFamily={POLICE_CODE} fontWeight={700} fontSize={nom.length > 9 ? 19 : 24} fill="#fff">{nom}</text>
      {[30, 50, 70].map((y) => <rect key={y} x={18} y={y} width={y === 50 ? 60 : 84} height={9} rx={4} fill="#c9cde0" />)}
      {barre && <path d="M-10,196 L160,-10" stroke={C.rouge} strokeWidth={16} strokeLinecap="round" />}
    </svg>
  </div>
);

/** Petit bonhomme du schéma : squelette (HTML), habillé (CSS), qui bouge (JS) */
export const Bonhomme: React.FC<{habits: number; muscles: number; frame: number}> = ({habits, muscles, frame}) => {
  const flex = muscles > 0 ? Math.sin(frame / 4) * 0.5 + 0.5 : 0;
  const brasAng = -40 - flex * 70 * muscles;
  return (
    <svg width={170} height={230} viewBox="-85 -20 170 230">
      {/* habits (CSS) */}
      <g opacity={habits}>
        <path d="M-40,62 Q-42,48 -24,46 L24,46 Q42,48 40,62 L38,130 L-38,130 Z" fill={C.toiSweat} />
        <path d="M-34,130 L-30,196 L-8,196 L-4,138 L4,138 L8,196 L30,196 L34,130 Z" fill={C.toiJean} />
        <ellipse cx={-19} cy={200} rx={18} ry={8} fill="#fff" />
        <ellipse cx={19} cy={200} rx={18} ry={8} fill="#fff" />
      </g>
      {/* squelette (HTML) */}
      <g stroke="#fff" strokeWidth={7} strokeLinecap="round" fill="none" opacity={1 - habits * 0.75}>
        <line x1={0} y1={44} x2={0} y2={128} />
        {[60, 76, 92, 108].map((y) => <line key={y} x1={-18} y1={y} x2={18} y2={y} />)}
        <line x1={0} y1={128} x2={-18} y2={196} />
        <line x1={0} y1={128} x2={18} y2={196} />
        <line x1={0} y1={50} x2={-38} y2={110} />
      </g>
      {/* bras qui bouge (JS) */}
      <g transform={`translate(10,52) rotate(${brasAng})`}>
        <line x1={0} y1={0} x2={0} y2={60} stroke={habits > 0.5 ? C.toiSweat : '#fff'} strokeWidth={habits > 0.5 ? 20 : 7} strokeLinecap="round" />
        <circle cx={0} cy={62} r={habits > 0.5 ? 13 : 0} fill={C.noir} />
      </g>
      {muscles > 0.5 && [0, 1, 2].map((i) => (
        <path key={i} d={`M${50 + i * 10},${10 + i * 16} q10,-6 16,0`} stroke={C.jaune} strokeWidth={5} fill="none" strokeLinecap="round" opacity={flex} />
      ))}
      {/* tête */}
      <circle cx={0} cy={18} r={28} fill={C.noir} stroke="#fff" strokeWidth={habits > 0.5 ? 0 : 4} />
      <ellipse cx={-6} cy={14} rx={7} ry={9} fill="#fff" />
      <ellipse cx={12} cy={14} rx={7} ry={9} fill="#fff" />
    </svg>
  );
};

/** Schéma « un site = 3 fichiers » : chaque ligne apparaît à sa frame */
export const SchemaTroisFichiers: React.FC<{debut: number; fin: number; aHTML: number; aCSS: number; aJS: number}> = ({debut, fin, aHTML, aCSS, aJS}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lignes = [
    {a: aHTML, nom: 'index.html', couleur: '#e8642c', titre: 'HTML', role: 'le squelette', detail: 'titres, textes, images', habits: 0, muscles: 0},
    {a: aCSS, nom: 'style.css', couleur: '#2f6fe0', titre: 'CSS', role: 'les vêtements', detail: 'couleurs, tailles, mise en page', habits: 1, muscles: 0},
    {a: aJS, nom: 'script.js', couleur: '#d9b400', titre: 'JS', role: 'les muscles', detail: 'ce qui bouge au clic', habits: 1, muscles: 1},
  ];
  return (
    <Panneau debut={debut} fin={fin} titre="UN SITE = 3 FICHIERS" top={420} bottom={500}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 22, padding: '24px 36px'}}>
        {lignes.map((l, i) => {
          const s = spring({frame: f - l.a, fps, config: {damping: 12}});
          if (f < l.a) return <div key={i} style={{height: 200}} />;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, transform: `scale(${s})`, transformOrigin: 'left center', height: 200,
              background: 'rgba(255,255,255,0.06)', borderRadius: 30, padding: '0 20px'}}>
              <IconeFichier nom={l.nom} couleur={l.couleur} taille={0.95} />
              <div style={{flex: 1}}>
                <div style={{color: '#fff', fontWeight: 900, fontSize: 64, lineHeight: 1}}>{l.titre}</div>
                <div style={{color: C.jaune, fontWeight: 900, fontSize: 46, marginTop: 6}}>{l.role}</div>
                <div style={{color: C.vert, fontWeight: 800, fontSize: 34, marginTop: 6}}>{l.detail}</div>
              </div>
              <Bonhomme habits={l.habits} muscles={l.muscles} frame={f} />
            </div>
          );
        })}
      </div>
    </Panneau>
  );
};

/** Schéma « HTML cassé ? ou CSS pas relié ? » */
export const SchemaDeuxPistes: React.FC<{debut: number; fin: number; aPiste2: number; relie?: number}> = ({debut, fin, aPiste2, relie}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s2 = spring({frame: f - aPiste2, fps, config: {damping: 12}});
  const connecte = relie !== undefined && f >= relie;
  const k = relie !== undefined ? interpolate(f, [relie, relie + 10], [0, 1], clamp) : 0;
  return (
    <Panneau debut={debut} fin={fin} titre="2 PISTES" top={420} bottom={500}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 34, padding: '34px 46px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30, background: 'rgba(255,71,87,0.15)', borderRadius: 30, padding: 26, border: `4px solid ${C.rouge}`}}>
          <div style={{position: 'relative'}}>
            <IconeFichier nom="index.html" couleur="#e8642c" />
            <svg width={150} height={186} style={{position: 'absolute', inset: 0}}>
              <path d="M70,0 L84,50 L62,90 L90,130 L72,186" stroke="#141418" strokeWidth={8} fill="none" />
            </svg>
          </div>
          <div style={{color: '#fff', fontWeight: 900, fontSize: 52, lineHeight: 1.15}}>HTML cassé ?<br /><span style={{color: C.jaune, fontSize: 42}}>→ tu réécris tout</span></div>
        </div>
        <div style={{opacity: f >= aPiste2 ? 1 : 0, transform: `scale(${s2})`, background: 'rgba(62,224,122,0.12)', borderRadius: 30, padding: 26, border: `4px solid ${C.vert}`}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <IconeFichier nom="index.html" couleur="#e8642c" taille={0.85} />
            <svg width={300} height={120}>
              <path d="M10,60 C80,0 120,120 140,60" stroke={connecte ? C.vert : '#c9cde0'} strokeWidth={12} fill="none" strokeLinecap="round" />
              <path d={`M${160 - (1 - k) * 0},60 C${180},0 ${220},120 290,60`} stroke={connecte ? C.vert : '#c9cde0'} strokeWidth={12} fill="none" strokeLinecap="round"
                transform={`translate(${(1 - k) * 30},${(1 - k) * 20}) rotate(${(1 - k) * 12},160,60)`} />
              {!connecte && <text x={150} y={110} textAnchor="middle" fontSize={44}>✂️</text>}
              {connecte && <circle cx={150} cy={60} r={18} fill={C.vert} />}
            </svg>
            <IconeFichier nom="style.css" couleur="#2f6fe0" taille={0.85} />
          </div>
          <div style={{color: '#fff', fontWeight: 900, fontSize: 48, lineHeight: 1.15, marginTop: 14}}>Le CSS existe…<br /><span style={{color: C.jaune, fontSize: 42}}>mais il n’est pas relié !</span></div>
        </div>
      </div>
    </Panneau>
  );
};
