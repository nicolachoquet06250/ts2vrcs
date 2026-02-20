export declare class GameObject {
    public name: string;
    public activeSelf: boolean;
    public activeInHierarchy: boolean;
    public layer: number;
    public tag: string;
    public transform: Transform;

    public setActive(value: boolean): void;
    public getComponent<T>(type: string | { new(): T }): T;
    public getComponents<T>(type: string | { new(): T }): T[];
    public getComponentInChildren<T>(type: string | { new(): T }): T;
    public getComponentsInChildren<T>(type: string | { new(): T }): T[];

    public static Find(name: string): GameObject;
}

export declare class Transform {
    public position: Vector3;
    public localPosition: Vector3;
    public rotation: Quaternion;
    public localRotation: Quaternion;
    public eulerAngles: Vector3;
    public localEulerAngles: Vector3;
    public right: Vector3;
    public up: Vector3;
    public forward: Vector3;
    public parent: Transform;
    public gameObject: GameObject;
    public childCount: number;

    public lookAt(target: Transform | Vector3): void;
    public rotate(eulers: Vector3): void;
    public rotateAround(point: Vector3, axis: Vector3, angle: number): void;
    public setParent(parent: Transform): void;
    public getChild(index: number): Transform;
    public find(name: string): Transform;
}

export declare class Vector2 {
    constructor(x: number, y: number);
    public x: number;
    public y: number;
    public static readonly zero: Vector2;
    public static readonly one: Vector2;
    public static distance(a: Vector2, b: Vector2): number;
}

export declare class Vector3 {
    constructor(x: number, y: number, z: number);
    public x: number;
    public y: number;
    public z: number;

    public static readonly zero: Vector3;
    public static readonly one: Vector3;
    public static readonly up: Vector3;
    public static readonly down: Vector3;
    public static readonly left: Vector3;
    public static readonly right: Vector3;
    public static readonly forward: Vector3;
    public static readonly back: Vector3;

    public static distance(a: Vector3, b: Vector3): number;
    public static magnitude(a: Vector3): number;
    public static normalize(a: Vector3): Vector3;
    public static dot(a: Vector3, b: Vector3): number;
    public static cross(lhs: Vector3, rhs: Vector3): Vector3;
    public static lerp(a: Vector3, b: Vector3, t: number): Vector3;
    public static angle(from: Vector3, to: Vector3): number;
}

export declare class Vector4 {
    constructor(x: number, y: number, z: number, w: number);
    public x: number;
    public y: number;
    public z: number;
    public w: number;
    public static readonly zero: Vector4;
}

export declare class Rect {
    constructor(x: number, y: number, width: number, height: number);
    public x: number;
    public y: number;
    public width: number;
    public height: number;
}

export declare class LayerMask {
    public value: number;
    public static getMask(...layerNames: string[]): number;
    public static layerToName(layer: number): string;
    public static nameToLayer(layerName: string): number;
}

export declare class Ray {
    constructor(origin: Vector3, direction: Vector3);
    public origin: Vector3;
    public direction: Vector3;
    public getPoint(distance: number): Vector3;
}

export declare class RaycastHit {
    public readonly collider: Collider;
    public readonly distance: number;
    public readonly normal: Vector3;
    public readonly point: Vector3;
    public readonly transform: Transform;
}

export declare class Physics {
    public static raycast(origin: Vector3, direction: Vector3, maxDistance?: number, layerMask?: number): boolean;
    public static raycast(ray: Ray, maxDistance?: number, layerMask?: number): boolean;
}

export declare class Random {
    public static range(min: number, max: number): number;
    public static readonly value: number;
    public static readonly insideUnitSphere: Vector3;
    public static readonly onUnitSphere: Vector3;
    public static readonly rotation: Quaternion;
}

export declare class Component {
    public gameObject: GameObject;
    public transform: Transform;
    public tag: string;
    public getComponent<T>(type: string | { new(): T }): T;
}

export declare class Rigidbody extends Component {
    public mass: number;
    public drag: number;
    public angularDrag: number;
    public useGravity: boolean;
    public isKinematic: boolean;
    public velocity: Vector3;
    public angularVelocity: Vector3;
    public addForce(force: Vector3): void;
    public addTorque(torque: Vector3): void;
}

export declare class Collider extends Component {
    public enabled: boolean;
    public isTrigger: boolean;
}

export declare class BoxCollider extends Collider {
    public center: Vector3;
    public size: Vector3;
}

export declare class SphereCollider extends Collider {
    public center: Vector3;
    public radius: number;
}

export declare class CapsuleCollider extends Collider {
    public center: Vector3;
    public radius: number;
    public height: number;
    public direction: number;
}

export declare class MeshCollider extends Collider {
    public convex: boolean;
}

export declare class CharacterController extends Collider {
    public isGrounded: boolean;
    public radius: number;
    public height: number;
    public center: Vector3;
    public velocity: Vector3;
    public move(motion: Vector3): void;
    public simpleMove(speed: Vector3): void;
}

export declare class Animator extends Component {
    public setFloat(name: string, value: number): void;
    public setInt(name: string, value: number): void;
    public setBool(name: string, value: boolean): void;
    public setTrigger(name: string): void;
    public getFloat(name: string): number;
    public getInt(name: string): number;
    public getBool(name: string): boolean;
}

export declare class AudioClip extends Component {}

export declare class AudioSource extends Component {
    public clip: AudioClip;
    public volume: number;
    public pitch: number;
    public loop: boolean;
    public isPlaying: boolean;
    public play(): void;
    public stop(): void;
    public pause(): void;
    public playOneShot(clip: AudioClip): void;
}

export declare class Renderer extends Component {
    public material: any;
    public materials: any[];
    public enabled: boolean;
}

