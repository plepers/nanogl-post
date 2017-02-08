
var BaseEffect = require( './base-effect' );


function Sharpen( amount, limit ){
  BaseEffect.call( this );

  this.amount = amount;
  this.limit  = limit;

  this._preCode = require( '../glsl/templates/sharpen_pre.frag' )();
  this._code    = require( '../glsl/templates/sharpen.frag' )();
}


Sharpen.prototype = Object.create( BaseEffect.prototype );
Sharpen.prototype.constructor = Sharpen;



Sharpen.prototype.genCode = function( precode, code ) {
  precode.push( this._preCode )
  code.   push( this._code )
}


Sharpen.prototype.setupProgram = function( prg ) {
  var a  = this.amount,
      l  = this.limit,
      bw = this.post.bufferWidth ,
      bh = this.post.bufferHeight;

  // not needed in glsl300
  if( prg.uSharpenKernel )
    prg.uSharpenKernel( 1/bw, 0, 0, 1/bh );

  prg.uSharpness(
      a,
      a / 4.0,
      l
  );

}

module.exports = Sharpen;