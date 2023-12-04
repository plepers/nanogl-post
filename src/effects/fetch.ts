
import Program from 'nanogl/program';
import BaseEffect from './base-effect'

import code from '../glsl/templates/fetch.frag'

/**
 * This class implements a fetch effect.
 *
 * It is used to set the current color as the rendered scene texture.
 * You can use this before applying effects that modify the current color
 * such as `Sharpen` or `Saturation`.
 */
export default class Fetch extends BaseEffect {

  /** The shader code for this effect */
  _code: string;

  constructor() {
    super();
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
