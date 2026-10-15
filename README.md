# SportSee — Dashboard de sport

Application en JavaScript et JSX, avec React 19 et React Router 8 en mode Framework,
Vite et Tailwind CSS. Le rendu côté serveur est activé.

La page de connexion `HomeLogin` permet d'accéder à un espace utilisateur protégé.
Les données proviennent de l'API SportSee ou d'un mock local, selon la configuration.

## Installation et lancement

Prérequis : Node.js 22.22 ou une version plus récente compatible avec les dépendances,
et npm. Depuis le dossier `opc-dashboard` :

```sh
npm ci
```

Au premier lancement, copier [`.env.example`](.env.example) vers `.env` à la racine
du projet, puis choisir la source des données décrite ci-dessous.

```sh
npm run dev
```

L'application est accessible à l'adresse affichée dans le terminal
(par défaut : http://localhost:5173).

## Configuration

Les variables sont lues côté serveur depuis `.env`. Les variables déjà définies
dans l'environnement du processus ont priorité.

| Variable | Valeur par défaut | Rôle |
| --- | --- | --- |
| `API_BASE_URL` | `http://localhost:8000` | Adresse de l'API accessible depuis le serveur React Router. |
| `DATA_SOURCE` | `api` | Source des données : `api` ou `mock`. |
| `SESSION_SECRET` | Vide | Secret privé de signature des cookies, de 32 caractères minimum. Obligatoire en production. |

En développement, si `SESSION_SECRET` est vide, un secret temporaire est généré
au démarrage. Les sessions précédentes deviennent alors invalides après un
redémarrage. Définir un secret stable permet de conserver les sessions API.

Pour générer un secret aléatoire à reporter dans `.env` :

```sh
node --input-type=module -e "import { randomBytes } from 'node:crypto'; console.log(randomBytes(32).toString('hex'))"
```

`.env.example` sert de modèle et peut être versionné sans secret réel.
`.env` et les autres fichiers `.env.*` privés sont ignorés par Git.

### Utiliser l'API

```env
DATA_SOURCE=api
API_BASE_URL=http://localhost:8000
```

L'API Node.js / Express se trouve dans le dossier voisin `P6JS`. Son serveur doit
être démarré ; dans l'environnement Docker local du projet, le conteneur est
`sportsee-api` et l'API est exposée sur le port 8000.

Si le serveur front fonctionne lui aussi dans Docker Desktop, utiliser
`API_BASE_URL=http://host.docker.internal:8000` pour joindre l'API exposée sur la machine.

### Utiliser le mock

```env
DATA_SOURCE=mock
```

Ce mode fonctionne sans l'API ni Docker. Il reproduit la connexion, les profils,
les statistiques et le filtrage des activités par dates, avec les mêmes formats
de réponse que l'API. Les activités futures sont exclues des résultats filtrés.

Le jeu de données contient les trois utilisateurs de démonstration et leurs
1 085 activités dans `app/mocks/data/users.json`. Les images de profil locales
se trouvent dans `public/images/mocks/`.

Après un changement de source, redémarrer le serveur et se reconnecter.
Aucune modification des composants n'est nécessaire. Les sessions du mock sont
conservées en mémoire et sont perdues au redémarrage du serveur.

## Authentification

Le formulaire attend un **nom d'utilisateur** et un mot de passe.
Les mêmes comptes de démonstration fonctionnent avec l'API et le mock :

| Nom d'utilisateur | Mot de passe |
| --- | --- |
| `sophiemartin` | `password123` |
| `emmaleroy` | `password789` |
| `marcdubois` | `password456` |

La connexion à l'API est effectuée côté serveur par les actions React Router.
Le JWT reçu est conservé dans un cookie signé, `HttpOnly` et `SameSite=Lax`,
valable 24 heures. Les appels aux données utilisent l'en-tête
`Authorization: Bearer <token>`. Le token n'est pas exposé aux composants ni
stocké dans `localStorage`.

| Route | Fonctionnement |
| --- | --- |
| `/` | Page de connexion ; redirection vers `/dashboard` si une session est présente. |
| `/dashboard` | Route protégée avec vérification du profil auprès de la source active. Affiche actuellement un accueil personnalisé et la déconnexion. |
| `POST /logout` | Suppression du cookie de session et retour à la connexion. |

Un token refusé par l'API efface la session et ramène au formulaire. Une panne
réseau conserve la session et affiche un message permettant de réessayer.
Le formulaire indique les erreurs de connexion et bloque un nouvel envoi
pendant le traitement.

La récupération du mot de passe n'est pas implémentée ; l'API ne fournit pas
d'endpoint pour cette fonctionnalité.

## Build de production

```sh
npm run build
npm start
```

`SESSION_SECRET` doit être configuré dans l'environnement de production.
Les cookies de session y utilisent l'attribut `Secure` : le déploiement doit
servir l'application en HTTPS. Dans Docker, les variables sont à fournir au
conteneur à l'exécution ; les fichiers `.env` privés sont exclus de l'image.

## Tests

Les tests utilisent le moteur de test natif de Node.js, sans dépendance supplémentaire.

Tests unitaires, sans API :

```sh
npm test
```

Tests d'intégration, avec l'API démarrée et un build à jour :

```sh
npm run build
npm run test:integration
```

Les tests d'intégration démarrent et arrêtent leurs propres serveurs front sur
des ports disponibles. Ils couvrent les parcours de connexion et de déconnexion,
les routes protégées, les erreurs réseau et la concordance des profils,
statistiques et activités entre l'API et le mock.

## Organisation

- `app/root.jsx` : document HTML et layout principal.
- `app/routes.js` et `app/routes/` : routes, loaders et actions React Router.
- `app/pages/` : pages de l'application.
- `app/layouts/` : mises en page partagées.
- `app/components/` : composants d'interface réutilisables.
- `app/hooks/` : hooks React, dont `useAuth` pour accéder à l'utilisateur connecté.
- `app/domain/` : validation des identifiants et des plages de dates.
- `app/services/` : services d'authentification, de session et de données ; accès HTTP dans `repositories/`.
- `app/mappers/` : transformation des réponses de l'API vers les données utilisées par l'application.
- `app/mocks/` : données et implémentation du mock.
- `app/config/`, `app/errors/` et `app/utils/` : configuration, gestion des erreurs et utilitaires.
- `app/styles/` : styles globaux, tokens et CSS Modules centralisés par composants, layouts et pages.
- `app/assets/` : logos et images importés par l'application.
- `public/` : fichiers servis directement, dont les images du mock.
- `tests/` : tests unitaires et d'intégration.

Les modules `.server.js` restent côté serveur. Les services API et mock partagent
la même interface ; la sélection est centralisée dans `app/services/sportsee.server.js`.

L'alias `~/` pointe vers `app/` ; il est configuré dans `vite.config.js` et
`jsconfig.json`. Le dossier `.react-router/` est généré automatiquement par
React Router et ignoré par Git.
