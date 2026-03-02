# ts2vrcs

> Création d'une bibliothèque de correspondence de types entre typescript et C# VRChat ainsi qu'un binaire de transpile

## Utilisation en local

Des exemple sont disponibles dans `./examples/`

Transpile :
```shell
npm run build
node dist/index.js ./examples/ -o ./dist-cs
```

Aller voir les fichiers générés dans `./dist-cs/`

## Installation pour la production

```shell
echo "@nicolachoquet06250:registry=https://npm.pkg.github.com" >> .npmrc

npm i @nicolachoquet06250/ts2vrcs
```

## Utilisation pour la production

### Transpile

```shell
# for help
ts2vrcs -h

ts2vrcs ./path/to/ts/files [-o ./path/to/output/folder]
```

### Code TypeScript

```ts
import {
    UdonSharpBehaviour,
    VRCPlayerApi,
    Networking,
    Vector3,
    Quaternion,
    Animator,
    Rigidbody,
    Physics,
    DebugLog,
    UdonSynced,
    Time,
    Random,
    Mathf
} from "@nicolachoquet06250/ts2vrcs";

export class ComprehensiveTest extends UdonSharpBehaviour {
    @UdonSynced()
    public syncMessage: string = "Sync me!";

    private animator?: Animator;
    private rb?: Rigidbody;
    private someFloat?: number;

    public start(): void {
        this.animator = this.gameObject.getComponent(Animator);
        this.rb = this.gameObject.getComponent(Rigidbody);
        this.someFloat = 1.5;

        DebugLog("Started test");
    }

    // ...
}
```

### Code C#

```C#
using UdonSharp;
using UnityEngine;
using VRC.SDKBase;
using VRC.Udon;

public class ComprehensiveTest : UdonSharpBehaviour
{
    [UdonSynced]
    public string SyncMessage = "Sync me!";
    private Animator? Animator;
    private Rigidbody? Rb;
    private float? SomeFloat;
    
    public override void Start()
    {
        this.Animator = this.GameObject.GetComponent(Animator);
        this.Rb = this.GameObject.GetComponent(Rigidbody);
        this.SomeFloat = 1.5;
        Debug.Log("Started test");
    }
    
    // ...
}
```