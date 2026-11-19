import React from 'react';
import {Easing, useCurrentFrame} from 'remotion';
import {keys, pop, prog} from '../lib/anim';
import {FONT} from '../lib/fonts';

/* Schémas et écrans du Mode Survie (sobres, pas d'humour) */

/**
 * Carte de la zone : lac, sentier du « grand tour du lac », position de Toi, zone de recherche des secours.
 * position : [x, y] du point Toi (coordonnées carte 0..900), trace : chemin parcouru hors zone.
 */
export const CarteZone: React.FC<{
  debut: number;
  fin: number;
  boucle?: number; // frame où le sentier s'allume
  zone?: number; // frame où la zone de recherche apparaît
  position: [number, number];
  trace?: [number, number][];
  horsZone?: number; // frame : tampon « HORS ZONE »
  largeur?: number;
  y?: number;
}> = ({debut, fin, boucle, zone, position, trace, horsZone, largeur = 940, y = 470}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 10) return null;
  const p = pop(f, debut, 30, 12) * (1 - prog(f, fin, 10));
  const bk = boucle !== undefined ? prog(f, boucle, 30, Easing.linear) : 0;
  const zk = zone !== undefined ? prog(f, zone, 16) : 0;
  const pulse = 0.5 + 0.5 * Math.sin(f * 0.15);
  const boucleD = 'M250,620 C150,520 170,300 330,240 C480,180 680,200 730,330 C780,470 700,640 540,680 C420,710 320,690 250,620 Z';
  return (
    <div style={{position: 'absolute', left: (1080 - largeur) / 2, top: y, width: largeur, transform: `scale(${p})`, fontFamily: FONT}}>
      <svg width={largeur} height={largeur} viewBox="0 0 900 900" style={{borderRadius: 40, boxShadow: '0 20px 0 rgba(0,0,0,0.5)'}}>
        <rect width={900} height={900} rx={40} fill="#1c2620" />
        {/* courbes de niveau */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx={460} cy={450} rx={120 + i * 70} ry={90 + i * 62} fill="none" stroke="#2f3d33" strokeWidth={3} />
        ))}
        {/* forêt */}
        {Array.from({length: 40}).map((_, i) => (
          <path key={i} d={`M${(i * 97) % 880 + 10},${((i * 151) % 860) + 20} l12,24 l-24,0 Z`} fill="#26402f" />
        ))}
        {/* lac */}
        <path d="M330,380 C380,320 560,320 600,400 C630,470 560,540 470,540 C380,540 300,460 330,380 Z" fill="#274b6b" stroke="#3b6a92" strokeWidth={4} />
        <text x={465} y={448} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#9cc3e6">
          LAC
        </text>
        {/* sentier du grand tour */}
        <path d={boucleD} fill="none" stroke="#5c5440" strokeWidth={10} strokeDasharray="20 14" />
        {bk > 0 && <path d={boucleD} fill="none" stroke="#fbbf24" strokeWidth={10} strokeDasharray="1600" strokeDashoffset={1600 * (1 - bk)} strokeLinecap="round" />}
        {/* parking */}
        <rect x={210} y={640} width={60} height={46} rx={8} fill="#e5e7eb" />
        <text x={240} y={674} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} fill="#1f2937">
          P
        </text>
        {/* zone de recherche */}
        {zk > 0 && (
          <g opacity={zk}>
            <ellipse cx={470} cy={450} rx={380} ry={330} fill="#f97316" opacity={0.12 + 0.08 * pulse} />
            <ellipse cx={470} cy={450} rx={380} ry={330} fill="none" stroke="#f97316" strokeWidth={6} strokeDasharray="18 12" />
            <text x={470} y={95} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#fdba74">
              ZONE DE RECHERCHE
            </text>
          </g>
        )}
        {/* trace hors zone */}
        {trace && trace.length > 1 && (
          <polyline points={trace.map((pt) => pt.join(',')).join(' ')} fill="none" stroke="#ef4444" strokeWidth={8} strokeDasharray="14 10" strokeLinecap="round" />
        )}
        {/* Toi */}
        <circle cx={position[0]} cy={position[1]} r={22 + pulse * 10} fill="#8b5cf6" opacity={0.35} />
        <circle cx={position[0]} cy={position[1]} r={16} fill="#8b5cf6" stroke="#fff" strokeWidth={5} />
        <text x={position[0]} y={position[1] - 32} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill="#fff">
          TOI
        </text>
        {horsZone !== undefined && f >= horsZone && (
          <g transform={`translate(${Math.min(position[0], 720)},${Math.min(position[1] + 70, 840)}) scale(${pop(f, horsZone, 30, 8)}) rotate(-8)`}>
            <rect x={-150} y={-40} width={300} height={70} rx={14} fill="#111827" stroke="#ef4444" strokeWidth={6} />
            <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill="#f87171">
              HORS ZONE
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

/** Les 4 tuiles S.T.O.P. ; actif = index de la lettre en cours (-1 : aucune) */
export const TuilesStop: React.FC<{debut: number; fin: number; actif: number; y?: number; x?: number; taille?: number}> = ({debut, fin, actif, y = 300, x, taille = 190}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 10) return null;
  const out = prog(f, fin, 10);
  return (
    <div style={{position: 'absolute', left: x ?? 0, right: x === undefined ? 0 : undefined, top: y, display: 'flex', justifyContent: x === undefined ? 'center' : 'flex-start', gap: 16, fontFamily: FONT, opacity: 1 - out}}>
      {['S', 'T', 'O', 'P'].map((l, i) => {
        const p = pop(f, debut + i * 5, 30, 9);
        const on = i === actif;
        const fait = i < actif;
        return (
          <div
            key={l}
            style={{
              width: taille,
              height: taille,
              borderRadius: 34,
              background: on ? 'linear-gradient(180deg,#f97316,#c2410c)' : fait ? '#14532d' : '#111827',
              border: `8px solid ${on ? '#fdba74' : fait ? '#4ade80' : '#f4c542'}`,
              color: '#fff',
              fontSize: taille * 0.68,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${p * (on ? 1.08 : 1)})`,
              boxShadow: on ? '0 0 40px rgba(249,115,22,0.7), 0 12px 0 rgba(0,0,0,0.5)' : '0 12px 0 rgba(0,0,0,0.5)',
              position: 'relative',
            }}
          >
            {l}
            {fait && <span style={{position: 'absolute', right: 10, bottom: 4, fontSize: 44, color: '#4ade80'}}>✓</span>}
          </div>
        );
      })}
    </div>
  );
};

/** Cercle de respiration (inspire / expire) */
export const Respiration: React.FC<{debut: number; fin: number; x?: number; y?: number}> = ({debut, fin, x = 540, y = 760}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 8) return null;
  const p = pop(f, debut, 30, 12) * (1 - prog(f, fin, 8));
  const cycle = ((f - debut) % 90) / 90;
  const k = 0.5 - 0.5 * Math.cos(cycle * Math.PI * 2);
  return (
    <div style={{position: 'absolute', left: x - 170, top: y - 170, width: 340, height: 340, transform: `scale(${p})`, fontFamily: FONT}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: '6px solid rgba(147,197,253,0.6)'}} />
      <div
        style={{
          position: 'absolute',
          left: 170 - (60 + k * 110),
          top: 170 - (60 + k * 110),
          width: (60 + k * 110) * 2,
          height: (60 + k * 110) * 2,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,197,253,0.45), rgba(147,197,253,0.1))',
        }}
      />
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 40, fontWeight: 700}}>
        {cycle < 0.5 ? 'INSPIRE' : 'EXPIRE'}
      </div>
    </div>
  );
};

/** Objets de l'inventaire (Observer : ce que tu as) */
export const Inventaire: React.FC<{debut: number; pas?: number}> = ({debut, pas = 6}) => {
  const f = useCurrentFrame();
  const objets: {nom: string; svg: React.ReactNode}[] = [
    {
      nom: 'tél. 9 %',
      svg: (
        <g>
          <rect x={30} y={10} width={40} height={74} rx={8} fill="#1f2937" stroke="#9ca3af" strokeWidth={4} />
          <rect x={38} y={52} width={10} height={20} fill="#ef4444" />
        </g>
      ),
    },
    {
      nom: 'sac',
      svg: (
        <g>
          <rect x={22} y={20} width={56} height={66} rx={14} fill="#9a3412" />
          <rect x={30} y={50} width={40} height={24} rx={8} fill="#7c2d12" />
        </g>
      ),
    },
    {nom: 'veste', svg: <path d="M30,14 L50,22 L70,14 L88,30 L80,46 L72,40 L72,86 L28,86 L28,40 L20,46 L12,30 Z" fill="#dc2626" />},
    {
      nom: 'lampe',
      svg: (
        <g>
          <rect x={20} y={38} width={44} height={22} rx={6} fill="#facc15" />
          <path d="M64,34 L90,22 L90,76 L64,64 Z" fill="#fde68a" />
        </g>
      ),
    },
    {
      nom: 'sifflet',
      svg: (
        <g>
          <rect x={18} y={38} width={50} height={26} rx={12} fill="#f97316" />
          <circle cx={62} cy={58} r={16} fill="#f97316" />
          <circle cx={62} cy={58} r={6} fill="#7c2d12" />
        </g>
      ),
    },
  ];
  return (
    <div style={{display: 'flex', gap: 14, justifyContent: 'center', fontFamily: FONT}}>
      {objets.map((o, i) => (
        <div key={o.nom} style={{textAlign: 'center', transform: `scale(${pop(f, debut + i * pas, 30, 10)})`}}>
          <div style={{width: 120, height: 120, borderRadius: 24, background: '#1f2937', border: '4px solid #f4c542'}}>
            <svg width={112} height={112} viewBox="0 0 100 100">
              {o.svg}
            </svg>
          </div>
          <div style={{color: '#e5e7eb', fontSize: 28, fontWeight: 600, marginTop: 6}}>{o.nom}</div>
        </div>
      ))}
    </div>
  );
};

/** Téléphone en gros plan : appel du 112, mode avion, ou mise en veille / rallumage */
export const TelephoneUrgence: React.FC<{
  debut: number;
  fin: number;
  avion?: number; // frame : mode avion activé
  veille?: number; // frame : cycle éteint / rallumé
  x?: number;
  y?: number;
  echelle?: number;
}> = ({debut, fin, avion, veille, x = 540, y = 900, echelle = 0.85}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 10) return null;
  const p = pop(f, debut, 30, 12) * (1 - prog(f, fin, 10));
  const modeAvion = avion !== undefined && f >= avion;
  const enVeille = veille !== undefined && f >= veille && ((f - veille) % 50) < 26;
  const typed = Math.floor(keys(f, [[debut + 6, 0], [debut + 24, 3]]));
  const ring = !modeAvion ? 0.5 + 0.5 * Math.sin(f * 0.3) : 0;
  return (
    <div style={{position: 'absolute', left: x - 260, top: y - 480, width: 520, height: 960, transform: `scale(${p * echelle})`, fontFamily: FONT}}>
      <div style={{position: 'absolute', inset: 0, background: '#0b0f19', borderRadius: 70, border: '10px solid #374151', boxShadow: '0 24px 0 rgba(0,0,0,0.5)'}} />
      <div style={{position: 'absolute', left: 26, right: 26, top: 26, bottom: 26, borderRadius: 50, overflow: 'hidden', background: enVeille ? '#000' : 'linear-gradient(180deg,#111827,#1e293b)', color: '#e5e7eb'}}>
        {!enVeille && (
          <>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '22px 30px 0', fontSize: 30, fontWeight: 700}}>
              <span>{modeAvion ? '✈' : 'SOS'}</span>
              <span style={{color: '#f87171'}}>9 %</span>
            </div>
            {!modeAvion ? (
              <div style={{textAlign: 'center', marginTop: 60}}>
                <div style={{fontSize: 34, color: '#9ca3af'}}>Appel d'urgence</div>
                <div style={{fontSize: 140, fontWeight: 700, letterSpacing: 10, marginTop: 20}}>{'112'.slice(0, typed)}</div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 90px)', gap: 18, justifyContent: 'center', marginTop: 30}}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((k) => (
                    <div key={k} style={{width: 90, height: 90, borderRadius: 45, background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 700}}>
                      {k}
                    </div>
                  ))}
                </div>
                <div style={{width: 120, height: 120, borderRadius: 60, background: '#22c55e', margin: '30px auto 0', boxShadow: `0 0 ${20 + ring * 30}px rgba(34,197,94,0.8)`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width={60} height={60} viewBox="0 0 40 40">
                    <path d="M8,4 L15,4 L18,12 L14,15 Q18,23 25,26 L28,22 L36,25 L36,32 Q20,34 8,20 Q4,12 8,4 Z" fill="#fff" />
                  </svg>
                </div>
              </div>
            ) : (
              <div style={{textAlign: 'center', marginTop: 120}}>
                <div style={{fontSize: 160}}>✈</div>
                <div style={{fontSize: 44, fontWeight: 700, marginTop: 20}}>Mode avion</div>
                <div style={{margin: '30px auto 0', width: 150, height: 74, borderRadius: 37, background: '#f97316', position: 'relative'}}>
                  <div style={{position: 'absolute', right: 8, top: 8, width: 58, height: 58, borderRadius: 29, background: '#fff'}} />
                </div>
                <div style={{fontSize: 32, color: '#fdba74', marginTop: 40}}>Batterie économisée</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/** Voiture qui tombe dans l'eau (icône du teaser) */
export const IconeVoitureEau: React.FC<{s?: number}> = ({s = 160}) => {
  const f = useCurrentFrame();
  const b = Math.sin(f * 0.15) * 4;
  return (
    <svg width={s} height={s * 0.7} viewBox="0 0 160 112">
      <g transform={`translate(0,${b}) rotate(12 80 50)`}>
        <path d="M24,56 L40,30 L112,30 L130,56 L140,58 L140,76 L18,76 L18,58 Z" fill="#60a5fa" stroke="#1e3a8a" strokeWidth={4} />
        <rect x={50} y={36} width={26} height={18} rx={3} fill="#bfdbfe" />
        <rect x={82} y={36} width={26} height={18} rx={3} fill="#bfdbfe" />
        <circle cx={44} cy={78} r={12} fill="#1f2937" />
        <circle cx={116} cy={78} r={12} fill="#1f2937" />
      </g>
      <path d={`M0,${80 + b * 0.5} q20,-10 40,0 t40,0 t40,0 t40,0 L160,112 L0,112 Z`} fill="#1d4ed8" opacity={0.85} />
    </svg>
  );
};

