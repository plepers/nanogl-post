import code from '../glsl/templates/gamma_correction.frag';
import BaseEffect from './base-effect';
export default class GammaCorrection extends BaseEffect {
    constructor(gamma) {
        super();
        this._code = code({ invGamma: 1.0 / gamma });
    }
    genCode(precode, code) {
        code.push(this._code);
    }
    init() { }
    release() { }
    preRender() { }
    setupProgram(prg) { }
    resize(w, h) { }
}
