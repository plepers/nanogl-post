import BaseEffect from "./base-effect";

import preCode from '../glsl/templates/sharpen_pre.frag'
import code    from '../glsl/templates/sharpen.frag'
import Program from "nanogl/program";

export default class Sharpen extends BaseEffect {

  
  amount: number;
  limit: number;
  _preCode: string;
  _code: string;

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
    var a  = this.amount,
        l  = this.limit,
        bw = this.post!.bufferWidth ,
        bh = this.post!.bufferHeight;

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
