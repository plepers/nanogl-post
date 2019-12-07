import BaseEffect from "./base-effect";
import Program from "nanogl/program";
export default class Grain extends BaseEffect {
    amount: number;
    sharpness: number;
    private _noiseTex;
    private _preCode;
    private _code;
    constructor(amount: number, sharpness: number);
    genCode(precode: string[], code: string[]): void;
    init(): void;
    release(): void;
    setupProgram(prg: Program): void;
    preRender(): void;
    resize(w: number, h: number): void;
}
