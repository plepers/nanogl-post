import BaseEffect from "./base-effect";
import Program from "nanogl/program";
export default class LUT extends BaseEffect {
    private _lut;
    private _lutTex;
    private _invalidTex;
    private _preCode;
    private _code;
    constructor(lut: ArrayLike<number>);
    init(): void;
    release(): void;
    genCode(precode: string[], code: string[]): void;
    _updateTex(): void;
    setupProgram(prg: Program): void;
    preRender(): void;
    resize(w: number, h: number): void;
}
