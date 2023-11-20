
import Program from 'nanogl/program';
import code from '../glsl/templates/gamma_correction.frag'
import BaseEffect from './base-effect';

/**
 * This class implements gamma correction.
 *
 * **Note :** Gamma correction may be applied directly within *nanogl-pbr*'s shader
 */
export default class GammaCorrection extends BaseEffect {
  /** The shader code for this effect */
  _code: string;

  constructor( gamma : number ){
    super()
    this._code    = code( {invGamma: 1.0/gamma});
  }


  genCode( precode: string[], code: string[] ) {
    code.   push( this._code )
  }


  init(): void {}
  release(): void {}
  preRender(): void {}
  setupProgram( prg: Program ): void {}
  resize(w: number, h: number): void {}

}
