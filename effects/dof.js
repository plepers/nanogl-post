/*
 * Based on Earl Hammon GPU Gems 3 book
 * https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch28.html
 */


var Texture       = require( 'nanogl/texture' );
var Program       = require( 'nanogl/program' );
var Fbo           = require( 'nanogl/fbo' );
var Sampler       = require( 'nanogl/sampler' );
var GLArrayBuffer = require( 'nanogl/arraybuffer' );
var BaseEffect    = require( './base-effect' );
var vec3          = require( 'gl-matrix/src/gl-matrix/vec3')


var ds_frag   = require( '../glsl/templates/dof_downsample.frag' )();
var ds_vert   = require( '../glsl/templates/dof_downsample.vert'  )();

var blur_frag = require( '../glsl/templates/dof_blur.frag' )();
var blur_vert = require( '../glsl/templates/main.vert' )();

var coc_frag  = require( '../glsl/templates/dof_near_coc.frag' )();
var coc_vert  = require( '../glsl/templates/dof_near_coc.vert'  )();

var b3x3_frag = require( '../glsl/templates/dof_blur_3x3.frag' )();
var b3x3_vert = require( '../glsl/templates/dof_blur_3x3.vert'  )();


var V2  = new Float32Array(2);
var V3  = new Float32Array(3);
var V3Z = new Float32Array(3);


var DOWNSCALE = 4;

function Dof( camera ){
  BaseEffect.call( this );

  this._flags = BaseEffect.NEED_DEPTH | BaseEffect.NEED_LINEAR;

  this.camera = camera;

  this._available = true;

  this.focus = 1.3;
  this.focusRange = 0;
  this.far = 4
  this.near= 1

  this.d0 = .2
  this.d1 = .2


  this.blurSamples = 2;
  this.blurKernel  = new Float32Array( (this.blurSamples*2+1) * 3 );

  this.fboDS    = null;
  this.fboBlurV = null;
  this.fboBlurH = null;
  this.fboCoc   = null;
  this.fboMed   = null;

  this.prgDS    = null;
  this.prgBlur  = null;
  this.prgCoc   = null;
  this.prgMed   = null;

  this._preCode = require( '../glsl/templates/dof_pre.frag' )();
  this._code    = require( '../glsl/templates/dof.frag' )();


}


Dof.prototype = Object.create( BaseEffect.prototype );
Dof.prototype.constructor = Dof;



Dof.prototype.genFbo = function( precode, code ) {
  var gl = this.post.gl;
  var res = new Fbo( gl, {
    format  : gl.RGBA
  });
  res.color.setFilter( true, false, false );
  res.color.clamp();
  return res;
};


Dof.prototype.init = function( precode, code ) {
  var gl = this.post.gl;

  this._available = this.post.mainFbo.attachment.isDepthTexture();

  if( ! this._available ){
    return;
  }

  this.fboDS    = this.genFbo();
  this.fboCoc   = this.genFbo();
  this.fboMed   = this.genFbo();
  this.fboBlurH = this.genFbo();
  this.fboBlurV = this.genFbo();


  this.prgDS = new Program( gl );
  this.prgDS.compile( ds_vert, ds_frag );

  this.prgCoc = new Program( gl );
  this.prgCoc.compile( coc_vert, coc_frag );

  this.prgMed = new Program( gl );
  this.prgMed.compile( b3x3_vert, b3x3_frag );

  var defs = '\n';
  defs += 'precision highp float;\n';
  defs += "#define BLUR_SAMPLES " + (this.blurSamples*2+1)+'\n';

  this.prgBlur = new Program( gl );
  this.prgBlur.compile( blur_vert, blur_frag, defs );


  if( gl.TEXTURE_COMPARE_MODE ) {
    this.depthSampler = new Sampler( gl )
    gl.samplerParameteri( this.depthSampler.id, gl.TEXTURE_COMPARE_MODE, gl.NONE );
  }
  
}


Dof.prototype.resize = function() {
  if( ! this._available ){
    return;
  }

  var bw = this.post.bufferWidth  / DOWNSCALE;
  var bh = this.post.bufferHeight / DOWNSCALE;

  if( bw > 1 && bh > 1 ){
    this.fboDS   .resize( bw, bh );
    this.fboCoc  .resize( bw, bh );
    this.fboMed  .resize( bw, bh );
    this.fboBlurH.resize( bw, bh );
    this.fboBlurV.resize( bw, bh );
  }
}


Dof.prototype.release = function(  ) {
  if( ! this._available ){
    return;
  }

  this.fboDS    .dispose();
  this.prgDS    .dispose();
  this.prgMed   .dispose();

  this.fboDS    .dispose();
  this.fboCoc   .dispose();
  this.fboMed   .dispose();
  this.fboBlurH .dispose();
  this.fboBlurV .dispose();
}



Dof.prototype.genCode = function( precode, code ) {
  precode.push( this._preCode )
  code.   push( this._code )
}


Dof.prototype.getNearEq = function(){

  var proj = this.camera.lens.getProjection();

  V3Z[2] = - this.focus + this.focusRange/2.0;
  vec3.transformMat4( V3, V3Z, proj );
  var dMin = V3[2];

  V3Z[2] = - this.near;
  vec3.transformMat4( V3, V3Z, proj );
  var dMax = V3[2];

  V2[0] = 1.0/ (dMax-dMin);
  V2[1] = 1.0 - V2[0] * dMax;

  return V2;
};


