import React from 'react';
import {Composition, continueRender, delayRender} from 'remotion';
import {DUREE_TEST, Test} from './compositions/Test';
import {DevsTeach1, DUREE_DEVSTEACH_1} from './compositions/DevsTeach1';
import {DevsTeach2, DUREE_DEVSTEACH_2} from './compositions/DevsTeach2';
import {DevsTeach3, DUREE_DEVSTEACH_3} from './compositions/DevsTeach3';
import {DevsTeach4, DUREE_DEVSTEACH_4} from './compositions/DevsTeach4';
import {DevsTeach5, DUREE_DEVSTEACH_5} from './compositions/DevsTeach5';
import {Astuce1, DUREE_ASTUCE_1} from './compositions/Astuce1';
import {Astuce2, DUREE_ASTUCE_2} from './compositions/Astuce2';
import {Astuce3, DUREE_ASTUCE_3} from './compositions/Astuce3';
import {chargerPolices} from './lib/polices';
import {FPS, H, W} from './lib/theme';

const attente = delayRender('Chargement des polices');
chargerPolices().then(() => continueRender(attente));

export const Racine: React.FC = () => (
  <>
    <Composition id="Test" component={Test} durationInFrames={DUREE_TEST} fps={FPS} width={W} height={H} />
    <Composition id="devsteach-1" component={DevsTeach1} durationInFrames={DUREE_DEVSTEACH_1} fps={FPS} width={W} height={H} />
    <Composition id="devsteach-2" component={DevsTeach2} durationInFrames={DUREE_DEVSTEACH_2} fps={FPS} width={W} height={H} />
    <Composition id="devsteach-3" component={DevsTeach3} durationInFrames={DUREE_DEVSTEACH_3} fps={FPS} width={W} height={H} />
    <Composition id="devsteach-4" component={DevsTeach4} durationInFrames={DUREE_DEVSTEACH_4} fps={FPS} width={W} height={H} />
    <Composition id="devsteach-5" component={DevsTeach5} durationInFrames={DUREE_DEVSTEACH_5} fps={FPS} width={W} height={H} />
    <Composition id="astuce-1" component={Astuce1} durationInFrames={DUREE_ASTUCE_1} fps={FPS} width={W} height={H} />
    <Composition id="astuce-2" component={Astuce2} durationInFrames={DUREE_ASTUCE_2} fps={FPS} width={W} height={H} />
    <Composition id="astuce-3" component={Astuce3} durationInFrames={DUREE_ASTUCE_3} fps={FPS} width={W} height={H} />
  </>
);
