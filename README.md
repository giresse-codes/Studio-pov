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
