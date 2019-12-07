import BaseEffect from "./base-effect";
import code from '../glsl/templates/tm_hejl.frag';
export default class Hejl extends BaseEffect {
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
