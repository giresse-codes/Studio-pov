import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './style';
import {Calibrage, DUREE_CALIBRAGE} from './videos/Calibrage';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Calibrage" component={Calibrage} durationInFrames={Math.round(DUREE_CALIBRAGE * FPS)} fps={FPS} width={W} height={H} />
  </>
);
