
var BaseEffect = require( './base-effect' );


function TBCalibration(){
  BaseEffect.call( this );
  this._code    = require( '../glsl/templates/tb-calibration.frag' )();
}


TBCalibration.prototype = Object.create( BaseEffect.prototype );
TBCalibration.prototype.constructor = TBCalibration;



TBCalibration.prototype.genCode = function( precode, code ) {
  code.   push( this._code )
}


// TBCalibration.prototype.setupProgram = function( prg ) {

// }

module.exports = TBCalibration;