import BaseEffect from "./base-effect";

import perCode from '../glsl/templates/grain_pre.frag'
import code from '../glsl/templates/grain.frag'
import Texture from "nanogl/texture";
import Program from "nanogl/program";

const G_SIZE = 128;


let _NoiseData : Uint8Array;

function getNoiseData() {

  if (_NoiseData === undefined) {
    var numPix = G_SIZE * G_SIZE;
    _NoiseData = new Uint8Array(numPix);
    for (var i = 0; numPix > i; i++) {
      _NoiseData[i] = 128 * (Math.random() + Math.random());
    }
  }

  return _NoiseData;
}

/**
 * This class implements a grain effect.
 */
export default class Grain extends BaseEffect {

  /** The amount of grain */
  amount: number;
  /** The sharpness of the grain */
  sharpness: number;


  /** The noise texture used for the grain */
  private _noiseTex: Texture | null;
  /**
   * The shader pre-code (uniforms, attributes, functions, etc.)
   * for this effect
   */
  private _preCode: string;
  /** The shader code for this effect */
  private _code: string;

  /**
   * @param amount The amount value
   * @param sharpness The sharpness value
   */
  constructor(amount: number, sharpness: number) {
    super();

    this.amount = amount;
    this.sharpness = sharpness;

    this._noiseTex = null;

    this._preCode = perCode()
    this._code =    code();
  }





  genCode(precode: string[], code: string[]) {
    precode.push(this._preCode)
    code.push(this._code)
  }


  init() {
    var gl = this.post!.gl;
    this._noiseTex = new Texture(gl, gl.LUMINANCE);
    this._noiseTex.fromData(G_SIZE, G_SIZE, getNoiseData());
  }


  release() {
    if( this._noiseTex !== null )
      this._noiseTex.dispose()
    this._noiseTex = null;
  }


  setupProgram(prg : Program ) {

    const a = this.amount;


    const ig = 1 / G_SIZE,
          bw = this.post!.bufferWidth,
          bh = this.post!.bufferHeight,
          ms = 1 - this.sharpness;

    prg.uGrainCoord(
      ig * bw,
      ig * bh,
      0.5 * ms * ig,
      0.5 * ms * ig
    );

    prg.uGrainScaleBias(
      2 * a, -a
    );

    prg.tGrain(this._noiseTex);

  }

  preRender(): void {}
  resize(w: number, h: number): void {}


}