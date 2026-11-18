import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import mots from '../../videos/devsteach-1b/mots.json';
import {Camera} from '../camera/Camera';
import {BureauStartup, STARTUP} from '../decors/BureauStartup';
import {clamp, keys, pop, prog, s} from '../lib/anim';
import {FONT, MONO} from '../lib/fonts';
import {Bande, Effet} from '../lib/son';
import {Max, Toi} from '../personnages';
import {CarteJeu} from '../ui/CarteJeu';
import {Etiquette, SiteJoliMini, SiteMocheMini, Tampon} from '../ui/Communs';
import {CarteOuverture, ChoixRappel, Confettis, EcranAbonne, Etincelles} from '../ui/Ecrans';
import {Editeur} from '../ui/Editeur';
import {HUD} from '../ui/HUD';
import {Fichier, FondPlan, IconeNavigateur, MaquetteSite} from '../ui/Schema';
import {SousTitres} from '../ui/SousTitres';
import {NotifSMS, Portrait} from '../ui/Telephone';

/* DevsTeach 1b — « Le site est moche » (la réponse) */

const m = (i: number) => Math.round(mots[i].s * 30);

export const DUREE_DEVSTEACH_1B = s(59.5);

const MOTS_CLES = ['HTML', 'CSS', 'navigateur', 'head', 'link', 'stylesheet', 'style', 'génie', 'balise', 'nom', 'lettre', 'géant', 'index', 'rien'];

const T = {
  rappel: 3,
  nav1: m(5) - 6,
  texte: m(7),
  titres: m(9),
  htmlOk: m(14),
  rappel2: m(19) - 2,
  faux: m(21),
  bon: m(24),
  scenario: m(26) + 2,
  mange: m(28),
  schema: m(31) - 6,
  navigateur: m(35),
  devine: m(37),
  page: m(41),
  mon: m(46),
  fichier: m(51),
  jamais: m(53),
  editeur: m(59) - 6,
  head: m(64),
  ajoute: m(68),
  link: m(73),
  save: m(83),
  refresh: m(84) - 4,
  couleurs: m(87),
  boutons: m(89),
  mise: m(90),
  tout: m(94),
  sms: m(98),
  non: m(103),
  juste: m(104),
  regle: m(110) - 4,
  balise: m(119),
  linkMot: m(122),
  nom: m(124),
  nomMot: m(127),
  lettre: m(130),
  marchePlus: m(135),
  teaser: m(140) - 4,
  geant: m(146),
  abonne: s(56.6),
};

const saut = (f: number, debuts: number[]) =>
  debuts.reduce((a, d) => a + (f >= d && f < d + 12 ? Math.sin(((f - d) / 12) * Math.PI) * 55 : 0), 0);

const glisse = (f: number, debut: number, fin: number) =>
  (1 - prog(f, debut, 12, Easing.inOut(Easing.cubic))) * 1080 - prog(f, fin, 12, Easing.inOut(Easing.cubic)) * 1080;

const LIGNE_LINK = '  <link rel="stylesheet" href="style.css">';

