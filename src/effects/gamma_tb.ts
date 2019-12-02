
import code from '../glsl/templates/gamma_tb.frag'
import BaseEffect from './base-effect';
import Program from 'nanogl/program';

export default class GammaTB extends BaseEffect {

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
