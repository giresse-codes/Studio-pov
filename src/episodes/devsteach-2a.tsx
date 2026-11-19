import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import mots from '../../videos/devsteach-2a/mots.json';
import {Camera} from '../camera/Camera';
import {BureauStartup, STARTUP} from '../decors/BureauStartup';
import {clamp, pop, prog, rand, s} from '../lib/anim';
import {FONT, MONO, SERIF_1998} from '../lib/fonts';
import {Bande, Effet} from '../lib/son';
import {Max, Toi} from '../personnages';
import {CarteJeu} from '../ui/CarteJeu';
import {Etiquette, TelMonde} from '../ui/Communs';
import {CarteOuverture, EcranChoix} from '../ui/Ecrans';
import {Editeur} from '../ui/Editeur';
import {HUD} from '../ui/HUD';
import {FondPlan} from '../ui/Schema';
import {SousTitres} from '../ui/SousTitres';
import {AppelDirect, Portrait} from '../ui/Telephone';

/* DevsTeach 2a — « Max veut un titre géant » */

const m = (i: number) => Math.round(mots[i].s * 30);

export const DUREE_DEVSTEACH_2A = s(36);

const MOTS_CLES = ['ÉNORME', 'Lune.', 'p.', 'paragraphe.', 'timide.', 'HTML,', 'rôle.', 'p,', 'titres,', 'famille', 'h1', 'h6.', 'dix', 'h1.'];

const T = {
  allume: m(6),
  vibre: m(11),
  appel: m(13) - 4,
  lune: m(25),
  ouvre: m(30),
  editeur: m(30) + 16,
  titre: m(34),
  baliseP: m(40),
  paragraphe: m(42),
  petit: m(45),
  timide: m(47),
  schema: m(49) - 6,
  role: m(51),
  pRole: m(56),
  titres: m(61),
  famille: m(69),
  h1: m(72),
  h6: m(74),
  rappel: m(75) - 4,
  dix: m(82),
  options: m(84) - 4,
  opt1: m(86),
  opt2: m(98),
  choix: m(105) - 4,
};

const saut = (f: number, debuts: number[]) =>
  debuts.reduce((a, d) => a + (f >= d && f < d + 12 ? Math.sin(((f - d) / 12) * Math.PI) * 55 : 0), 0);

/** La Lune (silhouette, grands yeux) qui regarde la Terre aux jumelles */
const LuneJumelles: React.FC<{debut: number; fin: number}> = ({debut, fin}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin + 8) return null;
  const a = Math.min(clamp((f - debut) / 6), 1 - prog(f, fin, 8));
  const p = pop(f, debut + 2, 30, 10);
  return (
    <AbsoluteFill style={{background: `rgba(5,8,25,${0.96 * a})`, opacity: a}}>
      {Array.from({length: 50}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: rand(i) * 1080, top: rand(i + 7) * 1920, width: 4, height: 4, borderRadius: 2, background: '#fff', opacity: 0.4 + 0.6 * Math.abs(Math.sin(f * 0.1 + i))}} />
      ))}
      <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920} viewBox="0 0 1080 1920">
        {/* la Terre, en bas, avec un titre géant */}
        <circle cx={540} cy={1950} r={900} fill="#2563eb" />
        <path d="M200,1200 q120,-80 260,-20 q140,60 300,-30 q100,-50 200,10 L1080,1300 L0,1300 Z" fill="#16a34a" opacity={0.9} />
        <g transform={`translate(540,1200) scale(${pop(f, debut + 8, 30, 8)})`}>
          <rect x={-300} y={-80} width={600} height={120} rx={16} fill="#fff" />
          <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={90} fill="#111">
            TITRE
          </text>
        </g>
        {/* la Lune */}
        <g transform={`translate(700,620) scale(${p})`}>
          <circle r={250} fill="#d1d5db" />
          {[
            [-120, -80, 40],
            [90, -130, 28],
            [130, 90, 46],
            [-60, 140, 30],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#9ca3af" />
          ))}
          {/* jumelles */}
          <g transform="translate(-30,40) rotate(20)">
            <rect x={-110} y={-30} width={90} height={110} rx={30} fill="#111827" />
            <rect x={10} y={-30} width={90} height={110} rx={30} fill="#111827" />
            <rect x={-30} y={0} width={50} height={30} fill="#111827" />
            <circle cx={-65} cy={80} r={30} fill="#60a5fa" />
            <circle cx={55} cy={80} r={30} fill="#60a5fa" />
          </g>
          <ellipse cx={-70} cy={-60} rx={34} ry={44} fill="#fff" />
          <ellipse cx={50} cy={-60} rx={34} ry={44} fill="#fff" />
          <circle cx={-64} cy={-40} r={14} fill="#111" />
          <circle cx={56} cy={-40} r={14} fill="#111" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Mini navigateur : le titre tout petit, tout timide */
