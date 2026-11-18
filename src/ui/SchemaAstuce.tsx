import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp, rand} from '../lib/anim';
import {FONT} from '../lib/fonts';

/* Schémas animés « comment ça marche » (Astuces) */

/**
 * Téléphone en coupe : circuit, batterie, gouttes d'eau cachées à l'intérieur.
 *  surface : 0..1 gouttes sur l'extérieur (le riz ne sèche que ça)
 *  alerteInterieur : frame à partir de laquelle l'eau cachée clignote
 *  poussiere : 0..1 la poussière d'amidon remonte dans le port
 *  riz : grains autour du téléphone
 *  corrosion : 0..1 taches de rouille
 *  eclair : frame d'un court-circuit (flash)
 */
export const CoupeTelephone: React.FC<{
  largeur?: number;
  surface?: number;
  alerteInterieur?: number;
  poussiere?: number;
  riz?: boolean;
  corrosion?: number;
  eclair?: number;
}> = ({largeur = 460, surface = 1, alerteInterieur, poussiere = 0, riz = false, corrosion = 0, eclair}) => {
  const f = useCurrentFrame();
  const alerte = alerteInterieur !== undefined && f >= alerteInterieur;
  const pulse = alerte ? 0.5 + 0.5 * Math.abs(Math.sin(f * 0.25)) : 0;
  const flash = eclair !== undefined && f >= eclair && f < eclair + 18 ? 1 - (f - eclair) / 18 : 0;
  const gouttesIn = [
    [150, 300],
    [300, 380],
    [190, 560],
    [320, 640],
    [240, 470],
  ];
  return (
    <svg width={largeur} height={largeur * 1.85} viewBox="-60 -40 580 1000" style={{overflow: 'visible'}}>
      {/* riz autour */}
      {riz &&
        Array.from({length: 60}).map((_, i) => {
          const a = rand(i) * Math.PI * 2;
          const r = 260 + rand(i + 3) * 60;
          return (
            <ellipse
              key={i}
              cx={230 + Math.cos(a) * r * 0.9}
              cy={460 + Math.sin(a) * r * 1.65}
              rx={11}
              ry={6}
              fill="#fff"
              stroke="#d6d3d1"
              strokeWidth={2}
              transform={`rotate(${rand(i + 5) * 180} ${230 + Math.cos(a) * r * 0.9} ${460 + Math.sin(a) * r * 1.65})`}
            />
          );
        })}
      {/* coque */}
      <rect x={0} y={0} width={460} height={920} rx={70} fill="#1f2937" stroke="#9ca3af" strokeWidth={10} />
      {/* intérieur en coupe */}
      <rect x={30} y={40} width={400} height={840} rx={46} fill="#0f172a" />
      <rect x={60} y={90} width={340} height={300} rx={14} fill="#166534" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={90 + (i % 2) * 160} y={120 + Math.floor(i / 2) * 140} width={110} height={90} rx={8} fill="#111827" />
          {Array.from({length: 5}).map((__, j) => (
            <rect key={j} x={96 + (i % 2) * 160 + j * 20} y={112 + Math.floor(i / 2) * 140} width={8} height={10} fill="#d1d5db" />
          ))}
        </g>
      ))}
      <path d="M80,370 L380,370 M100,250 L360,250 M230,100 L230,380" stroke="#facc15" strokeWidth={4} opacity={0.6} />
      {/* batterie */}
      <rect x={70} y={430} width={320} height={330} rx={20} fill="#334155" stroke="#64748b" strokeWidth={6} />
      <text x={230} y={610} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={56} fill="#94a3b8">
        BATTERIE
      </text>
      {/* corrosion */}
      {corrosion > 0 &&
        Array.from({length: 9}).map((_, i) => (
          <circle key={i} cx={90 + rand(i + 20) * 280} cy={110 + rand(i + 30) * 260} r={(10 + rand(i) * 22) * corrosion} fill={i % 2 ? '#a16207' : '#65a30d'} opacity={0.85} />
        ))}
      {/* eau cachée */}
      {gouttesIn.map(([x, y], i) => (
        <g key={i}>
          {alerte && <circle cx={x} cy={y} r={46 + pulse * 10} fill="none" stroke="#ef4444" strokeWidth={6} opacity={pulse} />}
          <path d={`M${x},${y - 34} q-26,34 -26,48 a26,26 0 0,0 52,0 q0,-14 -26,-48 Z`} fill="#38bdf8" opacity={0.92} />
          <ellipse cx={x - 8} cy={y + 6} rx={6} ry={9} fill="#fff" opacity={0.6} />
        </g>
      ))}
      {/* port en bas */}
      <rect x={180} y={880} width={100} height={30} rx={12} fill="#000" stroke="#9ca3af" strokeWidth={4} />
      {poussiere > 0 && (
        <g>
          <rect x={186} y={884} width={88 * clamp(poussiere * 1.3)} height={22} rx={8} fill="#f5f5f4" />
          {Array.from({length: 26}).map((_, i) => {
            const k = (rand(i) + f * 0.02 * (0.6 + rand(i + 2))) % 1;
            return <circle key={i} cx={230 + (rand(i + 7) - 0.5) * 160 * (1 - k)} cy={990 - k * 100} r={4 + rand(i + 1) * 5} fill="#e7e5e4" opacity={poussiere * (1 - k * 0.5)} />;
          })}
        </g>
      )}
      {/* gouttes en surface */}
      {Array.from({length: 10}).map((_, i) => (
        <ellipse key={i} cx={10 + (i % 2) * 440 + (rand(i) - 0.5) * 16} cy={80 + i * 80} rx={14} ry={20} fill="#bae6fd" stroke="#fff" strokeWidth={3} opacity={surface} />
      ))}
      {/* flash de court-circuit */}
      {flash > 0 && (
        <g opacity={flash}>
          <rect x={-60} y={-40} width={580} height={1000} fill="#fef08a" opacity={0.5} />
          <path d="M260,80 L190,300 L260,300 L180,560 L330,250 L250,250 L310,80 Z" fill="#facc15" stroke="#fff" strokeWidth={8} />
        </g>
      )}
    </svg>
  );
};

