# ts2vrcs

> Création d'une bibliothèque de correspondence de types entre typescript et C# VRChat ainsi qu'un binaire de transpile

Des exemple sont disponibles dans `./examples/`

Transpile :
```shell
npm run build
node dist/index.js ./examples/ -o ./dist-cs
```

Aller voir les fichiers générés dans `./dist-cs/`