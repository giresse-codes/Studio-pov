// Captures d'images clés pour vérifier un rendu.
// Usage : node outils/captures.mjs <composition> <dossier> <sec1> <sec2> ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const [id, dir, ...secs] = process.argv.slice(2);
fs.mkdirSync(dir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id});
for (const sec of secs) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(Number(sec) * composition.fps));
  const output = path.join(dir, `${id}-${String(sec).replace('.', '_')}.png`);
  await renderStill({serveUrl, composition, frame, output, scale: 0.5});
  console.log(output);
}
