import Program from 'nanogl/program';
import BaseEffect from './base-effect';
export default class GammaCorrection extends BaseEffect {
    _code: string;
    constructor(gamma: number);
    genCode(precode: string[], code: string[]): void;
    init(): void;
    release(): void;
    preRender(): void;
    setupProgram(prg: Program): void;
    resize(w: number, h: number): void;
}
