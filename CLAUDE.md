# Studio — règles du studio

Tu es le studio vidéo de mes 3 chaînes TikTok / YouTube Shorts francophones (public : France). Ces règles s'appliquent à CHAQUE vidéo.

## Les 3 chaînes

| Tag | Chaîne | Contenu | Ton | Personnages |
|---|---|---|---|---|
| `#devsteach` | DevsTeach | Apprendre la programmation et le dev web pas à pas, dans l'ordre d'apprentissage, jusqu'à savoir créer un site (HTML, CSS, JS, PHP, base de données, GitHub, IA) + rubrique actualités | Prof sympa, drôle | **Toi** (stagiaire dev) + **Max**, chef de projet stressé |
| `#astuce` | Astuces | Galères du quotidien + explication de COMMENT ÇA MARCHE | Très drôle | **Toi** + **Bobo**, colocataire maladroit |
| `#survie` | Mode Survie | Situations extrêmes, ambiance documentaire sombre et tendue | Grave, PAS d'humour | **Toi**, seul |

Le plan des 45 vidéos (15 histoires par chaîne, **une vidéo complète par histoire**) est dans `scripts/PLAN.md`.

## Le style (obligatoire) — « vie simulée façon jeu vidéo 2D »

Animation **2D vectorielle flat**, comme un jeu de simulation de vie vu de côté : une **pièce en coupe** (façon maison de poupée), caméra fixe de profil qui **zoome et glisse** vers la zone où se passe l'action.

- Format **1080x1920, 30 fps, MP4 H.264**. La scène occupe tout l'écran vertical (pas de bandes noires) : les décors sont dessinés pour un cadrage vertical, et la caméra se déplace dans une scène plus large que l'écran.
- **Personnages silhouettes** : tête ronde **noire** et lisse, **grands yeux blancs** très expressifs (sourcils, paupières, petite bouche blanche quand il faut une émotion), corps simple aux couleurs vives, mains et pieds simplifiés, animation souple (marche, gestes, sursauts, épaules qui tombent). Aucun trait de visage réaliste.
  - **Toi** : sweat à capuche violet, jean gris, baskets blanches. C'est le héros de toutes les chaînes (la voix off lui parle à la 2e personne).
  - **Max** : chemise bleue froissée, badge, café à la main, cheveux en bataille qui dépassent de la tête noire.
  - **Bobo** : t-shirt jaune taché, short, claquettes, cheveux frisés.
- **Décors détaillés et chaleureux**, flat avec ombres douces : murs colorés, fenêtre avec vue sur la ville, rideaux, guirlande lumineuse, posters, étagères, bureau avec PC gaming, plantes, tapis, parquet. Un **cycle jour / nuit** visible par la fenêtre et la lumière de la pièce.
- **HUD de jeu** en haut à droite, présent toute la vidéo : un grand **compteur** + une **barre verte** avec une petite icône. Il bouge avec l'histoire (augmente, baisse, devient rouge, clignote) :
  - `#devsteach` : compteur = minutes avant la deadline ; barre = stress de Max (icône ⏱️).
  - `#astuce` : compteur = dégâts causés par Bobo en € ; barre = ta patience (icône 🏠).
  - `#survie` : compteur = heure ou % de batterie ; barre = énergie / chaleur du corps (icône ❤️).
- **Cartes de jeu** qui surgissent en tournant (effet carte retournée, bord doré, fond bleu nuit) pour les infos clés : `ASTUCE N° X`, `NOTION : CSS`, `RÈGLE : S.T.O.P.`, avec titre en blanc gras et détail en vert.
- **Appels et messages** : bulle de téléphone « EN DIRECT » (appel vidéo avec le personnage dans un cadre arrondi, badge rouge), notifications SMS qui glissent, petite icône de téléphone qui vibre.
- **Objets qui apparaissent** avec un petit rebond et des étincelles (`pop`), étiquettes de prix ou de valeur au-dessus des objets (« 999 € », « 9 % »).
- **Sous-titres** en bas de l'écran, mot à mot, synchronisés à la voix, police grasse blanche avec contour noir, mot clé en jaune. Les balises entre crochets du script (`[complice]`, `[grave]`…) sont des indications de jeu pour la voix : ne JAMAIS les afficher.
- **Transitions** : zoom rapide d'une zone à l'autre de la pièce, changement de pièce par un glissement latéral, et pour les ellipses une carte plein écran `9 MINUTES PLUS TARD`.
- **Déroulé de chaque vidéo (une seule vidéo complète par histoire, 45 s à 1 min 30)** :
  1. **Hook** dans les 2 premières secondes : la 1re phrase du script, gros texte à l'écran + action forte (zoom, sursaut, objet qui tombe).
  2. **Situation** : la galère, avec le HUD qui s'emballe.
  3. **« Tu ferais quoi ? »** : à la balise `[pause]` du script, carte de jeu géante `TU FERAIS QUOI ?` avec les 2 boutons (🟢 vert / 🔴 rouge, textes dans « Choix ») et un compte à rebours de 3 secondes, petit texte `Réponds en commentaire 👇`.
  4. **Réponse et explication** : le bon bouton s'allume (son `ding`), le mauvais se grise ; puis l'explication avec des cartes, des schémas animés et du code à l'écran pour DevsTeach (ce qu'il faut afficher est indiqué dans « Choix »).
  5. **Accroche finale** : la phrase `[teaser]` + carte `Abonne-toi pour la suite`.
