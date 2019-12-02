import BaseEffect from "./base-effect";
import Program from "nanogl/program";
export default class Saturation extends BaseEffect {
    tint: number[];
    amount: number;
    private _preCode;
    private _code;
    constructor(amount: number);
    genCode(precode: string[], code: string[]): void;
    setupProgram(prg: Program): void;
    init(): void;
    release(): void;
    preRender(): void;
    resize(w: number, h: number): void;
}
