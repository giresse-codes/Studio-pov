import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../lib/anim';
import {FONT, MONO} from '../lib/fonts';

/* Éditeur de code animé (DevsTeach) : coloration HTML/CSS, frappe synchronisée à la voix, surlignage. */

export type Tok = {t: string; c: string};

const COUL = {
  tag: '#569cd6',
  attr: '#9cdcfe',
  str: '#ce9178',
  txt: '#e5e7eb',
  ponct: '#808080',
  com: '#6a9955',
};

/** Coloration simple d'une ligne HTML */
export const colorerHTML = (ligne: string): Tok[] => {
  const out: Tok[] = [];
  const re = /(<!--.*?-->)|(<\/?[\w!]+)|(\s[\w-]+)(?==)|(=)|("[^"]*")|(\/?>)|([^<>="]+)/g;
  let m: RegExpExecArray | null;
  let dansBalise = false;
  while ((m = re.exec(ligne))) {
    if (m[1]) out.push({t: m[1], c: COUL.com});
    else if (m[2]) {
      out.push({t: m[2].slice(0, m[2].startsWith('</') ? 2 : 1), c: COUL.ponct});
      out.push({t: m[2].slice(m[2].startsWith('</') ? 2 : 1), c: COUL.tag});
      dansBalise = true;
    } else if (m[3]) out.push({t: m[3], c: COUL.attr});
    else if (m[4]) out.push({t: m[4], c: COUL.ponct});
    else if (m[5]) out.push({t: m[5], c: COUL.str});
    else if (m[6]) {
      out.push({t: m[6], c: COUL.ponct});
      dansBalise = false;
    } else if (m[7]) out.push({t: m[7], c: dansBalise ? COUL.attr : COUL.txt});
  }
  return out;
};

export type Ligne = {
  code: string;
  /** frappe : clés [frame, nb de caractères visibles] (sinon ligne déjà écrite) */
  frappe?: [number, number][];
  /** surlignage : [debut, fin, couleur] */
  surligne?: [number, number, string?][];
  /** sous-chaîne mise en évidence (encadrée) entre deux frames */
  zoom?: {texte: string; debut: number; fin: number; couleur?: string};
};

export const Editeur: React.FC<{
  lignes: Ligne[];
  fichier?: string;
  modifie?: boolean; // pastille ● de fichier non enregistré
  taille?: number; // taille de police
  largeur?: number;
  chrome?: boolean;
  curseurLigne?: number;
  lang?: 'html';
}> = ({lignes, fichier = 'index.html', modifie = false, taille = 36, largeur = 1000, chrome = true, curseurLigne}) => {
  const f = useCurrentFrame();
  const lh = taille * 1.55;
  const cw = taille * 0.6; // largeur d'un caractère (police mono)
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <div
      style={{
        width: largeur,
        background: '#1e1e2e',
        borderRadius: 28,
        overflow: 'hidden',
        boxShadow: '0 20px 0 rgba(0,0,0,0.35)',
        border: '5px solid #2d2d44',
      }}
    >
      {chrome && (
        <div style={{display: 'flex', alignItems: 'center', background: '#151522', height: 70, padding: '0 20px', gap: 12}}>
          {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
            <div key={c} style={{width: 20, height: 20, borderRadius: 10, background: c}} />
          ))}
          <div
            style={{
              marginLeft: 20,
              background: '#1e1e2e',
              color: '#e5e7eb',
              fontFamily: MONO,
              fontSize: 26,
              padding: '12px 22px',
              borderRadius: '12px 12px 0 0',
              alignSelf: 'flex-end',
              display: 'flex',
              gap: 14,
              alignItems: 'center',
            }}
          >
            <span style={{color: '#f97316', fontFamily: FONT, fontWeight: 700}}>{'<>'}</span>
            {fichier}
            <span style={{color: modifie ? '#e5e7eb' : '#6b7280', fontSize: modifie ? 30 : 22}}>{modifie ? '●' : '×'}</span>
          </div>
        </div>
      )}
      <div style={{padding: '22px 0 26px', position: 'relative'}}>
        {lignes.map((l, i) => {
          const toks = colorerHTML(l.code);
          const total = l.code.length;
          const vis = l.frappe
            ? Math.floor(
                interpolate(
                  f,
                  l.frappe.map((k) => k[0]),
                  l.frappe.map((k) => k[1]),
                  {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.linear},
                ),
              )
            : total;
          const enFrappe = l.frappe && vis < total && f >= l.frappe[0][0];
          const sl = l.surligne?.find(([a, b]) => f >= a && f <= b);
          let restant = vis;
          const indent = l.code.match(/^\s*/)?.[0].length ?? 0;
          const zoomIdx = l.zoom ? l.code.indexOf(l.zoom.texte) : -1;
          const zoomOn = l.zoom && f >= l.zoom.debut && f <= l.zoom.fin && zoomIdx >= 0;
          const zk = l.zoom ? clamp((f - l.zoom.debut) / 8) : 0;
          return (
            <div key={i} style={{display: 'flex', height: lh, alignItems: 'center', position: 'relative'}}>
              {sl && (
                <div
                  style={{
                    position: 'absolute',
                    left: 58,
                    right: 12,
                    top: 2,
                    bottom: 2,
                    background: sl[2] ?? 'rgba(250,204,21,0.22)',
                    borderLeft: '6px solid #facc15',
                    borderRadius: 8,
                    opacity: clamp((f - sl[0]) / 6),
                  }}
                />
              )}
              <div style={{width: 76, textAlign: 'right', paddingRight: 26, color: '#4b5563', fontFamily: MONO, fontSize: taille * 0.8, flexShrink: 0}}>{i + 1}</div>
              <div style={{fontFamily: MONO, fontSize: taille, whiteSpace: 'pre', position: 'relative'}}>
                {toks.map((t, j) => {
                  if (restant <= 0) return null;
                  const txt = t.t.slice(0, restant);
                  restant -= t.t.length;
                  return (
                    <span key={j} style={{color: t.c}}>
                      {txt}
                    </span>
                  );
                })}
                {(enFrappe || (curseurLigne === i && !l.frappe)) && blink && (
                  <span style={{display: 'inline-block', width: 4, height: taille * 1.1, background: '#facc15', verticalAlign: 'middle', marginLeft: curseurLigne === i && !l.frappe ? indent * cw : 0}} />
                )}
                {zoomOn && (
                  <div
                    style={{
                      position: 'absolute',
                      left: zoomIdx * cw - 8,
                      top: -6,
                      width: l.zoom!.texte.length * cw + 16,
                      height: taille * 1.3 + 12,
                      border: `5px solid ${l.zoom!.couleur ?? '#facc15'}`,
                      borderRadius: 10,
                      transform: `scale(${0.8 + 0.2 * zk})`,
                      opacity: zk,
                      boxShadow: `0 0 20px ${l.zoom!.couleur ?? '#facc15'}`,
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
