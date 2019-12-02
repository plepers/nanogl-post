import BaseEffect from "./base-effect";
import preCode from '../glsl/templates/vignette_pre.frag';
import code from '../glsl/templates/vignette.frag';
export default class Vignette extends BaseEffect {
    constructor(color, strength, curve) {
        super();
        this.color = color;
        this.curve = curve;
        this.strength = strength;
        this._preCode = preCode();
        this._code = code();
    }
    genCode(precode, code) {
        precode.push(this._preCode);
        code.push(this._code);
    }
    setupProgram(prg) {
        var c = this.color, s = this.strength, bw = this.post.renderWidth, bh = this.post.renderHeight;
        var max = Math.max(bw, bh);
        prg.uVignetteAspect(bw / max, bh / max, 0.5 * bw / max, 0.5 * bh / max);
        prg.uVignette(2.0 * (1.0 - c[0]) * s, 2.0 * (1.0 - c[1]) * s, 2.0 * (1.0 - c[2]) * s, this.curve);
    }
    init() { }
    release() { }
    preRender() { }
    resize(w, h) { }
}
