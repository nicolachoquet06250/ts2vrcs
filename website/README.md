# Kit de démarrage Astro : Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Astronaute chevronné ?** Supprimez ce fichier. Amusez-vous bien !

## 🚀 Structure du projet

À l'intérieur de votre projet Astro, vous verrez les dossiers et fichiers suivants :

```text
/
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── astro.svg
│   │   └── background.svg
│   ├── components/
│   │   └── AnimatedBlur.astro
│   ├── layouts/
│   │   ├── DocLayout.astro
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── docs/
│   │   │   ├── reference/
│   │   │   │   ├── api.md
│   │   │   │   ├── cli.md
│   │   │   │   └── types-mapping.md
│   │   │   ├── installation.md
│   │   │   ├── intro.md
│   │   │   └── usage.md
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── .gitignore
├── astro.config.mjs
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

Pour en savoir plus sur la structure des dossiers d'un projet Astro, consultez [notre guide sur la structure de projet](https://docs.astro.build/fr/basics/project-structure/).

## 🧞 Commandes

Toutes les commandes sont exécutées depuis la racine du projet, via un terminal :

| Commande                  | Action                                             |
|:--------------------------|:---------------------------------------------------|
| `npm install`             | Installe les dépendances                           |
| `npm run dev`             | Lance le serveur de dév local sur `localhost:4321` |
| `npm run build`           | Compile votre site de production dans `./dist/`    |
| `npm run preview`         | Prévisualise votre build localement                |
| `npm run astro ...`       | Lance des commandes CLI comme `astro add`          |
| `npm run astro -- --help` | Affiche l'aide de la CLI Astro                     |

## 👀 Vous voulez en savoir plus ?

N'hésitez pas à consulter [notre documentation](https://docs.astro.build) ou à rejoindre notre [serveur Discord](https://astro.build/chat).
