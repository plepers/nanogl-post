
var BaseEffect = require( './base-effect' );


function Fetch(){
  BaseEffect.call( this );
  this._code    = require( '../glsl/templates/fetch.frag.js' )();
}


Fetch.prototype = Object.create( BaseEffect.prototype );
Fetch.prototype.constructor = Fetch;



Fetch.prototype.genCode = function( precode, code ) {
  code.   push( this._code )
}


// Fetch.prototype.setupProgram = function( prg ) {

// }

module.exports = Fetch;