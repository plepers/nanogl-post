

var Texture       = require( 'nanogl/texture' );
var Program       = require( 'nanogl/program' );
var Fbo           = require( 'nanogl/fbo' );
var PixelFormats   = require( 'nanogl-pf' );
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

  var maxFuniforms      = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);


  var pf = PixelFormats.getInstance( gl );

  var configs = [];

  configs = [ 
    pf.RGB16F ,
    pf.RGBA16F,
    pf.RGB32F ,
    pf.RGBA32F,
    pf.RGB8   
  ];

  var cfg = pf.getRenderableFormat( configs );

  for (var i = 0; i<2; ++i) {

    this.bloomTargets[i] = new Fbo( gl )
    this.bloomTargets[i].bind();
    this.bloomTargets[i].attachColor( cfg.format, cfg.type, cfg.internal );

    this.bloomTargets[i].resize( TEX_SIZE, TEX_SIZE );

    var color = this.bloomTargets[i].getColor();
    color.setFilter( true, false, false );
    color.clamp();

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
  this.bloomTargets[0].defaultViewport();
  this.bloomTargets[0].clear();
  this.prcPrg.use();
  this.prcPrg.tInput( this.post.mainColor );
  this.prcPrg.uKernel( this.bloomKernel );
  this.post.fillScreen( this.prcPrg );

  this.transposeKernel();

  this.bloomTargets[1].bind();
  this.bloomTargets[1].defaultViewport();
  this.bloomTargets[1].clear();
  this.prcPrg.tInput( this.bloomTargets[0].getColor() );
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

  prg.tBloom( this.bloomTargets[1].getColor() );

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