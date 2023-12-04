
import BaseEffect from './base-effect'


import preCode from '../glsl/templates/contrast_pre.frag'
import code from '../glsl/templates/contrast.frag'
import Program from 'nanogl/program';

/**
 * This class implements a contrast effect.
 */
export default class Contrast extends BaseEffect {
  /** The contrast amount */
  contrast  : number;
  /** The brightness amount */
  brightness: number;
  /** The bias amount */
  bias      : number;

  /**
   * The tint color for the contrast
   * @defaultValue [1, 1, 1]
   */
  contrastTint  : number[];
  /**
   * The tint color for the brightness
   * @defaultValue [1, 1, 1]
   */
  brightnessTint: number[];
  /**
   * The tint color for the bias
   * @defaultValue [1, 1, 1]
   */
  biasTint      : number[];

  /**
   * The shader pre-code (uniforms, attributes, functions, etc.)
   * for this effect
   */
  _preCode: string;
  /** The shader code for this effect */
  _code: string;

  /**
   * @param contrast The contrast amount
   * @param brightness The brightness amount
   * @param bias The bias amount
   */
  constructor(contrast : number, brightness : number, bias : number ) {
    super()

    this.contrast = contrast;
    this.brightness = brightness;
    this.bias = bias;

    this.contrastTint = [1, 1, 1];
    this.brightnessTint = [1, 1, 1];
    this.biasTint = [1, 1, 1];


    this._preCode = preCode();
    this._code = code();
  }





  genCode(precode: string[], code: string[]) {
    precode.push(this._preCode)
    code.push(this._code)
  }


  setupProgram(prg :Program ) {
    const c     = this.contrast      ,
          ct    = this.contrastTint  ,
          b     = this.brightness    ,
          bt    = this.brightnessTint,
          bias  = this.bias          ,
          biast = this.biasTint      ;


    prg.uContrastScale(
      (ct[0] * c) * (bt[0] * b),
      (ct[1] * c) * (bt[1] * b),
      (ct[2] * c) * (bt[2] * b)
    );

    prg.uContrastBias(
      ((biast[0] * bias) * (-ct[0] * c + 1)) * (bt[0] * b),
      ((biast[1] * bias) * (-ct[1] * c + 1)) * (bt[1] * b),
      ((biast[2] * bias) * (-ct[2] * c + 1)) * (bt[2] * b)
    );

  }


  init(): void {}
  release(): void {}
  preRender(): void {}
  resize(w: number, h: number): void {}


}