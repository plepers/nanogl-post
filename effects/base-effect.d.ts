import Post from "../post";
import Program from "nanogl/program";
export declare enum EffectDependency {
    NONE = 0,
    DEPTH = 2,
    LINEAR = 4
}
export default abstract class BaseEffect {
    _flags: EffectDependency;
    post: Post | null;
    constructor();
    _init(post: Post): void;
    abstract init(): void;
    abstract release(): void;
    abstract preRender(): void;
    abstract genCode(precode: string[], code: string[]): void;
    abstract setupProgram(prg: Program): void;
    abstract resize(w: number, h: number): void;
}
