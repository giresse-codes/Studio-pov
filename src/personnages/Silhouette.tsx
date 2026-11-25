import React from 'react';
import {C} from '../lib/theme';

/**
 * Base commune des personnages « silhouettes » : tête ronde noire et lisse,
 * grands yeux blancs expressifs, corps simple aux couleurs vives.
 * Origine (0,0) = entre les pieds, au sol. Hauteur debout ≈ 560 px.
 * Le personnage regarde vers la droite par défaut (sens = -1 pour la gauche).
 */

export type Expression =
  | 'neutre' | 'surpris' | 'panique' | 'fier' | 'coupable' | 'soulage' | 'triste' | 'concentre' | 'content';

/** Angles en degrés : 0 = membre vertical vers le bas, positif = vers l'avant (droite) */
export type Pose = {
  epauleAv: number; coudeAv: number; // bras avant (côté spectateur)
  epauleAr: number; coudeAr: number; // bras arrière
  hancheAv: number; genouAv: number;
  hancheAr: number; genouAr: number;
  buste: number; // inclinaison du buste (degrés, + = vers l'avant)
  tete: number; // inclinaison de la tête
  y: number; // décalage vertical du corps (saut, respiration)
  assis?: boolean; // le bassin descend à hauteur de chaise
};

export const POSE_DEBOUT: Pose = {
  epauleAv: 8, coudeAv: 10, epauleAr: -8, coudeAr: 10,
  hancheAv: 0, genouAv: 0, hancheAr: 0, genouAr: 0, buste: 0, tete: 0, y: 0,
};

export type Tenue = {
  haut: string; hautOmbre: string; bas: string; basOmbre: string;
  chaussure: string; semelle: string;
  manchesCourtes?: boolean; jambesNues?: boolean; // short / t-shirt
  peau?: string; // couleur des bras/jambes nues (silhouette noire)
};

type Props = {
  pose: Pose;
  expression: Expression;
  tenue: Tenue;
  regard?: number; // -1..1 direction des pupilles en x
  regardY?: number;
  cligne?: number; // 0..1 fermeture des paupières (clignement)
  parle?: number; // 0..1 ouverture de bouche
  sens?: 1 | -1;
  echelle?: number;
  cheveux?: React.ReactNode; // dessinés autour de la tête (repère tête)
  accessoireMainAv?: React.ReactNode; // dessiné dans la main avant (repère main)
  accessoireMainAr?: React.ReactNode;
  detailsBuste?: React.ReactNode; // poche, badge, taches… (repère buste)
  capuche?: string; // couleur de capuche dans le dos
};

const NOIR = C.noir;
const L_BRAS = 92; // longueur segment bras
const L_JAMBE = 112;
const R_TETE = 96;

const rad = (d: number) => (d * Math.PI) / 180;
const pt = (x: number, y: number, ang: number, l: number) => [x + Math.sin(rad(ang)) * l, y + Math.cos(rad(ang)) * l];

const Membre: React.FC<{
  x: number; y: number; a1: number; a2: number; l: number; ep: number; couleur: string; ombre?: string; bout?: React.ReactNode; boutCouleur?: string; boutR?: number; manche?: string; lManche?: number;
}> = ({x, y, a1, a2, l, ep, couleur, bout, boutCouleur = NOIR, boutR = 20, manche, lManche = 0}) => {
  const [x1, y1] = pt(x, y, a1, l);
  const [x2, y2] = pt(x1, y1, a1 + a2, l);
  const [xm, ym] = pt(x, y, a1, lManche);
  return (
    <g>
      <path d={`M${x},${y} L${x1},${y1} L${x2},${y2}`} stroke={couleur} strokeWidth={ep} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {manche && <path d={`M${x},${y} L${xm},${ym}`} stroke={manche} strokeWidth={ep + 6} strokeLinecap="round" fill="none" />}
      <circle cx={x2} cy={y2} r={boutR} fill={boutCouleur} />
      {bout && <g transform={`translate(${x2},${y2}) rotate(${-(a1 + a2)})`}>{bout}</g>}
    </g>
  );
};

