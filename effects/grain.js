
var Texture    = require( 'nanogl/texture' ); 
var BaseEffect = require( './base-effect' );


var G_SIZE = 128;


var _NoiseData = null;
function getNoiseData(){

  if( _NoiseData === null ){
    var numPix = G_SIZE*G_SIZE;
    _NoiseData = new Uint8Array( numPix );
    for (var i = 0; numPix > i; i++) {
      _NoiseData[i] = 128 * (Math.random() + Math.random());
    }
  }

  return _NoiseData;
}



function Grain( amount, sharpness ){
  BaseEffect.call( this );

  this.amount    = amount;
  this.sharpness = sharpness;

  this._noiseTex = null;
  
  this._preCode = require( '../glsl/templates/grain_pre.frag' )();
  this._code    = require( '../glsl/templates/grain.frag' )();
}


Grain.prototype = Object.create( BaseEffect.prototype );
Grain.prototype.constructor = Grain;



Grain.prototype.genCode = function( precode, code ) {
  precode.push( this._preCode )
  code.   push( this._code )
}


Grain.prototype.init = function( precode, code ) {
  var gl = this.post.gl;
  this._noiseTex = new Texture( gl, gl.LUMINANCE );
  this._noiseTex.fromData( G_SIZE, G_SIZE, getNoiseData() );
}


Grain.prototype.release = function( precode, code ) {
  this._noiseTex.dispose()
  this._noiseTex = null;
}


Grain.prototype.setupProgram = function( prg ) {
  var a    = this.amount,
      s    = this.sharpness;


  var ig   = 1 / G_SIZE,
      bw   = this.post.bufferWidth ,
      bh   = this.post.bufferHeight,
      ms   = 1 - this.sharpness;

  prg.uGrainCoord(
    ig * bw,
    ig * bh,
    0.5 * ms * ig,
    0.5 * ms * ig
  );

  prg.uGrainScaleBias(
    2 * a, -a
  );


  prg.tGrain( this._noiseTex );




}

module.exports = Grain;