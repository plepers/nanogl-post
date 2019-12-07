import BaseEffect from './base-effect';
import Program from 'nanogl/program';
export default class GammaTB extends BaseEffect {
    _code: string;
    constructor();
    genCode(precode: string[], code: string[]): void;
    init(): void;
    release(): void;
    preRender(): void;
    setupProgram(prg: Program): void;
    resize(w: number, h: number): void;
}
