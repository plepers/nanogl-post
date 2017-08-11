
var BaseEffect = require( './base-effect' );


function GammaCorrection( gamma ){
  BaseEffect.call( this );
  this._code    = require( '../glsl/templates/gamma_correction.frag' )( {invGamma: 1.0/gamma});
}


GammaCorrection.prototype = Object.create( BaseEffect.prototype );
GammaCorrection.prototype.constructor = GammaCorrection;



GammaCorrection.prototype.genCode = function( precode, code ) {
  code.   push( this._code )
}


// GammaCorrection.prototype.setupProgram = function( prg ) {

// }

module.exports = GammaCorrection;