/**
 * Goutte d'eau géante : bulles de savon, sels (ions + / −) et courant électrique qui passe.
 */
export const GoutteIons: React.FC<{largeur?: number; savon?: number; ions?: number; courant?: number}> = ({largeur = 600, savon = 0, ions = 0, courant}) => {
  const f = useCurrentFrame();
  const on = courant !== undefined && f >= courant;
  const n = Math.round(ions * 14);
  return (
    <svg width={largeur} height={largeur * 1.1} viewBox="0 0 600 660" style={{overflow: 'visible'}}>
      {on && (
        <>
          <rect x={-30} y={360} width={60} height={200} rx={12} fill="#9ca3af" />
          <rect x={570} y={360} width={60} height={200} rx={12} fill="#9ca3af" />
          <text x={0} y={340} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={60} fill="#f87171">
            +
          </text>
          <text x={600} y={340} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={60} fill="#60a5fa">
            −
          </text>
        </>
      )}
      <path d="M300,20 C220,160 70,300 70,430 A230,230 0 0,0 530,430 C530,300 380,160 300,20 Z" fill="#38bdf8" opacity={0.85} stroke="#e0f2fe" strokeWidth={10} />
      <ellipse cx={200} cy={420} rx={30} ry={60} fill="#fff" opacity={0.35} />
      {/* savon */}
      {Array.from({length: 12}).map((_, i) => {
        const y = 600 - ((f * (1 + rand(i)) + rand(i + 3) * 400) % 420);
        return <circle key={`b${i}`} cx={130 + rand(i + 5) * 340} cy={y} r={(10 + rand(i + 2) * 18) * savon} fill="none" stroke="#fff" strokeWidth={4} opacity={0.9 * savon} />;
      })}
      {/* ions */}
      {Array.from({length: n}).map((_, i) => {
        const x = 150 + rand(i + 40) * 300 + Math.sin(f * 0.08 + i) * 10 + (on ? ((f * 4 + i * 30) % 120) - 60 : 0);
        const y = 300 + rand(i + 60) * 280 + Math.cos(f * 0.07 + i) * 10;
        const plus = i % 2 === 0;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={26} fill={plus ? '#fca5a5' : '#93c5fd'} stroke="#0f1630" strokeWidth={4} />
            <text x={x} y={y + 13} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={38} fill="#0f1630">
              {plus ? '+' : '−'}
            </text>
          </g>
        );
      })}
      {/* éclairs */}
      {on &&
        [0, 1, 2].map((i) => {
          const y = 400 + i * 60 + Math.sin(f * 0.9 + i) * 12;
          const vis = (f + i * 3) % 8 < 5;
          return (
            vis && (
              <path
                key={`e${i}`}
                d={`M30,${y} L130,${y - 30} L200,${y + 20} L300,${y - 25} L380,${y + 15} L470,${y - 20} L570,${y}`}
                stroke="#facc15"
                strokeWidth={10}
                fill="none"
                strokeLinejoin="round"
              />
            )
          );
        })}
    </svg>
  );
};
