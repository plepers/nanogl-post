import BaseEffect from './base-effect';
import code from '../glsl/templates/fetch.frag';
export default class Fetch extends BaseEffect {
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
