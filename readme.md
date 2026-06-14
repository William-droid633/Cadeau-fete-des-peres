# PROJET ORBITAL // SYSTEM_PAPA_2026

## Description du Projet
Ce projet est une expérience Web 3D immersive développée pour célébrer une occasion spéciale. Il simule une vue photoréaliste de la Terre depuis l'orbite terrestre basse (LEO), accompagnée d'une interface HUD (Heads-Up Display) de style station spatiale. Lors de l'initialisation, le système active une séquence visuelle dynamique couplée à la lecture automatique d'une œuvre de Kraftwerk.

## Stack Technique
- **Frontend** : HTML5, CSS3 (Glassmorphism).
- **Moteur 3D** : Three.js (r128).
- **Animations** : GSAP (GreenSock Animation Platform).
- **Audio** : Web Audio API / HTML5 Audio (MP3).
- **Police** : Inter (Google Fonts).

## Structure des fichiers
- `index.html` : Structure de l'interface utilisateur (HUD) et chargement des dépendances.
- `style.css` : Mise en page, effets de flou (Glassmorphism), et responsive design.
- `app.js` : Logique de la scène 3D, gestion de la caméra, des textures de la Terre et interaction audio.
- `kraftwerk.mp3` : Fichier audio principal (format MP3).
- Textures (format .jpg) : 
    - `earth_color.jpg` (Diffuse map)
    - `earth_clouds.jpg` (Alpha map pour nuages)
    - `earth_specular.jpg` (Reflets océaniques)

## Logique de l'IA (Comportement)
1. **Initialisation** : La scène 3D génère une sphère texturée (Terre) avec une couche de nuages dynamique et un système d'étoiles (particules).
2. **Interaction (Trigger)** : L'utilisateur déclenche la séquence via `launch-trigger`.
3. **Séquence post-clic** :
    - Lancement de `kraftwerk.mp3`.
    - Animation de la caméra (zoom vers la Terre via GSAP).
    - Mise à jour du contenu textuel du HUD (messages de célébration).
    - Mise à jour des propriétés du matériau (`MeshPhongMaterial`).

## Instructions pour l'IA Collaboratrice
- **Déploiement** : Le projet est conçu pour être hébergé sur GitHub Pages. Assurez-vous que tous les fichiers (JS, CSS, images, MP3) sont à la racine.
- **Règles de maintenance** :
    - Toute nouvelle texture doit être au format `.jpg` ou `.png` (le `.tif` est proscrit).
    - L'audio nécessite une interaction utilisateur (clic) pour être lancé conformément aux politiques de lecture automatique des navigateurs.
- **Optimisation** : Lors de l'ajout de nouvelles fonctionnalités 3D, prioriser le `MeshPhongMaterial` pour garder la compatibilité avec l'éclairage directionnel actuel.

## Note sur le déploiement local
Attention : Le chargement des textures locales est bloqué par la politique CORS des navigateurs modernes. Pour tester localement, utilisez un serveur de développement (ex: extension "Live Server" pour VS Code).