import code from '../glsl/templates/gamma_tb.frag';
import BaseEffect from './base-effect';
export default class GammaTB extends BaseEffect {
    constructor() {
        super();
        this._code = code();
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