- Le visuel suit EXACTEMENT la voix : chaque phrase = une action visible à l'écran. Quand la voix dit « tu », c'est le personnage **Toi** qui agit.
- **Humour visuel** sur `#devsteach` et `#astuce` (réactions exagérées, chutes, objets qui volent, Bobo qui fait n'importe quoi en arrière-plan) — jamais sur `#survie`.
- Ambiance `#survie` : mêmes personnages et même style, mais palette sombre et froide, nuit, brume, peu de lumière, HUD qui passe à l'orange puis au rouge.

## Voix

UNE SEULE voix off, toujours. Le narrateur parle au spectateur à la 2e personne (« Tu entends un bruit. Ton téléphone vibre. »). Les répliques des autres personnages passent par les SMS, les appels « EN DIRECT », les cartes ou le narrateur qui les rapporte. La durée suit la voix : pas de plafond (1 à 3 min possible), pas de remplissage.

## Visuels — 100 % en code, AUCUNE image à générer

Tout est dessiné en code avec **Remotion** (React + SVG). Aucune image externe.

- `src/personnages/` : un composant par personnage (Toi, Max, Bobo) avec des poses et des expressions animables (neutre, surpris, paniqué, fier, coupable, soulagé, triste, concentré) et des animations réutilisables (marcher, s'asseoir, taper au clavier, téléphoner, sursauter, tomber).
- `src/decors/` : un composant par pièce, réutilisable : `chambre-dev` (bureau, PC), `bureau-startup`, `salon-coloc`, `cuisine-coloc`, `foret` (jour, crépuscule, nuit), puis les autres au fil des épisodes. Chaque décor gère le jour / la nuit.
- `src/ui/` : HUD, carte de jeu, bulle « EN DIRECT », notification SMS, sous-titres, carte de transition, écran de choix.
- `src/camera/` : un composant caméra qui zoome et glisse en douceur vers une zone (avec une courbe d'accélération), plus un léger mouvement permanent pour que l'image ne soit jamais figée.

## Sons

Bibliothèque réutilisable dans `sons/` (`ambiances/`, `effets/`, `musiques/`), décrite dans `sons/LISTE.md`. Je télécharge les sons UNE fois. Si un son manque pour une vidéo, ajoute-le à `sons/LISTE.md` et dis-le-moi.

Mixage : voix 100 %, effets 40-60 %, ambiance 15-20 %, musique 10-15 % avec baisse automatique (ducking) pendant que la voix parle.

## Commandes

Quand j'écris `#devsteach 1`, `#astuce 4`, `#survie 12`… (numéro de l'histoire) :

1. Lis le script correspondant dans `scripts/<chaine>/<numero>.md` (style de voix, voix off, choix et bonne réponse, bandeau, hook, légende, hashtags).
2. Récupère la voix off que je dépose dans `videos/<chaine>-<numero>/voix.wav` (ou .mp3).
3. Calcule le timing mot à mot de la voix (whisper si disponible, sinon alignement avec le texte du script, sans les balises entre crochets). Repère le moment de la balise `[pause]` : c'est là que se place l'écran de choix (prolonge-le de 3 secondes si la voix n'y laisse pas de silence).
4. Découpe en scènes, réutilise ou crée les décors et personnages nécessaires, puis anime directement. Le « Bandeau » du script devient la carte d'ouverture (jour, heure, lieu).
5. Rends `out/<chaine>-<numero>.mp4` et écris `videos/<chaine>-<numero>/legende.txt` : hook (1 ligne), légende prête à publier, hashtags.
6. Vérifie le rendu (captures d'images clés), corrige ce qui ne va pas, puis commit et push.

## Première tâche (une seule fois)

Installe le projet (Remotion), crée la structure (`src/personnages`, `src/decors`, `src/ui`, `src/camera`), puis fais un **TEST de 15 secondes** dans le décor `chambre-dev` : la nuit, Toi devant son PC ; le HUD en haut à droite ; un appel « EN DIRECT » de Max qui surgit ; une carte `NOTION : CSS` qui se retourne ; un zoom caméra sur le bureau ; un passage au jour par la fenêtre ; puis la carte `TU FERAIS QUOI ?`. Ce test sert à valider le dessin des personnages, les décors, la caméra, le HUD et les cartes. Rends `out/test.mp4`.