/** Yeux + sourcils + bouche selon l'expression */
const Visage: React.FC<{expression: Expression; regard: number; regardY: number; cligne: number; parle: number}> = ({
  expression, regard, regardY, cligne, parle,
}) => {
  const uid = React.useId().replace(/:/g, '');
  // paramètres par expression
  const p = {
    neutre: {ry: 34, pup: 13, paup: 0.08, sourcil: 0, sy: 0, bouche: 'petite'},
    content: {ry: 32, pup: 13, paup: 0.12, sourcil: -6, sy: -2, bouche: 'sourire'},
    surpris: {ry: 42, pup: 9, paup: 0, sourcil: -14, sy: -16, bouche: 'o'},
    panique: {ry: 44, pup: 7, paup: 0, sourcil: 22, sy: -14, bouche: 'cri'},
    fier: {ry: 26, pup: 13, paup: 0.35, sourcil: -10, sy: -4, bouche: 'sourire'},
    coupable: {ry: 30, pup: 12, paup: 0.3, sourcil: 18, sy: 0, bouche: 'gene'},
    soulage: {ry: 22, pup: 12, paup: 0.5, sourcil: 14, sy: -4, bouche: 'sourire'},
    triste: {ry: 30, pup: 12, paup: 0.35, sourcil: 22, sy: 2, bouche: 'triste'},
    concentre: {ry: 24, pup: 13, paup: 0.42, sourcil: -16, sy: 4, bouche: 'plate'},
  }[expression];

  const ex = 28 + regard * 14; // centre des yeux décalé vers le regard
  const ecart = 31;
  const eyeY = -8 + regardY * 4;
  const rx = 25;
  const ry = p.ry;
  const fermeture = Math.min(1, p.paup + cligne);

  const Oeil = ({cx, cote}: {cx: number; cote: number}) => {
    const px = cx + regard * 9;
    const py = eyeY + regardY * 10 + 4;
    const hautPaup = eyeY - ry + fermeture * ry * 2 + 1;
    return (
      <g>
        <ellipse cx={cx} cy={eyeY} rx={rx} ry={ry} fill={C.blanc} />
        <circle cx={px} cy={py} r={p.pup} fill={NOIR} />
        <circle cx={px + 4} cy={py - 5} r={p.pup * 0.32} fill={C.blanc} />
        {/* paupière : rectangle noir qui descend du haut */}
        <clipPath id={`oeil-${uid}-${cote}`}>
          <ellipse cx={cx} cy={eyeY} rx={rx + 1} ry={ry + 1} />
        </clipPath>
        <rect x={cx - rx - 3} y={eyeY - ry - 4} width={rx * 2 + 6} height={Math.max(0, hautPaup - (eyeY - ry - 4))} fill={NOIR} clipPath={`url(#oeil-${uid}-${cote})`} />
        {/* sourcil */}
        <path
          d={`M${cx - 20},${eyeY - ry - 14 + p.sy + (cote * p.sourcil) / 2} L${cx + 20},${eyeY - ry - 14 + p.sy - (cote * p.sourcil) / 2}`}
          stroke={C.blanc} strokeWidth={9} strokeLinecap="round"
        />
      </g>
    );
  };

  const bx = ex + regard * 6;
  const by = 50;
  const ouvre = parle * 14;
  let bouche: React.ReactNode;
  switch (p.bouche) {
    case 'sourire':
      bouche = <path d={`M${bx - 20},${by - 4} Q${bx},${by + 16 + ouvre} ${bx + 20},${by - 4} Z`} fill={C.blanc} />;
      break;
    case 'o':
      bouche = <ellipse cx={bx} cy={by + 4} rx={11} ry={15 + ouvre / 2} fill={C.blanc} />;
      break;
    case 'cri':
      bouche = <path d={`M${bx - 22},${by + 2} Q${bx},${by - 14} ${bx + 22},${by + 2} Q${bx + 16},${by + 30 + ouvre} ${bx},${by + 30 + ouvre} Q${bx - 16},${by + 30 + ouvre} ${bx - 22},${by + 2} Z`} fill={C.blanc} />;
      break;
    case 'triste':
      bouche = <path d={`M${bx - 16},${by + 10} Q${bx},${by - 4} ${bx + 16},${by + 10}`} stroke={C.blanc} strokeWidth={7} strokeLinecap="round" fill="none" />;
      break;
    case 'gene':
      bouche = <path d={`M${bx - 16},${by + 4} Q${bx - 8},${by - 2} ${bx},${by + 4} Q${bx + 8},${by + 10} ${bx + 16},${by + 2}`} stroke={C.blanc} strokeWidth={6} strokeLinecap="round" fill="none" />;
      break;
    case 'plate':
      bouche = <path d={`M${bx - 12},${by + 4} L${bx + 12},${by + 4}`} stroke={C.blanc} strokeWidth={6} strokeLinecap="round" />;
      break;
    default:
      bouche = parle > 0.05
        ? <ellipse cx={bx} cy={by + 2} rx={12} ry={4 + ouvre / 2} fill={C.blanc} />
        : <path d={`M${bx - 10},${by + 2} Q${bx},${by + 8} ${bx + 10},${by + 2}`} stroke={C.blanc} strokeWidth={6} strokeLinecap="round" fill="none" />;
  }

  return (
    <g>
      <Oeil cx={ex - ecart} cote={-1} />
      <Oeil cx={ex + ecart} cote={1} />
      {bouche}
    </g>
  );
};

