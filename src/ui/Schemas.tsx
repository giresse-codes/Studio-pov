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

/** « Tes yeux » vs « Google » : ce que voit l'humain / ce que lit le robot */
export const SchemaYeuxGoogle: React.FC<{debut: number; fin: number; aYeux: number; aGoogle: number; aPetit: number}> = ({debut, fin, aYeux, aGoogle, aPetit}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame: f - aYeux, fps, config: {damping: 12}});
  const s2 = spring({frame: f - aGoogle, fps, config: {damping: 12}});
  const petit = interpolate(f, [aPetit, aPetit + 10], [1, 0.45], clamp);
  const bloc: React.CSSProperties = {flex: 1, borderRadius: 30, padding: '24px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16};
  return (
    <Panneau debut={debut} fin={fin} titre="CE QUE CHACUN VOIT" top={420} bottom={500}>
      <div style={{display: 'flex', gap: 24, padding: '30px 34px'}}>
        <div style={{...bloc, background: 'rgba(255,255,255,0.08)', transform: `scale(${s1})`, opacity: f >= aYeux ? 1 : 0}}>
          <div style={{fontSize: 90}}>👀</div>
          <div style={{color: C.jaune, fontWeight: 900, fontSize: 46}}>TES YEUX</div>
          <div style={{background: '#fff4e6', borderRadius: 20, width: '100%', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{color: '#3b2418', fontWeight: 900, fontSize: 92, lineHeight: 0.95, textAlign: 'center'}}>CAFÉ<br />PANAME</div>
          </div>
          <div style={{color: C.vert, fontWeight: 900, fontSize: 40}}>« Un titre ! »</div>
        </div>
        <div style={{...bloc, background: 'rgba(255,255,255,0.08)', transform: `scale(${s2})`, opacity: f >= aGoogle ? 1 : 0}}>
          <div style={{fontSize: 90}}>🤖</div>
          <div style={{color: C.jaune, fontWeight: 900, fontSize: 46}}>GOOGLE</div>
          <div style={{background: '#0b0d1f', borderRadius: 20, width: '100%', height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: POLICE_CODE, fontWeight: 700}}>
            <div style={{transform: `scale(${petit})`, textAlign: 'center'}}>
              <div style={{color: '#ff79c6', fontSize: 50}}>{'<p>'}</div>
              <div style={{color: '#e6e8ff', fontSize: 40}}>Café Paname</div>
              <div style={{color: '#ff79c6', fontSize: 50}}>{'</p>'}</div>
            </div>
          </div>
          <div style={{color: C.rouge, fontWeight: 900, fontSize: 40, opacity: f >= aPetit ? 1 : 0}}>« Un paragraphe. »</div>
        </div>
      </div>
    </Panneau>
  );
};

/** Hiérarchie des titres h1 > h2 > h3 (+ bénéfices) */
export const SchemaHierarchie: React.FC<{debut: number; fin: number; aH1: number; aSeul: number; aH2: number; aH3: number; aGoogle: number; aLecteur: number}> = ({
  debut, fin, aH1, aSeul, aH2, aH3, aGoogle, aLecteur,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ligne = (a: number, balise: string, texte: string, retrait: number, taille: number, couleur: string) => {
    const s = spring({frame: f - a, fps, config: {damping: 12}});
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 22, marginLeft: retrait, opacity: f >= a ? 1 : 0, transform: `translateX(${(1 - s) * 200}px)`}}>
        <div style={{background: couleur, color: '#fff', fontFamily: POLICE_CODE, fontWeight: 700, fontSize: 44, padding: '8px 20px', borderRadius: 16, minWidth: 110, textAlign: 'center'}}>{balise}</div>
        <div style={{color: '#fff', fontWeight: 900, fontSize: taille, lineHeight: 1}}>{texte}</div>
      </div>
    );
  };
  const badge = (a: number, texte: string) => {
    const s = spring({frame: f - a, fps, config: {damping: 10}});
    return <div style={{transform: `scale(${f >= a ? s : 0})`, background: C.vert, color: C.noir, fontWeight: 900, fontSize: 40, padding: '14px 24px', borderRadius: 22}}>{texte}</div>;
  };
  const seul = spring({frame: f - aSeul, fps, config: {damping: 9}});
  return (
    <Panneau debut={debut} fin={fin} titre="LES TITRES" top={420} bottom={500}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 34, padding: '40px 46px'}}>
        <div style={{position: 'relative'}}>
          {ligne(aH1, 'h1', 'Titre principal', 0, 72, '#e8642c')}
          <div style={{position: 'absolute', right: 0, top: -30, transform: `rotate(8deg) scale(${f >= aSeul ? seul : 0})`, background: C.jaune, color: C.noir,
            fontWeight: 900, fontSize: 36, padding: '8px 18px', borderRadius: 14}}>☝️ 1 SEUL / PAGE</div>
        </div>
        {ligne(aH2, 'h2', 'Grandes parties', 70, 58, '#2f6fe0')}
        {ligne(aH3, 'h3', 'Sous-parties', 140, 46, '#8a4fff')}
        {ligne(aH3 + 6, 'h3', 'Sous-parties', 140, 46, '#8a4fff')}
        <div style={{display: 'flex', gap: 20, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap'}}>
          {badge(aGoogle, '🤖 Google ✓')}
          {badge(aLecteur, '🔊 Lecteurs d’écran ✓')}
        </div>
      </div>
    </Panneau>
  );
};

