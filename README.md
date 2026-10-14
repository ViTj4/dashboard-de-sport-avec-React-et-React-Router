# SportSee — Dashboard de sport

Application en JavaScript et JSX, avec React 19 et React Router 8 en mode Framework,
Vite et Tailwind CSS. Le rendu côté serveur est activé.

La route `/` affiche la page d'accueil et de connexion `HomeLogin`.

## Installation et lancement

Avec Node.js 22.22 ou une version plus récente compatible avec les dépendances: 

```sh
npm ci
npm run dev
```

L'application est accessible à l'adresse affichée dans le terminal
(par défaut : http://localhost:5173).

## Build de production

```sh
npm run build
npm start
```

## Organisation

- `app/root.jsx`       : document HTML et layout principal.
- `app/routes.js`      : configuration des routes.
- `app/routes/home.jsx`: route d'accueil qui rend `HomeLogin`.
- `app/pages/` : pages de l'application.
- `app/layouts/`   : mises en page partagées.
- `app/components/`: composants d'interface réutilisables.
- `app/assets/`           : logos et images.
- `app/styles/`           : styles globaux, tokens et CSS Modules des composants, layouts et pages.
- `react-router.config.js`: configuration de React Router.
- `vite.config.js`        : plugins et alias `~/` vers le dossier `app/`.
- `jsconfig.json`         : résolution des modules JavaScript/JSX et de l'alias `~/`
  dans l'éditeur.

Le dossier `.react-router/` est généré automatiquement par React Router et ignoré par Git.

## API SportSee

L'API Node.js / Express se trouve dans le dossier voisin `P6JS` et fonctionne
via Docker à l'adresse http://localhost:8000.

Le formulaire de connexion n'est pas encore connecté à l'API.
