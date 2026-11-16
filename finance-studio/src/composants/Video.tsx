import '@fontsource/jetbrains-mono/800.css';
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender} from 'remotion';
import {Decor, Vignette} from './Scene';

/** Cadre commun d'une vidéo Finance : décor, scènes, vignette, puis texte. */
export const CadreVideo: React.FC<{scenes: React.ReactNode; texte: React.ReactNode; dessus?: React.ReactNode}> = ({scenes, texte, dessus}) => {
  const [h] = useState(() => delayRender('police'));
  useEffect(() => {
    document.fonts.load('800 35px "JetBrains Mono"').then(() => continueRender(h));
  }, [h]);
  return (
    <AbsoluteFill style={{background: '#05070B', overflow: 'hidden'}}>
      <Decor />
      {scenes}
      <Vignette />
      {texte}
      {dessus}
    </AbsoluteFill>
  );
};
