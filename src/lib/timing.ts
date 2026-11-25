import type {Mot} from '../ui/SousTitres';
import type {Segments} from './sons';

/** Données produites par outils/aligner.py (temps en secondes, voix originale) */
export type DonneesVoix = {pause: number | null; phrases: {balise: string; mots: {t: string; d: number; f: number}[]}[]};

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

/**
 * Convertit les temps de la voix en frames de la vidéo, en décalant tout ce qui suit
 * la pause de `ajout` frames (silence inséré pour l'écran de choix).
 */
export const creerTiming = (data: DonneesVoix, opts: {fps?: number; ajout?: number; cles?: string[]} = {}) => {
  const fps = opts.fps ?? 30;
  const ajout = opts.ajout ?? 0;
  const pauseF = data.pause !== null ? Math.round(data.pause * fps) : Infinity;
  const fr = (s: number) => {
    const f = Math.round(s * fps);
    return f >= pauseF ? f + ajout : f;
  };
  const cles = new Set((opts.cles ?? []).map(norm));
  const phrases = data.phrases.map((p) => ({
    balise: p.balise,
    mots: p.mots.map((m): Mot => ({t: m.t, d: fr(m.d), f: Math.max(fr(m.d) + 2, fr(m.f)), cle: cles.has(norm(m.t))})),
  }));
  const mots = phrases.flatMap((p) => p.mots);
  return {
    fps,
    pauseF,
    mots,
    phrases,
    /** début / fin (frames) de la phrase i */
    phrase: (i: number) => ({d: phrases[i].mots[0].d, f: phrases[i].mots[phrases[i].mots.length - 1].f}),
    /** frame du n-ième mot correspondant à `texte` dans la phrase i */
    mot: (i: number, texte: string, n = 0) => {
      const cible = norm(texte);
      const trouves = phrases[i].mots.filter((m) => norm(m.t) === cible);
      if (!trouves[n]) throw new Error(`Mot introuvable : « ${texte} » (phrase ${i})`);
      return trouves[n].d;
    },
    segments: phrases.map((p): [number, number] => [p.mots[0].d, p.mots[p.mots.length - 1].f]) as Segments,
    fin: fr(data.phrases[data.phrases.length - 1].mots.slice(-1)[0].f),
  };
};
export type Timing = ReturnType<typeof creerTiming>;
