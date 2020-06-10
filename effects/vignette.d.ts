import BaseEffect from "./base-effect";
import Program from "nanogl/program";
export default class Vignette extends BaseEffect {
    color: ArrayLike<number>;
    curve: number;
    strength: number;
    private _preCode;
    private _code;
    constructor(color: ArrayLike<number>, strength: number, curve: number);
    genCode(precode: string[], code: string[]): void;
    setupProgram(prg: Program): void;
    init(): void;
    release(): void;
    preRender(): void;
    resize(w: number, h: number): void;
}
