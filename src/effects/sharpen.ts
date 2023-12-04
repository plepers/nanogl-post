import BaseEffect from "./base-effect";

import preCode from '../glsl/templates/sharpen_pre.frag'
import code    from '../glsl/templates/sharpen.frag'
import Program from "nanogl/program";

/**
 * This class implements a sharpness effect.
 */
export default class Sharpen extends BaseEffect {

  /** The sharpness amount */
  amount: number;
  /** The sharpness limit */
  limit: number;
  /**
   * The shader pre-code (uniforms, attributes, functions, etc.)
   * for this effect
   */
  _preCode: string;
  /** The shader code for this effect */
  _code: string;

  /**
   * @param {number} amount The sharpness amount
   * @param {number} limit The sharpness limit
   */
  constructor( amount : number, limit : number ){
    super()

    this.amount = amount;
    this.limit  = limit;

    this._preCode = preCode();
    this._code    = code();
  }


  genCode( precode: string[], code: string[] ) {
    precode.push( this._preCode )
    code.   push( this._code )
  }


  setupProgram( prg : Program ) {
    const a  = this.amount;
    const l  = this.limit;
    const bw = this.post!.bufferWidth ;
    const bh = this.post!.bufferHeight;

    // not needed in glsl300
    if( prg.uSharpenKernel )
      prg.uSharpenKernel( 1/bw, 0, 0, 1/bh );

    prg.uSharpness(
        a,
        a / 4.0,
        l
    );

  }


  init(): void {}
  release(): void {}
  preRender(): void {}
  resize(w: number, h: number): void {}

}
