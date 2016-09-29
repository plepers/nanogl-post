
var BaseEffect = require( './base-effect' );


function Hejl( amount ){
  BaseEffect.call( this );

  this._code    = require( '../glsl/templates/tm_hejl.frag.js' )();
}


Hejl.prototype = Object.create( BaseEffect.prototype );
Hejl.prototype.constructor = Hejl;


Hejl.prototype.genCode = function( precode, code ) {
  code.   push( this._code )
}


module.exports = Hejl;