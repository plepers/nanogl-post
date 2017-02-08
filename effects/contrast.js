
var BaseEffect = require( './base-effect' );


function Contrast( contrast, brightness, bias ){
  BaseEffect.call( this );

  this.contrast        = contrast;
  this.brightness      = brightness;
  this.bias            = bias;

  this.contrastTint    = [1,1,1];
  this.brightnessTint  = [1,1,1];
  this.biasTint        = [1,1,1];


  this._preCode = require( '../glsl/templates/contrast_pre.frag' )();
  this._code    = require( '../glsl/templates/contrast.frag' )();
}


Contrast.prototype = Object.create( BaseEffect.prototype );
Contrast.prototype.constructor = Contrast;



Contrast.prototype.genCode = function( precode, code ) {
  precode.push( this._preCode )
  code.   push( this._code )
}


Contrast.prototype.setupProgram = function( prg ) {
  var c     = this.contrast,
      ct    = this.contrastTint,
      b     = this.brightness,
      bt    = this.brightnessTint,
      bias  = this.bias;
      biast = this.biasTint;


  prg.uContrastScale(
    (ct[0]*c) * (bt[0]*b),
    (ct[1]*c) * (bt[1]*b),
    (ct[2]*c) * (bt[2]*b)
  );

  prg.uContrastBias(
    ( (biast[0]*bias) * (-ct[0]*c + 1) ) * (bt[0]*b),
    ( (biast[1]*bias) * (-ct[1]*c + 1) ) * (bt[1]*b),
    ( (biast[2]*bias) * (-ct[2]*c + 1) ) * (bt[2]*b)
  );

}

module.exports = Contrast;