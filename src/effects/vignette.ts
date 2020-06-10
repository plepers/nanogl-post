import BaseEffect from "./base-effect";

import preCode from '../glsl/templates/vignette_pre.frag'
import code from '../glsl/templates/vignette.frag'
import Program from "nanogl/program";


export default class Vignette extends BaseEffect {

  
  color: ArrayLike<number>;

  curve: number;
  strength: number;

  private _preCode: string;
  private _code: string;

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
