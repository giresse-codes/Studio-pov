import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Camera} from '../camera/Camera';
import {CHAMBRE, ChambreDev} from '../decors/ChambreDev';
import {keys, s} from '../lib/anim';
import {Max, Toi} from '../personnages';
import {CarteJeu} from '../ui/CarteJeu';
import {EcranChoix} from '../ui/Ecrans';
import {HUD} from '../ui/HUD';
import {AppelDirect, Portrait} from '../ui/Telephone';

/** TEST de 15 s : valide personnages, décor, caméra, HUD, cartes. */
export const Test: React.FC = () => {
  const f = useCurrentFrame();
  const jour = keys(f, [
    [s(8.5), 0],
    [s(11), 1],
  ]);
  const {chaise} = CHAMBRE;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera
        mondeW={CHAMBRE.W}
        mondeH={CHAMBRE.H}
        haut={180}
        bas={1650}
        plans={[
          {f: 0, x: 900, y: 960, z: 1},
          {f: s(1), x: 1150, y: 1150, z: 1.45, d: 40},
          {f: s(6.5), x: 1250, y: 1150, z: 2.1, d: 14},
          {f: s(8.3), x: 700, y: 1000, z: 1.25, d: 30},
          {f: s(12), x: 1100, y: 1100, z: 1.5, d: 20},
        ]}
      >
        <ChambreDev jour={jour}>
          <Toi
            x={chaise.x + 10}
            y={chaise.y}
            timeline={[
              {f: 0, base: 'assis', bras: 'taper', expr: 'concentre'},
              {f: s(2), bras: 'telephone', expr: 'surpris'},
              {f: s(4), expr: 'panique'},
              {f: s(6.5), bras: 'taper', expr: 'concentre'},
              {f: s(9), bras: 'repos', expr: 'soulage'},
              {f: s(12), bras: 'reflechit', expr: 'curieux'},
            ]}
          />
        </ChambreDev>
      </Camera>
      <HUD
        compteur={[
          [0, 60],
          [s(4), 45],
          [s(10), 30],
        ]}
        barre={[
          [0, 0.3],
          [s(4), 0.6],
          [s(10), 0.85],
        ]}
        unite="MIN"
        label="DEADLINE"
        icone="chrono"
      />
      <AppelDirect
        debut={s(2)}
        fin={s(5.5)}
        nom="Max"
        texte="Le site sort dans 1 heure !"
        texteDebut={s(2.6)}
        portrait={
          <Portrait>
            <Max x={0} y={0} timeline={[{f: 0, bras: 'cafe', expr: 'panique'}]} ombre={false} />
          </Portrait>
        }
      />
      <CarteJeu debut={s(6)} fin={s(8.3)} surtitre="NOTION : CSS" titre="Les vêtements du site" detail="couleurs, tailles, mise en page" y={600} />
      <EcranChoix debut={s(12.2)} vert="Réécrire le HTML" rouge="Relier le CSS" />
    </AbsoluteFill>
  );
};
