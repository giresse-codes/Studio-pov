import React from 'react';
import {Composition} from 'remotion';
import './lib/fonts';
import {FPS, H, W} from './lib/anim';
import {Test} from './episodes/Test';
import {DevsTeach1a, DUREE_DEVSTEACH_1A} from './episodes/devsteach-1a';
import {DevsTeach1b, DUREE_DEVSTEACH_1B} from './episodes/devsteach-1b';
import {Astuce1a, DUREE_ASTUCE_1A} from './episodes/astuce-1a';

export const Root: React.FC = () => (
  <>
    <Composition id="test" component={Test} durationInFrames={15 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="devsteach-1a" component={DevsTeach1a} durationInFrames={DUREE_DEVSTEACH_1A} fps={FPS} width={W} height={H} />
    <Composition id="devsteach-1b" component={DevsTeach1b} durationInFrames={DUREE_DEVSTEACH_1B} fps={FPS} width={W} height={H} />
    <Composition id="astuce-1a" component={Astuce1a} durationInFrames={DUREE_ASTUCE_1A} fps={FPS} width={W} height={H} />
  </>
);
