import Texture from 'nanogl/texture';
import Program from 'nanogl/program';
import Fbo from 'nanogl/fbo';
import BaseEffect from './base-effect';
export default class Bloom extends BaseEffect {
    color: ArrayLike<number>;
    size: number;
    bloomTextures: Texture[];
    bloomTargets: Fbo[];
    bloomSamples: number;
    bloomKernel: Float32Array | null;
    _preCode: string;
    _code: string;
    prcPrg: Program | null;
    constructor(color: ArrayLike<number>, size: number);
    init(): void;
    resize(w: number, h: number): void;
    release(): void;
    genCode(precode: string[], code: string[]): void;
    preRender(): void;
    setupProgram(prg: Program): void;
    computeKernel(): void;
    transposeKernel(): void;
}
