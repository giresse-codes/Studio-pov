# Studio POV

Studio vidéo en animation 2D flat façon jeu de simulation de vie (pièce en coupe, personnages silhouettes, HUD, cartes de jeu), dessinée en code avec Remotion, pour 3 chaînes : DevsTeach, Astuces, Mode Survie.

- Règles du studio : `CLAUDE.md`
- Plan des 90 vidéos : `scripts/PLAN.md`
- Scripts (voix off, légendes, hashtags) : `scripts/<chaine>/<numero>.md`
- Sons à télécharger : `sons/LISTE.md`

Utilisation : dépose la voix off dans `videos/<chaine>-<numero>/voix.wav`, puis écris par exemple `#astuce 1a` dans Claude Code.

## Rendu

```bash
npm install
python3 -I outils/timing.py videos/devsteach-1a/voix.wav scripts/devsteach/1a.md videos/devsteach-1a/mots.json   # timing mot à mot (faster-whisper)
npm run render -- devsteach-1a out/devsteach-1a.mp4
npm run captures -- devsteach-1a /tmp/captures 5 20 40   # images clés
```

Structure : `src/personnages` (Toi, Max, Bobo), `src/decors` (chambre-dev, bureau-startup), `src/ui` (HUD, cartes, appel EN DIRECT, SMS, sous-titres, écrans de choix, schémas), `src/camera`, `src/episodes` (une composition par vidéo). Les sons absents de `sons/` sont ignorés au rendu (`outils/sons-dispo.mjs`).
