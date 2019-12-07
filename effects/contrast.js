import BaseEffect from './base-effect';
import preCode from '../glsl/templates/contrast_pre.frag';
import code from '../glsl/templates/contrast.frag';
export default class Contrast extends BaseEffect {
    constructor(contrast, brightness, bias) {
        super();
        this.contrast = contrast;
        this.brightness = brightness;
        this.bias = bias;
        this.contrastTint = [1, 1, 1];
        this.brightnessTint = [1, 1, 1];
        this.biasTint = [1, 1, 1];
        this._preCode = preCode();
        this._code = code();
    }
    genCode(precode, code) {
        precode.push(this._preCode);
        code.push(this._code);
    }
    setupProgram(prg) {
        const c = this.contrast, ct = this.contrastTint, b = this.brightness, bt = this.brightnessTint, bias = this.bias, biast = this.biasTint;
        prg.uContrastScale((ct[0] * c) * (bt[0] * b), (ct[1] * c) * (bt[1] * b), (ct[2] * c) * (bt[2] * b));
        prg.uContrastBias(((biast[0] * bias) * (-ct[0] * c + 1)) * (bt[0] * b), ((biast[1] * bias) * (-ct[1] * c + 1)) * (bt[1] * b), ((biast[2] * bias) * (-ct[2] * c + 1)) * (bt[2] * b));
    }
    init() { }
    release() { }
    preRender() { }
    resize(w, h) { }
}
