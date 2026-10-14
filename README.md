# SportSee — Dashboard de sport

Application en JavaScript et JSX, avec React 19 et React Router 8 en mode Framework,
Vite et Tailwind CSS. Le rendu côté serveur est activé.

La route `/` affiche une page blanche, point de départ du dashboard SportSee.
Les composants, logos, liens, métadonnées et polices de démonstration ont été retirés.

## Installation et lancement

Avec Node.js 22.22 ou une version plus récente compatible avec les dépendances :

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

- `app/root.jsx` : document HTML et layout principal.
- `app/routes.js` : configuration des routes.
- `app/routes/home.jsx` : page d'accueil vide.
- `app/app.css` : styles globaux et Tailwind CSS.
- `react-router.config.js` : configuration de React Router.
- `vite.config.js` : plugins et alias `~/` vers le dossier `app/`.
- `jsconfig.json` : résolution des modules JavaScript/JSX et de l'alias `~/`
  dans l'éditeur.

Les composants utilisent l'extension `.jsx` et les configurations l'extension `.js`.
Le projet ne contient plus de configuration TypeScript ni de script `typecheck`.

React Router génère automatiquement des fichiers de types dans `.react-router/types/`
au lancement du serveur de développement, même pour une application JavaScript.
Le `jsconfig.json` permet à VS Code de résoudre leurs imports vers les fichiers JSX
grâce à `rootDirs`. Ces fichiers générés sont ignorés par Git et gérés par React Router.

## Conventions de développement

- JavaScript moderne conforme à ECMAScript 2026, avec des modules ES et des fichiers JSX.
- Uniquement `const` et `let` pour les déclarations de variables.
- Composants fonctionnels et hooks compatibles avec React 19.
- Séparer les responsabilités : composants et layouts pour l'affichage, hooks
  pour la logique React, services pour les accès externes, mapping pour adapter
  les données et utils pour les fonctions utilitaires indépendantes.
- Ajouter ces modules au fur et à mesure des fonctionnalités, avec une logique
  métier indépendante de l'interface et des appels à l'API.

## API SportSee

L'API Node.js / Express se trouve dans le dossier voisin `P6JS` et fonctionne
via Docker à l'adresse http://localhost:8000. La connexion du front-end à cette
API sera réalisée dans une prochaine étape.
