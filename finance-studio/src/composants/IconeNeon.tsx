import React from 'react';
import {couleur as resoudreCouleur, halo, Couleur} from '../style';

/**
 * Icônes en traits fins façon néon (line art, coins arrondis), dessinées dans
 * une boîte 100 x 100. Le trait garde une épaisseur constante en pixels
 * (vector-effect), avec un halo de la couleur du trait.
 *
 * `trace` (0 → 1) dessine le contour progressivement (tracé qui se dessine).
 * `aiguille` (horloge) en degrés. `niveau` (jauge, tirelire) de 0 à 1.
 */
export type NomIcone =
  | 'chaise' | 'table' | 'maison' | 'telephone' | 'calendrier' | 'piece' | 'billet'
  | 'tirelire' | 'globe' | 'horloge' | 'ordinateur' | 'voiture' | 'machineALaver'
  | 'secheLinge' | 'carteBancaire' | 'graphique' | 'cadeau' | 'ballon' | 'etiquette'
  | 'chaussette' | 'monnayeur' | 'immeuble' | 'panierLinge' | 'coche' | 'croix'
  | 'flecheHaut' | 'flecheBas' | 'local' | 'favori' | 'reseau' | 'coeur' | 'jauge'
  | 'personne' | 'tableauCourbe' | 'contrat' | 'flecheDroite' | 'signal' | 'portefeuille'
  | 'lit' | 'camembert' | 'cible' | 'video' | 'glacon' | 'goutte' | 'verre' | 'couverts'
  | 'congelateur' | 'sachet' | 'soleil' | 'velo' | 'thermometre' | 'ampoule' | 'tshirt'
  | 'cadenas' | 'carton' | 'livre' | 'enceinte' | 'anneaux' | 'gateau' | 'mixage' | 'micro' | 'bulle'
  | 'distributeur' | 'pin' | 'haltere' | 'canette' | 'tournevis' | 'batterie' | 'eclair' | 'banque';

const RONDES = new Set<NomIcone>(['piece', 'globe', 'horloge', 'coche', 'croix', 'coeur', 'reseau', 'ballon', 'cadeau', 'tirelire', 'personne', 'camembert', 'cible', 'soleil', 'velo', 'haltere', 'eclair']);

type Props = {
  nom: NomIcone;
  couleur?: Couleur | string;
  epaisseur?: number;
  trace?: number;
  remplissage?: number;
  aiguille?: number;
  niveau?: number;
  /** courbe du graphique : 'monte' | 'baisse' | 'plat' */
  courbe?: 'monte' | 'baisse' | 'plat';
  /** progression du tracé de la courbe (tableauCourbe) */
  progresCourbe?: number;
  couleurCourbe?: Couleur | string;
  /** rotation du tambour (machine à laver), en degrés */
  tambour?: number;
  intensite?: number;
  /** garde les proportions 1:1 (icônes rondes) ; sinon le dessin remplit sa boîte */
  carre?: boolean;
};

