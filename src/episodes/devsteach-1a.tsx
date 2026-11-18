import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import mots from '../../videos/devsteach-1a/mots.json';
import {Camera} from '../camera/Camera';
import {BureauStartup, STARTUP} from '../decors/BureauStartup';
import {clamp, keys, pop, prog, s} from '../lib/anim';
import {FONT, SERIF_1998} from '../lib/fonts';
import {Bande, Effet} from '../lib/son';
import {Max, Toi} from '../personnages';
import {CarteJeu} from '../ui/CarteJeu';
import {CarteOuverture, EcranChoix, Etincelles} from '../ui/Ecrans';
import {HUD} from '../ui/HUD';
import {Fichier, FondPlan, IconeMuscle, IconeOs, IconeTshirt, Lien, MaquetteSite} from '../ui/Schema';
import {SousTitres} from '../ui/SousTitres';
import {AppelDirect, NotifSMS, Portrait} from '../ui/Telephone';

/* DevsTeach 1a — « Le site est moche » */

/** frame de début du mot n° i de la voix off */
const m = (i: number) => Math.round(mots[i].s * 30);

export const DUREE_DEVSTEACH_1A = s(55.5);

const MOTS_CLES = ['URGENT', 'HTML', 'CSS', 'JavaScript', 'squelette', 'vêtements', 'muscles', 'nu', '45', '1998', 'relié', 'noir', 'blanc', 'heure', 'couleur'];

// repères (frames)
const T = {
  assis: s(1.8),
  poseCafe: m(6),
  cafeSurBureau: m(9) + 3,
  vibre1: m(11),
  appel: m(14) - 4,
  ouvre: m(27),
  nav: m(27) + 18,
  charge: m(31),
  noir: m(33),
  blanc: m(35),
  couleur: m(37),
  word: m(40),
  an1998: m(46),
  schema: m(47) - 6,
  trois: m(51),
  ensemble: m(55),
  html: m(56),
  titres: m(62),
  textes: m(64),
  images: m(66),
  css: m(68) - 6,
  couleurs: m(73),
  tailles: m(75),
  miseEnPage: m(77),
  js: m(80),
  curseur: m(85),
  clic: m(91),
  retour: m(92) - 8,
  nu: m(97),
  vibre2: m(99),
  sms45: m(103),
  min45: m(104),
  options: m(106) - 4,
  opt1: m(108),
  opt2: m(117),
  casse: m(124),
  choix: m(132) - 4,
};

const saut = (f: number, debuts: number[]) =>
  debuts.reduce((a, d) => a + (f >= d && f < d + 12 ? Math.sin(((f - d) / 12) * Math.PI) * 55 : 0), 0);

/* ---------- mini site moche affiché sur l'écran du bureau ---------- */
const SiteMocheMini: React.FC<{censure: number}> = ({censure}) => (
  <g>
    <rect width={300} height={186} fill="#fff" />
    <text x={12} y={30} fontFamily={SERIF_1998} fontWeight={700} fontSize={22} fill="#000">
      Boulangerie Marcel
    </text>
    <rect x={12} y={42} width={110} height={64} fill="#fff" stroke="#000" strokeWidth={2} />
    <line x1={12} y1={42} x2={122} y2={106} stroke="#000" strokeWidth={1.5} />
    <line x1={122} y1={42} x2={12} y2={106} stroke="#000" strokeWidth={1.5} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={12} y={118 + i * 16} width={260 - i * 40} height={7} fill="#000" />
    ))}
    <rect x={12} y={168} width={140} height={6} fill="#0000ee" />
    {censure > 0 && (
      <g transform={`translate(150,93) scale(${censure}) rotate(-8)`}>
        <rect x={-150} y={-34} width={300} height={68} fill="#000" />
        <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#fff">
          CENSURÉ
        </text>
      </g>
    )}
  </g>
);

