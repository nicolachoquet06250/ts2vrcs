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
} from "../lib/udon.js";

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
