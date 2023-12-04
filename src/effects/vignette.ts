import BaseEffect from "./base-effect";

import preCode from '../glsl/templates/vignette_pre.frag'
import code from '../glsl/templates/vignette.frag'
import Program from "nanogl/program";

/**
 * This class implements a vignette effect.
 */
export default class Vignette extends BaseEffect {

  /** The vignette color */
  color: ArrayLike<number>;

  /** How rounded the vignette is */
  curve: number;
  /** The vignette strength */
  strength: number;

  /**
   * The shader pre-code (uniforms, attributes, functions, etc.)
   * for this effect
   */
  private _preCode: string;
  /** The shader code for this effect */
  private _code: string;

  /**
   * @param {ArrayLike<number>} color The vignette color
   * @param {number} strength The vignette strength
   * @param {number} curve How rounded the vignette is (between `0` & `1`)
   */
  constructor(color : ArrayLike<number>, strength : number, curve : number ) {

    super()

    this.color = color;
    this.curve = curve;
    this.strength = strength;

    this._preCode = preCode();
    this._code = code();
  }

  genCode(precode: string[], code: string[]) {
    precode.push(this._preCode);
    code.push(this._code);
  }


  setupProgram(prg : Program) {
    const c = this.color;
    const s = this.strength;
    const bw = this.post!.renderWidth;
    const bh = this.post!.renderHeight;

    const max = Math.max(bw, bh);

    prg.uVignetteAspect(
      bw / max,
      bh / max,
      0.5 * bw / max,
      0.5 * bh / max
    );

    prg.uVignette(
      2.0 * (1.0 - c[0]) * s,
      2.0 * (1.0 - c[1]) * s,
      2.0 * (1.0 - c[2]) * s,
      this.curve
    );



  }


  init(): void {}
  release(): void {}
  preRender(): void {}
  resize(w: number, h: number): void {}

}
