
var BaseEffect = require( './base-effect' );


function Vignette( color, strength, curve ){
  BaseEffect.call( this );

  this.color     = color;
  this.curve     = curve;
  this.strength  = strength;

  this._preCode = require( '../glsl/templates/vignette_pre.frag.js' )();
  this._code    = require( '../glsl/templates/vignette.frag.js' )();
}


Vignette.prototype = Object.create( BaseEffect.prototype );
Vignette.prototype.constructor = Vignette;



Vignette.prototype.genCode = function( precode, code ) {
  precode.push( this._preCode );
  code.   push( this._code );
}


Vignette.prototype.setupProgram = function( prg ) {
  var c  = this.color,
      s  = this.strength,
      bw = this.post.renderWidth ,
      bh = this.post.renderHeight;

  var max = Math.max( bw, bh );
  prg.uVignetteAspect(      
      bw / max,
      bh / max,
      0.5 * bw / max,
      0.5 * bh / max
  );

  prg.uVignette(
    2.0 * (1.0 - c[0]) * s,
    2.0 * (1.0 - c[1]) * s,
    2.0 * (1.0 - c[2]) * s,
    this.curve
  );



}

module.exports = Vignette;
