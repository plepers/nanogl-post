import Program from 'nanogl/program';
import BaseEffect from './base-effect';
export default class Fetch extends BaseEffect {
    _code: string;
    constructor();
    genCode(precode: string[], code: string[]): void;
    init(): void;
    release(): void;
    preRender(): void;
    setupProgram(prg: Program): void;
    resize(w: number, h: number): void;
}