export declare class MeshRenderer extends Renderer {}
export declare class SkinnedMeshRenderer extends Renderer {}

export declare class Light extends Component {
    public color: Color;
    public intensity: number;
    public range: number;
    public enabled: boolean;
}

export declare class Camera extends Component {
    public fieldOfView: number;
    public nearClipPlane: number;
    public farClipPlane: number;
    public enabled: boolean;
    public static readonly main: Camera;
}

export declare class VRCPickup extends Component {
    public pickupable: boolean;
    public proximity: number;
    public orientation: string;
    public autoHold: string;
}

export declare class VRCObjectSync extends Component {
    public flagDiscontinuity(): void;
}

export declare class VRCUrl {
    constructor(url: string);
    public get(): string;
}

export declare class VRCVideoPlayer extends Component {
    public playURL(url: VRCUrl): void;
    public stop(): void;
    public pause(): void;
    public play(): void;
}

export declare class VRCUrlInputField extends Component {
    public text: string;
}

export declare class Quaternion {
    public static readonly identity: Quaternion;
    public static euler(x: number, y: number, z: number): Quaternion;
    public static euler(v: Vector3): Quaternion;
    public static lookRotation(forward: Vector3, up?: Vector3): Quaternion;
    public static lerp(a: Quaternion, b: Quaternion, t: number): Quaternion;
    public static slerp(a: Quaternion, b: Quaternion, t: number): Quaternion;
    public static angle(a: Quaternion, b: Quaternion): number;
}

export declare class Color {
    constructor(r: number, g: number, b: number, a?: number);
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    public static readonly black: Color;
    public static readonly blue: Color;
    public static readonly clear: Color;
    public static readonly cyan: Color;
    public static readonly gray: Color;
    public static readonly green: Color;
    public static readonly grey: Color;
    public static readonly magenta: Color;
    public static readonly red: Color;
    public static readonly white: Color;
    public static readonly yellow: Color;
}

export declare class Mathf {
    public static readonly PI: number;
    public static readonly deg2Rad: number;
    public static readonly rad2Deg: number;

    public static abs(f: number): number;
    public static clamp(value: number, min: number, max: number): number;
    public static clamp01(value: number): number;
    public static lerp(a: number, b: number, t: number): number;
    public static max(a: number, b: number): number;
    public static min(a: number, b: number): number;
    public static sin(f: number): number;
    public static cos(f: number): number;
    public static tan(f: number): number;
    public static asin(f: number): number;
    public static acos(f: number): number;
    public static atan(f: number): number;
    public static atan2(y: number, x: number): number;
    public static sqrt(f: number): number;
    public static pow(f: number, p: number): number;
    public static floor(f: number): number;
    public static ceil(f: number): number;
    public static round(f: number): number;
}

export declare class Time {
    public static readonly deltaTime: number;
    public static readonly fixedDeltaTime: number;
    public static readonly time: number;
    public static readonly realtimeSinceStartup: number;
}

export declare class Input {
    public static getKey(name: string): boolean;
    public static getKeyDown(name: string): boolean;
    public static getKeyUp(name: string): boolean;
    public static getMouseButton(button: number): boolean;
    public static getMouseButtonDown(button: number): boolean;
    public static getMouseButtonUp(button: number): boolean;
    public static getAxis(axisName: string): number;
    public static getAxisRaw(axisName: string): number;
}

export declare class VRCPlayerApi {
    public id: number;
    public displayName: string;
    public isMaster: boolean;
    public isLocal: boolean;
    public isInstanceOwner: boolean;

    public getPosition(): Vector3;
    public getRotation(): Quaternion;
    public getVelocity(): Vector3;
    public isUserInVR(): boolean;
    public isPlayerGrounded(): boolean;
    public getPlayerTag(tagName: string): string;
    public setPlayerTag(tagName: string, value: string): void;
    public clearPlayerTags(): void;
    
    public teleportTo(position: Vector3, rotation: Quaternion): void;
    public setVelocity(velocity: Vector3): void;
}

export declare class Networking {
    public static readonly localPlayer: VRCPlayerApi;
    public static isMaster: boolean;
    public static getOwner(obj: GameObject): VRCPlayerApi;
    public static setOwner(player: VRCPlayerApi, obj: GameObject): void;
    public static isOwner(obj: GameObject): boolean;
    public static isOwner(player: VRCPlayerApi, obj: GameObject): boolean;
    public static getServerTimeInMilliseconds(): number;
    public static getServerTimeInSeconds(): number;
}

export declare class VRCStation extends UdonSharpBehaviour {
    public canUseStationFromStation: boolean;
    public immobilize: boolean;
    public stationEnterPlayerLocation: Transform;
    public stationExitPlayerLocation: Transform;

    public useStation(player: VRCPlayerApi): void;
    public exitStation(player: VRCPlayerApi): void;
}

export declare class UdonSharpBehaviour {
    public gameObject: GameObject;
    public transform: Transform;

    public interaction(): void;
    public onPickup(): void;
    public onDrop(): void;
    public onPickupUseDown(): void;
    public onPickupUseUp(): void;
    
    public onPlayerJoined(player: VRCPlayerApi): void;
    public onPlayerLeft(player: VRCPlayerApi): void;
    
    public onStationEntered(player: VRCPlayerApi): void;
    public onStationExited(player: VRCPlayerApi): void;
    
    public onOwnershipTransferred(player: VRCPlayerApi): void;
    
    public requestSerialization(): void;
    public onDeserialization(): void;
    public onPreSerialization(): void;
    public onPostSerialization(): void;
}

export declare function UdonSynced(target?: any): any;

export declare function DebugLog(message: any): void;
