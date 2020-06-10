import Program from 'nanogl/program';
import Camera from 'nanogl-camera';
import Fbo from 'nanogl/fbo';
import Sampler from 'nanogl/sampler';
import BaseEffect from './base-effect';
import { vec3 } from 'gl-matrix';
export default class Dof extends BaseEffect {
    camera: Camera;
    _available: boolean;
    focus: number;
    focusRange: number;
    far: number;
    near: number;
    farBlur: number;
    d0: number;
    d1: number;
    blurSamples: number;
    blurKernel: Float32Array;
    prgDS: Program;
    prgBlur: Program;
    prgCoc: Program;
    prgMed: Program;
    _preCode: string;
    _code: string;
    fboDS: Fbo;
    fboBlurV: Fbo;
    fboBlurH: Fbo;
    fboCoc: Fbo;
    fboMed: Fbo;
    depthSampler: Sampler | null;
    constructor(camera: Camera);
    genFbo(): Fbo;
    init(): void;
    resize(): void;
    release(): void;
    genCode(precode: string[], code: string[]): void;
    getNearEq(): Float32Array;
    getFarEq(): vec3;
    preRender(): void;
    setupProgram(prg: Program): void;
    computeKernel(h: boolean): void;
}
