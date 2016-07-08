
var BaseEffect = require( './base-effect' );


function Saturation( amount ){
  BaseEffect.call( this );
 
  this.tint          = [1, 1, 1];
  this.amount        = amount;

  this._preCode = require( '../glsl/templates/saturation_pre.frag.js' )();
  this._code    = require( '../glsl/templates/saturation.frag.js' )();
}


Saturation.prototype = Object.create( BaseEffect.prototype );
Saturation.prototype.constructor = Saturation;



Saturation.prototype.genCode = function( precode, code ) {
  precode.push( this._preCode )
  code.   push( this._code )
}


Saturation.prototype.setupProgram = function( prg ) {
  var a     = this.amount,
      tint  = this.tint;

  prg.uSaturation(
    tint[0]*a,
    tint[1]*a,
    tint[2]*a
  );

}

module.exports = Saturation;