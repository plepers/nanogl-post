import BaseEffect from "./base-effect";

import code from '../glsl/templates/tm_hejl.frag'
import Program from "nanogl/program";

/**
 * This class implements Hejl tone mapping.
 */
export default class Hejl extends BaseEffect {
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