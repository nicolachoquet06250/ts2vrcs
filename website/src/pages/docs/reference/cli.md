---
layout: ../../../layouts/DocLayout.astro
title: CLI — Commandes et options
description: Utilisation de la ligne de commande pour transpiler des fichiers/dossiers TypeScript vers C# (UdonSharp)
---

<style>
.prose p {
  display: inline-block;
  width: calc(100% - 50px);
}
</style>

La CLI `ts2vrcs` permet de transpiler un fichier individuel ou un dossier entier de fichiers TypeScript (hors `.d.ts`) vers des fichiers C# compatibles UdonSharp.

## Commande

```bash
ts2vrcs <path> [options]
```

- `<path>`: chemin vers un fichier `.ts` (hors `.d.ts`) ou un dossier.

## Options

- `-o, --output <dir>`: dossier de sortie (par défaut `./dist-cs`).
- `--sdk <version>`: version du SDK VRChat (ex.: `sdk3-worlds`, `sdk3-avatars`).
- `--udonsharp <version>`: version d’UdonSharp (ex.: `1.x`, `2.x`).
- `-V, --version`: afficher la version de la CLI.
- `-h, --help`: afficher l’aide.

## Comportement

- Si `<path>` est un dossier, tous les sous‑dossiers sont parcourus (hors `node_modules` et dossiers cachés), et seuls les `.ts` sont transpilés.
- Si `<path>` est un fichier, il doit se terminer par `.ts` et ne pas être une déclaration `.d.ts`.
- La structure relative est préservée dans le dossier de sortie: `src/foo/bar.ts` → `dist-cs/src/foo/bar.cs` si l’entrée est un dossier.
- Chaque compilation réussie journalise: `Successfully compiled <in> to <out>`.

## Exemples

- Transpiler un fichier:
  ```bash
  ts2vrcs examples/comprehensive-test.ts -o dist-cs
  ```

- Transpiler un dossier:
  ```bash
  ts2vrcs examples -o dist-cs --sdk sdk3-worlds --udonsharp 1.x
  ```

## Notes

- Les règles de génération (capitalisation, correspondance d’événements Udon, mapping de types, etc.) sont détaillées dans la section [Types & Constructions](./types-mapping).
- Les options `--sdk` et `--udonsharp` sont actuellement passées au transpileur mais n’altèrent pas les règles de génération; elles sont prévues pour de futures évolutions.
