# Studio POV

Studio vidéo en animation 2D flat façon jeu de simulation de vie (pièce en coupe, personnages silhouettes, HUD, cartes de jeu), dessinée en code avec Remotion, pour 3 chaînes : DevsTeach, Astuces, Mode Survie.

- Règles du studio : `CLAUDE.md`
- Plan des 45 vidéos : `scripts/PLAN.md`
- Scripts (voix off, légendes, hashtags) : `scripts/<chaine>/<numero>.md`
- Sons à télécharger : `sons/LISTE.md`

Utilisation : dépose la voix off dans `videos/<chaine>-<numero>/voix.wav`, puis écris par exemple `#astuce 1` dans Claude Code.

## Projet Remotion

- `npm install` puis `npm run studio` (prévisualisation) ou `npx remotion render <Composition> out/<nom>.mp4`
- `src/personnages/` (Toi, Max, Bobo + animations), `src/decors/` (chambre-dev…), `src/ui/` (HUD, cartes, EN DIRECT, SMS, sous-titres, choix), `src/camera/`, `src/lib/` (thème, sons, polices), `src/compositions/` (une composition par vidéo)
- `public/` : polices embarquées + liens vers `sons/` et `videos/`
- Test de style : composition `Test` → `out/test.mp4`

## Chaîne de production d'une vidéo (ex. `#devsteach 1`)

1. Voix déposée dans `videos/<chaine>-<n>/voix.wav`
2. Transcription mot à mot : `python3 outils/transcrire.py videos/<chaine>-<n>/voix.wav videos/<chaine>-<n>/whisper.json medium` (faster-whisper)
3. Alignement sur le texte du script (balises retirées, repère de la `[pause]`) : `python3 outils/aligner.py scripts/<chaine>/<n>.md videos/<chaine>-<n>/whisper.json videos/<chaine>-<n>/mots.json`
4. Composition `src/compositions/<Chaine><n>.tsx` (timing via `creerTiming`), rendu : `npx remotion render <chaine>-<n> out/<chaine>-<n>.mp4`