const ApercuTimide: React.FC<{debut: number}> = ({debut}) => {
  const f = useCurrentFrame();
  const p = pop(f, debut, 30, 12);
  const tremble = f >= debut + 20 ? Math.sin(f * 1.7) * 1.5 : 0;
  return (
    <div style={{width: 760, transform: `scale(${p})`, transformOrigin: 'top center'}}>
      <div style={{background: '#e2e8f0', borderRadius: '20px 20px 0 0', height: 50, display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px'}}>
        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
          <div key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />
        ))}
        <div style={{flex: 1, marginLeft: 10, background: '#fff', borderRadius: 14, height: 30, fontFamily: MONO, fontSize: 18, color: '#475569', display: 'flex', alignItems: 'center', padding: '0 14px'}}>boulangerie-marcel.fr</div>
      </div>
      <div style={{background: '#fff', borderRadius: '0 0 20px 20px', padding: '24px 30px 34px', fontFamily: SERIF_1998, color: '#000'}}>
        <div style={{fontSize: 26, display: 'inline-block', transform: `translateX(${tremble}px)`}}>Boulangerie Marcel</div>
        <div style={{fontSize: 24, marginTop: 12}}>Pain frais tous les matins.</div>
      </div>
    </div>
  );
};

/** Tuile de balise HTML avec son rôle */
const Tuile: React.FC<{balise: string; role: string; debut: number; actif?: boolean; taille?: number; couleur?: string}> = ({balise, role, debut, actif = false, taille = 64, couleur = '#569cd6'}) => {
  const f = useCurrentFrame();
  const p = pop(f, debut, 30, 9);
  return (
    <div
      style={{
        transform: `scale(${p * (actif ? 1.1 : 1)})`,
        background: actif ? '#1e3a8a' : '#1e1e2e',
        border: `6px solid ${actif ? '#facc15' : '#3f3f5a'}`,
        borderRadius: 26,
        padding: '18px 22px',
        textAlign: 'center',
        boxShadow: actif ? '0 0 30px rgba(250,204,21,0.6), 0 10px 0 rgba(0,0,0,0.4)' : '0 10px 0 rgba(0,0,0,0.4)',
      }}
    >
      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: taille, color: couleur}}>{`<${balise}>`}</div>
      {role && <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 32, color: '#e5e7eb', marginTop: 6}}>{role}</div>}
    </div>
  );
};

