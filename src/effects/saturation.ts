import BaseEffect from "./base-effect";

import preCode from '../glsl/templates/saturation_pre.frag'
import code from '../glsl/templates/saturation.frag'
import Program from "nanogl/program";

/**
 * This class implements a saturation effect.
 */
export default class Saturation extends BaseEffect {
  /**
   * The tint color for the saturation
   * @defaultValue [1, 1, 1]
   */
  tint: number[];
  /** The saturation amount */
  amount: number;

  /**
   * The shader pre-code (uniforms, attributes, functions, etc.)
   * for this effect
   */
  private _preCode: string;
  /** The shader code for this effect */
  private _code: string;

  /**
   * @param {number} amount The saturation amount
   */
  constructor(amount: number) {
    super()

    this.tint = [1, 1, 1];
    this.amount = amount;

    this._preCode = preCode();
    this._code = code();
  }


  genCode(precode: string[], code: string[]) {
    precode.push(this._preCode)
    code.push(this._code)
  }


  setupProgram(prg : Program ) {
    const a    = this.amount;
    const tint = this.tint;

    prg.uSaturation(
      tint[0] * a,
      tint[1] * a,
      tint[2] * a
    );

  }

  init(): void {}
  release(): void {}
  preRender(): void {}
  resize(w: number, h: number): void {}

}
