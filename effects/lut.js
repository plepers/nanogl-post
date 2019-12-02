import BaseEffect from "./base-effect";
import Texture from "nanogl/texture";
import preCode from '../glsl/templates/LUT_pre.frag';
import code from '../glsl/templates/LUT.frag';
export default class LUT extends BaseEffect {
    constructor(lut) {
        super();
        this._lut = lut;
        this._lutTex = null;
        this._invalidTex = true;
        this._preCode = preCode();
        this._code = code();
    }
    init() {
        var gl = this.post.gl;
        this._lutTex = new Texture(gl, gl.RGB);
    }
    release() {
        if (this._lutTex !== null)
            this._lutTex.dispose();
        this._lutTex = null;
    }
    genCode(precode, code) {
        precode.push(this._preCode);
        code.push(this._code);
    }
    _updateTex() {
        this._lutTex.fromData(this._lut.length / 3 | 0, 1, new Uint8Array(this._lut));
        this._invalidTex = false;
    }
    setupProgram(prg) {
        if (this._invalidTex) {
            this._updateTex();
        }
        prg.tLUT(this._lutTex);
    }
    preRender() { }
    resize(w, h) { }
}