Dof.prototype.getFarEq = function(){
  var proj = this.camera.lens.getProjection();

  V3Z[2] = - this.focus - this.focusRange/2.0;
  vec3.transformMat4( V3, V3Z, proj );
  var dMin = V3[2];

  V3Z[2] = - this.far;
  vec3.transformMat4( V3, V3Z, proj );
  var dMax = V3[2];

  V3[0] = 1.0/ (dMax-dMin);
  V3[1] = 1.0 - V3[0] * dMax;
  V3[2] = 1.0;

  return V3;
};




Dof.prototype.preRender = function() {
  if( ! this._available ){
    return;
  }

  var fbo, prg;
  var gl = this.post.gl;



  gl.viewport( 0, 0, this.post.renderWidth / DOWNSCALE, this.post.renderHeight / DOWNSCALE );


  //          DownSample
  // ===================

  prg = this.prgDS;
  fbo = this.fboDS;

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo );
  fbo.clear();
  prg.use();
  
  this.post.mainFbo.color.bind( 0 )
  prg.tInput( 0 );

  this.post.mainFbo.attachment.buffer.bind( 1 )
  prg.tDepth( 1 );

  prg.uDofEq          ( this.getNearEq() );
  prg.uInvTargetSize ( 1/this.post.bufferWidth, 1/this.post.bufferHeight );

  // this.depthSampler.bind( 1 )
  this.post.fillScreen( this.prgDS );
  // gl.bindSampler( 1 , null );


  //                Blur
  // ===================


  prg = this.prgBlur;
  prg.use();

  this.computeKernel( true );

  fbo = this.fboBlurH;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo );
  fbo.clear();
  prg.tInput( this.fboDS.color );
  prg.uKernel( this.blurKernel );
  this.post.fillScreen( prg );


  this.computeKernel( false );

  fbo = this.fboBlurV;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo );
  fbo.clear();
  prg.tInput( this.fboBlurH.color );
  prg.uKernel( this.blurKernel );
  this.post.fillScreen( prg );


  //            Near Coc
  // ===================

  prg = this.prgCoc;
  fbo = this.fboCoc;

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo );
  fbo.clear();
  prg.use();
  prg.tDownsample ( this.fboDS.color    );
  prg.tBlurred    ( this.fboBlurV.color );
  this.post.fillScreen( prg );


  //        Med blur 3x3
  // ===================

  prg = this.prgMed;
  fbo = this.fboMed;

  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo );
  fbo.clear();
  prg.use();
  prg.tCoc ( this.fboCoc.color );
  prg.uInvTargetSize ( DOWNSCALE / this.post.bufferWidth, DOWNSCALE / this.post.bufferHeight );
  this.post.fillScreen( prg );

},


Dof.prototype.setupProgram = function( prg ) {
  if( ! this._available ){
    return;
  }

  prg.tDofMedBlur         ( this.fboMed.color );
  prg.tDofBlur            ( this.fboBlurV.color );

  prg.uDofInvTargetSize   ( 1/this.post.bufferWidth, 1/this.post.bufferHeight );

  // Let the unblurred sample to small blur fade happen over distance
  // d0, the small to medium blur over distance d1, and the medium to
  // large blur over distance d2, where d0 + d1 + d2 = 1.
  // dofLerpScale = float4( -1 / d0, -1 / d1, -1 / d2, 1 / d2 );
  // dofLerpBias = float4( 1, (1 – d2) / d1, 1 / d2, (d2 – 1) / d2 );
  var d0, d1, d2;
  d0 = this.d0,
  d1 = this.d1,
  d2 = 1.0 - (d0+d1);

  prg.uDofLerpScale       ( -1 / d0, -1 / d1, -1 / d2, 1 / d2 );
  prg.uDofLerpBias        ( 1, (1 - d2) / d1, 1 / d2, (d2 - 1) / d2 );


  prg.uDofEqFar           ( this.getFarEq() );
},





Dof.prototype.computeKernel = function( h ) {

  var bw = this.post.bufferWidth  / DOWNSCALE;
  var bh = this.post.bufferHeight / DOWNSCALE;

  var numSamples = this.blurSamples * 2 + 1;
  var bufferSize = h ? bw : bh;
  var offsetSize = h ? bh : bw;
  var halfOffset = .5/bufferSize;

  var kernel = this.blurKernel;

  var SQRT_PI = Math.sqrt( Math.PI );

  var o1 = h ? 0 : 1;
  var o2 = h ? 1 : 0;

  for( var c = 0, sample = 0; sample < numSamples; ++sample ) {
    var i = sample * 3;

    var delta = 2 * sample / (numSamples - 1) - 1;
    var density = 3.0 * delta;

    // normal_dens
    density = Math.exp(- density*density / 2.0 );
    c += density;

    kernel[i + o1] = halfOffset + 2.0 * this.blurSamples * delta / bufferSize;
    kernel[i + o2] = .5 / offsetSize;
    kernel[i + 2] = density;
  }

  for (sample = 0; sample < numSamples; ++sample) {
    kernel[3 * sample + 2] /= c;
  }
}




module.exports = Dof;