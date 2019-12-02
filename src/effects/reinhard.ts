

import code from '../glsl/templates/tm_reinhard.frag'
import BaseEffect from './base-effect';
import Program from 'nanogl/program';

export default class Reinhard extends BaseEffect {

  _code: string;

  constructor(amount: number) {
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
