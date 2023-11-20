

import code from '../glsl/templates/tm_reinhard.frag'
import BaseEffect from './base-effect';
import Program from 'nanogl/program';

/**
 * This class implements Reinhard tone mapping.
 */
export default class Reinhard extends BaseEffect {
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
