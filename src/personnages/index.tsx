import React from 'react';
import {Personnage, PersonnageProps, Tenue} from './Personnage';

export * from './Personnage';

type P = Omit<PersonnageProps, 'tenue'>;

/** Toi : sweat à capuche violet, jean gris, baskets blanches */
export const TENUE_TOI: Tenue = {
  haut: '#8b5cf6',
  hautOmbre: '#6d3fd6',
  bas: '#7c8494',
  basOmbre: '#5f6675',
  chaussure: '#ffffff',
  semelle: '#cbd5e1',
  capuche: true,
};

/** Max : chemise bleue froissée, badge, café, cheveux en bataille */
export const TENUE_MAX: Tenue = {
  haut: '#3b82f6',
  hautOmbre: '#2563c9',
  bas: '#334155',
  basOmbre: '#1e293b',
  chaussure: '#7c4a1e',
  semelle: '#3f2410',
  chemise: true,
  badge: true,
  cheveux: 'bataille',
};

/** Bobo : t-shirt jaune taché, short, claquettes, cheveux frisés */
export const TENUE_BOBO: Tenue = {
  haut: '#facc15',
  hautOmbre: '#d4a90c',
  bas: '#22a06b',
  basOmbre: '#16794f',
  chaussure: '#ef4444',
  semelle: '#1f2937',
  mancheCourte: true,
  short: true,
  claquettes: true,
  tache: true,
  cheveux: 'frises',
};

export const Toi: React.FC<P> = (p) => <Personnage tenue={TENUE_TOI} t0={0} {...p} />;
export const Max: React.FC<P> = (p) => <Personnage tenue={TENUE_MAX} t0={37} {...p} />;
export const Bobo: React.FC<P> = (p) => <Personnage tenue={TENUE_BOBO} t0={71} {...p} />;
