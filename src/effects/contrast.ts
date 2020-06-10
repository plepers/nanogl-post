
import BaseEffect from './base-effect'


import preCode from '../glsl/templates/contrast_pre.frag'
import code from '../glsl/templates/contrast.frag'
import Program from 'nanogl/program';


export default class Contrast extends BaseEffect {

  contrast  : number;
  brightness: number;
  bias      : number;
  
  contrastTint  : number[];
  brightnessTint: number[];
  biasTint      : number[];
  
  _preCode: string;
  _code: string;

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