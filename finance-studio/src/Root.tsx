import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './style';
import {Calibrage, DUREE_CALIBRAGE} from './videos/Calibrage';
import {Finance01, DUREE_F01} from './videos/Finance01';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Calibrage" component={Calibrage} durationInFrames={Math.round(DUREE_CALIBRAGE * FPS)} fps={FPS} width={W} height={H} />
    <Composition id="finance-01" component={Finance01} durationInFrames={Math.round(DUREE_F01 * FPS)} fps={FPS} width={W} height={H} />
  </>
);
