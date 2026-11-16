# Studio POV — règles du studio

## ⚠️ Branche studio-finance : chaîne Finance (À LIRE EN PREMIER)

Sur cette branche, il y a une 4e chaîne, **Finance**, avec son PROPRE style. Pour les commandes `#finance N`, applique UNIQUEMENT les règles de cette section. Ignore tout le reste du fichier : pas de vue subjective, pas de 3D, pas de Max ni de Bobo, pas d'écran « TU FERAIS QUOI ? », pas de partie 1/partie 2. Les règles POV plus bas ne concernent que `#devsteach`, `#astuce` et `#survie`.

### Concept

Vidéos « business qui semblent nuls mais rapportent » et bases de l'argent. Public : francophones (France). Un seul narrateur à la 2e personne. Les 48 scripts (voix off, prompt spécifique, légende, hashtags) sont dans `finance/README.md`, sous les titres `### Script N — titre`. **Les sections 2 et 3 de `finance/README.md` sont obsolètes : ignore-les.** Seul le style décrit ici compte.

### Référence visuelle : à reproduire le plus fidèlement possible

La référence est `finance/reference.mp4`, accompagnée de ses planches `finance/reference-planches-1.png` et `finance/reference-planches-2.png`. **Avant de construire quoi que ce soit, regarde ces planches et des captures de la vidéo.** L'objectif est simple : qu'on ne voie pas la différence de style entre nos vidéos et cette référence. En cas de doute, la référence a raison.

Une version précédente a été rejetée parce qu'elle était trop colorée, trop vive et pas professionnelle : fond en dégradé coloré, grosses polices, couleurs partout, effets cartoon. Ne refais JAMAIS ça.

### Style Finance « scène sombre néon » (obligatoire)

- **Format** : 1080x1920, 30 fps, MP4 H.264. La durée suit la voix.
- **Moteur** : Remotion en 2D (SVG + CSS), dans `finance-studio/`. Pas de HyperFrames, pas de 3D.
- **Décor (toujours le même)** :
  - fond presque noir (`#05070B` → `#0B111C`), avec un halo bleu nuit très doux au centre (dégradé radial `#16233A`, faible opacité) et une vignette forte sur les bords ;
  - sol brillant : une ligne d'horizon fine (1 px, gris bleuté à environ 20 % d'opacité) à **78 % de la hauteur** ;
  - tout objet posé sur le sol a un **reflet** dessous : le même dessin retourné, à environ 25 % d'opacité, qui s'efface en dégradé ;
  - un léger grain. Aucun fond coloré, aucun dégradé vif.
- **L'image est volontairement sombre.** N'éclaircis JAMAIS le fond. Le contraste vient uniquement des objets lumineux et du texte.
- **Personnages** :
  - le « toi » de la voix est un bonhomme bâton blanc : tête ronde pleine, corps en traits épais aux bouts arrondis, sans visage ;
  - les autres personnes (clients, gens) ont la même silhouette, en gris `#9AA3AE` ;
  - animations simples et lentes : pointer du bras, marcher, lever les bras, s'allonger, s'asseoir.
- **Objets** :
  - icônes en traits fins façon néon : line art, contour de 3-4 px, coins arrondis, sans remplissage ou avec un remplissage très léger (10-15 %) ;
  - halo lumineux : ombre floue de la couleur du trait ;
  - blanc par défaut. La couleur porte un sens : vert `#2ECC71` = gain ou validé ; rouge `#FF4D3D` = perte ou interdit ; or `#F5B731` = argent, prix, pièces ; bleu `#4DA3FF` = technologie, information ; rose `#FF5FA2` = fête, plaisir ;
  - au maximum 2 à 3 couleurs à l'écran en même temps.
- **Composition** : beaucoup de vide, 1 à 4 éléments par scène, posés sur le sol vers le centre. Jamais d'écran chargé.
- **Texte (le cœur du style)** :
  - en haut, centré, entre 12 % et 20 % de la hauteur, sur 1 à 4 lignes courtes ;
  - police **monospace grasse en MAJUSCULES** (JetBrains Mono Bold ou IBM Plex Mono SemiBold), environ 34 px, lettres espacées (environ 0,12 em), blanc cassé `#E8ECF1` ;
  - les mots apparaissent **UN PAR UN, exactement au moment où la voix les dit**, avec un petit fondu de 0,1 s. Quand une nouvelle phrase commence, la précédente s'efface en fondu ;
  - 1 ou 2 mots-clés par phrase sont colorés avec le même code couleur que les objets ;
  - interdits : contour noir, grosse police, sous-titres en bas, emoji, balises entre crochets (`[direct]`, `[pause]`, `[rire]`…).
