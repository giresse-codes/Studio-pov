# finance-studio — chaîne Finance (HyperFrames)

Vidéos 1080x1920, 30 fps, 100 % en code (HTML + GSAP rendu par HyperFrames).

## Pipeline `#finance N`
```bash
# 1. texte du script -> videos/finance-NN/script.txt (voix off sans les titres)
# 2. timing mot à mot (whisper indisponible : synthèse espeak-ng + DTW, recalé sur les silences)
python3 outils/aligner_dtw.py ../videos/finance-NN/voix.wav ../videos/finance-NN/script.txt ../videos/finance-NN/timing.json
# 3. composition HyperFrames
node outils/build.js N            # -> rendu/finance-NN/
# 4. rendu
cd rendu/finance-NN && npx hyperframes render -o ../../../out/finance-NN.mp4 --quality standard
```
Dépendances système : ffmpeg, espeak-ng, python3 + numpy + librosa.

## Composants réutilisables (`composants/`)
- `studio.js` : moteur (scènes avec coupe/zoom 0,3 s + Ken Burns, entrées animées, sons, page HyperFrames)
- `fond.js` : dégradé bleu nuit → noir, halo, rayons, grille, particules or animés
- `sous-titres.js` : mot à mot, 3-5 mots, majuscules, mots-clés/chiffres en or
- `compteur.js`, `split-screen.js`, `processus.js`, `hook.js`, `carte-fin.js`, `reactions.js` (secousse, boing, zoom comique)
- `icones.js` : icônes SVG (machine, téléphone, laverie, horloge, calendrier…)

Une vidéo = un fichier `videos/finance-NN.js` (scènes ancrées sur les phrases de la voix).
Sons : `../sons/` en priorité, sinon secours générés (`outils/synth_sons.py`).