/** Deux options de code côte à côte (avant le choix) */
export const SchemaDeuxOptions: React.FC<{debut: number; fin: number; a1: number; a2: number; titre1: string; code1: string[]; titre2: string; code2: string[]}> = ({
  debut, fin, a1, a2, titre1, code1, titre2, code2,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opt = (a: number, titre: string, code: string[], couleur: string) => {
    const s = spring({frame: f - a, fps, config: {damping: 12}});
    return (
      <div style={{opacity: f >= a ? 1 : 0, transform: `scale(${s})`, border: `5px solid ${couleur}`, borderRadius: 30, padding: '22px 26px', background: 'rgba(255,255,255,0.06)'}}>
        <div style={{color: couleur, fontWeight: 900, fontSize: 50, marginBottom: 14}}>{titre}</div>
        <div style={{background: '#0b0d1f', borderRadius: 18, padding: '16px 20px', fontFamily: POLICE_CODE, fontWeight: 700, fontSize: 38, color: '#e6e8ff', whiteSpace: 'pre', lineHeight: 1.4}}>
          {code.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    );
  };
  return (
    <Panneau debut={debut} fin={fin} titre="2 OPTIONS" top={420} bottom={500}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 34, padding: '34px 40px'}}>
        {opt(a1, titre1, code1, C.vert)}
        {opt(a2, titre2, code2, C.rouge)}
      </div>
    </Panneau>
  );
};

/**
 * Le chemin d'un fichier = un GPS : arborescence + repère qui se déplace.
 * Étapes : départ (index.html) → « à côté » (rien) → entre dans images/ → photo trouvée → ../ remonte.
 */
