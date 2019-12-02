
import Program from 'nanogl/program';
import BaseEffect from './base-effect'

import code from '../glsl/templates/fetch.frag'

export default class Fetch extends BaseEffect {

  
  _code: string;
  
  constructor() {
    super();
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
