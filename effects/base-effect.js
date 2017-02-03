
// effect need scene's depth texture
BaseEffect.NEED_DEPTH  = 1<<1;
// effect need linear sampler for input color
BaseEffect.NEED_LINEAR = 1<<2;


function BaseEffect(){
  this.post         = null;
  this._flags       = 0;
}


BaseEffect.prototype = {


  _init : function( post ){
    if( this.post !== post ){
      this.post = post;
      this.init();
    }
  },


  init : function( ){

  },


  release : function(){

  },


  preRender : function(){

  },


  genCode : function( precode, code ){

  },


  setupProgram : function( prg ){

  },


  resize : function(){

  }


}


module.exports = BaseEffect;