import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../style';

/**
 * Bonhomme bâton : tête ronde pleine, corps en traits épais aux bouts arrondis,
 * sans visage. Le « toi » est blanc, les autres sont gris (#9AA3AE).
 *
 * Angles en degrés : 0 = vers le bas, 90 = vers la droite de l'écran,
 * 180 = vers le haut, -90 = vers la gauche.
 * Bras : [épaule, coude (relatif)], jambes : [hanche, genou (relatif)].
 */
export type Pose = {
  brasG: [number, number];
  brasD: [number, number];
  jambeG: [number, number];
  jambeD: [number, number];
  /** abaissement du bassin (assis, accroupi) en px à l'échelle 1 */
  bassin: number;
  /** raccourci des cuisses (vue de face assis) : 1 = normal */
  cuisse: number;
  /** inclinaison du buste en degrés */
  buste: number;
};

export const POSES: Record<string, Pose> = {
  debout: {brasG: [-10, 4], brasD: [10, -4], jambeG: [-5, 0], jambeD: [5, 0], bassin: 0, cuisse: 1, buste: 0},
  pointeDroite: {brasG: [-10, 4], brasD: [78, -4], jambeG: [-5, 0], jambeD: [5, 0], bassin: 0, cuisse: 1, buste: 0},
  pointeGauche: {brasG: [-78, 4], brasD: [10, -4], jambeG: [-5, 0], jambeD: [5, 0], bassin: 0, cuisse: 1, buste: 0},
  presenteDroite: {brasG: [-80, -6], brasD: [72, 10], jambeG: [-5, 0], jambeD: [5, 0], bassin: 0, cuisse: 1, buste: 0},
  brasOuverts: {brasG: [-68, -12], brasD: [68, 12], jambeG: [-6, 0], jambeD: [6, 0], bassin: 0, cuisse: 1, buste: 0},
  brasLeves: {brasG: [-148, 8], brasD: [148, -8], jambeG: [-6, 0], jambeD: [6, 0], bassin: 0, cuisse: 1, buste: 0},
  mainsHanches: {brasG: [-40, 70], brasD: [40, -70], jambeG: [-6, 0], jambeD: [6, 0], bassin: 0, cuisse: 1, buste: 0},
  reflechit: {brasG: [-10, 4], brasD: [30, 130], jambeG: [-5, 0], jambeD: [5, 0], bassin: 0, cuisse: 1, buste: 0},
  assis: {brasG: [-12, 10], brasD: [12, -10], jambeG: [-8, 0], jambeD: [8, 0], bassin: 150, cuisse: 0.12, buste: 0},
};

const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const l = (x: number, y: number) => x + (y - x) * t;
  const l2 = (x: [number, number], y: [number, number]): [number, number] => [l(x[0], y[0]), l(x[1], y[1])];
  return {
    brasG: l2(a.brasG, b.brasG),
    brasD: l2(a.brasD, b.brasD),
    jambeG: l2(a.jambeG, b.jambeG),
    jambeD: l2(a.jambeD, b.jambeD),
    bassin: l(a.bassin, b.bassin),
    cuisse: l(a.cuisse, b.cuisse),
    buste: l(a.buste, b.buste),
  };
};

const resoudre = (p: string | Pose): Pose => (typeof p === 'string' ? POSES[p] ?? POSES.debout : p);

/** Clés de pose : [seconde, pose]. Transition douce de `duree` secondes vers chaque nouvelle pose. */
export type ClesPose = Array<[number, string | Pose]>;

export const poseA = (cles: ClesPose, frame: number, duree = 0.45, fps = 30): Pose => {
  let courante = resoudre(cles[0][1]);
  for (let i = 1; i < cles.length; i++) {
    const f = cles[i][0] * fps;
    const p = cles[i][1];
    if (frame < f) break;
    const t = interpolate(frame, [f, f + duree * fps], [0, 1], {
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    });
    courante = lerpPose(courante, resoudre(p), t);
  }
  return courante;
};

const dir = (deg: number, len: number): [number, number] => {
  const r = (deg * Math.PI) / 180;
  return [Math.sin(r) * len, Math.cos(r) * len];
};

// Proportions calées sur la référence (échelle 1 = 700 px de haut).
const TETE_R = 64;
const COU_Y = 150;
const EPAULE_Y = 196;
const HANCHE_Y = 400;
const BRAS = [128, 124];
const JAMBE = [148, 142];
export const HAUTEUR_BONHOMME = 700;
export const LARGEUR_BOITE = 640;

