

var Texture       = require( 'nanogl/texture' );
var Program       = require( 'nanogl/program' );
var Fbo           = require( 'nanogl/fbo' );
var GLArrayBuffer = require( 'nanogl/arraybuffer' );
var BaseEffect    = require( './base-effect' );


var prc_frag = require( '../glsl/templates/bloom_process.frag' )();
var prc_vert = require( '../glsl/templates/main.vert' )();


var TEX_SIZE = 256;

function Bloom( color, size ){
  BaseEffect.call( this );

  this.color = color
  this.size = size


  this.bloomTextures = [];
  this.bloomTargets = [];
  this.bloomSamples = 0;
  this.bloomKernel = null;

  this._preCode = require( '../glsl/templates/bloom_pre.frag' )();
  this._code    = require( '../glsl/templates/bloom.frag' )();
}


Bloom.prototype = Object.create( BaseEffect.prototype );
Bloom.prototype.constructor = Bloom;



Bloom.prototype.init = function( precode, code ) {
  var gl = this.post.gl;

  var float_texture_ext = gl.getExtension('OES_texture_float');
  var halfFloat         = gl.getExtension('OES_texture_half_float');
  var color_buffer_float= gl.getExtension('EXT_color_buffer_float');
  var maxFuniforms      = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);


  var configs = [
  {
    type   : gl.FLOAT, 
    format : gl.RGB,
    internal : gl.RGB
  },{
    type   : gl.UNSIGNED_BYTE, 
    format : gl.RGB,
    internal : gl.RGB
  }]


  if( gl.UNSIGNED_INT_2_10_10_10_REV === 0x8368){
    configs.unshift( {
      type   : gl.UNSIGNED_INT_2_10_10_10_REV, 
      format : gl.RGBA,
      internal : gl.RGB10_A2
    } );
  }


  if( halfFloat ){
    configs.unshift( {
      type   : halfFloat.HALF_FLOAT_OES, 
      format : gl.RGB,
      internal : gl.RGB
    } );
  }



  for (var i = 0; i<2; ++i) {

    this.bloomTargets[i] = new Fbo( gl, {
      configs  : configs
    });

    this.bloomTargets[i].resize( TEX_SIZE, TEX_SIZE );

    this.bloomTargets[i].color.setFilter( true, false, false );
    this.bloomTargets[i].color.clamp();

  }

  for( this.bloomSamples = 64; this.bloomSamples + 16 >= maxFuniforms; ){
    this.bloomSamples /= 2;
  }

  this.bloomKernel = new Float32Array( this.bloomSamples * 4 );


  var defs = '\n';
  defs += 'precision highp float;\n';
  defs += "#define BLOOM_SAMPLES " + this.bloomSamples+'\n';

  this.prcPrg = new Program( gl );
  this.prcPrg.compile( prc_vert, prc_frag, defs )

}


Bloom.prototype.release = function( precode, code ) {

  this.prcPrg.dispose()
  this.prcPrg = null;
  for (var i = 0; i<2; ++i) {
    this.bloomTargets[i].dispose();
  }

  this.bloomTargets = [];

}



Bloom.prototype.genCode = function( precode, code ) {
  precode.push( this._preCode )
  code.   push( this._code )
}



Bloom.prototype.preRender = function() {

  this.computeKernel();

  this.bloomTargets[0].bind();
  this.bloomTargets[0].clear();
  this.prcPrg.use();
  this.prcPrg.tInput( this.post.mainFbo.color );
  this.prcPrg.uKernel( this.bloomKernel );
  this.post.fillScreen( this.prcPrg );

  this.transposeKernel();

  this.bloomTargets[1].bind();
  this.bloomTargets[1].clear();
  this.prcPrg.tInput( this.bloomTargets[0].color );
  this.prcPrg.uKernel( this.bloomKernel );
  this.post.fillScreen( this.prcPrg, true );

},


Bloom.prototype.setupProgram = function( prg ) {

  var c     = this.color;

  prg.uBloomColor(
    c[0],
    c[1],
    c[2]
  );

  prg.tBloom( this.bloomTargets[1].color );

}





Bloom.prototype.computeKernel = function() {

  var kernel = this.bloomKernel;

  var SQRT_PI = Math.sqrt( Math.PI );

  for( var c = 0, sample = 0; sample < this.bloomSamples; ++sample ) {
    var i = sample * 4;

    var delta = 2 * sample / (this.bloomSamples - 1) - 1;
    var density = 4.0 * delta;

    // normal_dens
    density = Math.exp(- density*density / 2.0 ) / SQRT_PI;
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



Bloom.prototype.transposeKernel = function() {

  var kernel = this.bloomKernel;

  var ratio = this.post.renderWidth / this.post.renderHeight;

  for( var sample = 0; sample < this.bloomSamples; ++sample ) {
    var i = sample << 2;
    kernel[i + 1] = kernel[i] * ratio;
    kernel[i] = 0;
  }

}


module.exports = Bloom;