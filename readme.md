# DIE MENSCH-MASCHINE · SPACELAB 🤖🌍

Une expérience web 3D pour la **fête des pères 2026**, en hommage à **KRAFTWERK**.
Une **sphère de Dyson** se construit autour d'une Terre photoréaliste, dans une
interface *Mensch-Maschine* (rouge / noir / blanc). Au démarrage, la musique se
lance, la sphère s'achève, l'oscilloscope s'anime, les robots dansent — et le
message apparaît : **BONNE FÊTE PAPA**.

## Le thème Kraftwerk (références)
- **Die Mensch-Maschine** — palette rouge/noir/blanc, les 4 robots (*Die Roboter*,
  chemise rouge + cravate noire) qui dansent sur la musique.
- **Spacelab** — la station qui observe la Terre depuis l'orbite.
- **Oscilloscope** réactif au son (comme sur scène), panneaux solaires et halo qui
  pulsent au rythme de la basse.
- **Computerwelt** — afficheurs type terminal (police VT323), grille en perspective.
- **Bandeau défilant** : *Autobahn, The Model, Wir sind die Roboter, Radio-Aktivität,
  Trans-Europa Express, Numbers (eins zwei drei vier), Boing Boom Tschak, Neon Lights…*
- Télémétrie : **ENERGIE** (la sphère de Dyson), **RADIOAKTIVITÄT**, **NUMMERN**
  (eins/zwei/drei/vier), **AUTOBAHN** (vitesse).

## La sphère de Dyson
Une vraie mégastructure : un **réseau géodésique** (icosaèdre) + un **essaim de
300 panneaux solaires** répartis sur une sphère de Fibonacci, qui **se construit
progressivement** de 12 % à 100 % au lancement. Les panneaux captent la lumière du
Soleil et rougeoient au rythme de la musique.

## La Terre (réaliste)
Gestion des couleurs sRGB + tone mapping ACES, soleil directionnel (jour/nuit),
réflexion spéculaire des océans, nuages en couche alpha, atmosphère bleutée
(fresnel), inclinaison de l'axe à 23,4°, champ d'étoiles en profondeur.

## Stack
HTML5 / CSS3 · **Three.js r128** · **GSAP** · **Web Audio API** (analyse + oscilloscope).
Commandes orbitales et lueur atmosphérique écrites « maison » → **aucune dépendance
ajoutée** (seuls `three.min.js` et `gsap` via CDN).

## Fichiers
- `index.html` · `style.css` · `app.js` — la page et toute la scène.
- `earth_color.jpg` · `earth_cloud.jpg` · `earth_specular.jpg` — textures de la Terre.
- `kraftwerk.mp3` — la bande-son.

## Tout personnaliser
En haut de `app.js`, l'objet **`CONFIG`** regroupe tout le texte modifiable :
le titre, le message à papa, la date, et la liste **`ticker`** des références
Kraftwerk qui défilent. Une ligne à changer pour adapter le message.

## Tester en local
Les textures sont bloquées en `file://` (CORS). Lancer un petit serveur :
```bash
python3 -m http.server 8000   # puis http://localhost:8000
```

## Déploiement
Prêt pour **GitHub Pages** (tous les fichiers à la racine).
*Wir sind die Roboter.* 🤖