export const DevsTeach1b: React.FC = () => {
  const f = useCurrentFrame();
  const {chaise} = STARTUP;

  /* ---------- personnages ---------- */
  const maxX = keys(f, [
    [0, 1650],
    [T.scenario - 6, 1650],
    [T.mange, 1140],
    [T.schema + 10, 1140],
    [T.schema + 11, 1560],
  ], Easing.inOut(Easing.quad));
  const maxFacing: 1 | -1 = f < T.scenario - 6 ? 1 : -1;

  const plans = [
    {f: 0, x: 1000, y: 1100, z: 1.6},
    {f: T.scenario - 6, x: 1060, y: 1080, z: 1.55, d: 1},
    {f: T.mange, x: 1010, y: 1060, z: 1.8, d: 8},
    {f: T.schema + 12, x: 1230, y: 1060, z: 1.3, d: 1},
    {f: T.juste, x: 1050, y: 1090, z: 1.6, d: 16},
    {f: T.teaser, x: 1350, y: 1060, z: 1.4, d: 14},
  ];

  /* ---------- couches ---------- */
  const showNav1 = f >= T.nav1 && f < T.rappel2 + 12;
  const showScenario = f >= T.scenario - 6 && f < T.schema + 12;
  const showSchema = f >= T.schema && f < T.editeur + 12;
  const showEditeur = f >= T.editeur && f < T.refresh + 12;
  const showNav2 = f >= T.refresh && f < T.sms - 4;
  const regleVoile = f >= T.regle && f < T.teaser + 12 ? clamp((f - T.regle) / 10) * (1 - prog(f, T.teaser, 12)) : 0;
  const navIn = prog(f, T.nav1, 12, Easing.out(Easing.back(1.2)));
  const nav2In = prog(f, T.refresh, 10, Easing.out(Easing.cubic));

  const effets: Effet[] = [
    {f: 0, son: 'whoosh', vol: 0.4},
    {f: T.rappel, son: 'carte', vol: 0.5},
    {f: T.nav1, son: 'whoosh', vol: 0.45},
    {f: T.texte, son: 'pop', vol: 0.5},
    {f: T.titres, son: 'pop', vol: 0.5},
    {f: T.htmlOk, son: 'ding-bonne-reponse', vol: 0.5},
    {f: T.rappel2, son: 'carte', vol: 0.5},
    {f: T.faux, son: 'buzzer-erreur', vol: 0.45},
    {f: T.bon, son: 'ding-bonne-reponse', vol: 0.55},
    {f: T.mange, son: 'gag-boing', vol: 0.5},
    {f: T.schema, son: 'whoosh', vol: 0.5},
    {f: T.navigateur, son: 'pop', vol: 0.45},
    {f: T.page, son: 'pop', vol: 0.45},
    {f: T.jamais, son: 'buzzer-erreur', vol: 0.35},
    {f: T.editeur, son: 'whoosh', vol: 0.5},
    {f: T.link, son: 'frappe-clavier', vol: 0.45, dur: s(5)},
    {f: T.save, son: 'clic-bouton', vol: 0.5},
    {f: T.refresh, son: 'whoosh', vol: 0.45},
    {f: T.couleurs, son: 'sparkle', vol: 0.5},
    {f: T.tout, son: 'ding-bonne-reponse', vol: 0.6},
    {f: T.sms, son: 'notification', vol: 0.55},
    {f: T.juste, son: 'pop', vol: 0.5},
    {f: T.regle, son: 'carte', vol: 0.5},
    {f: T.linkMot, son: 'pop', vol: 0.45},
    {f: T.nomMot, son: 'pop', vol: 0.45},
    {f: T.marchePlus, son: 'buzzer-erreur', vol: 0.45},
    {f: T.teaser, son: 'carte', vol: 0.5},
    {f: T.geant, son: 'gag-boing', vol: 0.55},
    {f: T.abonne, son: 'pop', vol: 0.5},
  ];

  return (
    <AbsoluteFill style={{background: '#0f1630'}}>
      {/* ======================= MONDE : bureau ======================= */}
      <Camera plans={plans} mondeW={STARTUP.W} mondeH={STARTUP.H} haut={180} bas={1650}>
        <BureauStartup jour={1} heure={[9, 20 + Math.floor(f / 1800)]} ecran={f >= T.tout ? <SiteJoliMini /> : <SiteMocheMini censure={0} />}>
          <g transform="translate(1000,1300)">
            <path d="M-16,-40 L16,-40 L12,0 L-12,0 Z" fill="#fff" />
            <rect x={-15} y={-28} width={30} height={14} fill="#a16207" />
            <rect x={-18} y={-46} width={36} height={8} rx={3} fill="#e5e7eb" />
          </g>
          <Max
            x={maxX}
            y={1530}
            facing={maxFacing}
            scale={f >= T.mange && f < T.schema ? 1 + 0.08 * Math.sin(Math.min(1, (f - T.mange) / 8) * Math.PI) + 0.05 : 1}
            tremble={f >= T.mange && f < T.schema ? 3 : 0}
            timeline={[
              {f: 0, base: 'debout', bras: 'cafe', expr: 'panique'},
              {f: T.scenario - 6, base: 'marche', bras: 'pointer', expr: 'fache'},
              {f: T.mange, base: 'debout', bras: 'panique', expr: 'fache'},
              {f: T.schema + 11, base: 'debout', bras: 'leve', expr: 'soulage'},
              {f: T.teaser, bras: 'pointer', expr: 'fier'},
            ]}
          />
          <Toi
            x={chaise.x + 10}
            y={1500}
            saut={saut(f, [T.mange, T.sms])}
            timeline={[
              {f: 0, base: 'assis', bras: 'taper', expr: 'concentre'},
              {f: T.scenario - 6, bras: 'panique', expr: 'panique', regard: [1, 0]},
              {f: T.schema, bras: 'taper', expr: 'concentre'},
              {f: T.sms, bras: 'telephone', expr: 'surpris', regard: [1, 0.5]},
              {f: m(100), expr: 'fier'},
              {f: T.non, bras: 'repos', expr: 'amuse', regard: [-0.3, 0]},
              {f: T.regle, bras: 'reflechit', expr: 'concentre'},
              {f: T.teaser, bras: 'repos', expr: 'curieux', regard: [1, -0.3]},
            ]}
          />
        </BureauStartup>
      </Camera>

      {/* ======================= SCÉNARIO « tu réécris tout » ======================= */}
      {showScenario && (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 45%, rgba(40,10,10,0.75) 100%)'}} />
          <div
            style={{
              position: 'absolute',
              left: 50,
              top: 300,
              transform: `scale(${pop(f, T.scenario)}) rotate(-3deg)`,
              background: '#22c55e',
              color: '#fff',
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 46,
              padding: '12px 28px',
              borderRadius: 22,
              border: '5px solid #fff',
              boxShadow: '0 10px 0 #15803d',
            }}
          >
            SI TU AVAIS TOUT RÉÉCRIT…
          </div>
        </AbsoluteFill>
      )}

      {/* ======================= NAVIGATEUR 1 : le HTML marche ======================= */}
      {showNav1 && (
        <AbsoluteFill style={{background: `rgba(15,22,48,${0.88 * navIn})`, opacity: 1 - prog(f, T.rappel2, 10)}}>
          <div style={{position: 'absolute', left: 40, top: 470, transform: `scale(${0.3 + 0.7 * navIn})`, transformOrigin: '50% 30%'}}>
            <MaquetteSite html={1} couleurs={0} tailles={0} miseEnPage={0} largeur={1000} surbrillance={f >= T.titres && f < T.htmlOk ? 'titres' : f >= T.texte && f < T.titres ? 'textes' : null} />
          </div>
          <Etiquette debut={T.texte} x={800} y={1010} texte="✓ TEXTE" couleur="#15803d" />
          <Etiquette debut={T.titres} x={800} y={650} texte="✓ TITRES" couleur="#15803d" rot={3} />
          <Tampon debut={T.htmlOk} x={540} y={860} texte="HTML : OK ✓" couleur="#16a34a" taille={110} />
        </AbsoluteFill>
      )}

      {/* ======================= RAPPEL DU CHOIX ======================= */}
      {f < T.nav1 + 12 && f > 0 && <AbsoluteFill style={{background: `rgba(8,12,30,${0.6 * (1 - prog(f, T.nav1, 10))})`}} />}
      <ChoixRappel debut={T.rappel} fin={T.nav1} vert="Réécrire le HTML" rouge="Relier le CSS" y={640} />
      {f >= T.rappel2 && f < T.scenario + 6 && <AbsoluteFill style={{background: `rgba(8,12,30,${0.7 * (1 - prog(f, T.scenario - 6, 10))})`}} />}
      <ChoixRappel
        debut={T.rappel2}
        fin={T.scenario - 6}
        vert="Réécrire le HTML"
        rouge="Relier le CSS"
        etatVert="faux"
        depuisVert={T.faux}
        etatRouge="bon"
        depuisRouge={T.bon}
        titre="RÉSULTAT"
        y={560}
      />

      {/* ======================= SCHÉMA : le navigateur ne devine rien ======================= */}
      {showSchema && (
        <AbsoluteFill style={{transform: `translateX(${glisse(f, T.schema, T.editeur)}px)`}}>
          <FondPlan />
          <div style={{position: 'absolute', left: 390, top: 700, transform: `scale(${pop(f, T.navigateur)}) rotate(${f >= T.devine ? Math.sin(f * 0.15) * 4 : 0}deg)`}}>
            <IconeNavigateur s={300} perdu={f >= T.devine} regard={f >= T.jamais ? -1 : f >= T.mon ? -0.6 : 0} />
            <div style={{textAlign: 'center', color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 40, marginTop: -6}}>le navigateur</div>
          </div>
          {/* liens navigateur -> fichiers */}
          {f >= T.page && (
            <svg style={{position: 'absolute', left: 0, top: 0}} width={1080} height={1920}>
              <line x1={470} y1={990} x2={190} y2={1080} stroke="#4ade80" strokeWidth={10} strokeDasharray="18 12" strokeDashoffset={-f * 2} strokeLinecap="round" opacity={prog(f, T.page, 8)} />
              {f >= T.jamais && (
                <>
                  <line x1={610} y1={990} x2={700} y2={1020} stroke="#ef4444" strokeWidth={10} strokeDasharray="18 12" strokeLinecap="round" />
                  <line x1={800} y1={1050} x2={890} y2={1080} stroke="#ef4444" strokeWidth={10} strokeDasharray="18 12" strokeLinecap="round" />
                  <text x={750} y={1060} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill="#ef4444">
                    ✕
                  </text>
                </>
              )}
            </svg>
          )}
          <div style={{position: 'absolute', left: 80, top: 1080, transform: `scale(${pop(f, T.page)})`}}>
            <Fichier nom="index.html" ext="html" taille={190} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 810,
              top: 1080,
              transform: `scale(${pop(f, T.page + 6)}) translateX(${f >= T.jamais ? Math.sin(f * 1.6) * 10 : 0}px)`,
              opacity: f >= T.jamais ? 1 : 0.85,
            }}
          >
            <Fichier nom="style.css" ext="css" taille={190} />
          </div>
          {/* ce que la page ne dit pas */}
          {f >= T.mon && (
            <div
              style={{
                position: 'absolute',
                left: 290,
                top: 1150,
                width: 480,
                transform: `scale(${pop(f, T.mon)})`,
                background: 'rgba(255,255,255,0.12)',
                border: '5px dashed #cbd5e1',
                borderRadius: 30,
                padding: '18px 22px',
                color: '#e2e8f0',
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 38,
                textAlign: 'center',
              }}
            >
              « mon style est dans ce fichier »
            </div>
          )}
          <Tampon debut={T.fichier} x={530} y={1215} texte="ABSENT" couleur="#ef4444" taille={64} rot={-8} />
          {f >= T.jamais && (
            <div
              style={{
                position: 'absolute',
                left: 700,
                top: 900,
                transform: `scale(${pop(f, T.jamais + 4)})`,
                background: '#fff',
                color: '#1d4ed8',
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 42,
                padding: '14px 24px',
                borderRadius: 26,
                boxShadow: '0 8px 0 rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap',
              }}
            >
              Hé ! Je suis là !
            </div>
          )}
          <CarteJeu debut={T.schema + 6} fin={T.editeur - 4} surtitre="LE VRAI PROBLÈME" couleurSurtitre="#f87171" titre="Le navigateur ne devine rien" x={380} y={290} largeur={640} />
        </AbsoluteFill>
      )}

      {/* ======================= ÉDITEUR : la ligne magique ======================= */}
      {showEditeur && (
        <AbsoluteFill style={{transform: `translateX(${glisse(f, T.editeur, T.refresh)}px)`}}>
          <FondPlan />
          <div style={{position: 'absolute', left: 40, top: 300, color: '#fff', fontFamily: FONT, fontWeight: 700, fontSize: 56, transform: `scale(${pop(f, T.editeur + 6)})`, transformOrigin: 'left'}}>
            📄 index.html
          </div>
          <div style={{position: 'absolute', left: 40, top: 410, transform: `scale(${pop(f, T.editeur + 4, 30, 12)})`}}>
            <Editeur
              fichier="index.html"
              modifie={f >= T.link && f < T.save + 4}
              taille={34}
              largeur={1000}
              curseurLigne={f >= T.ajoute && f < T.link ? 4 : undefined}
              lignes={[
                {code: '<!DOCTYPE html>'},
                {code: '<html>'},
                {code: '<head>', surligne: [[T.head, T.link - 6]]},
                {code: '  <title>Boulangerie Marcel</title>', surligne: [[T.head, T.link - 6]]},
                {
                  code: LIGNE_LINK,
                  frappe: [
                    [T.link - 4, 2],
                    [T.link + 10, 7],
                    [m(74), 7],
                    [m(76) + 22, 26],
                    [m(77), 26],
                    [m(81) + 12, LIGNE_LINK.length],
                  ],
                  surligne: [[T.head, T.link - 6], [T.link, T.refresh, 'rgba(74,222,128,0.18)']],
                },
                {code: '</head>', surligne: [[T.head, T.link - 6]]},
                {code: '<body>'},
                {code: '  <h1>Boulangerie Marcel</h1>'},
                {code: '  <p>Pain frais tous les matins.</p>'},
                {code: '</body>'},
                {code: '</html>'},
              ]}
            />
          </div>
          <Etiquette debut={T.head} x={760} y={555} texte="LA PARTIE HEAD" rot={3} />
          <Etiquette debut={T.link + 4} x={540} y={1180} texte="UNE SEULE LIGNE !" couleur="#15803d" rot={-2} />
          {f >= T.save && (
            <div
              style={{
                position: 'absolute',
                left: 540,
                top: 1290,
                transform: `translate(-50%,-50%) scale(${pop(f, T.save)})`,
                display: 'flex',
                gap: 18,
                alignItems: 'center',
                fontFamily: FONT,
                fontWeight: 700,
              }}
            >
              {['Ctrl', 'S'].map((k, i) => (
                <React.Fragment key={k}>
                  {i > 0 && <span style={{color: '#fff', fontSize: 50}}>+</span>}
                  <span style={{background: '#f8fafc', color: '#0f1630', fontSize: 48, padding: '8px 24px', borderRadius: 14, boxShadow: '0 8px 0 #94a3b8', transform: f < T.save + 6 ? 'translateY(6px)' : undefined}}>
                    {k}
                  </span>
                </React.Fragment>
              ))}
              <span style={{color: '#4ade80', fontSize: 50, marginLeft: 14}}>✓ Enregistré</span>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ======================= NAVIGATEUR 2 : tout apparaît ======================= */}
      {showNav2 && (
        <AbsoluteFill style={{background: `rgba(15,22,48,${0.9 * nav2In})`, opacity: 1 - prog(f, T.sms - 14, 10)}}>
          <div style={{position: 'absolute', left: 40, top: 470, transform: `scale(${0.9 + 0.1 * nav2In})`, opacity: nav2In}}>
            <MaquetteSite
              html={1}
              couleurs={prog(f, T.couleurs, 12)}
              tailles={prog(f, T.boutons, 12, Easing.out(Easing.back(2)))}
              miseEnPage={prog(f, T.mise, 16)}
              largeur={1000}
            />
            {f < T.couleurs && (
              <div style={{position: 'absolute', left: 0, top: 70, width: 1000, height: 711, background: `rgba(255,255,255,${f < T.couleurs - 18 ? 0.85 : 0})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                {f < T.couleurs - 18 && (
                  <svg width={140} height={140} viewBox="0 0 100 100" style={{transform: `rotate(${f * 12}deg)`}}>
                    <path d="M50,12 A38,38 0 1,1 16,32" stroke="#3b82f6" strokeWidth={10} fill="none" strokeLinecap="round" />
                    <path d="M6,20 L18,36 L30,22 Z" fill="#3b82f6" />
                  </svg>
                )}
              </div>
            )}
          </div>
          <Etiquette debut={T.couleurs} x={260} y={520} texte="COULEURS" couleur="#be185d" rot={-5} />
          <Etiquette debut={T.boutons} x={800} y={1290} texte="BOUTONS" couleur="#be185d" rot={4} />
          <Etiquette debut={T.mise} x={300} y={1290} texte="MISE EN PAGE" couleur="#be185d" rot={-3} />
          <Confettis debut={T.tout} />
          <Etincelles debut={T.tout} x={540} y={850} r={300} n={16} />
          {f >= T.refresh + 6 && (
            <div
              style={{
                position: 'absolute',
                left: 60,
                top: 260,
                width: 190,
                height: 190,
                borderRadius: 95,
                overflow: 'hidden',
                border: '8px solid #f4c542',
                transform: `scale(${pop(f, T.refresh + 6) * (f >= T.tout && f < T.tout + 10 ? 1.15 : 1)})`,
                boxShadow: '0 10px 0 rgba(0,0,0,0.35)',
              }}
            >
              <Portrait fond="#c4b5fd" viewBox="-125 -580 250 250">
                <Toi x={0} y={0} ombre={false} timeline={[{f: 0, expr: 'curieux', regard: [0, 0]}, {f: T.couleurs, expr: 'surpris'}, {f: T.tout, expr: 'fier'}]} />
              </Portrait>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ======================= « T'es un génie » ======================= */}
      <NotifSMS debut={T.sms} fin={T.non + 10} de="Max" texte="T'es un génie 🤩" y={470} />
      {f >= T.juste && f < T.regle + 10 && <Etiquette debut={T.juste} x={330} y={760} texte="JUSTE 1 LIGNE 😎" rot={-4} />}

      {/* ======================= RÈGLE À RETENIR ======================= */}
      {regleVoile > 0 && (
        <AbsoluteFill style={{background: `rgba(8,12,30,${0.78 * regleVoile})`}}>
          <CarteJeu
            debut={T.regle}
            fin={T.teaser - 4}
            surtitre="À RETENIR"
            titre="Site sans style ?"
            detail={f < T.nom ? '① la balise link' : '① la balise link\n② le nom du fichier'}
            x={380}
            y={290}
            largeur={640}
          />
          {f >= T.balise && (
            <div style={{position: 'absolute', left: 40, top: 790, transform: `scale(${pop(f, T.balise, 30, 12)})`}}>
              <Editeur
                chrome={false}
                taille={31}
                largeur={1000}
                lignes={[
                  {
                    code: '<link rel="stylesheet" href="style.css">',
                    zoom: f < T.nomMot ? {texte: 'link', debut: T.linkMot, fin: T.nomMot - 1} : {texte: 'style.css', debut: T.nomMot, fin: T.teaser},
                  },
                ]}
              />
            </div>
          )}
          {f >= T.lettre &&
            [
              {nom: 'style.css', ok: true, d: T.lettre},
              {nom: 'styel.css', ok: false, d: m(132)},
            ].map((r, i) => (
              <div
                key={r.nom}
                style={{
                  position: 'absolute',
                  left: 110 + i * 450,
                  top: 1000,
                  transform: `scale(${pop(f, r.d)})`,
                  background: r.ok ? '#14532d' : '#7f1d1d',
                  border: `6px solid ${r.ok ? '#4ade80' : '#f87171'}`,
                  borderRadius: 24,
                  padding: '18px 26px',
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 44,
                  color: '#fff',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <span>
                  {r.ok ? (
                    'style.css'
                  ) : (
                    <>
                      sty<span style={{color: '#fde047', textDecoration: 'underline'}}>el</span>.css
                    </>
                  )}
                </span>
                <span style={{fontFamily: FONT, fontSize: 52, color: r.ok ? '#4ade80' : '#f87171'}}>{r.ok ? '✓' : '✗'}</span>
              </div>
            ))}
          <Tampon debut={T.marchePlus} x={540} y={1240} texte="ÇA NE MARCHE PLUS" couleur="#dc2626" taille={68} rot={-6} />
        </AbsoluteFill>
      )}

      {/* ======================= TEASER ======================= */}
      {f >= T.teaser && f < T.abonne + 6 && (
        <AbsoluteFill>
          <CarteJeu debut={T.teaser} fin={T.abonne - 4} surtitre="PROCHAIN ÉPISODE" titre="Max veut un titre…" x={540} y={470} largeur={900} />
          {f >= T.geant && (
            <div
              style={{
                position: 'absolute',
                left: 540,
                top: 980,
                transform: `translate(-50%,-50%) scale(${pop(f, T.geant, 30, 6) * (1 + 0.25 * prog(f, T.geant + 8, 30))}) rotate(${Math.sin(f * 0.8) * 2}deg)`,
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 230,
                color: '#ffe14d',
                WebkitTextStroke: '18px #000',
                paintOrder: 'stroke fill',
                textShadow: '0 16px 0 rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap',
              }}
            >
              GÉANT
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ======================= UI permanente ======================= */}
      <HUD
        compteur={[
          [0, 45],
          [s(20), 44],
          [s(40), 43],
        ]}
        barre={[
          [0, 0.86],
          [T.save, 0.88],
          [T.tout, 0.88],
          [T.tout + 18, 0.12],
          [T.sms + 20, 0.05],
        ]}
        unite="MIN"
        label="DEADLINE"
        icone="chrono"
        alerte={0.75}
      />
      <CarteOuverture debut={4} fin={T.nav1 - 8} ligne1="LUNDI • 09:20" ligne2="Bureau – Startup" ligne3="Toi, stagiaire dev" />
      <EcranAbonne debut={T.abonne} />
      {f < T.abonne && <SousTitres mots={mots} motsCles={MOTS_CLES} y={1400} />}

      <Bande voix="videos/devsteach-1b/voix.wav" mots={mots} effets={effets} ambiance="ambiances/bureau.mp3" musique="musiques/tech-leger.mp3" />
    </AbsoluteFill>
  );
};