export const Silhouette: React.FC<Props> = ({
  pose, expression, tenue, regard = 0.6, regardY = 0, cligne = 0, parle = 0, sens = 1, echelle = 1,
  cheveux, accessoireMainAv, accessoireMainAr, detailsBuste, capuche,
}) => {
  // Bassin
  const bassinY = pose.assis ? -132 : -224;
  const by = bassinY + pose.y;
  const torseH = 150;
  const epaule = {x: 0, y: by - torseH + 16};
  const ep = 34; // épaisseur membres
  const peau = tenue.peau ?? NOIR;

  // Jambes
  const jambe = (h: number, g: number, cote: 'av' | 'ar') => {
    const x0 = cote === 'av' ? 14 : -14;
    const [x1, y1] = pt(x0, by, h, L_JAMBE);
    const [x2, y2] = pt(x1, y1, h + g, L_JAMBE);
    const couleur = cote === 'av' ? tenue.bas : tenue.basOmbre;
    const nu = tenue.jambesNues;
    return (
      <g>
        {nu ? (
          <>
            <path d={`M${x0},${by} L${x1},${y1} L${x2},${y2}`} stroke={peau} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d={`M${x0},${by} L${pt(x0, by, h, L_JAMBE * 0.75).join(',')}`} stroke={couleur} strokeWidth={46} strokeLinecap="round" fill="none" />
          </>
        ) : (
          <path d={`M${x0},${by} L${x1},${y1} L${x2},${y2}`} stroke={couleur} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        )}
        {/* chaussure */}
        <g transform={`translate(${x2},${y2 + 6}) rotate(${-(h + g) * 0.4})`}>
          <path d="M-22,-14 Q-24,8 -18,12 L44,12 Q50,4 40,-6 Q20,-12 8,-20 Z" fill={tenue.chaussure} />
          <rect x={-20} y={8} width={66} height={8} rx={4} fill={tenue.semelle} />
        </g>
      </g>
    );
  };

  const busteRot = pose.buste;
  const teteY = epaule.y - R_TETE + 4;

  return (
    <g transform={`scale(${sens * echelle},${echelle})`}>
      {/* ombre au sol */}
      <ellipse cx={8} cy={14} rx={92} ry={14} fill="#000" opacity={0.18} />
      {jambe(pose.hancheAr, pose.genouAr, 'ar')}
      <g transform={`rotate(${busteRot},0,${by})`}>
        {/* bras arrière */}
        <Membre x={epaule.x - 6} y={epaule.y + 10} a1={pose.epauleAr} a2={pose.coudeAr} l={L_BRAS} ep={ep - 4}
          couleur={tenue.manchesCourtes ? peau : tenue.hautOmbre} manche={tenue.manchesCourtes ? tenue.hautOmbre : undefined} lManche={40} bout={accessoireMainAr} boutR={19} />
        {/* capuche dans le dos */}
        {capuche && <path d={`M-58,${epaule.y - 6} Q-80,${epaule.y + 40} -54,${epaule.y + 70} L-20,${epaule.y + 30} Z`} fill={capuche} />}
        {/* buste */}
        <path
          d={`M-52,${by + 6} L-56,${epaule.y + 20} Q-54,${epaule.y - 6} -30,${epaule.y - 10} L34,${epaule.y - 10} Q58,${epaule.y - 6} 58,${epaule.y + 20} L56,${by + 6} Q0,${by + 18} -52,${by + 6} Z`}
          fill={tenue.haut}
        />
        <path d={`M-52,${by + 6} L-56,${epaule.y + 20} Q-54,${epaule.y - 6} -30,${epaule.y - 10} L-18,${epaule.y - 10} L-26,${by + 12} Z`} fill={tenue.hautOmbre} opacity={0.55} />
        {/* ceinture / haut du pantalon */}
        <path d={`M-52,${by + 2} Q0,${by + 16} 56,${by + 2} L56,${by + 22} Q0,${by + 34} -52,${by + 22} Z`} fill={tenue.jambesNues ? tenue.bas : tenue.bas} />
        <g transform={`translate(0,${epaule.y})`}>{detailsBuste}</g>
        {/* cou */}
        <rect x={-14} y={epaule.y - 24} width={30} height={30} rx={10} fill={NOIR} />
        {/* tête */}
        <g transform={`rotate(${pose.tete},0,${epaule.y - 10}) translate(0,${teteY})`}>
          {cheveux && <g>{cheveux}</g>}
          <circle cx={0} cy={0} r={R_TETE} fill={NOIR} />
          <ellipse cx={-34} cy={-44} rx={22} ry={12} fill="#ffffff" opacity={0.08} transform="rotate(-30,-34,-44)" />
          <Visage expression={expression} regard={regard} regardY={regardY} cligne={cligne} parle={parle} />
        </g>
        {/* bras avant */}
        <Membre x={epaule.x + 10} y={epaule.y + 10} a1={pose.epauleAv} a2={pose.coudeAv} l={L_BRAS} ep={ep}
          couleur={tenue.manchesCourtes ? peau : tenue.haut} manche={tenue.manchesCourtes ? tenue.haut : undefined} lManche={40} bout={accessoireMainAv} boutR={21} />
      </g>
      {jambe(pose.hancheAv, pose.genouAv, 'av')}
    </g>
  );
};

/** Clignement automatique toutes les ~3 s */
export const clignement = (f: number, decalage = 0) => {
  const t = (f + decalage) % 97;
  return t < 3 ? [0.5, 1, 0.5][t] : 0;
};