export const SchemaChemin: React.FC<{
  debut: number; fin: number; aCote: number; aRien: number; aImages: number; aTrouve: number; aRemonte: number; titre?: string;
}> = ({debut, fin, aCote, aRien, aImages, aTrouve, aRemonte, titre = 'LE CHEMIN = UN GPS'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const H = 118;
  const rows = [
    {ic: '📁', nom: 'site/', ind: 0},
    {ic: '📄', nom: 'index.html', ind: 1},
    {ic: '❓', nom: '(à côté)', ind: 1, fantome: true},
    {ic: '📁', nom: 'images/', ind: 1},
    {ic: '🖼️', nom: 'photo.jpg', ind: 2},
  ];
  // position du repère (index de ligne, fractionnaire)
  const etapes: [number, number][] = [[debut, 1], [aCote, 2], [aImages, 3], [aTrouve, 4], [aRemonte, 0]];
  let pos = 1;
  for (const [a, r] of etapes) pos = pos + (r - pos) * interpolate(f, [a, a + 10], [0, 1], {...clamp});
  const rien = f >= aRien && f < aImages;
  const trouve = f >= aTrouve;
  const sR = spring({frame: f - aRemonte, fps, config: {damping: 12}});
  const codeImages = interpolate(f, [aImages, aImages + 8], [0, 1], clamp);
  return (
    <Panneau debut={debut} fin={fin} titre={titre} top={420} bottom={500}>
      <div style={{position: 'relative', margin: '30px 40px 0', height: H * rows.length}}>
        {rows.map((r, i) => (
          <div key={i} style={{position: 'absolute', top: i * H, left: r.ind * 90, height: H, display: 'flex', alignItems: 'center', gap: 18,
            opacity: r.fantome ? (f >= aCote ? 0.9 : 0) : 1}}>
            <span style={{fontSize: 64}}>{r.ic}</span>
            <span style={{fontFamily: POLICE_CODE, fontWeight: 700, fontSize: 52, color: r.fantome ? '#8890b8' : i === 4 && trouve ? C.vert : '#fff',
              fontStyle: r.fantome ? 'italic' : 'normal'}}>{r.nom}</span>
            {r.fantome && rien && <span style={{color: C.rouge, fontWeight: 900, fontSize: 56}}>❌ RIEN</span>}
            {i === 4 && trouve && <span style={{color: C.vert, fontWeight: 900, fontSize: 56}}>✓</span>}
          </div>
        ))}
        {/* repère GPS */}
        <div style={{position: 'absolute', right: 30, top: pos * H + 10, fontSize: 80, transform: `rotate(${Math.sin(f / 5) * 8}deg)`}}>📍</div>
        {/* ../ : remonte d'un dossier */}
        {f >= aRemonte && (
          <div style={{position: 'absolute', left: 200, top: 0.5 * H, height: 3 * H, display: 'flex', alignItems: 'center', transform: `scale(${sR})`, transformOrigin: 'left center'}}>
            <svg width={90} height={3 * H} style={{position: 'absolute', left: 230}}>
              <path d={`M20,${3 * H - 20} C80,${3 * H - 40} 80,40 20,20`} stroke={C.jaune} strokeWidth={10} fill="none" strokeLinecap="round" />
              <path d="M20,20 L44,8 M20,20 L40,40" stroke={C.jaune} strokeWidth={10} strokeLinecap="round" />
            </svg>
            <div style={{position: 'absolute', left: 330, background: C.jaune, color: C.noir, fontWeight: 900, fontSize: 38, padding: '8px 18px', borderRadius: 14, whiteSpace: 'nowrap',
              fontFamily: POLICE_CODE}}>../ = remonte</div>
          </div>
        )}
      </div>
      {/* le code */}
      <div style={{margin: '26px 40px', background: '#0b0d1f', borderRadius: 22, padding: '20px 26px', border: `4px solid ${codeImages > 0.5 ? C.vert : C.rouge}`,
        fontFamily: POLICE_CODE, fontWeight: 700, fontSize: 46, color: '#e6e8ff', whiteSpace: 'nowrap'}}>
        <span style={{color: '#ff79c6'}}>{'<img '}</span><span style={{color: '#8be9fd'}}>src</span>=<span style={{color: '#f1fa8c'}}>"</span>
        <span style={{color: C.vert, display: 'inline-block', maxWidth: codeImages * 260, overflow: 'hidden', verticalAlign: 'bottom'}}>images/</span>
        <span style={{color: '#f1fa8c'}}>photo.jpg"</span><span style={{color: '#ff79c6'}}>{'>'}</span>
      </div>
    </Panneau>
  );
};

/** 200 photos en vrac à côté de index.html : le bazar */
export const SchemaBazar: React.FC<{debut: number; fin: number; aPile: number; aDeuxCents: number}> = ({debut, fin, aPile, aDeuxCents}) => {
  const f = useCurrentFrame();
  const n = Math.floor(interpolate(f, [aPile, aDeuxCents + 6], [6, 200], clamp));
  const ic = ['🖼️', '📷', '🌄', '🏞️'];
  return (
    <Panneau debut={debut} fin={fin} titre="TOUT EN VRAC…" top={420} bottom={500}>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 6, padding: '24px 34px', justifyContent: 'center'}}>
        {Array.from({length: n}).map((_, i) => (
          i === 87 ? (
            <div key={i} style={{fontFamily: POLICE_CODE, fontWeight: 700, fontSize: 22, background: '#e8642c', color: '#fff', padding: '6px 8px', borderRadius: 8}}>index.html</div>
          ) : <span key={i} style={{fontSize: 38, transform: `rotate(${((i * 37) % 30) - 15}deg)`}}>{ic[i % 4]}</span>
        ))}
      </div>
      <div style={{position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center', opacity: f >= aDeuxCents ? 1 : 0}}>
        <span style={{background: C.rouge, color: '#fff', fontWeight: 900, fontSize: 64, padding: '12px 30px', borderRadius: 24}}>200 PHOTOS 😵</span>
      </div>
    </Panneau>
  );
};

/** Trois liens qui marchent : page interne, lien externe dans un nouvel onglet, téléphone */
export const SchemaTroisLiens: React.FC<{
  debut: number; fin: number; aBalise: number; aDestination: number; aContact: number; aInsta: number; aBlank: number; aTel: number; aAppel: number;
}> = ({debut, fin, aBalise, aDestination, aContact, aInsta, aBlank, aTel, aAppel}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = (a: number) => interpolate(f, [a, a + 6], [0, 1], clamp);
  const bloc = (a: number, contenu: React.ReactNode, etiquette: React.ReactNode, couleur: string) => {
    const s = spring({frame: f - a, fps, config: {damping: 12}});
    return (
      <div style={{opacity: f >= a ? 1 : 0, transform: `translateX(${(1 - s) * 300}px)`, border: `5px solid ${couleur}`, borderRadius: 28, padding: '18px 22px',
        background: 'rgba(255,255,255,0.06)'}}>
        <div style={{background: '#0b0d1f', borderRadius: 16, padding: '14px 18px', fontFamily: POLICE_CODE, fontWeight: 700, fontSize: 38, color: '#e6e8ff',
          whiteSpace: 'pre', lineHeight: 1.45}}>{contenu}</div>
        <div style={{marginTop: 12, display: 'flex', gap: 14, flexWrap: 'wrap'}}>{etiquette}</div>
      </div>
    );
  };
  const tag = (a: number, t: string, fond: string = C.jaune) => (
    <span style={{opacity: v(a), transform: `scale(${0.6 + v(a) * 0.4})`, background: fond, color: C.noir, fontWeight: 900, fontSize: 38, padding: '8px 18px', borderRadius: 12,
      display: 'inline-block'}}>{t}</span>
  );
  const rose = '#ff79c6', bleu = '#8be9fd', jaune = '#f1fa8c';
  return (
    <Panneau debut={debut} fin={fin} titre="DES LIENS QUI MARCHENT" top={420} bottom={480}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 34, padding: '30px 30px'}}>
        {bloc(aBalise, (
          <>
            <span style={{color: rose, background: f >= aBalise && f < aDestination ? 'rgba(255,121,198,0.25)' : 'transparent'}}>{'<a'}</span>{' '}
            <span style={{color: bleu, background: f >= aDestination && f < aContact ? 'rgba(139,233,253,0.25)' : 'transparent'}}>href</span>=
            <span style={{color: jaune, opacity: v(aContact)}}>"contact.html"</span><span style={{color: rose}}>{'>'}</span>Contact<span style={{color: rose}}>{'</a>'}</span>
          </>
        ), <>{tag(aBalise, 'a = un lien')}{tag(aDestination, 'href = destination 📍')}</>, C.vert)}
        {bloc(aInsta, (
          <>
            <span style={{color: rose}}>{'<a'}</span> <span style={{color: bleu}}>href</span>=<span style={{color: jaune}}>"https://instagram.com/…"</span>{'\n   '}
            <span style={{opacity: v(aBlank)}}><span style={{color: bleu}}>target</span>=<span style={{color: jaune}}>"_blank"</span></span><span style={{color: rose}}>{'>'}</span>Insta<span style={{color: rose}}>{'</a>'}</span>
          </>
        ), <>{tag(aInsta, 'adresse complète https://')}{tag(aBlank, 'nouvel onglet ↗', C.vert)}</>, '#5a9bff')}
        {bloc(aTel, (
          <>
            <span style={{color: rose}}>{'<a'}</span> <span style={{color: bleu}}>href</span>=<span style={{color: jaune}}>"tel:0123456789"</span><span style={{color: rose}}>{'>'}</span>Appeler<span style={{color: rose}}>{'</a>'}</span>
          </>
        ), <>{tag(aTel, 'BONUS ⭐')}{tag(aAppel, '📞 1 clic = ça appelle', C.vert)}</>, C.or)}
      </div>
    </Panneau>
  );
};

