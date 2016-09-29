


var Texture    = require( 'nanogl/texture' ); 
var BaseEffect = require( './base-effect' );


var G_SIZE = 128;

function LUT( lut ){
  BaseEffect.call( this );

  this._lut        = lut;

  this._lutTex     = null;
  this._invalidTex = true;
  
  this._preCode = require( '../glsl/templates/LUT_pre.frag.js' )();
  this._code    = require( '../glsl/templates/LUT.frag.js' )();
}


LUT.prototype = Object.create( BaseEffect.prototype );
LUT.prototype.constructor = LUT;


LUT.prototype.init = function( precode, code ) {
  var gl = this.post.gl;
  this._lutTex = new Texture( gl, gl.RGB );
}


LUT.prototype.release = function( precode, code ) {
  this._lutTex.dispose()
  this._lutTex = null;
}


LUT.prototype.genCode = function( precode, code ) {
  precode.push( this._preCode )
  code.   push( this._code )
}


LUT.prototype._updateTex = function( ) {

  this._lutTex.fromData( 
    this._lut.length / 3 | 0,
    1,
    new Uint8Array(this._lut) 
  );
  this._invalidTex = false;

}


LUT.prototype.setupProgram = function( prg ) {
  var a    = this.amount,
      s    = this.sharpness,
      gl   = prg.gl;


  if( this._invalidTex ){
    this._updateTex();
  }

  prg.tLUT( this._lutTex );




}

module.exports = LUT;