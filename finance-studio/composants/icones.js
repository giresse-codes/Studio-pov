// Icônes SVG plates, contour bleu nuit épais, 100 % en code.
// Chaque fonction renvoie une chaîne <svg>. `w` = largeur affichée en px.
const N = '#0B1F3A'; // contour
const G = '#F5C542'; // or
const W = '#FFFFFF';
const L = '#EAF1FB'; // blanc bleuté
const B = '#5B9BE6'; // bleu clair
const R = '#FF4D5A'; // rouge
const V = '#2ED47A'; // vert

const svg = (w, vb, body, extra = '') =>
  `<svg width="${w}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" style="overflow:visible;display:block" ${extra}>${body}</svg>`;

const I = {
  machine: (w = 300, { tambour = B, corps = L } = {}) =>
    svg(w, '0 0 200 220', `
      <rect x="20" y="10" width="160" height="200" rx="22" fill="${corps}" stroke="${N}" stroke-width="7"/>
      <line x1="20" y1="55" x2="180" y2="55" stroke="${N}" stroke-width="6"/>
      <circle cx="45" cy="33" r="9" fill="${G}" stroke="${N}" stroke-width="4"/>
      <circle cx="72" cy="33" r="9" fill="${B}" stroke="${N}" stroke-width="4"/>
      <rect x="108" y="23" width="56" height="20" rx="5" fill="${N}"/>
      <rect x="114" y="29" width="20" height="8" rx="2" fill="${G}"/>
      <circle cx="100" cy="134" r="60" fill="#C9D8EC" stroke="${N}" stroke-width="7"/>
      <g class="tambour">
        <circle cx="100" cy="134" r="45" fill="${tambour}" stroke="${N}" stroke-width="5"/>
        <path d="M57 140 Q78 124 100 140 T143 140 A45 45 0 0 1 57 140 Z" fill="#9CC8FF"/>
        <circle cx="86" cy="118" r="7" fill="${W}" opacity=".85"/>
        <circle cx="117" cy="112" r="5" fill="${W}" opacity=".85"/>
        <circle cx="104" cy="156" r="6" fill="${W}" opacity=".7"/>
        <rect x="96" y="91" width="8" height="18" rx="3" fill="${N}" opacity=".5"/>
      </g>
      <path d="M68 104 A45 45 0 0 1 96 92" stroke="${W}" stroke-width="7" fill="none" stroke-linecap="round" opacity=".9"/>`),

  secheLinge: (w = 300) =>
    svg(w, '0 0 200 220', `
      <rect x="20" y="10" width="160" height="200" rx="22" fill="#FFF3D1" stroke="${N}" stroke-width="7"/>
      <line x1="20" y1="55" x2="180" y2="55" stroke="${N}" stroke-width="6"/>
      <circle cx="45" cy="33" r="9" fill="${R}" stroke="${N}" stroke-width="4"/>
      <rect x="108" y="23" width="56" height="20" rx="5" fill="${N}"/>
      <circle cx="100" cy="134" r="60" fill="#FFE29A" stroke="${N}" stroke-width="7"/>
      <g class="tambour">
        <circle cx="100" cy="134" r="45" fill="#FFB547" stroke="${N}" stroke-width="5"/>
        <path d="M80 150 q6 -10 0 -20 q-6 -10 0 -20 M100 155 q6 -10 0 -20 q-6 -10 0 -20 M120 150 q6 -10 0 -20 q-6 -10 0 -20" stroke="${W}" stroke-width="6" fill="none" stroke-linecap="round"/>
      </g>`),

  telephone: (w = 220, { ecran = '#7FB2F0' } = {}) =>
    svg(w, '0 0 120 210', `
      <rect x="10" y="5" width="100" height="200" rx="20" fill="#22344F" stroke="${N}" stroke-width="7"/>
      <rect x="20" y="24" width="80" height="160" rx="8" fill="${ecran}"/>
      <rect x="45" y="12" width="30" height="6" rx="3" fill="${N}"/>
      <path d="M30 40 L60 40 M30 52 L80 52" stroke="${W}" stroke-width="6" stroke-linecap="round" opacity=".8"/>
      <rect x="30" y="70" width="60" height="44" rx="8" fill="${W}" opacity=".6"/>
      <path d="M26 150 L92 60" stroke="${W}" stroke-width="10" opacity=".25" stroke-linecap="round"/>
      <circle cx="60" cy="195" r="5" fill="${W}" opacity=".7"/>`),

  chaussette: (w = 260) =>
    svg(w, '0 0 200 240', `
      <path d="M62 14 H138 V120 Q138 138 152 152 L178 176 Q196 198 172 214 Q150 228 130 208 L68 148 Q56 136 56 118 V14 Z"
            transform="translate(0,0)" fill="${W}" stroke="${N}" stroke-width="7" stroke-linejoin="round"/>
      <rect x="56" y="14" width="82" height="22" fill="${G}" stroke="${N}" stroke-width="7"/>
      <path d="M58 60 H136 M58 86 H136" stroke="${B}" stroke-width="10"/>
      <circle cx="160" cy="196" r="10" fill="${N}" opacity=".85"/>`),

  boiteMystere: (w = 260) =>
    svg(w, '0 0 200 200', `
      <rect x="22" y="70" width="156" height="118" rx="12" fill="${G}" stroke="${N}" stroke-width="7"/>
      <rect x="12" y="44" width="176" height="40" rx="10" fill="#FFD866" stroke="${N}" stroke-width="7"/>
      <rect x="88" y="44" width="24" height="144" fill="${R}" stroke="${N}" stroke-width="6"/>
      <text x="100" y="160" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="80" fill="${N}" stroke="${W}" stroke-width="3" paint-order="stroke">?</text>`),

  immeuble: (w = 200, { h = 260, couleur = L } = {}) => {
    let fen = '';
    for (let r = 0; r < Math.floor((h - 60) / 44); r++)
      for (let c = 0; c < 3; c++)
        fen += `<rect x="${28 + c * 50}" y="${30 + r * 44}" width="30" height="26" rx="4" fill="${(r + c) % 3 === 0 ? G : B}" stroke="${N}" stroke-width="4"/>`;
    return svg(w, `0 0 200 ${h}`, `<rect x="10" y="8" width="180" height="${h - 14}" rx="10" fill="${couleur}" stroke="${N}" stroke-width="7"/>${fen}
      <rect x="80" y="${h - 50}" width="40" height="44" rx="4" fill="${N}"/>`);
  },

  piece: (w = 160, txt = '€') =>
    svg(w, '0 0 120 120', `
      <circle cx="60" cy="60" r="52" fill="${G}" stroke="${N}" stroke-width="7"/>
      <circle cx="60" cy="60" r="38" fill="none" stroke="#C99A1E" stroke-width="5"/>
      <text x="60" y="80" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="54" fill="${N}">${txt}</text>`),

  monnayeur: (w = 200) =>
    svg(w, '0 0 160 220', `
      <rect x="15" y="10" width="130" height="200" rx="16" fill="#3A5A85" stroke="${N}" stroke-width="7"/>
      <rect x="35" y="30" width="90" height="40" rx="6" fill="#9FE6B8" stroke="${N}" stroke-width="5"/>
      <text x="80" y="60" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="26" fill="${N}">3,00</text>
      <rect x="66" y="92" width="28" height="8" rx="3" fill="${N}"/>
      <g class="piece-in"><circle cx="80" cy="96" r="16" fill="${G}" stroke="${N}" stroke-width="5"/></g>
      <rect x="40" y="140" width="80" height="44" rx="8" fill="${N}"/>`),

  horloge: (w = 300) =>
    svg(w, '0 0 200 200', `
      <circle cx="100" cy="100" r="88" fill="${W}" stroke="${N}" stroke-width="8"/>
      ${Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6, r1 = 72, r2 = i % 3 === 0 ? 58 : 64;
        return `<line x1="${100 + r1 * Math.sin(a)}" y1="${100 - r1 * Math.cos(a)}" x2="${100 + r2 * Math.sin(a)}" y2="${100 - r2 * Math.cos(a)}" stroke="${N}" stroke-width="${i % 3 === 0 ? 7 : 4}" stroke-linecap="round"/>`;
      }).join('')}
      <g class="aiguille-h"><line x1="100" y1="100" x2="100" y2="58" stroke="${N}" stroke-width="10" stroke-linecap="round"/></g>
      <g class="aiguille-m"><line x1="100" y1="100" x2="100" y2="34" stroke="${G}" stroke-width="7" stroke-linecap="round"/></g>
      <circle cx="100" cy="100" r="9" fill="${N}"/>`),

  personne: (w = 140, couleur = B) =>
    svg(w, '0 0 120 160', `
      <circle cx="60" cy="40" r="28" fill="#FFD9B5" stroke="${N}" stroke-width="7"/>
      <path d="M14 152 Q14 82 60 82 Q106 82 106 152 Z" fill="${couleur}" stroke="${N}" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="50" cy="40" r="4" fill="${N}"/><circle cx="70" cy="40" r="4" fill="${N}"/>
      <path d="M50 52 Q60 60 70 52" stroke="${N}" stroke-width="4" fill="none" stroke-linecap="round"/>`),

  etiquette: (w = 220) =>
    svg(w, '0 0 200 140', `
      <path d="M10 70 L60 14 H186 V126 H60 Z" fill="${G}" stroke="${N}" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="58" cy="70" r="12" fill="${W}" stroke="${N}" stroke-width="5"/>
      <text x="125" y="90" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="52" fill="${N}">€</text>`),

  bulle: (w = 220, txt = '') =>
    svg(w, '0 0 200 160', `
      <path d="M20 14 H180 Q192 14 192 26 V100 Q192 112 180 112 H80 L44 146 L50 112 H20 Q8 112 8 100 V26 Q8 14 20 14 Z" fill="${W}" stroke="${N}" stroke-width="7" stroke-linejoin="round"/>
      ${txt ? `<text x="100" y="80" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="46" fill="${N}">${txt}</text>`
        : `<circle cx="62" cy="63" r="10" fill="${N}"/><circle cx="100" cy="63" r="10" fill="${N}"/><circle cx="138" cy="63" r="10" fill="${N}"/>`}`),

  panier: (w = 320) =>
    svg(w, '0 0 240 220', `
      <path d="M60 70 q20 -50 60 -40 q30 -30 60 10 q10 -10 10 30" fill="${B}" stroke="${N}" stroke-width="6"/>
      <path d="M70 72 q30 -40 70 -10" fill="${G}" stroke="${N}" stroke-width="6"/>
      <path d="M20 70 H220 L196 206 H44 Z" fill="#D9B98A" stroke="${N}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M40 100 H200 M48 140 H192 M54 178 H186" stroke="${N}" stroke-width="5" opacity=".5"/>
      <g class="odeur" stroke="#7BD88F" stroke-width="7" fill="none" stroke-linecap="round">
        <path d="M70 20 q-12 -12 0 -24 q12 -12 0 -24"/><path d="M120 10 q-12 -12 0 -24 q12 -12 0 -24"/><path d="M170 20 q-12 -12 0 -24 q12 -12 0 -24"/>
      </g>`),

  calendrier: (w = 300, jours = ['L', 'M', 'M', 'J', 'V', 'S', 'D']) =>
    svg(w, '0 0 280 200', `
      <rect x="10" y="20" width="260" height="170" rx="16" fill="${W}" stroke="${N}" stroke-width="7"/>
      <path d="M10 36 Q10 20 26 20 H254 Q270 20 270 36 V64 H10 Z" fill="${R}" stroke="${N}" stroke-width="7"/>
      <rect x="62" y="6" width="12" height="30" rx="5" fill="${N}"/><rect x="206" y="6" width="12" height="30" rx="5" fill="${N}"/>
      ${jours.map((j, i) => `<text x="${34 + i * 35.5}" y="98" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="22" fill="${N}">${j}</text>
        <g class="coche coche-${i}"><circle cx="${34 + i * 35.5}" cy="140" r="15" fill="${V}" stroke="${N}" stroke-width="4"/>
        <path d="M${27 + i * 35.5} 140 l5 6 l10 -12" stroke="${W}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`).join('')}`),

  signet: (w = 240) =>
    svg(w, '0 0 160 220', `
      <path d="M20 10 H140 V206 L80 160 L20 206 Z" fill="${G}" stroke="${N}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M52 80 l20 22 l38 -44" stroke="${N}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),

  calculatrice: (w = 260) =>
    svg(w, '0 0 180 240', `
      <rect x="10" y="10" width="160" height="220" rx="18" fill="#22344F" stroke="${N}" stroke-width="7"/>
      <rect x="26" y="26" width="128" height="50" rx="8" fill="#9FE6B8"/>
      <text x="142" y="64" text-anchor="end" font-family="Montserrat" font-weight="900" font-size="30" fill="${N}" class="ecran-calc">?</text>
      ${Array.from({ length: 12 }, (_, k) => {
        const c = k % 3, r = Math.floor(k / 3);
        return `<rect x="${28 + c * 44}" y="${92 + r * 34}" width="36" height="26" rx="6" fill="${k === 11 ? G : (k % 3 === 2 ? B : L)}" stroke="${N}" stroke-width="3"/>`;
      }).join('')}`),

  laverie: (w = 360) =>
    svg(w, '0 0 260 240', `
      <rect x="20" y="70" width="220" height="160" rx="8" fill="${L}" stroke="${N}" stroke-width="7"/>
      <path d="M10 70 L30 30 H230 L250 70 Z" fill="${W}" stroke="${N}" stroke-width="7" stroke-linejoin="round"/>
      ${[0, 1, 2, 3, 4].map((k) => `<path d="M${30 + k * 40} 30 L${18 + k * 40 + (k ? 4 : 0)} 70 H${58 + k * 40} L${70 + k * 40} 30 Z" fill="${k % 2 ? W : G}" stroke="${N}" stroke-width="4"/>`).join('')}
      <rect x="40" y="88" width="180" height="34" rx="6" fill="${N}"/>
      <text x="130" y="114" text-anchor="middle" font-family="Montserrat" font-weight="900" font-size="24" fill="${G}" letter-spacing="2">LAVERIE</text>
      <rect x="40" y="136" width="120" height="80" rx="6" fill="#9CC8FF" stroke="${N}" stroke-width="5"/>
      <circle cx="72" cy="176" r="20" fill="${W}" stroke="${N}" stroke-width="5"/><circle cx="72" cy="176" r="10" fill="${B}"/>
      <circle cx="128" cy="176" r="20" fill="${W}" stroke="${N}" stroke-width="5"/><circle cx="128" cy="176" r="10" fill="${B}"/>
      <rect x="172" y="136" width="48" height="94" rx="4" fill="${G}" stroke="${N}" stroke-width="5"/>
      <circle cx="182" cy="186" r="4" fill="${N}"/>`),

  croix: (w = 120) =>
    svg(w, '0 0 100 100', `<circle cx="50" cy="50" r="44" fill="${R}" stroke="${N}" stroke-width="7"/>
      <path d="M32 32 L68 68 M68 32 L32 68" stroke="${W}" stroke-width="11" stroke-linecap="round"/>`),

  coche: (w = 120) =>
    svg(w, '0 0 100 100', `<circle cx="50" cy="50" r="44" fill="${V}" stroke="${N}" stroke-width="7"/>
      <path d="M28 52 L44 68 L74 34" stroke="${W}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),

  flaque: (w = 260) =>
    svg(w, '0 0 260 70', `<path d="M20 50 Q10 30 50 28 Q70 10 110 24 Q150 8 190 26 Q240 22 238 46 Q236 64 130 62 Q30 66 20 50 Z" fill="#7FB2F0" stroke="${N}" stroke-width="6"/>
      <ellipse cx="90" cy="40" rx="22" ry="6" fill="${W}" opacity=".6"/>`),

  goutte: (w = 50) =>
    svg(w, '0 0 40 56', `<path d="M20 4 Q36 28 36 38 A16 16 0 0 1 4 38 Q4 28 20 4 Z" fill="#9CC8FF" stroke="${N}" stroke-width="4"/>`),

  fissure: (w = 200) =>
    svg(w, '0 0 120 210', `<path d="M40 30 L58 70 L44 92 L70 130 L56 160" stroke="${W}" stroke-width="6" fill="none" stroke-linejoin="round"/>`),

  fleche: (w = 160, couleur = G) =>
    svg(w, '0 0 160 80', `<path d="M8 40 H120 M100 14 L140 40 L100 66" stroke="${N}" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 40 H120 M100 14 L140 40 L100 66" stroke="${couleur}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`),

  megaphone: (w = 220) =>
    svg(w, '0 0 200 160', `
      <path d="M30 60 L130 20 V140 L30 100 Z" fill="${G}" stroke="${N}" stroke-width="7" stroke-linejoin="round"/>
      <rect x="12" y="56" width="26" height="48" rx="6" fill="${B}" stroke="${N}" stroke-width="6"/>
      <path d="M52 104 L62 146 H84 L76 112" fill="${L}" stroke="${N}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M152 50 q16 30 0 60 M170 36 q26 44 0 88" stroke="${W}" stroke-width="7" fill="none" stroke-linecap="round"/>`),

  coeur: (w = 120) =>
    svg(w, '0 0 120 110', `<path d="M60 104 L14 58 Q-4 34 18 14 Q40 -2 60 22 Q80 -2 102 14 Q124 34 106 58 Z" fill="${R}" stroke="${N}" stroke-width="7" stroke-linejoin="round"/>
      <circle cx="36" cy="36" r="8" fill="${W}" opacity=".8"/>`),

  etoile: (w = 60, c = G) =>
    svg(w, '0 0 100 100', `<path d="M50 4 L62 38 L98 38 L68 60 L80 96 L50 74 L20 96 L32 60 L2 38 L38 38 Z" fill="${c}" stroke="${N}" stroke-width="6" stroke-linejoin="round"/>`),
};

module.exports = { I, COULEURS: { N, G, W, L, B, R, V } };
