
import code from '../glsl/templates/gamma_tb.frag'
import BaseEffect from './base-effect';
import Program from 'nanogl/program';

/**
 * This class implements an alternative gamma correction, using the gamma curve from Marmoset Toolbag.
 *
 * **Note :** Gamma correction may be applied directly within *nanogl-pbr*'s shader
 */
export default class GammaTB extends BaseEffect {
  /** The shader code for this effect */
  _code: string;

  constructor() {
    super()
    this._code = code();
  }


  genCode(precode: string[], code: string[]) {
    code.push(this._code)
  }


  init(): void {}
  release(): void {}
  preRender(): void {}
  setupProgram( prg: Program ): void {}
  resize(w: number, h: number): void {}

}
