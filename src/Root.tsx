import React from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {DUREE_TEST, Test} from './compositions/Test';
import {chargerPolices} from './lib/polices';
import {FPS, H, W} from './lib/theme';

const attente = delayRender('Chargement des polices');
chargerPolices().then(() => continueRender(attente));

export const Racine: React.FC = () => (
  <>
    <Composition id="Test" component={Test} durationInFrames={DUREE_TEST} fps={FPS} width={W} height={H} />
  </>
);
