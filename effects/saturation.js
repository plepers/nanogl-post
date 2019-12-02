import BaseEffect from "./base-effect";
import preCode from '../glsl/templates/saturation_pre.frag';
import code from '../glsl/templates/saturation.frag';
export default class Saturation extends BaseEffect {
    constructor(amount) {
        super();
        this.tint = [1, 1, 1];
        this.amount = amount;
        this._preCode = preCode();
        this._code = code();
    }
    genCode(precode, code) {
        precode.push(this._preCode);
        code.push(this._code);
    }
    setupProgram(prg) {
        var a = this.amount, tint = this.tint;
        prg.uSaturation(tint[0] * a, tint[1] * a, tint[2] * a);
    }
    init() { }
    release() { }
    preRender() { }
    resize(w, h) { }
}
