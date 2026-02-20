import { UdonSharpBehaviour, DebugLog, UdonSynced, Networking } from '../lib/udon.js';

export class MyVRChatScript extends UdonSharpBehaviour {
    @UdonSynced()
    public message: string = "Hello from TypeScript!";
    
    public counter: number = 0;

    public interaction(): void {
        this.counter++;
        const player = Networking.localPlayer;
        DebugLog(player.displayName + " says: " + this.message + " Counter: " + this.counter);
    }

    public onPickup(): void {
        DebugLog("Object picked up!");
    }
}