/* ---------------- étiquette de valeur (pop + étincelles) ---------------- */
const Etiquette: React.FC<{debut: number; x: number; y: number; texte: string; couleur?: string; rot?: number}> = ({debut, x, y, texte, couleur = '#111827', rot = -4}) => {
  const f = useCurrentFrame();
  const p = pop(f, debut, 30, 8);
  if (p <= 0) return null;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(-50%,-50%) scale(${p}) rotate(${rot}deg)`,
          background: '#ffe14d',
          border: `6px solid ${couleur}`,
          color: couleur,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 50,
          padding: '8px 26px',
          borderRadius: 18,
          boxShadow: '0 10px 0 rgba(0,0,0,0.35)',
          whiteSpace: 'nowrap',
        }}
      >
        {texte}
      </div>
      <Etincelles debut={debut} x={x} y={y} r={120} />
    </>
  );
};

/* -------------------- téléphone qui vibre (monde) -------------------- */
const TelMonde: React.FC<{x: number; y: number; debut: number; fin: number}> = ({x, y, debut, fin}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin) return null;
  const p = pop(f, debut);
  const r = Math.sin(f * 2.4) * 16;
  return (
    <g transform={`translate(${x},${y}) scale(${p}) rotate(${r})`}>
      <circle r={50} fill="#ffe14d" stroke="#111" strokeWidth={5} />
      <rect x={-16} y={-30} width={32} height={58} rx={7} fill="#111" />
      <rect x={-11} y={-23} width={22} height={40} rx={3} fill="#60a5fa" />
      <path d="M-34,-16 q-8,16 0,32 M34,-16 q8,16 0,32" stroke="#111" strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* =============================== VIDÉO =============================== */
export const DevsTeach1a: React.FC = () => {
  const f = useCurrentFrame();
  const {chaise, ecran: E} = STARTUP;

  /* ---------- personnages ---------- */
  const toiX = keys(f, [
    [0, 470],
    [T.assis - 6, chaise.x + 10],
  ], Easing.inOut(Easing.quad));

  const maxCourse = f >= T.vibre2 + 6;
  const maxX = maxCourse
    ? keys(f, [
        [T.vibre2 + 6, 1900],
        [T.options, -200],
      ], Easing.linear)
    : 1700 + Math.sin(f * 0.035) * 90;
  const maxFacing: 1 | -1 = maxCourse ? -1 : Math.cos(f * 0.035) > 0 ? 1 : -1;

  /* ---------- caméra ---------- */
  const plans = [
    {f: 0, x: 900, y: 1000, z: 1.3},
    {f: s(0.4), x: 900, y: 1080, z: 1.45, d: 45},
    {f: T.assis, x: 1000, y: 1120, z: 1.75, d: 30},
    {f: T.vibre1, x: 960, y: 1080, z: 2.05, d: 9},
    {f: T.appel, x: 1060, y: 1040, z: 1.75, d: 14},
    {f: T.ouvre, x: E.x + E.w / 2, y: E.y + E.h / 2, z: 2.3, d: 10},
    {f: T.ouvre + 10, x: E.x + E.w / 2, y: E.y + E.h / 2, z: 4.8, d: 10, ease: Easing.in(Easing.cubic)},
    {f: T.schema, x: 1100, y: 1110, z: 1.65, d: 1},
    {f: T.vibre2, x: 1150, y: 1020, z: 1.35, d: 12},
    {f: T.options, x: 1050, y: 1050, z: 1.5, d: 30},
  ];

  /* ---------- superpositions ---------- */
  // navigateur : sort de l'écran du bureau
  const navIn = prog(f, T.nav - 6, 12, Easing.out(Easing.back(1.2)));
  const schemaIn = prog(f, T.schema, 12, Easing.inOut(Easing.cubic));
  const schemaOut = prog(f, T.retour, 12, Easing.inOut(Easing.cubic));
  const showNav = f >= T.nav - 6 && f < T.schema + 12;
  const showSchema = f >= T.schema && f < T.retour + 12;
  const optionsVoile = f >= T.options ? clamp((f - T.options) / 10) : 0;

  const charge = clamp((f - T.charge) / 24);
  const tampon = pop(f, T.an1998 - 2, 30, 7);

  const effets: Effet[] = [
    {f: 0, son: 'pas', vol: 0.4, dur: 54},
    {f: T.cafeSurBureau, son: 'pop', vol: 0.5},
    {f: T.vibre1, son: 'vibration', vol: 0.6},
    {f: T.appel, son: 'appel', vol: 0.45, dur: 60},
    {f: T.ouvre, son: 'frappe-clavier', vol: 0.4, dur: 20},
    {f: T.ouvre + 10, son: 'whoosh', vol: 0.5},
    {f: T.noir, son: 'pop', vol: 0.5},
    {f: T.blanc, son: 'pop', vol: 0.5},
    {f: T.couleur, son: 'pop', vol: 0.5},
    {f: T.an1998 - 2, son: 'gag-boing', vol: 0.5},
    {f: T.schema, son: 'whoosh', vol: 0.5},
    {f: T.trois, son: 'pop', vol: 0.45},
    {f: T.trois + 6, son: 'pop', vol: 0.45},
    {f: T.trois + 12, son: 'pop', vol: 0.45},
    {f: T.html, son: 'carte', vol: 0.5},
    {f: T.css, son: 'carte', vol: 0.5},
    {f: T.couleurs, son: 'sparkle', vol: 0.45},
    {f: T.js, son: 'carte', vol: 0.5},
    {f: T.clic, son: 'clic-bouton', vol: 0.55},
    {f: T.retour, son: 'whoosh', vol: 0.5},
    {f: T.nu, son: 'gag-boing', vol: 0.5},
    {f: T.vibre2, son: 'vibration', vol: 0.6},
    {f: T.sms45, son: 'notification', vol: 0.55},
    {f: T.min45, son: 'compteur', vol: 0.5},
    {f: T.opt1, son: 'carte', vol: 0.5},
    {f: T.opt2, son: 'carte', vol: 0.5},
    {f: T.choix - 20, son: 'coeur', vol: 0.5, dur: 60},
    {f: T.choix, son: 'carte', vol: 0.55},
    {f: T.choix + 14, son: 'clic-bouton', vol: 0.5},
  ];

  return (
    <AbsoluteFill style={{background: '#0f1630'}}>
      {/* ======================= MONDE : bureau ======================= */}
      <Camera plans={plans} mondeW={STARTUP.W} mondeH={STARTUP.H} haut={180} bas={1650}>
        <BureauStartup
          jour={1}
          heure={[9, 12 + Math.floor(f / 1800)]}
          ecran={f >= T.retour ? <SiteMocheMini censure={pop(f, T.nu, 30, 8)} /> : undefined}
        >
          {/* café posé sur le bureau */}
          {f >= T.cafeSurBureau && (
            <g transform={`translate(1000,1300) scale(${pop(f, T.cafeSurBureau)})`}>
              <path d="M-16,-40 L16,-40 L12,0 L-12,0 Z" fill="#fff" />
              <rect x={-15} y={-28} width={30} height={14} fill="#a16207" />
              <rect x={-18} y={-46} width={36} height={8} rx={3} fill="#e5e7eb" />
            </g>
          )}
          <Max
            x={maxX}
            y={1530}
            facing={maxFacing}
            timeline={[
              {f: 0, base: 'marche', bras: 'cafe', expr: 'panique'},
              {f: T.vibre2 + 6, base: 'marche', bras: 'panique', expr: 'panique'},
            ]}
            tremble={maxCourse ? 0 : 1.5}
          />
          <Toi
            x={toiX}
            y={1500}
            saut={saut(f, [T.vibre1, T.vibre2])}
            timeline={[
              {f: 0, base: 'marche', bras: 'cafe', expr: 'neutre', regard: [1, 0]},
              {f: T.assis, base: 'assis', bras: 'cafe', expr: 'fier'},
              {f: T.poseCafe, bras: 'poser'},
              {f: T.vibre1, bras: 'repos', expr: 'surpris', regard: [0, 1]},
              {f: T.vibre1 + 10, bras: 'telephone', regard: [1, 0.5]},
              {f: T.appel + 30, expr: 'panique'},
              {f: m(26), expr: 'concentre', regard: [1, 0]},
              {f: T.ouvre, bras: 'taper'},
              {f: T.retour, bras: 'facepalm', expr: 'consterne'},
              {f: T.vibre2, bras: 'repos', expr: 'surpris', regard: [0, 1]},
              {f: T.vibre2 + 10, bras: 'telephone', expr: 'panique'},
              {f: T.options, bras: 'reflechit', expr: 'concentre', regard: [0.6, -0.6]},
            ]}
          />
          <TelMonde x={970} y={900} debut={T.vibre1} fin={T.vibre1 + 30} />
          <TelMonde x={1000} y={890} debut={T.vibre2} fin={T.vibre2 + 32} />
        </BureauStartup>
      </Camera>

      {/* ======================= NAVIGATEUR : le site moche ======================= */}
      {showNav && (
        <AbsoluteFill
          style={{
            background: `rgba(15,22,48,${0.88 * navIn})`,
            transform: `translateX(${-schemaIn * 1080}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: 470,
              transform: `scale(${0.25 + 0.75 * navIn})`,
              transformOrigin: '50% 30%',
              opacity: clamp(navIn * 3),
            }}
          >
            {f < T.charge ? (
              <div style={{width: 1000, height: 720, background: '#fff', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div style={{width: 90, height: 90, borderRadius: 45, border: '12px solid #cbd5e1', borderTopColor: '#3b82f6', transform: `rotate(${f * 14}deg)`}} />
              </div>
            ) : (
              <MaquetteSite html={charge} couleurs={0} tailles={0} miseEnPage={0} largeur={1000} />
            )}
          </div>
          <Etiquette debut={T.noir} x={800} y={1010} texte="TEXTE : NOIR" />
          <Etiquette debut={T.blanc} x={790} y={700} texte="FOND : BLANC" rot={3} />
          <Etiquette debut={T.couleur} x={720} y={1180} texte="COULEURS : 0" couleur="#dc2626" rot={-2} />
          {/* tampon « WORD 1998 » */}
          {tampon > 0 && (
            <div
              style={{
                position: 'absolute',
                left: 540,
                top: 760,
                transform: `translate(-50%,-50%) scale(${1 + (1 - tampon) * 2}) rotate(-12deg)`,
                opacity: clamp(tampon * 1.5),
                border: '12px solid #dc2626',
                color: '#dc2626',
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 110,
                padding: '6px 40px',
                borderRadius: 24,
                background: 'rgba(255,255,255,0.85)',
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              WORD
              <br />
              1998
            </div>
          )}
          {/* réaction de Toi */}
          {f >= T.word && (
            <div
              style={{
                position: 'absolute',
                left: 60,
                top: 290,
                width: 200,
                height: 200,
                borderRadius: 100,
                overflow: 'hidden',
                border: '8px solid #f4c542',
                transform: `scale(${pop(f, T.word)})`,
                boxShadow: '0 10px 0 rgba(0,0,0,0.35)',
              }}
            >
              <Portrait fond="#c4b5fd" viewBox="-125 -580 250 250">
                <Toi x={0} y={0} timeline={[{f: 0, bras: 'repos', expr: 'consterne', regard: [0, 0]}]} ombre={false} />
              </Portrait>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ======================= SCHÉMA : HTML / CSS / JS ======================= */}
      {showSchema && (
        <AbsoluteFill style={{transform: `translateX(${(1 - schemaIn) * 1080 - schemaOut * 1080}px)`}}>
          <FondPlan />
          {/* 1) trois fichiers qui travaillent ensemble */}
          {f < T.html + 8 && (
            <div style={{position: 'absolute', inset: 0, opacity: 1 - prog(f, T.html - 4, 10)}}>
              <div
                style={{
                  position: 'absolute',
                  left: 540,
                  top: 560,
                  transform: `translate(-50%,-50%) scale(${pop(f, T.schema + 8)})`,
                  fontFamily: FONT,
                  color: '#fff',
                  fontSize: 84,
                  fontWeight: 700,
                  textAlign: 'center',
                  lineHeight: 1.05,
                  textShadow: '0 6px 0 rgba(0,0,0,0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                UN SITE WEB
                <div style={{color: '#4ade80', fontSize: 60}}>= 3 fichiers</div>
              </div>
              {[
                {nom: 'index.html', ext: 'html'},
                {nom: 'style.css', ext: 'css'},
                {nom: 'script.js', ext: 'js'},
              ].map((fi, i) => (
                <div
                  key={fi.ext}
                  style={{
                    position: 'absolute',
                    left: 70 + i * 330,
                    top: 820,
                    transform: `scale(${pop(f, T.trois + i * 6)}) translateY(${Math.sin(f * 0.1 + i) * 8}px)`,
                  }}
                >
                  <Fichier nom={fi.nom} ext={fi.ext} taille={280} />
                </div>
              ))}
              {f >= T.ensemble &&
                [0, 1].map((i) => (
                  <div key={i} style={{position: 'absolute', left: 300 + i * 330, top: 950, opacity: prog(f, T.ensemble, 8)}}>
                    <Lien longueur={150} />
                  </div>
                ))}
              {f >= T.ensemble && <Etincelles debut={T.ensemble} x={540} y={990} r={200} couleur="#4ade80" />}
            </div>
          )}
          {/* 2) la maquette du site qui évolue */}
          {f >= T.html - 4 && (
            <div style={{position: 'absolute', left: 150, top: 770, opacity: prog(f, T.html - 4, 10), transform: `scale(${0.9 + 0.1 * prog(f, T.html - 4, 12)})`}}>
              <MaquetteSite
                html={prog(f, T.html, 24, Easing.linear)}
                couleurs={prog(f, T.couleurs, 14)}
                tailles={prog(f, T.tailles, 12, Easing.out(Easing.back(2)))}
                miseEnPage={prog(f, T.miseEnPage, 16)}
                curseur={T.curseur}
                clic={T.clic}
                surbrillance={f >= T.titres && f < T.textes ? 'titres' : f >= T.textes && f < T.images ? 'textes' : f >= T.images && f < T.css ? 'images' : null}
                largeur={780}
              />
            </div>
          )}
          {f >= T.couleurs && f < T.couleurs + 25 && <Etincelles debut={T.couleurs} x={540} y={820} r={260} couleur="#f472b6" n={14} />}
          <CarteJeu debut={T.html} fin={T.css - 2} surtitre="NOTION : HTML" titre="Le squelette" detail="titres • textes • images" icone={<IconeOs s={110} />} x={380} y={300} largeur={640} />
          <CarteJeu
            debut={T.css}
            fin={T.js - 2}
            surtitre="NOTION : CSS"
            titre="Les vêtements"
            detail="couleurs • tailles • mise en page"
            icone={<IconeTshirt s={100} />}
            x={380}
            y={300}
            largeur={640}
          />
          <CarteJeu debut={T.js} fin={T.retour + 4} surtitre="NOTION : JS" titre="Les muscles" detail="ce qui bouge au clic" icone={<IconeMuscle s={110} />} x={380} y={300} largeur={640} />
        </AbsoluteFill>
      )}

      {/* ======================= LES DEUX OPTIONS ======================= */}
      {optionsVoile > 0 && f < T.choix + 10 && (
        <AbsoluteFill style={{background: `rgba(8,12,30,${0.7 * optionsVoile})`}}>
          <div
            style={{
              position: 'absolute',
              left: 60,
              top: 300,
              transform: `scale(${pop(f, T.options + 2)}) rotate(-3deg)`,
              background: '#f4c542',
              color: '#0f1630',
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 64,
              padding: '8px 34px',
              borderRadius: 24,
              boxShadow: '0 10px 0 #b8860b',
            }}
          >
            2 OPTIONS
          </div>
          <CarteJeu
            debut={T.opt1}
            fin={T.choix}
            surtitre="OPTION 1"
            couleurSurtitre="#4ade80"
            titre="Le HTML est cassé ?"
            detail="→ tu réécris tout"
            icone={<Fichier nom="index.html" ext="html" taille={110} barre={f >= m(112)} />}
            x={540}
            y={440}
            largeur={900}
          />
          <CarteJeu
            debut={T.opt2}
            fin={T.choix}
            surtitre="OPTION 2"
            couleurSurtitre="#f87171"
            titre="Le CSS n'est pas relié ?"
            detail="le fichier est là… mais pas branché"
            icone={
              <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
                <Fichier nom="index.html" ext="html" taille={100} />
                <Lien longueur={170} casse={prog(f, T.casse, 14)} />
                <Fichier nom="style.css" ext="css" taille={100} />
              </div>
            }
            x={540}
            y={930}
            largeur={900}
          />
        </AbsoluteFill>
      )}

      {/* ======================= UI permanente ======================= */}
      <HUD
        compteur={[
          [0, 60],
          [T.min45, 45],
        ]}
        barre={[
          [0, 0.22],
          [m(15), 0.45],
          [m(25), 0.55],
          [T.vibre2, 0.6],
          [T.min45, 0.86],
          [DUREE_DEVSTEACH_1A, 0.92],
        ]}
        unite="MIN"
        label="DEADLINE"
        icone="chrono"
        alerte={0.75}
      />
      <CarteOuverture debut={6} fin={s(3.4)} ligne1="LUNDI • 09:12" ligne2="Bureau – Startup" ligne3="Toi, stagiaire dev" />
      <AppelDirect
        debut={T.appel}
        fin={T.ouvre - 4}
        nom="Max"
        x={470}
        y={450}
        texte="URGENT. Le site du client est en ligne dans 1 heure. Regarde-le."
        texteDebut={m(15)}
        portrait={
          <Portrait>
            <Max x={0} y={0} timeline={[{f: 0, bras: 'cafe', expr: 'panique', regard: [-0.6, 0]}]} tremble={2} ombre={false} />
          </Portrait>
        }
      />
      <NotifSMS debut={T.sms45} fin={T.options - 2} de="Max" texte="45 minutes." urgent y={470} />
      <EcranChoix debut={T.choix} vert="Réécrire le HTML" rouge="Relier le CSS" ctaDebut={s(52.3)} />
      {f < T.choix && <SousTitres mots={mots} motsCles={MOTS_CLES} y={1390} />}

      <Bande voix="videos/devsteach-1a/voix.wav" mots={mots} effets={effets} ambiance="ambiances/bureau.mp3" musique="musiques/tech-leger.mp3" />
    </AbsoluteFill>
  );
};
