import BaseEffect from "./base-effect";
import preCode from '../glsl/templates/sharpen_pre.frag';
import code from '../glsl/templates/sharpen.frag';
export default class Sharpen extends BaseEffect {
    constructor(amount, limit) {
        super();
        this.amount = amount;
        this.limit = limit;
        this._preCode = preCode();
        this._code = code();
    }
    genCode(precode, code) {
        precode.push(this._preCode);
        code.push(this._code);
    }
    setupProgram(prg) {
        const a = this.amount;
        const l = this.limit;
        const bw = this.post.bufferWidth;
        const bh = this.post.bufferHeight;
        if (prg.uSharpenKernel)
            prg.uSharpenKernel(1 / bw, 0, 0, 1 / bh);
        prg.uSharpness(a, a / 4.0, l);
    }
    init() { }
    release() { }
    preRender() { }
    resize(w, h) { }
}
