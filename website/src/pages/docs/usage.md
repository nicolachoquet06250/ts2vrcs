---
layout: ../../layouts/DocLayout.astro
title: Utilisation
description: "Comment utiliser @nicolachoquet06250/ts2svrc dans votre projet."
---

Voici un exemple simple d'utilisation de `@nicolachoquet06250/ts2svrc`.

> Le code TypeScript ci-dessous :

```typescript
import {
    UdonSharpBehaviour,
    VRCPlayerApi,
    Networking, Vector3,
    Quaternion, Animator,
    Rigidbody, Physics,
    DebugLog, UdonSynced,
    Time, Random, Mathf
} from "@nicolachoquet06250/ts2svrc";

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

        DebugLog("Started comprehensive test");
    }

    public update(): void {
        const currentForce = this.someFloat ?? 1.0;
        if (this.rb != null) {
            const force = new Vector3(0, Mathf.sin(Time.time) * currentForce, 0);
            this.rb.addForce(force);
        }

        if (Random.value > 0.99) {
            const pos = new Vector3(Random.range(-5, 5), 0, Random.range(-5, 5));
            Networking.localPlayer.teleportTo(pos, Quaternion.identity);
        }
    }

    public override onPlayerJoined(player: VRCPlayerApi): void {
        DebugLog("Player joined: " + player.displayName);
        if (Networking.isMaster) {
            DebugLog("I am the master of this world.");
        }
    }

    public interact(): void {
        const rayOrigin = this.transform.position;
        const rayDir = this.transform.forward;

        if (Physics.raycast(rayOrigin, rayDir, 10)) {
            DebugLog("Hit something!");
        }

        this.animator?.setTrigger("Interacted");
    }

    public onPickup(): void {
        this.syncMessage = Networking.localPlayer.displayName + " picked me up!";
        this.requestSerialization();
    }
}
```

> Est convertis en le code C# suivant :

```csharp
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
        Debug.Log("Started comprehensive test");
    }

    
    public override void Update()
    {
        var currentForce = this.SomeFloat ?? 1;
        if (this.Rb != null) {
            var force = new Vector3(0, Mathf.Sin(Time.Time) * currentForce, 0);
            this.Rb.AddForce(force);
        }
        if (Random.Value > 0.99) {
            var pos = new Vector3(Random.Range(-5, 5), 0, Random.Range(-5, 5));
            Networking.LocalPlayer.TeleportTo(pos, Quaternion.Identity);
        }
    }

    
    public  override void OnPlayerJoined(VRCPlayerApi player)
    {
        Debug.Log("Player joined: " + player.DisplayName);
        if (Networking.IsMaster) {
            Debug.Log("I am the master of this world.");
        }
    }

    
    public override void Interact()
    {
        var rayOrigin = this.Transform.Position;
        var rayDir = this.Transform.Forward;
        if (Physics.Raycast(rayOrigin, rayDir, 10)) {
            Debug.Log("Hit something!");
        }
        this.Animator?.SetTrigger("Interacted");
    }

    
    public override void OnPickup()
    {
        this.SyncMessage = Networking.LocalPlayer.DisplayName + " picked me up!";
        this.RequestSerialization();
    }

}
```