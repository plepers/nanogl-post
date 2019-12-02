import code from '../glsl/templates/tm_reinhard.frag';
import BaseEffect from './base-effect';
export default class Reinhard extends BaseEffect {
    constructor(amount) {
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
