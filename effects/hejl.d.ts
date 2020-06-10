import BaseEffect from "./base-effect";
import Program from "nanogl/program";
export default class Hejl extends BaseEffect {
    _code: string;
    constructor(amount: number);
    genCode(precode: string[], code: string[]): void;
    init(): void;
    release(): void;
    preRender(): void;
    setupProgram(prg: Program): void;
    resize(w: number, h: number): void;
}