/** Petit bouton coloré (HTML) pour les schémas CSS */
const BoutonDemo: React.FC<{texte: string; couleur: string; taille?: number; s?: number}> = ({texte, couleur, taille = 36, s = 1}) => (
  <span style={{display: 'inline-block', background: couleur, color: '#fff', fontWeight: 900, fontSize: taille, padding: '12px 24px', borderRadius: 18,
    boxShadow: '0 6px 0 rgba(0,0,0,0.3)', transform: `scale(${s})`}}>{texte}</span>
);

/** Une classe : HTML class="…" + CSS .classe → seul le bouton ciblé change */
export const SchemaClasse: React.FC<{debut: number; fin: number; aHTML: number; aCSS: number; aVert: number; classe?: string}> = ({debut, fin, aHTML, aCSS, aVert, classe = 'btn-acheter'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = (a: number) => interpolate(f, [a, a + 6], [0, 1], clamp);
  const sV = spring({frame: f - aVert, fps, config: {damping: 8}});
  const code: React.CSSProperties = {background: '#0b0d1f', borderRadius: 18, padding: '16px 22px', fontFamily: POLICE_CODE, fontWeight: 700, fontSize: 38, color: '#e6e8ff', whiteSpace: 'pre', lineHeight: 1.45};
  return (
    <Panneau debut={debut} fin={fin} titre="LA CLASSE" top={420} bottom={480}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, padding: '28px 36px'}}>
        <div style={{opacity: v(aHTML)}}>
          <div style={{color: '#e8642c', fontWeight: 900, fontSize: 40, marginBottom: 8}}>HTML</div>
          <div style={code}><span style={{color: '#ff79c6'}}>{'<button'}</span> <span style={{color: '#8be9fd', background: 'rgba(62,224,122,0.2)'}}>class</span>=<span style={{color: '#50fa7b'}}>"{classe}"</span><span style={{color: '#ff79c6'}}>{'>'}</span>{'\n  Acheter'}<span style={{color: '#ff79c6'}}>{'</button>'}</span></div>
        </div>
        <div style={{opacity: v(aCSS)}}>
          <div style={{color: '#5a9bff', fontWeight: 900, fontSize: 40, marginBottom: 8}}>CSS</div>
          <div style={code}><span style={{color: '#50fa7b', background: 'rgba(62,224,122,0.2)'}}>.{classe}</span>{' {\n  '}<span style={{color: '#8be9fd'}}>background</span>: <span style={{color: '#50fa7b'}}>green</span>{';\n}'}</div>
        </div>
        <div style={{display: 'flex', gap: 18, justifyContent: 'center', marginTop: 10}}>
          <BoutonDemo texte="Menu" couleur="#ff9f1a" />
          <BoutonDemo texte="Réserver" couleur="#ff9f1a" />
          <BoutonDemo texte="Acheter" couleur={f >= aVert ? '#1faa55' : '#ff9f1a'} s={f >= aVert ? 1 + (1 - sV) * 0.3 : 1} />
        </div>
      </div>
    </Panneau>
  );
};

