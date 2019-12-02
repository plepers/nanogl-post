import BaseEffect from "./base-effect";

import preCode from '../glsl/templates/saturation_pre.frag'
import code from '../glsl/templates/saturation.frag'
import Program from "nanogl/program";


export default class Saturation extends BaseEffect {
  
  tint: number[];
  amount: number;
  
  private _preCode: string;
  private _code: string;

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
    var a = this.amount,
      tint = this.tint;

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
