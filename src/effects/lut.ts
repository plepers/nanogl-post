import BaseEffect from "./base-effect";
import Texture from "nanogl/texture";

import preCode from '../glsl/templates/LUT_pre.frag'
import code from '../glsl/templates/LUT.frag'
import Program from "nanogl/program";


export default class LUT extends BaseEffect {
  

  private _lut: ArrayLike<number>;
  private _lutTex: Texture | null;

  private _invalidTex: boolean;
  
  private _preCode: string;
  private _code: string;

  constructor(lut: ArrayLike<number>) {
    super()

    this._lut = lut;

    this._lutTex = null;
    this._invalidTex = true;

    this._preCode = preCode();
    this._code = code();
  }




  init() {
    const gl = this.post!.gl;
    this._lutTex = new Texture(gl, gl.RGB);
  }


  release() {
    if( this._lutTex !== null )
      this._lutTex.dispose()
    this._lutTex = null;
  }


  genCode(precode: string[], code: string[]) {
    precode.push(this._preCode)
    code.push(this._code)
  }


  _updateTex() {

    this._lutTex!.fromData(
      this._lut.length / 3 | 0,
      1,
      new Uint8Array(this._lut)
    );
    this._invalidTex = false;

  }


  setupProgram(prg : Program ) {

    if (this._invalidTex) {
      this._updateTex();
    }

    prg.tLUT(this._lutTex);

  }

  preRender(): void {}
  resize(w: number, h: number): void {}

}