/** Point (classe, plusieurs éléments) ou dièse (id, un seul élément) */
export const SchemaPointDiese: React.FC<{debut: number; fin: number; aPoint: number; aDiese: number}> = ({debut, fin, aPoint, aDiese}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const carte = (a: number, signe: string, nom: string, texte: string, contenu: React.ReactNode, couleur: string) => {
    const s = spring({frame: f - a, fps, config: {damping: 12}});
    return (
      <div style={{flex: 1, opacity: f >= a ? 1 : 0, transform: `scale(${s})`, border: `5px solid ${couleur}`, borderRadius: 30, padding: '26px 20px', background: 'rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
        <div style={{fontFamily: POLICE_CODE, fontWeight: 700, fontSize: 84, color: couleur, lineHeight: 1}}>{signe}</div>
        <div style={{color: '#fff', fontWeight: 900, fontSize: 52}}>{nom}</div>
        <div style={{color: C.vert, fontWeight: 800, fontSize: 36, textAlign: 'center'}}>{texte}</div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center'}}>{contenu}</div>
      </div>
    );
  };
  return (
    <Panneau debut={debut} fin={fin} titre="POINT OU DIÈSE ?" top={420} bottom={480}>
      <div style={{display: 'flex', gap: 24, padding: '34px 34px'}}>
        {carte(aPoint, '.btn', 'classe', 'à plein d’éléments', <>{[0, 1, 2, 3].map((i) => <BoutonDemo key={i} texte="btn" couleur="#1faa55" taille={28} />)}</>, C.vert)}
        {carte(aDiese, '#logo', 'id', 'un seul élément unique', <BoutonDemo texte="👑 logo" couleur="#8a4fff" taille={32} />, '#b48cff')}
      </div>
    </Panneau>
  );
};

/** La règle la plus précise gagne */
export const SchemaPrecision: React.FC<{debut: number; fin: number; aGagne: number; aClasse: number}> = ({debut, fin, aGagne, aClasse}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sG = spring({frame: f - aGagne, fps, config: {damping: 9}});
  const k = interpolate(f, [aGagne, aGagne + 10], [0, 1], clamp);
  const regle = (sel: string, val: string, couleur: string, gagnant: boolean, precision: string) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: gagnant ? 1 : 1 - k * 0.55, transform: `scale(${gagnant ? 1 + k * 0.06 : 1 - k * 0.06})`,
      border: `5px solid ${gagnant && k > 0.5 ? C.or : 'transparent'}`, borderRadius: 26, padding: '16px 20px', background: 'rgba(255,255,255,0.06)'}}>
      <div style={{flex: 1, fontFamily: POLICE_CODE, fontWeight: 700, fontSize: 40, color: '#e6e8ff', whiteSpace: 'pre'}}>
        <span style={{color: gagnant ? '#50fa7b' : '#ffb86c'}}>{sel}</span>{' { '}<span style={{color: couleur}}>{val}</span>{' }'}
        <div style={{fontFamily: "'Inter Studio', sans-serif", fontWeight: 900, fontSize: 32, color: '#c9d0ff', marginTop: 6}}>{precision}</div>
      </div>
      {gagnant && <div style={{fontSize: 90, transform: `scale(${f >= aGagne ? sG : 0})`}}>🏆</div>}
      {!gagnant && <div style={{fontSize: 70, opacity: k}}>❌</div>}
    </div>
  );
  return (
    <Panneau debut={debut} fin={fin} titre="QUI GAGNE ?" top={420} bottom={480}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 28, padding: '34px 36px'}}>
        {regle('button', 'orange', '#ff9f1a', false, 'tous les boutons')}
        {regle('.btn-acheter', 'green', '#50fa7b', true, 'UN bouton précis')}
        <div style={{textAlign: 'center', marginTop: 10, opacity: interpolate(f, [aClasse, aClasse + 8], [0, 1], clamp)}}>
          <span style={{background: C.jaune, color: C.noir, fontWeight: 900, fontSize: 50, padding: '12px 28px', borderRadius: 20}}>PLUS PRÉCIS = GAGNE</span>
        </div>
      </div>
    </Panneau>
  );
};
