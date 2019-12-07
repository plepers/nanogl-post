import BaseEffect from './base-effect';
import Program from 'nanogl/program';
export default class Contrast extends BaseEffect {
    contrast: number;
    brightness: number;
    bias: number;
    contrastTint: number[];
    brightnessTint: number[];
    biasTint: number[];
    _preCode: string;
    _code: string;
    constructor(contrast: number, brightness: number, bias: number);
    genCode(precode: string[], code: string[]): void;
    setupProgram(prg: Program): void;
    init(): void;
    release(): void;
    preRender(): void;
    resize(w: number, h: number): void;
}
