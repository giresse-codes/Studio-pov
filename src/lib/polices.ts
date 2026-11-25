import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Polices embarquées dans public/polices (Inter, JetBrains Mono — licence OFL).
// loadFont bloque le rendu tant que la police n'est pas chargée.
const polices: [string, string, string][] = [
  ['Inter Studio', 'Inter-Bold.otf', '700'],
  ['Inter Studio', 'Inter-ExtraBold.otf', '800'],
  ['Inter Studio', 'Inter-Black.otf', '900'],
  ['JetBrains Studio', 'JetBrainsMono-Bold.ttf', '700'],
];

export const chargerPolices = () =>
  Promise.all(polices.map(([family, f, weight]) => loadFont({family, url: staticFile(`polices/${f}`), weight})));
