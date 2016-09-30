


function BaseEffect(){
  this.renderWidth  = 0;
  this.renderHeight = 0;

  this.post = null;

  this.needDepth = false;
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


  resize : function(w, h){
    this.renderWidth  = w;
    this.renderHeight = h;
  }


}


module.exports = BaseEffect;