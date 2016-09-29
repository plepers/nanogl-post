
var BaseEffect = require( './base-effect' );


function Reinhard( amount ){
  BaseEffect.call( this );

  this._code    = require( '../glsl/templates/tm_reinhard.frag.js' )();
}


Reinhard.prototype = Object.create( BaseEffect.prototype );
Reinhard.prototype.constructor = Reinhard;


Reinhard.prototype.genCode = function( precode, code ) {
  code.   push( this._code )
}


module.exports = Reinhard;