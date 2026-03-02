---
layout: ../../../layouts/DocLayout.astro
title: Types & Constructions — TS → C#
description: Référence des correspondances de types et de constructions du transpileur ts vers C# (UdonSharp)
---

Cette page est la référence de mappage TS → C# généré.

## Primitives et alias usuels

- `string` → `string`
- `number` → `float`
- `boolean` → `bool`
- `void` → `void`
- `any` → `object`
- `null` → `null` (valeur)
- `undefined` → ignoré uniquement dans unions (voir nullabilité)

## Types Unity/Udon pris en charge

- `Vector2` → `Vector2`
- `Vector3` → `Vector3`
- `Vector4` → `Vector4`
- `Quaternion` → `Quaternion`

Remarque: d’autres types personnalisés sont émis tels quels (par nom) et nécessitent une définition côté C# dans votre projet.

## Nullabilité et unions

- Union contenant `null` ou `undefined` → on garde le premier type « effectif » et on ajoute `?`.
  - `number | null` → `float?`
  - `string | undefined` → `string?`
  - `Vector3 | null | undefined` → `Vector3?`
- Type avec suffixe TS `?` (cas rares dans l’AST type): on tente d’extraire le type de base et d’ajouter `?` si absent.

Limites: unions hétérogènes complexes (ex.: `number | string`) sont réduites au premier type reconnu par l’algorithme (comportement actuel). Préférez des types explicites côté TS.

## Propriétés et champs

- Nom toujours capitalisé (PascalCase) sauf s’il commence par `_`.
- Modificateurs supportés: `public`, `private`, `protected`, `static`.
- Propriété optionnelle (`prop?: T`) → `T?`.
- Décorateurs TS mappés en attributs C#:
  - `@X()` → `[X]`
  - `@X` → `[X]`

Exemple
```ts
@UdonSynced() private health?: number = 100
```
```csharp
[UdonSynced]
private float? Health = 100;
```

## Méthodes

- Nom capitalisé par défaut, avec table de correspondance des événements Udon:
  - `start` → `Start`
  - `update` → `Update`
  - `lateUpdate` → `LateUpdate`
  - `fixedUpdate` → `FixedUpdate`
  - `onEnable` → `OnEnable`
  - `onDisable` → `OnDisable`
  - `onDestroy` → `OnDestroy`
  - `interact` → `Interact`
  - `interaction` → `Interaction`
  - `onPickup` → `OnPickup`
  - `onDrop` → `OnDrop`
  - `onPickupUseDown` → `OnPickupUseDown`
  - `onPickupUseUp` → `OnPickupUseUp`
  - `onPlayerJoined` → `OnPlayerJoined`
  - `onPlayerLeft` → `OnPlayerLeft`
  - `onStationEntered` → `OnStationEntered`
  - `onStationExited` → `OnStationExited`
  - `onOwnershipTransferred` → `OnOwnershipTransferred`
  - `onPreSerialization` → `OnPreSerialization`
  - `onPostSerialization` → `OnPostSerialization`
  - `onDeserialization` → `OnDeserialization`
  - `onTriggerEnter` → `OnTriggerEnter`
  - `onTriggerExit` → `OnTriggerExit`
  - `onTriggerStay` → `OnTriggerStay`
  - `onCollisionEnter` → `OnCollisionEnter`
  - `onCollisionExit` → `OnCollisionExit`
  - `onCollisionStay` → `OnCollisionStay`
  - `onVideoStart` → `OnVideoStart`
  - `onVideoEnd` → `OnVideoEnd`
  - `onVideoPlay` → `OnVideoPlay`
  - `onVideoPause` → `OnVideoPause`
  - `onVideoError` → `OnVideoError`
- Ajout automatique de `override` si c’est un événement Udon et que la méthode est `public` ou `protected`.
- Paramètres: `mapType` + nom inchangé.
- Retour: `mapType` ou `void`.

## Appels de fonctions et accès membres

- `DebugLog(x)` → `Debug.Log(x)`.
- Appels membres sur `this`: `this.foo()` → `this.Foo()` (ou mappage Udon event si applicable).
- Appels globaux: `foo()` → `Foo()` sauf pour une poignée reconnue (`Vector3`, `Quaternion`, `Color`, `LayerMask`, `DebugLog`).
- Accès propriétés: capitalisation systématique, sauf `_` en tête.
- `Math.*` → `Mathf.*` avec membre capitalisé: `Math.sin(x)` → `Mathf.Sin(x)`.
- Chaînage optionnel conservé: `a?.b` / `a?.b()`.

## Constructions de langage

- Instructions
  - `if (cond) { ... } else { ... }` → identique en C#.
  - `return expr;` → identique.
  - `new Type(args)` → identique.
- Expressions
  - Opérateurs binaires: rendus tels quels (`+`, `-`, `*`, `/`, `%`, `&&`, `||`, `==`, `!=`, `<`, `>`, `<=`, `>=`).
  - Coalescence nulle `??` supportée.
  - Unaires pré/post: `++a`, `a++`, `--a`, `a--`, `!a`, `-a` rendus tels quels.
- Littéraux
  - Chaînes: `"..."`.
  - Nombres: rendus tels quels (pas de suffixe `f` ajouté automatiquement).

## Éléments ignorés (pas de génération C# directe)

- Import/Export TypeScript (les `import` sont supprimés dans la sortie).
- `type` alias et `interface` (déclarations de type pures). Si vous avez besoin de types côté C#, définissez‑les manuellement.

## Exemples de bout‑en‑bout

Entrée TS
```ts
class Player {
  @UdonSynced() private health?: number = 100
  start() { DebugLog("Ready") }
  takeDamage(amount: number | null) {
    this.health = (this.health ?? 0) - (amount ?? 0)
  }
}
```

Sortie C#
```csharp
using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

public class Player : UdonSharpBehaviour
{
    [UdonSynced]
    private float? Health = 100;

    public override void Start()
    {
        Debug.Log("Ready");
    }

    public void TakeDamage(float? amount)
    {
        this.Health = (this.Health ?? 0) - (amount ?? 0);
    }
}
```