export const Bonhomme: React.FC<{
  cles?: ClesPose;
  pose?: string | Pose;
  couleur?: string;
  /** marche : durée d'un pas en images, 0 = immobile */
  marche?: number;
  /** allongé au sol : 0 = debout, 1 = allongé (rotation douce) */
  allonge?: number;
  duree?: number;
  decalage?: number;
}> = ({cles, pose = 'debout', couleur = C.blanc, marche = 0, allonge = 0, duree = 0.45, decalage = 0}) => {
  const frame = useCurrentFrame() - decalage;
  let p = cles ? poseA(cles, frame, duree) : resoudre(pose);

  if (marche > 0) {
    const ph = Math.sin((frame / marche) * Math.PI);
    p = {
      ...p,
      jambeG: [p.jambeG[0] + 20 * ph, Math.max(0, -16 * ph)],
      jambeD: [p.jambeD[0] - 20 * ph, Math.max(0, 16 * ph) * -1],
      brasG: [p.brasG[0] - 14 * ph, p.brasG[1]],
      brasD: [p.brasD[0] - 14 * ph, p.brasD[1]],
    };
  }

  // Respiration discrète
  const souffle = Math.sin(frame / 22) * 2;

  const cx = LARGEUR_BOITE / 2;
  const b = p.bassin;
  const hancheY = HANCHE_Y + b;
  const epauleY = EPAULE_Y + b + souffle * 0.5;
  const teteY = TETE_R + 4 + b + souffle * 0.6;

  const membre = (ox: number, oy: number, a: [number, number], l: number[], k = 1): string => {
    const [x1, y1] = dir(a[0], l[0] * k);
    const [x2, y2] = dir(a[0] + a[1], l[1]);
    return `M ${ox} ${oy} L ${ox + x1} ${oy + y1} L ${ox + x1 + x2} ${oy + y1 + y2}`;
  };
  const bout = (ox: number, oy: number, a: [number, number], l: number[], k = 1): [number, number] => {
    const [x1, y1] = dir(a[0], l[0] * k);
    const [x2, y2] = dir(a[0] + a[1], l[1]);
    return [ox + x1 + x2, oy + y1 + y2];
  };

  const piedG = bout(cx - 16, hancheY, p.jambeG, JAMBE, p.cuisse);
  const piedD = bout(cx + 16, hancheY, p.jambeD, JAMBE, p.cuisse);

  const rot = allonge * -90;
  return (
    <svg
      viewBox={`0 0 ${LARGEUR_BOITE} ${HAUTEUR_BONHOMME}`}
      width="100%"
      height="100%"
      style={{overflow: 'visible'}}
    >
      <g
        transform={`translate(${allonge * 60} ${-30 * allonge}) rotate(${rot} ${cx} ${HAUTEUR_BONHOMME - 40})`}
        fill="none"
        stroke={couleur}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{filter: `drop-shadow(0 0 6px ${couleur}33)`}}
      >
        {/* jambes */}
        <path d={membre(cx - 16, hancheY - 6, p.jambeG, JAMBE, p.cuisse)} strokeWidth={40} />
        <path d={membre(cx + 16, hancheY - 6, p.jambeD, JAMBE, p.cuisse)} strokeWidth={40} />
        {/* pieds */}
        <path d={`M ${piedG[0] + 6} ${piedG[1] - 4} L ${piedG[0] - 22} ${piedG[1] - 4}`} strokeWidth={30} />
        <path d={`M ${piedD[0] - 6} ${piedD[1] - 4} L ${piedD[0] + 22} ${piedD[1] - 4}`} strokeWidth={30} />
        {/* buste */}
        <g transform={`rotate(${-p.buste} ${cx} ${hancheY})`}>
          <path d={`M ${cx} ${COU_Y + b + 30} L ${cx} ${hancheY - 10}`} strokeWidth={66} />
          {/* bras */}
          <path d={membre(cx - 14, epauleY, p.brasG, BRAS)} strokeWidth={32} />
          <path d={membre(cx + 14, epauleY, p.brasD, BRAS)} strokeWidth={32} />
          {/* tête */}
          <circle cx={cx} cy={teteY} r={TETE_R} fill={couleur} stroke="none" />
        </g>
      </g>
    </svg>
  );
};
