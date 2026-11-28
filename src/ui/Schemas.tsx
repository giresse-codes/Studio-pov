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

/** Bulle de parole (repère écran) : la réplique d'un personnage rapportée en carte */
export const BulleParole: React.FC<{a: number; fin: number; x: number; y: number; texte: string; queue?: 'gauche' | 'droite'; largeur?: number}> = ({
  a, fin, x, y, texte, queue = 'gauche', largeur = 560,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < a || f > fin + 8) return null;
  const s = spring({frame: f - a, fps, config: {damping: 10, stiffness: 180}});
  const sortie = interpolate(f, [fin, fin + 8], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: largeur, transform: `translate(-50%,-100%) scale(${s * (1 - sortie)})`, transformOrigin: queue === 'gauche' ? '20% 100%' : '80% 100%',
      fontFamily: POLICE}}>
      <div style={{background: '#fff', border: '6px solid #141418', borderRadius: 36, padding: '22px 28px', fontWeight: 900, fontSize: 46, lineHeight: 1.15, color: '#141418',
        boxShadow: '0 10px 0 rgba(0,0,0,0.3)', textAlign: 'center'}}>{texte}</div>
      <svg width={70} height={50} style={{position: 'absolute', bottom: -44, [queue === 'gauche' ? 'left' : 'right']: 70}}>
        <path d={queue === 'gauche' ? 'M0,0 L60,0 L10,46 Z' : 'M10,0 L70,0 L60,46 Z'} fill="#fff" stroke="#141418" strokeWidth={6} strokeLinejoin="round" />
        <rect x={0} y={-6} width={70} height={12} fill="#fff" />
      </svg>
    </div>
  );
};

/** Liste à puces qui apparaissent une à une (icône + texte) */
export const SchemaListe: React.FC<{debut: number; fin: number; titre: string; items: {a: number; icone: string; texte: string; couleur?: string}[]; tampon?: {a: number; texte: string}}> = ({
  debut, fin, titre, items, tampon,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sT = tampon ? spring({frame: f - tampon.a, fps, config: {damping: 9}}) : 0;
  return (
    <Panneau debut={debut} fin={fin} titre={titre} top={420} bottom={480}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 26, padding: '34px 40px'}}>
        {items.map((it, i) => {
          const s = spring({frame: f - it.a, fps, config: {damping: 12}});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 24, opacity: f >= it.a ? 1 : 0, transform: `translateX(${(1 - s) * 250}px)`,
              background: 'rgba(255,255,255,0.07)', borderRadius: 28, padding: '20px 24px', borderLeft: `12px solid ${it.couleur ?? C.jaune}`}}>
              <span style={{fontSize: 80, lineHeight: 1}}>{it.icone}</span>
              <span style={{color: '#fff', fontWeight: 900, fontSize: 48, lineHeight: 1.15}}>{it.texte}</span>
            </div>
          );
        })}
      </div>
      {tampon && f >= tampon.a && (
        <div style={{position: 'absolute', right: 40, bottom: 40, transform: `rotate(-12deg) scale(${sT})`, border: `10px solid ${C.rouge}`, color: C.rouge, fontWeight: 900,
          fontSize: 90, padding: '6px 30px', borderRadius: 20, background: 'rgba(255,255,255,0.9)'}}>{tampon.texte}</div>
      )}
    </Panneau>
  );
};

