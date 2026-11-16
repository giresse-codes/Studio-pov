import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Un plan (une scène) : son contenu entre en fondu au début et sort en fondu
 * à la fin. Tous les temps sont absolus (secondes depuis le début de la vidéo).
 */
export const Plan: React.FC<{debut: number; fin: number; fondu?: number; children: React.ReactNode}> = ({
  debut,
  fin,
  fondu = 0.25,
  children,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  if (t < debut || t >= fin) return null;
  const op = interpolate(t, [debut, debut + fondu, fin - fondu, fin], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  return <AbsoluteFill style={{opacity: op}}>{children}</AbsoluteFill>;
};

/**
 * Fondu doux par le noir au-dessus de tout (décor compris) autour de chaque
 * coupe, et noir complet après `finNoir` (la vidéo se termine par 1 s de noir).
 */
export const FonduNoir: React.FC<{coupes: number[]; demi?: number; force?: number; finNoir?: number}> = ({
  coupes,
  demi = 0.25,
  force = 0.6,
  finNoir,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  let op = 0;
  for (const c of coupes) {
    op = Math.max(op, interpolate(t, [c - demi, c, c + demi], [0, force, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  }
  // Ouverture au tout début
  op = Math.max(op, interpolate(t, [0, 0.4], [1, 0], {extrapolateRight: 'clamp'}));
  if (finNoir !== undefined) op = Math.max(op, interpolate(t, [finNoir - 0.5, finNoir], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return <AbsoluteFill style={{background: '#000', opacity: op, pointerEvents: 'none'}} />;
};
