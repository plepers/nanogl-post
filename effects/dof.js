import Program from 'nanogl/program';
import Fbo from 'nanogl/fbo';
import Sampler from 'nanogl/sampler';
import BaseEffect, { EffectDependency } from './base-effect';
import ds_frag from '../glsl/templates/dof_downsample.frag';
import ds_vert from '../glsl/templates/dof_downsample.vert';
import blur_frag from '../glsl/templates/dof_blur.frag';
import blur_vert from '../glsl/templates/main.vert';
import coc_frag from '../glsl/templates/dof_near_coc.frag';
import coc_vert from '../glsl/templates/dof_near_coc.vert';
import b3x3_frag from '../glsl/templates/dof_blur_3x3.frag';
import b3x3_vert from '../glsl/templates/dof_blur_3x3.vert';
import preCode from '../glsl/templates/dof_pre.frag';
import code from '../glsl/templates/dof.frag';
import { vec3 } from 'gl-matrix';
import { isWebgl2 } from 'nanogl/types';
const V2 = new Float32Array(2);
const V3 = vec3.create();
const V3Z = vec3.create();
const DOWNSCALE = 4;
export default class Dof extends BaseEffect {
    constructor(camera) {
        super();
        this._flags = EffectDependency.DEPTH | EffectDependency.LINEAR;
        this.camera = camera;
        this._available = true;
        this.focus = 1.3;
        this.focusRange = 0;
        this.far = 4;
        this.near = 1;
        this.farBlur = .5;
        this.d0 = .2;
        this.d1 = .2;
        this.blurSamples = 2;
        this.blurKernel = new Float32Array((this.blurSamples * 2 + 1) * 3);
        this.fboDS = null;
        this.fboBlurV = null;
        this.fboBlurH = null;
        this.fboCoc = null;
        this.fboMed = null;
        this.prgDS = null;
        this.prgBlur = null;
        this.prgCoc = null;
        this.prgMed = null;
        this.depthSampler = null;
        this._preCode = preCode();
        this._code = code();
    }
    genFbo() {
        const gl = this.post.gl;
        const res = new Fbo(gl);
        res.bind();
        const color = res.attachColor(gl.RGBA).target;
        color.bind();
        color.setFilter(true, false, false);
        color.clamp();
        return res;
    }
    ;
    init() {
        const gl = this.post.gl;
        this._available = this.post.hasDepthTexture;
        if (!this._available) {
            return;
        }
        this.fboDS = this.genFbo();
        this.fboCoc = this.genFbo();
        this.fboMed = this.genFbo();
        this.fboBlurH = this.genFbo();
        this.fboBlurV = this.genFbo();
        this.prgDS = new Program(gl);
        this.prgDS.compile(ds_vert(), ds_frag());
        this.prgCoc = new Program(gl);
        this.prgCoc.compile(coc_vert(), coc_frag());
        this.prgMed = new Program(gl);
        this.prgMed.compile(b3x3_vert(), b3x3_frag());
        var defs = '\n';
        defs += 'precision highp float;\n';
        defs += "#define BLUR_SAMPLES " + (this.blurSamples * 2 + 1) + '\n';
        this.prgBlur = new Program(gl);
        this.prgBlur.compile(blur_vert(), blur_frag(), defs);
        if (isWebgl2(gl)) {
            this.depthSampler = new Sampler(gl);
            gl.samplerParameteri(this.depthSampler.id, gl.TEXTURE_COMPARE_MODE, gl.NONE);
        }
    }
    resize() {
        if (!this._available) {
            return;
        }
        var bw = this.post.bufferWidth / DOWNSCALE;
        var bh = this.post.bufferHeight / DOWNSCALE;
        if (bw > 1 && bh > 1) {
            this.fboDS.resize(bw, bh);
            this.fboCoc.resize(bw, bh);
            this.fboMed.resize(bw, bh);
            this.fboBlurH.resize(bw, bh);
            this.fboBlurV.resize(bw, bh);
        }
    }
    release() {
        if (!this._available) {
            return;
        }
        this.fboDS.dispose();
        this.prgDS.dispose();
        this.prgMed.dispose();
        this.fboDS.dispose();
        this.fboCoc.dispose();
        this.fboMed.dispose();
        this.fboBlurH.dispose();
        this.fboBlurV.dispose();
    }
    genCode(precode, code) {
        precode.push(this._preCode);
        code.push(this._code);
    }
    getNearEq() {
        var proj = this.camera.lens.getProjection();
        V3Z[2] = -this.focus + this.focusRange / 2.0;
        vec3.transformMat4(V3, V3Z, proj);
        var dMin = V3[2];
        V3Z[2] = -this.near;
        vec3.transformMat4(V3, V3Z, proj);
        var dMax = V3[2];
        V2[0] = 1.0 / (dMax - dMin);
        V2[1] = 1.0 - V2[0] * dMax;
        return V2;
    }
    ;
    getFarEq() {
        var proj = this.camera.lens.getProjection();
        V3Z[2] = -this.focus - this.focusRange / 2.0;
        vec3.transformMat4(V3, V3Z, proj);
        var dMin = V3[2];
        V3Z[2] = -this.far;
        vec3.transformMat4(V3, V3Z, proj);
        var dMax = V3[2];
        V3[0] = 1.0 / (dMax - dMin);
        V3[1] = 1.0 - V3[0] * dMax;
        V3[2] = this.farBlur;
        return V3;
    }
    ;
    preRender() {
        if (!this._available) {
            return;
        }
        var fbo, prg;
        const post = this.post;
        const gl = post.gl;
        gl.viewport(0, 0, post.renderWidth / DOWNSCALE, post.renderHeight / DOWNSCALE);
        prg = this.prgDS;
        fbo = this.fboDS;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
        fbo.clear();
        prg.use();
        post.mainColor.bind(0);
        prg.tInput(0);
        post.mainFbo.getDepth().bind(1);
        prg.tDepth(1);
        prg.uDofEq(this.getNearEq());
        prg.uInvTargetSize(1 / post.bufferWidth, 1 / post.bufferHeight);
        post.fillScreen(this.prgDS);
        prg = this.prgBlur;
        prg.use();
        this.computeKernel(true);
        fbo = this.fboBlurH;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
        fbo.clear();
        prg.tInput(this.fboDS.getColor(0));
        prg.uKernel(this.blurKernel);
        post.fillScreen(prg);
        this.computeKernel(false);
        fbo = this.fboBlurV;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
        fbo.clear();
        prg.tInput(this.fboBlurH.getColor(0));
        prg.uKernel(this.blurKernel);
        post.fillScreen(prg);
        prg = this.prgCoc;
        fbo = this.fboCoc;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
        fbo.clear();
        prg.use();
        prg.tDownsample(this.fboDS.getColor(0));
        prg.tBlurred(this.fboBlurV.getColor(0));
        post.fillScreen(prg);
        prg = this.prgMed;
        fbo = this.fboMed;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo);
        fbo.clear();
        prg.use();
        prg.tCoc(this.fboCoc.getColor(0));
        prg.uInvTargetSize(DOWNSCALE / post.bufferWidth, DOWNSCALE / post.bufferHeight);
        post.fillScreen(prg);
    }
    setupProgram(prg) {
        if (!this._available) {
            return;
        }
        prg.tDofMedBlur(this.fboMed.getColor(0));
        prg.tDofBlur(this.fboBlurV.getColor(0));
        prg.uDofInvTargetSize(1 / this.post.bufferWidth, 1 / this.post.bufferHeight);
        var d0, d1, d2;
        d0 = this.d0,
            d1 = this.d1,
            d2 = 1.0 - (d0 + d1);
        prg.uDofLerpScale(-1 / d0, -1 / d1, -1 / d2, 1 / d2);
        prg.uDofLerpBias(1, (1 - d2) / d1, 1 / d2, (d2 - 1) / d2);
        prg.uDofEqFar(this.getFarEq());
    }
    computeKernel(h) {
        var bw = this.post.bufferWidth / DOWNSCALE;
        var bh = this.post.bufferHeight / DOWNSCALE;
        var numSamples = this.blurSamples * 2 + 1;
        var bufferSize = h ? bw : bh;
        var offsetSize = h ? bh : bw;
        var halfOffset = .5 / bufferSize;
        var kernel = this.blurKernel;
        var SQRT_PI = Math.sqrt(Math.PI);
        var o1 = h ? 0 : 1;
        var o2 = h ? 1 : 0;
        for (var c = 0, sample = 0; sample < numSamples; ++sample) {
            var i = sample * 3;
            var delta = 2 * sample / (numSamples - 1) - 1;
            var density = 3.0 * delta;
            density = Math.exp(-density * density / 2.0);
            c += density;
            kernel[i + o1] = halfOffset + 2.0 * this.blurSamples * delta / bufferSize;
            kernel[i + o2] = ((c % 2 === 0) ? .5 : -.5) / offsetSize;
            kernel[i + 2] = density;
        }
        for (sample = 0; sample < numSamples; ++sample) {
            kernel[3 * sample + 2] /= c;
        }
    }
}
