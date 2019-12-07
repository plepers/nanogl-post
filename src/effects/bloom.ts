

import Texture from 'nanogl/texture'
import Program from 'nanogl/program'
import Fbo from 'nanogl/fbo'
import PixelFormats from 'nanogl-pf'
import BaseEffect from './base-effect'


import prc_frag from '../glsl/templates/bloom_process.frag'
import prc_vert from '../glsl/templates/main.vert'


import bloomPreCode from '../glsl/templates/bloom_pre.frag'
import bloomCode    from '../glsl/templates/bloom.frag'


const TEX_SIZE = 256;

export default class Bloom extends BaseEffect {



  color: ArrayLike<number>
  size: number
  bloomTextures: Texture[]
  bloomTargets: Fbo[]
  
  bloomSamples: number
  bloomKernel: Float32Array|null

  _preCode: string
  _code: string
  prcPrg: Program | null

  constructor(color : ArrayLike<number>, size : number ) {
    super()

    this.color = color
    this.size = size


    this.bloomTextures = [];
    this.bloomTargets = [];
    this.bloomSamples = 0;
    this.bloomKernel = null;

    this.prcPrg = null;

    this._preCode = bloomPreCode();
    this._code    = bloomCode();
  }





  init() : void {
    const gl = this.post!.gl;

    const maxFuniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);


    const pf = PixelFormats.getInstance(gl);

    const configs = [
      pf.RGB16F,
      pf.RGBA16F,
      pf.RGB32F,
      pf.RGBA32F,
      pf.RGB8
    ];

    const cfg = pf.getRenderableFormat(configs)!;

    for (var i = 0; i < 2; ++i) {

      this.bloomTargets[i] = new Fbo(gl)
      this.bloomTargets[i].bind();
      this.bloomTargets[i].attachColor(cfg.format, cfg.type, cfg.internal);

      this.bloomTargets[i].resize(TEX_SIZE, TEX_SIZE);

      var color = this.bloomTargets[i].getColor(0) as Texture;
      color.setFilter(true, false, false);
      color.clamp();

    }

    for (this.bloomSamples = 64; this.bloomSamples + 16 >= maxFuniforms;) {
      this.bloomSamples /= 2;
    }

    this.bloomKernel = new Float32Array(this.bloomSamples * 4);


    var defs = '\n';
    defs += 'precision highp float;\n';
    defs += `#define BLOOM_SAMPLES ${this.bloomSamples} \n`;

    this.prcPrg = new Program(gl);
    this.prcPrg.compile(prc_vert(), prc_frag(), defs)

  }

  resize(w: number, h: number): void {

  }



  release() {
    if( this.prcPrg !== null )
      this.prcPrg.dispose()

    this.prcPrg = null;
    for (var i = 0; i < 2; ++i) {
      this.bloomTargets[i].dispose();
    }

    this.bloomTargets = [];

  }



  genCode(precode : string[], code : string[]) {
    precode.push(this._preCode)
    code.push(this._code)
  }



  preRender() {
    const prg = this.prcPrg!;
    const post = this.post!;

    this.computeKernel();

    this.bloomTargets[0].bind();
    this.bloomTargets[0].defaultViewport();
    this.bloomTargets[0].clear();
    prg.use();
    prg.tInput(post.mainColor);
    prg.uKernel(this.bloomKernel);
    post.fillScreen(prg);

    this.transposeKernel();

    this.bloomTargets[1].bind();
    this.bloomTargets[1].defaultViewport();
    this.bloomTargets[1].clear();
    prg.tInput(this.bloomTargets[0].getColor(0) as Texture);
    prg.uKernel(this.bloomKernel);
    post.fillScreen(prg, true);

  }


  setupProgram(prg:Program) {

    const c = this.color;

    prg.uBloomColor(
      c[0],
      c[1],
      c[2]
    );

    prg.tBloom(this.bloomTargets[1].getColor(0) as Texture);

  }





  computeKernel() {

    const kernel = this.bloomKernel!;

    const SQRT_PI = Math.sqrt(Math.PI);

    for (var c = 0, sample = 0; sample < this.bloomSamples; ++sample) {
      var i = sample * 4;
      var delta = 2 * sample / (this.bloomSamples - 1) - 1;
      var density = 4.0 * delta;

      // normal_dens
      density = Math.exp(- density * density / 2.0) / SQRT_PI;
      c += density;

      kernel[i + 0] = delta * this.size;
      kernel[i + 1] = 0;
      kernel[i + 2] = density;
      kernel[i + 3] = 0;
    }

    for (sample = 0; sample < this.bloomSamples; ++sample) {
      kernel[4 * sample + 2] /= c;
    }
  }



  transposeKernel() {

    const kernel = this.bloomKernel!;

    const ratio = this.post!.renderWidth / this.post!.renderHeight;

    for (var sample = 0; sample < this.bloomSamples; ++sample) {
      var i = sample << 2;
      kernel[i + 1] = kernel[i] * ratio;
      kernel[i] = 0;
    }

  }

}