export const DevsTeach2a: React.FC = () => {
  const f = useCurrentFrame();
  const {chaise, ecran: E} = STARTUP;

  const maxX = 1700 + Math.sin(f * 0.035) * 90;
  const maxFacing: 1 | -1 = Math.cos(f * 0.035) > 0 ? 1 : -1;

  const plans = [
    {f: 0, x: 1000, y: 1110, z: 1.7},
    {f: T.vibre, x: 960, y: 1080, z: 2.05, d: 9},
    {f: T.appel, x: 1060, y: 1040, z: 1.75, d: 14},
    {f: T.ouvre, x: E.x + E.w / 2, y: E.y + E.h / 2, z: 2.3, d: 8},
    {f: T.ouvre + 8, x: E.x + E.w / 2, y: E.y + E.h / 2, z: 4.8, d: 10, ease: Easing.in(Easing.cubic)},
    {f: T.rappel - 2, x: 1080, y: 1040, z: 1.45, d: 1},
    {f: T.options, x: 1050, y: 1050, z: 1.5, d: 30},
  ];

  const edIn = prog(f, T.editeur - 6, 12, Easing.out(Easing.back(1.2)));
  const showEditeur = f >= T.editeur - 6 && f < T.schema + 12;
  const showSchema = f >= T.schema && f < T.rappel + 12;
  const glisse = (1 - prog(f, T.schema, 12)) * 1080 - prog(f, T.rappel, 12) * 1080;

  const effets: Effet[] = [
    {f: T.allume, son: 'clic-bouton', vol: 0.4},
    {f: T.vibre, son: 'vibration', vol: 0.6},
    {f: T.appel, son: 'appel', vol: 0.45, dur: 50},
    {f: T.lune, son: 'whoosh', vol: 0.5},
    {f: m(29), son: 'gag-boing', vol: 0.45},
    {f: T.ouvre, son: 'frappe-clavier', vol: 0.4, dur: 20},
    {f: T.ouvre + 8, son: 'whoosh', vol: 0.5},
    {f: T.paragraphe, son: 'pop', vol: 0.45},
    {f: T.timide, son: 'pop', vol: 0.4},
    {f: T.schema, son: 'whoosh', vol: 0.5},
    {f: T.role, son: 'carte', vol: 0.5},
    {f: T.famille, son: 'sparkle', vol: 0.45},
    {f: T.rappel, son: 'appel', vol: 0.45, dur: 40},
    {f: T.dix, son: 'compteur', vol: 0.5},
    {f: T.opt1, son: 'carte', vol: 0.5},
    {f: T.opt2, son: 'carte', vol: 0.5},
    {f: T.choix - 20, son: 'coeur', vol: 0.5, dur: 60},
    {f: T.choix, son: 'carte', vol: 0.55},
    {f: T.choix + 14, son: 'clic-bouton', vol: 0.5},
  ];

  return (
    <AbsoluteFill style={{background: '#0f1630'}}>
      {/* ======================= MONDE : le bureau ======================= */}
      <Camera plans={plans} mondeW={STARTUP.W} mondeH={STARTUP.H} haut={180} bas={1650}>
        <BureauStartup jour={1} heure={[9, 5 + Math.floor(f / 1800)]} ecran={f < T.allume + 4 ? <rect width={300} height={186} fill="#000" /> : undefined}>
          <g transform="translate(1000,1300)">
            <path d="M-16,-40 L16,-40 L12,0 L-12,0 Z" fill="#fff" />
            <rect x={-15} y={-28} width={30} height={14} fill="#a16207" />
            <rect x={-18} y={-46} width={36} height={8} rx={3} fill="#e5e7eb" />
          </g>
          <Max
            x={maxX}
            y={1530}
            facing={maxFacing}
            tremble={f >= T.rappel ? 2 : 0}
            timeline={[
              {f: 0, base: 'marche', bras: 'cafe', expr: 'fier'},
              {f: T.appel, bras: 'leve', expr: 'fier'},
              {f: T.ouvre, bras: 'cafe', expr: 'neutre'},
              {f: T.rappel, bras: 'panique', expr: 'panique'},
            ]}
          />
          <Toi
            x={chaise.x + 10}
            y={1500}
            saut={saut(f, [T.vibre])}
            timeline={[
              {f: 0, base: 'assis', bras: 'repos', expr: 'neutre', regard: [1, 0]},
              {f: T.allume - 6, bras: 'poser'},
              {f: T.allume + 8, bras: 'repos', expr: 'soulage'},
              {f: T.vibre, expr: 'surpris', regard: [0, 1]},
              {f: T.vibre + 10, bras: 'telephone', regard: [1, 0.5]},
              {f: T.appel + 20, expr: 'curieux'},
              {f: m(29), expr: 'amuse'},
              {f: T.ouvre, bras: 'taper', expr: 'concentre', regard: [1, 0]},
              {f: T.rappel, bras: 'telephone', expr: 'panique', regard: [1, 0.5]},
              {f: T.options, bras: 'reflechit', expr: 'concentre', regard: [0.6, -0.6]},
            ]}
          />
          <TelMonde x={970} y={900} debut={T.vibre} fin={T.vibre + 30} />
        </BureauStartup>
      </Camera>

      {/* appel de Max (surexcité) */}
      <AppelDirect
        debut={T.appel}
        fin={T.lune - 2}
        nom="Max"
        x={470}
        y={450}
        texte="Le client veut un titre ÉNORME en haut de la page !"
        texteDebut={m(14)}
        portrait={
          <Portrait>
            <Max x={0} y={0} timeline={[{f: 0, bras: 'pointer', expr: 'fier', regard: [-0.6, 0]}]} facing={-1} ombre={false} />
          </Portrait>
        }
      />
      {/* « visible depuis la Lune » */}
      <LuneJumelles debut={T.lune} fin={T.ouvre - 2} />

      {/* ======================= ÉDITEUR : le titre dans un <p> ======================= */}
      {showEditeur && (
        <AbsoluteFill style={{transform: `translateX(${-prog(f, T.schema, 12) * 1080}px)`}}>
          <div style={{position: 'absolute', inset: 0, opacity: edIn}}>
            <FondPlan />
          </div>
          <div style={{position: 'absolute', left: 40, top: 400, transform: `scale(${0.3 + 0.7 * edIn})`, transformOrigin: '50% 20%', opacity: clamp(edIn * 3)}}>
            <Editeur
              fichier="index.html"
              taille={36}
              largeur={1000}
              lignes={[
                {code: '<body>'},
                {code: '  <p>Boulangerie Marcel</p>', surligne: [[T.titre, T.schema]], zoom: {texte: '<p>', debut: T.baliseP, fin: T.schema, couleur: '#facc15'}},
                {code: '  <p>Pain frais tous les matins.</p>'},
                {code: '</body>'},
              ]}
            />
          </div>
          <Etiquette debut={T.paragraphe} x={600} y={790} texte="UN SIMPLE PARAGRAPHE" rot={3} />
          {f >= T.petit && (
            <div style={{position: 'absolute', left: 160, top: 900}}>
              <ApercuTimide debut={T.petit} />
            </div>
          )}
          {f >= T.timide && <Etiquette debut={T.timide} x={640} y={1210} texte="TOUT PETIT, TOUT TIMIDE 😳" couleur="#be185d" rot={-3} />}
        </AbsoluteFill>
      )}

      {/* ======================= SCHÉMA : chaque balise a un rôle ======================= */}
      {showSchema && (
        <AbsoluteFill style={{transform: `translateX(${glisse}px)`}}>
          <FondPlan />
          <CarteJeu debut={T.schema + 6} fin={T.rappel - 2} surtitre="NOTION : BALISES" titre="Chaque balise a un rôle" x={380} y={290} largeur={640} />
          {f < T.titres + 10 && (
            <div style={{position: 'absolute', left: 60, right: 60, top: 680, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 34, opacity: 1 - prog(f, T.titres, 10)}}>
              <Tuile balise="p" role="paragraphe" debut={T.role} actif={f >= T.pRole} />
              <Tuile balise="img" role="image" debut={T.role + 5} />
              <Tuile balise="a" role="lien" debut={T.role + 10} />
              <Tuile balise="button" role="bouton" debut={T.role + 15} />
            </div>
          )}
          {f >= T.titres && (
            <div style={{position: 'absolute', left: 40, right: 40, top: 640, opacity: prog(f, T.titres, 10)}}>
              <div style={{textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 62, color: '#fff', transform: `scale(${pop(f, T.famille - 4)})`, marginBottom: 30}}>
                👪 LA FAMILLE DES TITRES
              </div>
              <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 14}}>
                {[1, 2, 3, 4, 5, 6].map((n) => {
                  const d = T.h1 + Math.round(((n - 1) * (T.h6 + 6 - T.h1)) / 5);
                  const p = pop(f, d, 30, 9);
                  const h = 330 - (n - 1) * 46;
                  return (
                    <div
                      key={n}
                      style={{
                        width: 150 - (n - 1) * 12,
                        height: h,
                        transform: `scale(${p})`,
                        transformOrigin: 'bottom center',
                        background: n === 1 ? 'linear-gradient(180deg,#f97316,#c2410c)' : '#1e1e2e',
                        border: `6px solid ${n === 1 ? '#fdba74' : '#569cd6'}`,
                        borderRadius: 22,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 0 rgba(0,0,0,0.4)',
                      }}
                    >
                      <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 64 - (n - 1) * 8, color: n === 1 ? '#fff' : '#9cdcfe'}}>h{n}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px 30px 0', fontFamily: FONT, fontWeight: 700, fontSize: 34, color: '#e5e7eb', opacity: prog(f, T.h6, 10)}}>
                <span>↑ le plus important</span>
                <span>le plus petit ↑</span>
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* Max rappelle */}
      <AppelDirect
        debut={T.rappel}
        fin={T.options - 2}
        nom="Max"
        x={470}
        y={450}
        texte="Il me faut ça dans 10 minutes !"
        texteDebut={m(77)}
        portrait={
          <Portrait>
            <Max x={0} y={0} timeline={[{f: 0, bras: 'panique', expr: 'panique', regard: [-0.6, 0]}]} tremble={2} ombre={false} />
          </Portrait>
        }
      />

      {/* ======================= LES DEUX OPTIONS ======================= */}
      {f >= T.options && f < T.choix + 10 && (
        <AbsoluteFill style={{background: `rgba(8,12,30,${0.7 * clamp((f - T.options) / 10)})`}}>
          <CarteJeu
            debut={T.opt1}
            fin={T.choix}
            surtitre="OPTION 1"
            couleurSurtitre="#4ade80"
            titre="Garder p et grossir le texte"
            icone={<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, color: '#9cdcfe', background: '#1e1e2e', padding: '8px 20px', borderRadius: 14}}>{'<p>'} <span style={{fontSize: 64, color: '#fff'}}>Aa</span></div>}
            x={540}
            y={440}
            largeur={900}
          />
          <CarteJeu
            debut={T.opt2}
            fin={T.choix}
            surtitre="OPTION 2"
            couleurSurtitre="#f87171"
            titre="Changer la balise en h1"
            icone={<div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, color: '#9cdcfe', background: '#1e1e2e', padding: '8px 20px', borderRadius: 14}}>{'<p>'} → <span style={{color: '#fdba74'}}>{'<h1>'}</span></div>}
            x={540}
            y={930}
            largeur={900}
          />
        </AbsoluteFill>
      )}

      {/* ======================= UI permanente ======================= */}
      <HUD
        compteur={[
          [0, 30],
          [T.dix, 10],
        ]}
        barre={[
          [0, 0.28],
          [m(19), 0.5],
          [T.rappel, 0.6],
          [T.dix, 0.86],
          [DUREE_DEVSTEACH_2A, 0.92],
        ]}
        unite="MIN"
        label="DEADLINE"
        icone="chrono"
        alerte={0.75}
      />
      <CarteOuverture debut={4} fin={T.appel - 4} ligne1="MARDI • 09:05" ligne2="Bureau – Startup" ligne3="Toi, stagiaire dev" />
      <EcranChoix debut={T.choix} vert="Garder p et grossir le texte" rouge="Passer en h1" ctaDebut={s(33)} />
      {f < T.choix && <SousTitres mots={mots} motsCles={MOTS_CLES} y={1400} />}

      <Bande voix="videos/devsteach-2a/voix.wav" mots={mots} effets={effets} ambiance="ambiances/bureau.mp3" musique="musiques/tech-leger.mp3" />
    </AbsoluteFill>
  );
};
