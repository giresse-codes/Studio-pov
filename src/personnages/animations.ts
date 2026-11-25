import {interpolate} from 'remotion';
import {Pose, POSE_DEBOUT} from './Silhouette';
import {clamp} from '../lib/anim';

/** Animations réutilisables : chaque fonction donne une pose à une frame donnée. */

const respire = (f: number, amp = 3) => Math.sin(f / 14) * amp;

export const debout = (f: number): Pose => ({
  ...POSE_DEBOUT,
  y: respire(f),
  epauleAv: 8 + Math.sin(f / 20) * 2,
  epauleAr: -8 - Math.sin(f / 20) * 2,
  tete: Math.sin(f / 30) * 2,
});

export const assis = (f: number): Pose => ({
  ...POSE_DEBOUT,
  assis: true,
  hancheAv: 92, genouAv: -92, hancheAr: 86, genouAr: -86,
  y: respire(f, 2),
  buste: 4,
  epauleAv: 30, coudeAv: 40, epauleAr: 26, coudeAr: 44,
  tete: Math.sin(f / 28) * 2,
});

/** Assis, bras vers le clavier, mains qui tapotent */
export const taperClavier = (f: number, vitesse = 1): Pose => {
  const base = assis(f);
  const t = f * vitesse;
  return {
    ...base,
    buste: 10,
    epauleAv: 58 + Math.sin(t * 1.9) * 4, coudeAv: 34 + Math.abs(Math.sin(t * 1.3)) * 10,
    epauleAr: 54 + Math.sin(t * 1.6 + 1) * 4, coudeAr: 38 + Math.abs(Math.sin(t * 1.1 + 2)) * 10,
    tete: 6 + Math.sin(t / 6) * 1.5,
  };
};

/** Assis, téléphone à l'oreille (bras avant plié vers la tête) */
export const telephoneAssis = (f: number): Pose => ({
  ...assis(f),
  buste: 0,
  epauleAv: 150, coudeAv: 160,
  epauleAr: 40, coudeAr: 60,
  tete: -6,
});

/** Debout, téléphone à l'oreille */
export const telephoneDebout = (f: number): Pose => ({
  ...debout(f),
  epauleAv: 150, coudeAv: 160,
});

/** Sursaut : petit saut, bras en l'air (t = frames depuis le début du sursaut) */
export const sursaut = (base: Pose, t: number): Pose => {
  const k = interpolate(t, [0, 4, 10, 18], [0, 1, 0.6, 0], clamp);
  return {
    ...base,
    y: base.y - 40 * k,
    epauleAv: base.epauleAv + (150 - base.epauleAv) * k,
    coudeAv: base.coudeAv * (1 - k) + 20 * k,
    epauleAr: base.epauleAr + (130 - base.epauleAr) * k,
    coudeAr: base.coudeAr * (1 - k) + 20 * k,
    buste: base.buste * (1 - k) - 8 * k,
    tete: base.tete - 10 * k,
  };
};

/** Marche (cycle complet ~ 20 frames) */
export const marcher = (f: number, vitesse = 1): Pose => {
  const c = (f * vitesse * Math.PI * 2) / 20;
  const s = Math.sin(c);
  return {
    ...POSE_DEBOUT,
    hancheAv: s * 28, genouAv: Math.max(0, -Math.cos(c)) * -30,
    hancheAr: -s * 28, genouAr: Math.max(0, Math.cos(c)) * -30,
    epauleAv: -s * 26, coudeAv: 20, epauleAr: s * 26, coudeAr: 20,
    y: -Math.abs(Math.cos(c)) * 8,
    buste: 4,
    tete: 0,
  };
};

/** S'étirer (bras au-dessus de la tête) — k de 0 à 1 */
export const etirer = (base: Pose, k: number): Pose => ({
  ...base,
  epauleAv: base.epauleAv + (172 - base.epauleAv) * k,
  coudeAv: base.coudeAv * (1 - k) + 10 * k,
  epauleAr: base.epauleAr + (168 - base.epauleAr) * k,
  coudeAr: base.coudeAr * (1 - k) + 14 * k,
  buste: base.buste * (1 - k) - 10 * k,
  tete: base.tete - 12 * k,
});

/** Épaules qui tombent (déception) */
export const epaulesTombent = (base: Pose, k: number): Pose => ({
  ...base,
  epauleAv: base.epauleAv * (1 - k) + 2 * k,
  epauleAr: base.epauleAr * (1 - k) - 2 * k,
  coudeAv: base.coudeAv * (1 - k), coudeAr: base.coudeAr * (1 - k),
  buste: base.buste + 12 * k,
  tete: base.tete + 16 * k,
  y: base.y + 8 * k,
});

/** Chute : renversé en arrière (k 0→1) — à combiner avec une rotation du groupe */
export const tomber = (base: Pose, k: number): Pose => ({
  ...base,
  epauleAv: base.epauleAv + (160 - base.epauleAv) * k,
  epauleAr: base.epauleAr + (-150 - base.epauleAr) * k,
  hancheAv: base.hancheAv + 60 * k,
  genouAv: base.genouAv - 40 * k,
});

/** Mélange de deux poses (transition douce) */
export const melanger = (a: Pose, b: Pose, t: number): Pose => {
  const m = (x: number, y: number) => x + (y - x) * t;
  return {
    epauleAv: m(a.epauleAv, b.epauleAv), coudeAv: m(a.coudeAv, b.coudeAv),
    epauleAr: m(a.epauleAr, b.epauleAr), coudeAr: m(a.coudeAr, b.coudeAr),
    hancheAv: m(a.hancheAv, b.hancheAv), genouAv: m(a.genouAv, b.genouAv),
    hancheAr: m(a.hancheAr, b.hancheAr), genouAr: m(a.genouAr, b.genouAr),
    buste: m(a.buste, b.buste), tete: m(a.tete, b.tete), y: m(a.y, b.y),
    assis: t < 0.5 ? a.assis : b.assis,
  };
};