/** Équation en icônes : A + B = C (chaque terme apparaît à sa frame) */
export const SchemaEquation: React.FC<{debut: number; fin: number; titre: string; termes: {a: number; icone: string; texte: string}[]; resultat: {a: number; icone: string; texte: string}}> = ({
  debut, fin, titre, termes, resultat,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bloc = (a: number, icone: string, texte: string, rouge?: boolean) => {
    const s = spring({frame: f - a, fps, config: {damping: 10}});
    return (
      <div style={{opacity: f >= a ? 1 : 0, transform: `scale(${s})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        background: rouge ? 'rgba(255,71,87,0.2)' : 'rgba(255,255,255,0.08)', border: rouge ? `5px solid ${C.rouge}` : 'none', borderRadius: 30, padding: '24px 30px', minWidth: 220}}>
        <span style={{fontSize: 120, lineHeight: 1}}>{icone}</span>
        <span style={{color: rouge ? C.rouge : '#fff', fontWeight: 900, fontSize: 44, textAlign: 'center'}}>{texte}</span>
      </div>
    );
  };
  const op = (a: number, t: string) => <span style={{color: C.jaune, fontWeight: 900, fontSize: 100, opacity: f >= a ? 1 : 0}}>{t}</span>;
  return (
    <Panneau debut={debut} fin={fin} titre={titre} top={420} bottom={480}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 30px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
          {bloc(termes[0].a, termes[0].icone, termes[0].texte)}
          {op(termes[1].a, '+')}
          {bloc(termes[1].a, termes[1].icone, termes[1].texte)}
        </div>
        {op(resultat.a, '=')}
        {bloc(resultat.a, resultat.icone, resultat.texte, true)}
      </div>
    </Panneau>
  );
};

/** Étapes numérotées en icônes (grille 2 colonnes) */
export const SchemaEtapes: React.FC<{debut: number; fin: number; titre: string; etapes: {a: number; icone: string; texte: string}[]}> = ({debut, fin, titre, etapes}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Panneau debut={debut} fin={fin} titre={titre} top={420} bottom={480}>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 20, padding: '30px 30px', justifyContent: 'center'}}>
        {etapes.map((e, i) => {
          const s = spring({frame: f - e.a, fps, config: {damping: 10}});
          return (
            <div key={i} style={{width: e === etapes[etapes.length - 1] && etapes.length % 2 ? '96%' : '47%', opacity: f >= e.a ? 1 : 0, transform: `scale(${s})`,
              background: 'rgba(255,255,255,0.08)', borderRadius: 28, padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative'}}>
              <div style={{position: 'absolute', top: -14, left: -10, width: 54, height: 54, borderRadius: 27, background: C.or, color: C.nuit, fontWeight: 900, fontSize: 34,
                display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
              <span style={{fontSize: 72, lineHeight: 1, marginLeft: 20}}>{e.icone}</span>
              <span style={{color: '#fff', fontWeight: 900, fontSize: 38, lineHeight: 1.12}}>{e.texte}</span>
            </div>
          );
        })}
      </div>
    </Panneau>
  );
};

/** Deux choix illustrés (icône + texte), sans code */
export const SchemaDeuxChoix: React.FC<{debut: number; fin: number; a1: number; a2: number; icone1: string; texte1: string; icone2: string; texte2: string; titre?: string}> = ({
  debut, fin, a1, a2, icone1, texte1, icone2, texte2, titre = '2 OPTIONS',
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const carte = (a: number, icone: string, texte: string, couleur: string) => {
    const s = spring({frame: f - a, fps, config: {damping: 11}});
    return (
      <div style={{opacity: f >= a ? 1 : 0, transform: `scale(${s})`, border: `6px solid ${couleur}`, borderRadius: 32, padding: '26px 30px', background: 'rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 26}}>
        <span style={{fontSize: 130, lineHeight: 1}}>{icone}</span>
        <span style={{color: '#fff', fontWeight: 900, fontSize: 54, lineHeight: 1.12}}>{texte}</span>
      </div>
    );
  };
  return (
    <Panneau debut={debut} fin={fin} titre={titre} top={420} bottom={480}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 40, padding: '44px 40px'}}>
        {carte(a1, icone1, texte1, C.vert)}
        <div style={{textAlign: 'center', color: C.jaune, fontWeight: 900, fontSize: 60, opacity: f >= a2 ? 1 : 0}}>OU</div>
        {carte(a2, icone2, texte2, C.rouge)}
      </div>
    </Panneau>
  );
};

/**
 * Le bocal en coupe : air chaud → refroidi (vide) → l'air du dehors appuie ;
 * puis eau chaude (le couvercle se dilate) ; puis cuillère en levier (pschitt, l'air rentre).
 */
export const SchemaBocal: React.FC<{
  debut: number; fin: number; aChaud: number; aFroid: number; aVide: number; aDehors: number;
  aEau: number; aVerre: number; aDesserre: number; aCuillere: number; aLevier: number; aPschitt: number; aOuvre: number;
}> = (p) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const v = (a: number, d = 8) => interpolate(f, [a, a + d], [0, 1], clamp);
  const phase = f < p.aEau ? 'vide' : f < p.aCuillere ? 'eau' : 'cuillere';
  const titre = phase === 'vide' ? 'POURQUOI ÇA BLOQUE ?' : phase === 'eau' ? 'L’EAU CHAUDE' : 'LA CUILLÈRE';
  // géométrie du bocal (SVG 840 x 860)
  const jx = 250, jy = 250, jw = 340, jh = 440;
  const refroidi = v(p.aFroid, 20);
  const pschitt = v(p.aPschitt, 14);
  const nAir = Math.round(26 - refroidi * 16 + pschitt * 16);
  const dilate = phase === 'eau' ? v(p.aEau + 6, 20) : 0;
  const ouvre = v(p.aOuvre, 10);
  const levier = phase === 'cuillere' ? v(p.aLevier, 12) : 0;
  const appuie = f >= p.aDehors && phase !== 'eau' && pschitt < 0.5;
  return (
    <Panneau debut={p.debut} fin={p.fin} titre={titre} top={420} bottom={480}>
      <svg width={960} height={983} viewBox="0 0 840 860" style={{display: 'block', margin: '0 auto'}}>
        {/* air du dehors qui appuie */}
        {appuie && [0, 1, 2].map((i) => {
          const k = v(p.aDehors);
          const dy = Math.sin(f / 4 + i) * 6;
          return (
            <g key={i} opacity={k} transform={`translate(${jx + 50 + i * 120},${jy - 190 + dy})`}>
              <rect x={-14} y={0} width={28} height={70} fill={C.jaune} />
              <path d="M-36,64 L36,64 L0,110 Z" fill={C.jaune} />
            </g>
          );
        })}
        {appuie && <text x={420} y={36} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={38} fill={C.jaune} opacity={v(p.aDehors)}>L’AIR DU DEHORS APPUIE</text>}
        {/* eau chaude */}
        {phase === 'eau' && Array.from({length: 10}).map((_, i) => {
          const y = ((f * 9 + i * 37) % 170);
          return <ellipse key={i} cx={jx + jw / 2 - 40 + (i % 3) * 40} cy={jy - 200 + y} rx={8} ry={16} fill="#5ab0ff" opacity={0.9} />;
        })}
        {phase === 'eau' && <text x={420} y={36} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={40} fill="#ff6b4a">🔥 EAU TRÈS CHAUDE</text>}
        {/* verre */}
        <rect x={jx} y={jy} width={jw} height={jh} rx={40} fill="#dff5ff" opacity={0.25} stroke="#bfe8ff" strokeWidth={10} />
        {/* cornichons */}
        {[[60, 380], [140, 330], [230, 390], [110, 260], [260, 280], [190, 200]].map(([x, y], i) => (
          <ellipse key={i} cx={jx + x} cy={jy + y} rx={22} ry={60} fill="#5a8a2a" opacity={0.8} transform={`rotate(${i * 25 - 40},${jx + x},${jy + y})`} />
        ))}
        {/* air à l'intérieur */}
        {Array.from({length: nAir}).map((_, i) => {
          const vit = f < p.aFroid ? 3 : 0.8;
          const x = jx + 30 + ((i * 53 + Math.sin(f / 10 * vit + i) * 40 + f * vit * (i % 3)) % (jw - 60) + (jw - 60)) % (jw - 60);
          const y = jy + 30 + ((i * 31 + Math.cos(f / 9 * vit + i * 2) * 30) % 140 + 140) % 140;
          const chaud = f < p.aFroid + 10;
          return <circle key={i} cx={x} cy={y} r={11} fill={chaud ? '#ff6b4a' : '#7fc6ff'} opacity={0.9} />;
        })}
        {f >= p.aVide && pschitt < 0.6 && (
          <g opacity={v(p.aVide) * (1 - pschitt)}>
            <rect x={jx + 70} y={jy + 50} width={200} height={70} rx={16} fill="#141418" opacity={0.75} />
            <text x={jx + 170} y={jy + 98} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={44} fill="#fff">VIDE</text>
          </g>
        )}
        {f < p.aFroid + 30 && f >= p.aChaud && (
          <text x={420} y={jy + jh + 70} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={40} fill={f < p.aFroid ? '#ff6b4a' : '#7fc6ff'}>
            {f < p.aFroid ? 'Air chaud à l’usine 🏭' : 'En refroidissant, il rétrécit ❄️'}
          </text>
        )}
        {/* couvercle */}
        <g transform={`translate(${jx + jw / 2},${jy - 6 - ouvre * 140}) rotate(${-levier * 4 - ouvre * 25}) scale(${1 + dilate * 0.1},1)`}>
          <rect x={-jw / 2 - 26} y={-56} width={jw + 52} height={62} rx={14} fill={dilate > 0 ? interpolateCouleur('#c9cfdb', '#ff8a5c', dilate) : '#c9cfdb'} stroke="#8a92a6" strokeWidth={6} />
          {Array.from({length: 12}).map((_, i) => <rect key={i} x={-jw / 2 - 16 + i * 32} y={-50} width={6} height={50} fill="#8a92a6" />)}
        </g>
        {dilate > 0.3 && (
          <g opacity={dilate}>
            <path d={`M${jx - 70},${jy - 30} L${jx - 20},${jy - 30} M${jx - 70},${jy - 30} l20,-14 M${jx - 70},${jy - 30} l20,14`} stroke={C.jaune} strokeWidth={10} strokeLinecap="round" fill="none" />
            <path d={`M${jx + jw + 70},${jy - 30} L${jx + jw + 20},${jy - 30} M${jx + jw + 70},${jy - 30} l-20,-14 M${jx + jw + 70},${jy - 30} l-20,14`} stroke={C.jaune} strokeWidth={10} strokeLinecap="round" fill="none" />
            <text x={420} y={jy + jh + 70} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={40} fill="#ff8a5c">MÉTAL : se dilate beaucoup</text>
          </g>
        )}
        {f >= p.aVerre && phase === 'eau' && (
          <text x={420} y={jy + jh + 120} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={40} fill="#bfe8ff" opacity={v(p.aVerre)}>VERRE : un peu</text>
        )}
        {f >= p.aDesserre && phase === 'eau' && (
          <text x={420} y={jy + jh + 170} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={46} fill={C.vert} opacity={v(p.aDesserre)}>→ ÇA SE DESSERRE ✓</text>
        )}
        {/* cuillère en levier */}
        {phase === 'cuillere' && (
          <g opacity={v(p.aCuillere)} transform={`translate(${jx + jw + 10},${jy - 20}) rotate(${-20 + levier * 18})`}>
            <rect x={0} y={-8} width={230} height={16} rx={8} fill="#c9cfdb" />
            <ellipse cx={-6} cy={0} rx={34} ry={20} fill="#c9cfdb" />
          </g>
        )}
        {phase === 'cuillere' && f >= p.aPschitt && (
          <g opacity={v(p.aPschitt) * (1 - v(p.aOuvre + 10))}>
            {[0, 1, 2].map((i) => <path key={i} d={`M${jx + jw + 90 + i * 30},${jy - 80 - i * 20} q-30,10 -60,40`} stroke="#ffffff" strokeWidth={8} fill="none" strokeLinecap="round" />)}
            <text x={jx + jw + 20} y={jy - 140} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={64} fill="#ffffff" transform={`rotate(-10,${jx + jw + 20},${jy - 140})`}>PSCHITT !</text>
          </g>
        )}
        {phase === 'cuillere' && (
          <text x={420} y={jy + jh + 80} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={42} fill={f >= p.aPschitt ? C.vert : '#fff'}>
            {f < p.aLevier ? 'Glisse une cuillère sous le bord' : f < p.aPschitt ? 'Fais levier doucement' : 'L’air rentre, le vide disparaît ✓'}
          </text>
        )}
      </svg>
    </Panneau>
  );
};

const interpolateCouleur = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((x, i) => Math.round(x + (pb[i] - x) * Math.max(0, Math.min(1, t)))).join(',')})`;
};

/**
 * La capsaïcine dans la bouche : gouttes d'huile (orange) ; l'eau les étale partout (le feu s'étend) ;
 * le lait (caséine) les attrape et les emporte, comme un savon.
 */
export const SchemaCapsaicine: React.FC<{
  debut: number; fin: number; aHuile: number; aEau: number; aEtend: number; aLait: number; aCaseine: number; aAttrape: number; aSavon: number;
}> = (p) => {
  const f = useCurrentFrame();
  const v = (a: number, d = 10) => interpolate(f, [a, a + d], [0, 1], clamp);
  const phaseLait = f >= p.aLait;
  const titre = phaseLait ? 'LE LAIT 🥛' : 'L’EAU 💧';
  const W = 840, H = 820;
  // bouche : zone ovale
  const bx = 70, by = 170, bw = 700, bh = 420;
  const etale = phaseLait ? 1 : v(p.aEau, 40);
  const attrape = v(p.aAttrape, 40);
  const N = 14;
  const gouttes = Array.from({length: N}).map((_, i) => {
    // position de départ : groupées au centre ; étalées : partout
    const x0 = bx + bw / 2 - 90 + (i % 5) * 45, y0 = by + bh / 2 + 40 + Math.floor(i / 5) * 40;
    const x1 = bx + 60 + ((i * 97) % (bw - 120)), y1 = by + 60 + ((i * 61) % (bh - 120));
    let x = x0 + (x1 - x0) * etale + Math.sin(f / 6 + i) * 4;
    let y = y0 + (y1 - y0) * etale + Math.cos(f / 7 + i) * 4;
    // la caséine emporte la goutte vers le bas à droite (avalée)
    const k = Math.max(0, Math.min(1, attrape * 1.6 - (i / N) * 0.6));
    x = x + (bx + bw + 60 - x) * k;
    y = y + (by + bh + 40 - y) * k;
    return {x, y, k};
  });
  const feux = phaseLait ? Math.round((1 - attrape) * 8) : Math.round(2 + v(p.aEtend, 20) * 8);
  return (
    <Panneau debut={p.debut} fin={p.fin} titre={titre} top={420} bottom={480}>
      <svg width={960} height={937} viewBox={`0 0 ${W} ${H}`} style={{display: 'block', margin: '0 auto'}}>
        {/* bouche */}
        <ellipse cx={bx + bw / 2} cy={by + bh / 2} rx={bw / 2} ry={bh / 2} fill="#7a1f2b" />
        <ellipse cx={bx + bw / 2} cy={by + bh / 2 + 80} rx={bw / 2 - 90} ry={bh / 2 - 110} fill="#e2566a" />
        <path d={`M${bx + bw / 2},${by + bh / 2 - 20} L${bx + bw / 2},${by + bh / 2 + 150}`} stroke="#c23b52" strokeWidth={8} />
        {/* dents */}
        {Array.from({length: 8}).map((_, i) => <rect key={i} x={bx + 150 + i * 52} y={by + 8} width={44} height={50} rx={10} fill="#fff" />)}
        {/* feux */}
        {Array.from({length: feux}).map((_, i) => (
          <text key={i} x={bx + 110 + ((i * 131) % (bw - 220))} y={by + 140 + ((i * 89) % (bh - 160))} fontSize={54} textAnchor="middle"
            transform={`rotate(${Math.sin(f / 3 + i) * 8})`} style={{transformBox: 'fill-box', transformOrigin: 'center'}}>🔥</text>
        ))}
        {/* eau */}
        {!phaseLait && f >= p.aEau && Array.from({length: 18}).map((_, i) => (
          <ellipse key={i} cx={bx + 40 + ((i * 53 + f * 4) % (bw - 80))} cy={by + 70 + ((i * 47) % (bh - 140))} rx={18} ry={12} fill="#7fc6ff" opacity={0.55 * v(p.aEau)} />
        ))}
        {/* lait + caséine */}
        {phaseLait && (
          <g>
            <ellipse cx={bx + bw / 2} cy={by + bh / 2} rx={bw / 2 - 30} ry={bh / 2 - 30} fill="#ffffff" opacity={0.35 * v(p.aLait)} />
            {f >= p.aCaseine && gouttes.map((g, i) => {
              const k0 = v(p.aCaseine + i * 2, 10);
              const ouvre = Math.abs(Math.sin(f / 3 + i)) * 30;
              return (
                <g key={`c${i}`} transform={`translate(${g.x - 34 + (1 - k0) * -120},${g.y})`} opacity={k0}>
                  <path d={`M0,0 L${24 * Math.cos((ouvre * Math.PI) / 180)},${-24 * Math.sin((ouvre * Math.PI) / 180)} A24,24 0 1,0 ${24 * Math.cos((ouvre * Math.PI) / 180)},${24 * Math.sin((ouvre * Math.PI) / 180)} Z`}
                    fill="#f5f0e0" stroke="#c9b98a" strokeWidth={3} transform="scale(-1,1)" />
                </g>
              );
            })}
          </g>
        )}
        {/* gouttes de capsaïcine (huile) */}
        {gouttes.map((g, i) => (
          <g key={i} opacity={(1 - g.k) * v(p.aHuile - 30)}>
            <circle cx={g.x} cy={g.y} r={16} fill="#ff9f1a" stroke="#c96a00" strokeWidth={3} />
            <circle cx={g.x - 5} cy={g.y - 5} r={5} fill="#fff" opacity={0.7} />
          </g>
        ))}
        {/* légendes */}
        <g>
          <circle cx={120} cy={70} r={18} fill="#ff9f1a" stroke="#c96a00" strokeWidth={3} />
          <text x={150} y={84} fontFamily={POLICE} fontWeight={900} fontSize={40} fill="#fff">capsaïcine = comme de l’huile</text>
        </g>
        {!phaseLait && f >= p.aEau && (
          <text x={W / 2} y={by + bh + 110} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={46} fill={C.rouge} opacity={v(p.aEau)}>
            {f < p.aEtend ? 'L’eau l’étale partout…' : 'LE FEU S’ÉTEND 🔥🔥'}
          </text>
        )}
        {phaseLait && (
          <text x={W / 2} y={by + bh + 110} textAnchor="middle" fontFamily={POLICE} fontWeight={900} fontSize={44} fill={f >= p.aSavon ? C.vert : '#fff'}>
            {f < p.aCaseine ? 'Du gras + une protéine…' : f < p.aSavon ? 'La caséine attrape la capsaïcine' : 'Elle l’emporte, comme un savon 🧼'}
          </text>
        )}
      </svg>
    </Panneau>
  );
};
