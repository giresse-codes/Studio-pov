# Studio POV — règles du studio

Tu es le studio vidéo de mes 3 chaînes TikTok / YouTube Shorts francophones (public : France). Ces règles s'appliquent à CHAQUE vidéo. Le dépôt repart de zéro.

## Les 3 chaînes

| Tag | Chaîne | Contenu | Ton | Avatar récurrent |
|---|---|---|---|---|
| `#devsteach` | DevsTeach | Apprendre la programmation et le dev web pas à pas, dans l'ordre d'apprentissage, jusqu'à savoir créer un site (HTML, CSS, JS, PHP, base de données, GitHub, IA) + rubrique actualités | Prof sympa, drôle | **Max**, chef de projet stressé qui envoie des SMS paniqués au spectateur (stagiaire dev) |
| `#astuce` | Astuces | Galères du quotidien + explication de COMMENT ÇA MARCHE | Très drôle | **Bobo**, colocataire maladroit qui provoque les catastrophes |
| `#survie` | Mode Survie | Situations extrêmes, ambiance documentaire sombre et tendue | Grave, PAS d'humour | Aucun : le spectateur est seul |

Le plan des 90 vidéos (15 histoires × 2 parties par chaîne) est dans `scripts/PLAN.md`.

## Le style (obligatoire)

Fiction en **VUE SUBJECTIVE (POV)** : la caméra = les yeux du spectateur. On voit ses mains, son téléphone, ses genoux, son bureau, comme dans un jeu vidéo.

- Format **1080x1920, 30 fps, MP4 H.264**.
- **Bandeau contexte** en haut à gauche dès la 1re seconde : `JOUR • HEURE` / lieu / `Toi, ...` (ex : `LUNDI • 09:12` / `Bureau – Startup` / `Toi, stagiaire dev`).
- **Transitions de temps** plein écran : `9 MINUTES PLUS TARD`.
- **Notifications SMS / WhatsApp** qui glissent en haut de l'écran (nom + emoji, heure en rouge, message) + téléphone tenu en main à l'écran.
- **Sous-titres** au centre, mot à mot, synchronisés à la voix, police grasse avec contour noir. Couleurs : blanc = narration ; jaune = mots clés et paroles rapportées ; bleu = pensées ; violet italique = voix lointaine ou mystérieuse. Les balises entre crochets du script (`[complice]`, `[grave]`…) sont des indications de jeu pour la voix : ne JAMAIS les afficher.
- **Fin de partie 1** : écran de choix `TU FERAIS QUOI ?` avec 2 gros boutons (🟢 vert / 🔴 rouge, textes dans le script), puis `Écris-le en commentaire 👇 pour la partie 2`.
- **Partie 2** : commence par un rappel rapide de la partie 1 + le résultat du choix, puis révèle la bonne réponse et l'explique avec des visuels clairs (schémas animés, icônes, code à l'écran pour DevsTeach). Fin : `Abonne-toi pour la prochaine situation`.
- Le visuel suit EXACTEMENT la voix : chaque phrase = une action visible à l'écran.
- **Humour visuel** sur `#devsteach` et `#astuce` (expressions exagérées, réactions, petits gags) — jamais sur `#survie`.

## Voix

UNE SEULE voix off, toujours. Le narrateur parle au spectateur à la 2e personne (« Tu entends un bruit. Ton téléphone vibre. »). Les répliques des autres personnages passent par les SMS, les sous-titres colorés ou le narrateur qui les rapporte. La durée suit la voix : pas de plafond (1 à 3 min possible), pas de remplissage.

## Visuels — 100 % en code, AUCUNE image à générer

Tout est construit en 3D dans le code avec **Remotion + @remotion/three (Three.js)**. Aucune image externe.

- **Rendu cel-shading façon BD** : `MeshToonMaterial`, couleurs plates, contours noirs épais sur tous les objets (outline), légère vignette, léger fish-eye en post-traitement.
- **Caméra = les yeux du spectateur**, à hauteur d'yeux, toujours vivante : respiration, petits tremblements, tête qui tourne, déplacements, zooms entre les scènes. Les mains du spectateur (manches + mains stylisées) et le téléphone sont des objets 3D attachés à la caméra.
- **Décors réutilisables**, un fichier par décor dans `src/decors/` : `bureau-startup`, `salon-coloc`, `cuisine-coloc`, `foret` (variantes jour, crépuscule, nuit), puis les autres au fil des épisodes. Construis-les détaillés : meubles, objets, plantes, posters, lumière d'ambiance cohérente.
- **Personnages** dans `src/personnages/` : Max et Bobo en style figurine (tête ronde, gros yeux expressifs, corps simple), avec expressions animables (yeux, sourcils, bouche) : neutre, paniqué, fier, coupable, soulagé, furieux comique. Petits mouvements idle.
  - Max : 35 ans, chemise bleue froissée, badge d'entreprise, cheveux en bataille, cernes, café à la main.
  - Bobo : 25 ans, t-shirt jaune taché, short, claquettes, cheveux courts frisés, sourire niais.
- Les écrans (ordinateur, téléphone) affichent du contenu fait en code (site web, SMS, batterie, réseau, code source).
- Ambiance `#survie` : couleurs désaturées, brouillard (fog), lumière froide, ombres longues.
- Composants communs dans `src/ui/` : bandeau contexte, sous-titres, notification SMS, téléphone, transition de temps, écran de choix.

## Sons

Bibliothèque réutilisable dans `sons/` (`ambiances/`, `effets/`, `musiques/`), décrite dans `sons/LISTE.md`. Je télécharge les sons UNE fois. Si un son manque pour une vidéo, ajoute-le à `sons/LISTE.md` et dis-le-moi.

Mixage : voix 100 %, effets 40-60 %, ambiance 15-20 %, musique 10-15 % avec baisse automatique (ducking) pendant que la voix parle.

## Commandes

Quand j'écris `#devsteach 1a`, `#astuce 1a`, `#survie 1b`… (numéro de l'histoire + `a` = partie 1, `b` = partie 2) :

1. Lis le script correspondant dans `scripts/<chaine>/<numero>.md` (voix off, choix, hook, légende, hashtags).
2. Récupère la voix off que je dépose dans `videos/<chaine>-<numero>/voix.wav` (ou .mp3).
3. Calcule le timing mot à mot de la voix (whisper si disponible, sinon alignement avec le texte du script, sans les balises entre crochets).
4. Découpe en scènes, réutilise ou crée les décors et personnages nécessaires, puis anime directement.
5. Rends `out/<chaine>-<numero>.mp4` et écris `videos/<chaine>-<numero>/legende.txt` : hook (1 ligne), légende prête à publier, hashtags.
6. Vérifie le rendu (captures d'images clés), corrige ce qui ne va pas, puis commit et push.

## Première tâche (une seule fois)

Installe le projet (Remotion + @remotion/three + three), crée la structure (`src/decors`, `src/personnages`, `src/ui`), puis fais un **TEST de 2 scènes** : scène 1, bureau-startup en POV avec mains au clavier, bandeau contexte et SMS de Max qui arrive ; scène 2, Max paniqué en gros plan puis zoom sur le téléphone et écran `TU FERAIS QUOI ?`. Ce test sert à valider le cel-shading, la caméra, les sous-titres et les SMS. Rends `out/test.mp4`.