- **Rythme et transitions** :
  - une scène par idée, souvent de 3 à 6 s ;
  - entre deux scènes, un **fondu doux par le noir** (0,4 à 0,6 s). Pas de coupes brutales, pas de zooms rapides ;
  - les objets apparaissent en douceur : fondu, léger glissement, tracé qui se dessine, petit rebond discret ;
  - tous les mouvements sont lents et élégants.
- **Animations utiles** : pièces qui tombent, barre de progression qui se remplit, croix rouge qui se dessine, coche verte, aiguille d'horloge qui tourne, jauge qui se vide, flèche de courbe qui monte ou descend.
- **Interdits** : gags cartoon, effet « boing », logo, carte de fin « ABONNE-TOI ». La vidéo se termine sur la dernière phrase de la voix et sa scène, puis 1 s de noir.
- **Son** : musique de fond très discrète, calme et ambiante (piano ou nappes), à 8-10 % avec ducking. Petits sons doux (clic, pièce, pop léger) à 20-30 %. Pas de whoosh agressif. Réutilise `sons/`. S'il manque un son, ajoute-le à `sons/LISTE.md` et dis-le-moi.
- **« Prompt spécifique » de chaque script** : il donne les idées d'objets. Traduis-les TOUJOURS dans ce style, avec des icônes néon et le bonhomme. Ignore ce qui contredit ce style (« texte géant », « en or », « pulse », « split-screen ») : une comparaison devient deux objets côte à côte sur le sol.

### Commande `#finance N` (ex : `#finance 1`, `#finance 12`)

`NN` = N sur 2 chiffres.

1. Lis le `### Script N` dans `finance/README.md` : voix off, prompt spécifique, légende et hashtags.
2. Récupère la voix déposée dans `videos/finance-NN/voix.wav` (ou `.mp3`). Si elle est absente, arrête-toi et dis-le-moi.
3. Calcule le timing mot à mot de la voix : avec whisper s'il est disponible, sinon par alignement avec le texte du script, sans les balises entre crochets.
4. Découpe en scènes selon les règles ci-dessus. Réutilise les composants de `finance-studio/` et crée ceux qui manquent.
5. Rends `out/finance-NN.mp4`. Écris `videos/finance-NN/legende.txt` avec : le hook (1 ligne), la légende prête à publier et les hashtags du script.
6. Vérifie le rendu : fais une planche de captures et compare-la aux planches de référence. Le fond doit être aussi sombre, le texte doit être en haut et apparaître mot à mot, les reflets au sol doivent être présents, les couleurs rares, et aucune balise ne doit s'afficher. Corrige ce qui ne va pas, puis fais le commit et le push sur la branche `studio-finance`.

### Première commande `#finance` (une seule fois)

1. S'il y a un projet HyperFrames dans `finance-studio/`, supprime-le. Crée à la place un projet Remotion.
2. Crée les composants réutilisables :
   - `Scene` : fond, halo, vignette, sol, reflets, grain ;
   - `Bonhomme` : poses animables ;
   - `IconeNeon` : bibliothèque d'icônes (chaise, table, maison, téléphone, calendrier, pièce, billet, tirelire, globe, horloge, ordinateur, voiture, machine à laver, carte bancaire, graphique, cadeau, ballon) ;
   - `TexteMotAMot` ;
   - `FonduNoir`.
3. **Test de calibrage** : refais les 10 premières secondes de la référence (« Les business qui ne semblent pas rentables… »). Mets-les côte à côte avec la référence dans `out/test-calibrage.mp4`, puis montre-moi le résultat avant de faire la vraie vidéo.

---

Tu es le studio vidéo de mes 3 chaînes TikTok / YouTube Shorts francophones (public : France). Ces règles s'appliquent à CHAQUE vidéo de ces 3 chaînes. Le dépôt repart de zéro.

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
