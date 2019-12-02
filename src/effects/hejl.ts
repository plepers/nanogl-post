import BaseEffect from "./base-effect";

import code from '../glsl/templates/tm_hejl.frag'
import Program from "nanogl/program";

export default class Hejl extends BaseEffect {

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