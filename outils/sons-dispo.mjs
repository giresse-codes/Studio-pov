// Liste les sons réellement présents dans sons/ -> src/sons-dispo.json
// (les sons manquants sont simplement ignorés au rendu).
import fs from 'node:fs';
import path from 'node:path';
const dispo = [];
for (const d of ['ambiances', 'effets', 'musiques']) {
  const dir = path.join('sons', d);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) if (/\.(mp3|wav|ogg)$/i.test(f)) dispo.push(`${d}/${f}`);
}
fs.writeFileSync('src/sons-dispo.json', JSON.stringify(dispo, null, 1) + '\n');
console.log(`${dispo.length} son(s) disponible(s)`);
