
var BaseEffect = require( './base-effect' );


function GammaTB(){
  BaseEffect.call( this );
  this._code    = require( '../glsl/templates/gamma_tb.frag' )();
}


GammaTB.prototype = Object.create( BaseEffect.prototype );
GammaTB.prototype.constructor = GammaTB;


GammaTB.prototype.genCode = function( precode, code ) {
  code.   push( this._code )
}


module.exports = GammaTB;