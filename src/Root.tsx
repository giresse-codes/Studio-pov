import React from 'react';
import {Composition} from 'remotion';
import './lib/fonts';
import {FPS, H, W} from './lib/anim';
import {Test} from './episodes/Test';
import {DevsTeach1a, DUREE_DEVSTEACH_1A} from './episodes/devsteach-1a';
import {DevsTeach1b, DUREE_DEVSTEACH_1B} from './episodes/devsteach-1b';
import {Astuce1a, DUREE_ASTUCE_1A} from './episodes/astuce-1a';
import {Astuce1b, DUREE_ASTUCE_1B} from './episodes/astuce-1b';
import {Survie1a, DUREE_SURVIE_1A} from './episodes/survie-1a';
import {Survie1b, DUREE_SURVIE_1B} from './episodes/survie-1b';
import {DevsTeach2a, DUREE_DEVSTEACH_2A} from './episodes/devsteach-2a';

export const Root: React.FC = () => (
  <>
    <Composition id="test" component={Test} durationInFrames={15 * FPS} fps={FPS} width={W} height={H} />
    <Composition id="devsteach-1a" component={DevsTeach1a} durationInFrames={DUREE_DEVSTEACH_1A} fps={FPS} width={W} height={H} />
    <Composition id="devsteach-1b" component={DevsTeach1b} durationInFrames={DUREE_DEVSTEACH_1B} fps={FPS} width={W} height={H} />
    <Composition id="astuce-1a" component={Astuce1a} durationInFrames={DUREE_ASTUCE_1A} fps={FPS} width={W} height={H} />
    <Composition id="astuce-1b" component={Astuce1b} durationInFrames={DUREE_ASTUCE_1B} fps={FPS} width={W} height={H} />
    <Composition id="survie-1a" component={Survie1a} durationInFrames={DUREE_SURVIE_1A} fps={FPS} width={W} height={H} />
    <Composition id="survie-1b" component={Survie1b} durationInFrames={DUREE_SURVIE_1B} fps={FPS} width={W} height={H} />
    <Composition id="devsteach-2a" component={DevsTeach2a} durationInFrames={DUREE_DEVSTEACH_2A} fps={FPS} width={W} height={H} />
  </>
);
