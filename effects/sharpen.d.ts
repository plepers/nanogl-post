import BaseEffect from "./base-effect";
import Program from "nanogl/program";
export default class Sharpen extends BaseEffect {
    amount: number;
    limit: number;
    _preCode: string;
    _code: string;
    constructor(amount: number, limit: number);
    genCode(precode: string[], code: string[]): void;
    setupProgram(prg: Program): void;
    init(): void;
    release(): void;
    preRender(): void;
    resize(w: number, h: number): void;
}
