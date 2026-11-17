import React from 'react';
import {Bonhomme, ClesPose, HAUTEUR_BONHOMME, LARGEUR_BOITE} from './Bonhomme';
import {IconeNeon} from './IconeNeon';
import {Flottant, SurSol} from './Scene';
import {Apparait, Etiquette} from './anim';
import {C} from '../style';

type IconeProps = React.ComponentProps<typeof IconeNeon>;

/** Le « toi » (blanc) ou une autre personne (gris), posé au sol avec reflet. */
export const Perso: React.FC<{
  x: number;
  echelle?: number;
  cles?: ClesPose;
  gris?: boolean;
  a?: number;
  disparait?: number;
  marche?: number;
  allonge?: number;
}> = ({x, echelle = 1, cles, gris, a, disparait, marche, allonge}) => {
  const corps = <Bonhomme cles={cles ?? [[0, 'debout']]} couleur={gris ? C.gris : C.blanc} marche={marche} allonge={allonge} />;
  return (
    <SurSol x={x} largeur={LARGEUR_BOITE * echelle} hauteur={HAUTEUR_BONHOMME * echelle}>
      {a === undefined ? corps : <Apparait a={a} disparait={disparait}>{corps}</Apparait>}
    </SurSol>
  );
};

/** Icône posée au sol (avec reflet) qui apparaît à l'instant a. */
export const ObjetSol: React.FC<IconeProps & {x: number; l: number; h: number; a: number; disparait?: number; y?: number; reflet?: number}> = ({
  x,
  l,
  h,
  a,
  disparait,
  y,
  reflet,
  ...icone
}) => (
  <SurSol x={x} largeur={l} hauteur={h} y={y} reflet={reflet}>
    <Apparait a={a} disparait={disparait} glisse={20}>
      <IconeNeon {...icone} />
    </Apparait>
  </SurSol>
);

/** Icône flottante (sans reflet), centrée en (x, y). */
export const ObjetAir: React.FC<IconeProps & {x: number; y: number; l: number; h: number; a: number; disparait?: number}> = ({
  x,
  y,
  l,
  h,
  a,
  disparait,
  ...icone
}) => (
  <Flottant x={x} y={y} largeur={l} hauteur={h}>
    <Apparait a={a} disparait={disparait} glisse={14}>
      <IconeNeon {...icone} />
    </Apparait>
  </Flottant>
);

/**
 * Étiquette de prix néon dont la taille s'adapte au texte : le texte reste
 * dans le corps de l'étiquette, sans toucher le trou.
 */
export const Prix: React.FC<{x: number; y: number; texte: string; a: number; taille?: number; couleur?: string}> = ({
  x,
  y,
  texte,
  a,
  taille = 36,
  couleur = 'or',
}) => {
  const largeurTexte = texte.length * taille * 0.66;
  const l = Math.max(240, largeurTexte / 0.46);
  const h = taille * 3.4;
  return (
    <>
      <ObjetAir x={x} y={y} l={l} h={h} a={a} nom="etiquette" couleur={couleur} epaisseur={5} remplissage={0.12} />
      <Etiquette x={x - l * 0.17} y={y + taille * 0.45} texte={texte} couleur={couleur} taille={taille} a={a + 0.1} style={{letterSpacing: '0.02em'}} />
    </>
  );
};
