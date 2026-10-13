# SportSee — Dashboard de sport

Projet React en JavaScript et JSX, basé sur le template React Router en mode
Framework, avec Vite et Tailwind CSS. Le rendu côté serveur du template est conservé.

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

- `app/root.jsx` : document HTML, layout principal et gestion des erreurs.
- `app/routes.js` : configuration des routes.
- `app/routes/home.jsx` : page d'accueil du template.
- `app/welcome/welcome.jsx` : composant d'accueil du template.
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

## API SportSee

L'API Node.js / Express se trouve dans le dossier voisin `P6JS` et fonctionne
via Docker à l'adresse http://localhost:8000. La connexion du front-end à cette
API sera réalisée dans une prochaine étape.