export const IconeNeon: React.FC<Props> = ({
  nom,
  couleur = 'blanc',
  epaisseur = 5,
  trace = 1,
  remplissage = 0.1,
  aiguille = 0,
  niveau = 1,
  courbe = 'monte',
  progresCourbe = 1,
  couleurCourbe,
  tambour = 0,
  intensite = 1,
  carre,
}) => {
  const c = resoudreCouleur(couleur);
  const clipId = React.useId().replace(/:/g, '');
  const cc = resoudreCouleur(couleurCourbe ?? couleur);
  // Attributs communs : tracé progressif
  const enCours = trace < 1;
  const t = enCours
    ? {
        pathLength: 1,
        strokeDasharray: 1,
        strokeDashoffset: 1 - Math.max(0, trace),
      }
    : {vectorEffect: 'non-scaling-stroke' as const};
  const f = {fill: c, fillOpacity: remplissage * Math.min(1, trace * 1.5)};
  const plein = {fill: c, fillOpacity: Math.min(1, trace * 1.5), stroke: 'none'};

  const dessins: Record<NomIcone, React.ReactNode> = {
    chaise: (
      <>
        <rect x={12} y={4} width={76} height={50} rx={14} {...t} {...f} />
        <path d="M30 15 V43 M44 15 V43 M58 15 V43 M72 15 V43" {...t} />
        <path d="M4 60 H96 L92 69 H8 Z" {...t} {...f} />
        <path d="M14 69 L8 97 M86 69 L92 97 M30 69 L28 92 M70 69 L72 92" {...t} />
      </>
    ),
    table: (
      <>
        <ellipse cx={50} cy={40} rx={46} ry={10} {...t} {...f} />
        <path d="M14 46 L10 96 M86 46 L90 96 M38 50 L37 92 M62 50 L63 92" {...t} />
      </>
    ),
    maison: (
      <>
        <path d="M6 40 L16 22 H84 L94 40 Z" {...t} {...f} />
        <rect x={14} y={40} width={72} height={56} {...t} {...f} />
        <rect x={22} y={50} width={16} height={14} {...t} />
        <rect x={62} y={50} width={16} height={14} {...t} />
        <rect x={42} y={58} width={16} height={38} {...t} />
      </>
    ),
    telephone: (
      <>
        <rect x={26} y={4} width={48} height={92} rx={9} {...t} {...f} />
        <path d="M43 11 H57" {...t} />
        <circle cx={50} cy={87} r={3} {...t} />
      </>
    ),
    calendrier: (
      <>
        <rect x={8} y={16} width={84} height={76} rx={9} {...t} {...f} />
        <path d="M8 34 H92 M28 8 V22 M72 8 V22" {...t} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((k) => (
            <circle key={`${r}${k}`} cx={24 + k * 17} cy={48 + r * 14} r={3.4} {...plein} fill={resoudreCouleur('or')} />
          )),
        )}
      </>
    ),
    piece: (
      <>
        <circle cx={50} cy={50} r={44} {...t} fill={c} fillOpacity={0.85 * Math.min(1, trace * 1.5)} />
        <circle cx={50} cy={50} r={33} {...t} stroke="#7A5300" />
        <path d="M62 34 A20 20 0 1 0 62 66 M30 45 H56 M30 56 H54" stroke="#7A5300" {...t} />
      </>
    ),
    billet: (
      <>
        <rect x={4} y={24} width={92} height={52} rx={6} {...t} {...f} />
        <circle cx={50} cy={50} r={13} {...t} />
        <path d="M14 34 V42 M86 58 V66" {...t} />
      </>
    ),
    tirelire: (
      <>
        <path d="M20 46 C20 26 40 18 56 20 C72 22 84 32 86 46 L94 48 V60 L86 62 C84 72 76 78 70 80 V92 H58 V82 H40 V92 H28 V78 C18 72 16 58 20 46 Z" {...t} {...f} />
        <path d="M44 14 L50 22 L56 14" {...t} />
        <path d="M40 28 H58" {...t} />
        <circle cx={70} cy={42} r={2.5} {...plein} />
      </>
    ),
    globe: (
      <>
        <circle cx={50} cy={50} r={44} {...t} {...f} />
        <ellipse cx={50} cy={50} rx={18} ry={44} {...t} />
        <path d="M6 50 H94 M12 28 H88 M12 72 H88 M50 6 V94" {...t} />
      </>
    ),
    horloge: (
      <>
        <circle cx={50} cy={50} r={44} {...t} {...f} />
        <path d={`M50 50 L${50 + 30 * Math.sin((aiguille * Math.PI) / 180)} ${50 - 30 * Math.cos((aiguille * Math.PI) / 180)}`} {...t} />
        <path d={`M50 50 L${50 + 20 * Math.sin((aiguille * Math.PI) / 2160)} ${50 - 20 * Math.cos((aiguille * Math.PI) / 2160)}`} {...t} />
        <circle cx={50} cy={50} r={3} {...plein} />
      </>
    ),
    ordinateur: (
      <>
        <rect x={6} y={10} width={88} height={60} rx={6} {...t} {...f} />
        <path d="M50 70 V84 M30 90 H70" {...t} />
      </>
    ),
    voiture: (
      <>
        <path d="M6 70 V56 L16 52 L28 32 H70 L82 52 L94 56 V70 Z" {...t} {...f} />
        <path d="M32 36 L24 52 H76 L68 36 Z M50 36 V52" {...t} />
        <circle cx={26} cy={74} r={10} {...t} />
        <circle cx={74} cy={74} r={10} {...t} />
      </>
    ),
    machineALaver: (
      <>
        <rect x={10} y={4} width={80} height={92} rx={8} {...t} {...f} />
        <path d="M10 24 H90" {...t} />
        <circle cx={24} cy={14} r={3.5} {...t} />
        <path d="M56 14 H80" {...t} />
        <circle cx={50} cy={60} r={26} {...t} />
        <g transform={`rotate(${tambour} 50 60)`}>
          <circle cx={50} cy={60} r={18} {...t} strokeOpacity={0.55} />
          <path d="M38 64 Q50 52 62 64" {...t} strokeOpacity={0.55} />
        </g>
      </>
    ),
    secheLinge: (
      <>
        <rect x={10} y={4} width={80} height={92} rx={8} {...t} {...f} />
        <path d="M10 24 H90" {...t} />
        <path d="M18 14 H40" {...t} />
        <circle cx={78} cy={14} r={3.5} {...t} />
        <circle cx={50} cy={60} r={26} {...t} />
        <g transform={`rotate(${tambour} 50 60)`}>
          <path d="M40 54 Q45 48 50 54 T60 54 M40 66 Q45 60 50 66 T60 66" {...t} strokeOpacity={0.55} />
        </g>
      </>
    ),
    carteBancaire: (
      <>
        <rect x={4} y={20} width={92} height={60} rx={8} {...t} {...f} />
        <path d="M4 36 H96" {...t} />
        <rect x={14} y={48} width={16} height={12} rx={2} {...t} />
        <path d="M60 66 H84" {...t} />
      </>
    ),
    graphique: (
      <>
        <path d="M8 6 V92 H96" {...t} />
        <path d={courbe === 'monte' ? 'M16 80 L38 62 L56 68 L88 22' : courbe === 'baisse' ? 'M16 24 L38 42 L56 36 L88 80' : 'M16 56 L38 52 L60 58 L88 54'} {...t} stroke={cc} />
      </>
    ),
    tableauCourbe: (
      <>
        <rect x={2} y={3} width={96} height={94} rx={4} {...t} fill={c} fillOpacity={0.04} strokeOpacity={0.6} />
        <clipPath id={`rev-${clipId}`}>
          <rect x={0} y={0} width={10 + 78 * progresCourbe} height={100} />
        </clipPath>
        <path
          d={courbe === 'monte' ? 'M12 80 C24 76 30 72 40 64 C52 52 62 40 86 22' : courbe === 'baisse' ? 'M12 46 C24 42 34 50 46 50 C58 52 70 56 86 62' : 'M12 54 C30 50 50 58 86 54'}
          stroke={cc}
          clipPath={`url(#rev-${clipId})`}
          vectorEffect="non-scaling-stroke"
        />
      </>
    ),
    cadeau: (
      <>
        <rect x={12} y={40} width={76} height={54} rx={4} {...t} {...f} />
        <rect x={6} y={28} width={88} height={14} rx={3} {...t} />
        <path d="M50 28 V94 M50 28 C40 8 22 14 30 28 M50 28 C60 8 78 14 70 28" {...t} />
      </>
    ),
    ballon: (
      <>
        <ellipse cx={50} cy={36} rx={26} ry={31} {...t} {...f} />
        <path d="M46 67 L54 67 L50 72 Z M50 72 C44 80 56 86 50 96" {...t} />
      </>
    ),
    etiquette: (
      <>
        <path d="M6 28 H66 L92 50 L66 72 H6 Z" {...t} {...f} />
        <circle cx={70} cy={50} r={5} {...plein} />
      </>
    ),
    chaussette: (
      <>
        <path d="M34 6 H62 V54 L80 66 C92 74 84 94 70 90 L34 78 C26 76 26 68 30 62 Z" {...t} {...f} />
        <path d="M34 18 H62" {...t} />
      </>
    ),
    monnayeur: (
      <>
        <rect x={20} y={4} width={60} height={92} rx={6} {...t} {...f} />
        <rect x={30} y={14} width={40} height={18} rx={2} {...t} />
        <path d="M44 46 H56" {...t} />
        <rect x={34} y={66} width={32} height={18} rx={3} {...t} />
      </>
    ),
    immeuble: (
      <>
        <rect x={20} y={4} width={60} height={92} {...t} {...f} />
        {[0, 1, 2, 3].map((r) => (
          <path key={r} d={`M30 ${16 + r * 18} h12 M58 ${16 + r * 18} h12`} {...t} />
        ))}
        <rect x={42} y={78} width={16} height={18} {...t} />
      </>
    ),
    panierLinge: (
      <>
        <path d="M10 36 H90 L82 94 H18 Z" {...t} {...f} />
        <path d="M30 36 C30 20 42 14 50 26 C58 14 70 20 70 36" {...t} />
        <path d="M30 52 L34 82 M50 52 V82 M70 52 L66 82" {...t} />
      </>
    ),
    coche: <path d="M10 52 L38 80 L92 18" {...t} />,
    croix: <path d="M12 12 L88 88 M88 12 L12 88" {...t} />,
    flecheHaut: <path d="M50 96 V8 M24 32 L50 6 L76 32" {...t} />,
    flecheBas: <path d="M50 4 V92 M24 68 L50 94 L76 68" {...t} />,
    local: (
      <>
        <rect x={4} y={4} width={92} height={92} rx={2} {...t} {...f} />
        <path d="M4 70 H30 M44 70 H96 M62 70 V96" {...t} strokeOpacity={0.6} />
      </>
    ),
    favori: <path d="M22 4 H78 V96 L50 74 L22 96 Z" {...t} {...f} />,
    reseau: (
      <>
        <path d="M50 22 L18 72 M50 22 L82 72 M18 72 H82" {...t} strokeOpacity={0.6} />
        <circle cx={50} cy={20} r={12} {...t} {...f} />
        <circle cx={16} cy={76} r={12} {...t} {...f} />
        <circle cx={84} cy={76} r={12} {...t} {...f} />
      </>
    ),
    coeur: <path d="M50 88 C20 66 6 50 10 30 C14 12 38 8 50 28 C62 8 86 12 90 30 C94 50 80 66 50 88 Z" {...t} fill={c} fillOpacity={0.9 * trace} />,
    jauge: (
      <>
        <rect x={34} y={4} width={32} height={92} rx={16} {...t} {...f} />
        <rect x={40} y={10 + 80 * (1 - niveau)} width={20} height={80 * niveau} rx={10} {...plein} fillOpacity={0.85} />
      </>
    ),
    personne: (
      <>
        <circle cx={50} cy={22} r={16} {...t} {...f} />
        <path d="M20 94 C20 60 34 46 50 46 C66 46 80 60 80 94" {...t} {...f} />
      </>
    ),
    contrat: (
      <>
        <path d="M18 4 H66 L84 22 V96 H18 Z" {...t} {...f} />
        <path d="M66 4 V22 H84" {...t} />
        <path d="M30 36 H72 M30 50 H72 M30 64 H60" {...t} strokeOpacity={0.7} />
        <path d="M30 84 C38 76 42 90 50 82 S62 80 70 84" {...t} />
      </>
    ),
    flecheDroite: <path d="M4 50 H92 M68 24 L94 50 L68 76" {...t} />,
    signal: (
      <>
        <rect x={8} y={70} width={14} height={24} rx={3} {...t} {...f} />
        <rect x={32} y={52} width={14} height={42} rx={3} {...t} {...f} />
        <rect x={56} y={32} width={14} height={62} rx={3} {...t} {...f} />
        <rect x={80} y={10} width={14} height={84} rx={3} {...t} {...f} />
      </>
    ),
    portefeuille: (
      <>
        <path d="M14 26 L66 8 L72 26" {...t} />
        <rect x={6} y={26} width={84} height={66} rx={10} {...t} {...f} />
        <path d="M94 48 H70 C62 48 62 70 70 70 H94 Z" {...t} />
        <circle cx={74} cy={59} r={3} {...plein} />
      </>
    ),
    lit: (
      <>
        <path d="M6 30 V94 M94 60 V94 M6 78 H94 M6 60 H94" {...t} />
        <rect x={12} y={42} width={26} height={16} rx={6} {...t} {...f} />
        <path d="M42 60 V48 C42 44 46 42 50 42 H88 C92 42 94 46 94 50 V60" {...t} {...f} />
      </>
    ),
    camembert: (
      <>
        <circle cx={50} cy={50} r={42} {...t} {...f} />
        <path d="M50 50 V8 M50 50 L86 70" {...t} />
        <path d="M50 50 V8 A42 42 0 0 1 86 70 Z" {...t} fill={c} fillOpacity={0.35 * Math.min(1, trace * 1.5)} />
      </>
    ),
    cible: (
      <>
        <circle cx={50} cy={50} r={42} {...t} {...f} />
        <circle cx={50} cy={50} r={27} {...t} />
        <circle cx={50} cy={50} r={11} {...t} fill={c} fillOpacity={0.6} />
      </>
    ),
    video: (
      <>
        <rect x={6} y={10} width={88} height={60} rx={6} {...t} {...f} />
        <path d="M50 70 V84 M30 90 H70" {...t} />
        <path d="M42 26 L64 40 L42 54 Z" fill={resoudreCouleur('bleu')} stroke={resoudreCouleur('bleu')} />
      </>
    ),
    glacon: (
      <>
        <path d="M50 8 L90 28 V72 L50 92 L10 72 V28 Z" {...t} {...f} />
        <path d="M10 28 L50 48 L90 28 M50 48 V92" {...t} />
        <path d="M24 42 L24 56" {...t} strokeOpacity={0.6} />
      </>
    ),
    goutte: <path d="M50 6 C66 32 82 48 82 66 C82 84 68 96 50 96 C32 96 18 84 18 66 C18 48 34 32 50 6 Z" {...t} {...f} />,
    verre: (
      <>
        <path d="M14 10 H86 L50 54 Z" {...t} {...f} />
        <path d="M50 54 V90 M30 92 H70" {...t} />
        <circle cx={66} cy={22} r={6} {...t} />
      </>
    ),
    couverts: (
      <>
        <circle cx={50} cy={56} r={28} {...t} {...f} />
        <circle cx={50} cy={56} r={18} {...t} strokeOpacity={0.6} />
        <path d="M8 20 V44 M4 20 V36 C4 42 12 42 12 36 V20 M8 44 V94" {...t} />
        <path d="M92 94 V20 C84 26 84 44 92 48" {...t} />
      </>
    ),
    congelateur: (
      <>
        <rect x={4} y={30} width={92} height={66} rx={6} {...t} {...f} />
        <path d="M4 44 H96" {...t} />
        <path d="M36 37 H64" {...t} />
        <path d="M70 66 L76 60 M70 60 L76 66 M73 56 V70 M66 63 H80" {...t} strokeOpacity={0.7} />
      </>
    ),
    sachet: (
      <>
        <path d="M18 20 H82 L88 94 H12 Z" {...t} {...f} />
        <path d="M18 20 L26 8 H74 L82 20" {...t} />
        <path d="M34 50 L46 56 L46 70 L34 64 Z M54 46 L66 52 L66 66 L54 60 Z" {...t} strokeOpacity={0.7} />
      </>
    ),
    soleil: (
      <>
        <circle cx={50} cy={50} r={20} {...t} {...f} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path key={a} d={`M${50 + 30 * Math.sin((a * Math.PI) / 180)} ${50 - 30 * Math.cos((a * Math.PI) / 180)} L${50 + 42 * Math.sin((a * Math.PI) / 180)} ${50 - 42 * Math.cos((a * Math.PI) / 180)}`} {...t} />
        ))}
      </>
    ),
    velo: (
      <>
        <circle cx={22} cy={68} r={18} {...t} />
        <circle cx={78} cy={68} r={18} {...t} />
        <path d="M22 68 L40 36 H70 L78 68 M40 36 L52 68 L70 36 M34 26 H46 M70 36 L66 24 H76" {...t} />
      </>
    ),
    thermometre: (
      <>
        <path d="M40 66 V14 C40 4 60 4 60 14 V66 C72 74 72 96 50 96 C28 96 28 74 40 66 Z" {...t} {...f} />
        <circle cx={50} cy={80} r={9} {...plein} fillOpacity={0.9} />
        <rect x={46} y={14 + 60 * (1 - niveau)} width={8} height={60 * niveau + 4} rx={4} {...plein} fillOpacity={0.9} />
      </>
    ),
    ampoule: (
      <>
        <path d="M36 70 C36 58 22 50 22 34 C22 18 35 6 50 6 C65 6 78 18 78 34 C78 50 64 58 64 70 Z" {...t} {...f} />
        <path d="M38 80 H62 M42 90 H58 M44 40 L50 52 L56 40" {...t} />
      </>
    ),
    tshirt: <path d="M34 8 C40 16 60 16 66 8 L94 22 L84 42 L72 36 V94 H28 V36 L16 42 L6 22 Z" {...t} {...f} />,
    cadenas: (
      <>
        <path d="M28 44 V28 C28 4 72 4 72 28 V44" {...t} />
        <rect x={16} y={44} width={68} height={50} rx={8} {...t} {...f} />
        <path d="M50 62 V76" {...t} />
      </>
    ),
    carton: (
      <>
        <path d="M6 30 L50 12 L94 30 V78 L50 96 L6 78 Z" {...t} {...f} />
        <path d="M6 30 L50 48 L94 30 M50 48 V96 M28 21 L72 39" {...t} />
      </>
    ),
    livre: (
      <>
        <path d="M50 20 C38 10 20 10 6 14 V88 C20 84 38 84 50 94 C62 84 80 84 94 88 V14 C80 10 62 10 50 20 Z" {...t} {...f} />
        <path d="M50 20 V94" {...t} />
      </>
    ),
    enceinte: (
      <>
        <rect x={18} y={2} width={64} height={96} rx={8} {...t} {...f} />
        <circle cx={50} cy={24} r={10} {...t} />
        <circle cx={50} cy={64} r={22} {...t} />
        <circle cx={50} cy={64} r={8} {...t} />
      </>
    ),
    anneaux: (
      <>
        <circle cx={36} cy={60} r={26} {...t} {...f} />
        <circle cx={64} cy={60} r={26} {...t} />
        <path d="M58 26 L64 18 L70 26 L64 32 Z" {...t} />
      </>
    ),
    gateau: (
      <>
        <rect x={10} y={52} width={80} height={42} rx={6} {...t} {...f} />
        <path d="M10 66 C24 74 36 60 50 68 C64 76 76 60 90 66" {...t} />
        <path d="M34 52 V36 M50 52 V32 M66 52 V36" {...t} />
        <path d="M34 28 C30 24 34 18 34 18 C34 18 38 24 34 28 Z M50 24 C46 20 50 14 50 14 C50 14 54 20 50 24 Z M66 28 C62 24 66 18 66 18 C66 18 70 24 66 28 Z" {...t} />
      </>
    ),
    mixage: (
      <>
        <rect x={4} y={30} width={92} height={56} rx={6} {...t} {...f} />
        <path d="M20 42 V74 M40 42 V74 M60 42 V74 M80 42 V74" {...t} strokeOpacity={0.5} />
        <path d="M14 52 H26 M34 64 H46 M54 48 H66 M74 58 H86" {...t} />
      </>
    ),
    micro: (
      <>
        <rect x={36} y={4} width={28} height={44} rx={14} {...t} {...f} />
        <path d="M26 36 C26 62 74 62 74 36 M50 60 V92 M34 94 H66" {...t} />
      </>
    ),
    bulle: <path d="M14 8 H86 C92 8 96 12 96 18 V60 C96 66 92 70 86 70 H40 L20 92 L24 70 H14 C8 70 4 66 4 60 V18 C4 12 8 8 14 8 Z" {...t} {...f} />,
    distributeur: (
      <>
        <rect x={12} y={2} width={76} height={96} rx={6} {...t} {...f} />
        <rect x={20} y={10} width={44} height={60} rx={3} {...t} />
        <path d="M20 30 H64 M20 50 H64" {...t} strokeOpacity={0.6} />
        <path d="M28 18 V26 M40 18 V26 M52 18 V26 M28 38 V46 M40 38 V46 M52 38 V46 M28 58 V66 M40 58 V66 M52 58 V66" {...t} strokeOpacity={0.8} />
        <rect x={70} y={14} width={12} height={8} rx={2} {...t} />
        <path d="M72 32 H80 M72 40 H80" {...t} />
        <rect x={20} y={78} width={44} height={12} rx={3} {...t} />
      </>
    ),
    pin: (
      <>
        <path d="M50 96 C36 74 18 58 18 38 C18 18 32 6 50 6 C68 6 82 18 82 38 C82 58 64 74 50 96 Z" {...t} {...f} />
        <circle cx={50} cy={38} r={12} {...t} />
      </>
    ),
    haltere: (
      <>
        <path d="M24 50 H76" {...t} />
        <rect x={10} y={28} width={14} height={44} rx={4} {...t} {...f} />
        <rect x={76} y={28} width={14} height={44} rx={4} {...t} {...f} />
        <path d="M4 40 V60 M96 40 V60" {...t} />
      </>
    ),
    canette: (
      <>
        <path d="M30 14 H70 L74 22 V84 L70 92 H30 L26 84 V22 Z" {...t} {...f} />
        <path d="M26 22 H74 M26 84 H74" {...t} />
        <path d="M40 8 H60" {...t} />
        <path d="M38 40 C46 48 54 32 62 40 M38 56 C46 64 54 48 62 56" {...t} strokeOpacity={0.6} />
      </>
    ),
    tournevis: (
      <>
        <rect x={40} y={4} width={20} height={40} rx={8} {...t} {...f} />
        <path d="M44 16 V32 M56 16 V32" {...t} strokeOpacity={0.6} />
        <path d="M50 44 V84 M44 84 H56 L50 96 Z" {...t} />
      </>
    ),
    batterie: (
      <>
        <rect x={8} y={26} width={76} height={48} rx={8} {...t} {...f} />
        <path d="M84 40 H92 V60 H84" {...t} />
        <rect x={16} y={34} width={36} height={32} rx={3} {...plein} fillOpacity={0.7} />
      </>
    ),
    eclair: <path d="M58 4 L22 56 H48 L40 96 L78 40 H52 Z" {...t} {...f} />,
    banque: (
      <>
        <path d="M6 32 L50 6 L94 32 Z" {...t} {...f} />
        <path d="M10 92 H90 M14 82 H86 M18 38 V78 M38 38 V78 M62 38 V78 M82 38 V78" {...t} />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio={carre ?? RONDES.has(nom) ? 'xMidYMid meet' : 'none'}
      width="100%"
      height="100%"
      style={{overflow: 'visible', filter: halo(c, intensite)}}
      fill="none"
      stroke={c}
      strokeWidth={epaisseur}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {dessins[nom]}
    </svg>
  );
};
