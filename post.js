
var Program       = require( 'nanogl/program' );
var Fbo           = require( 'nanogl/fbo' );
var GLArrayBuffer = require( 'nanogl/arraybuffer' );

var main_frag = require( './glsl/templates/main.frag.js' ); 
var main_vert = require( './glsl/templates/main.vert.js' ); 


function Post( gl ){
  this.gl = gl;

  this._effects = [];
  this._shaderInvalid = true;

  this.renderWidth  = 1;
  this.renderHeight = 1;

  this.enabled = true;

  var ctxAttribs        = gl.getContextAttributes();
  var float_texture_ext = gl.getExtension('OES_texture_float');
  var halfFloat         = gl.getExtension("OES_texture_half_float");

  // just activate ext for now
  gl.getExtension("OES_texture_half_float_linear");
  gl.getExtension("OES_texture_float_linear");

  var types =  [ gl.FLOAT, gl.UNSIGNED_BYTE ];
  if( halfFloat ){
    types.unshift( halfFloat.HALF_FLOAT_OES );
  }


  this.mainFbo = new Fbo( gl, 1, 1, {
    depth   : ctxAttribs.depth,
    stencil : ctxAttribs.stencil,
    type    : types,
    format  : gl.RGBA
  });

  this.mainFbo.color.setFilter( false, false, false )
  this.mainFbo.color.clamp()


  this.prg = new Program( gl );


  var fsData = new Float32Array( [0, 0, 2, 0, 0, 2] );
  this.fsPlane = new GLArrayBuffer( gl, fsData );
  this.fsPlane.attrib( 'aTexCoord0', 2, gl.FLOAT );
}


Post.prototype = {


  add : function( effect ){
    if( this._effects.indexOf( effect ) === -1 ){
      this._effects.push( effect );
      effect._init( this );
      effect.resize( this.renderWidth, this.renderHeight );
      this._shaderInvalid = true;
    }
  },


  remove : function( effect ){
    var i = this._effects.indexOf( effect );
    if( i > -1 ){
      this._effects.splice( i, 1 );
      effect.release();
      effect.post = null;
      this._shaderInvalid = true;
    }
  },


  resize : function( w, h ){

    this.renderWidth = w;
    this.renderHeight = h;
    
    this.mainFbo.resize( w, h );

    for( var i=0; i< this._effects.length; i++ ){
      this._effects[i].resize(w, h)
    }

  },


  preRender : function( width, height ){


    var gl = this.gl;
    
    if( this.enabled ){

      if( this.renderWidth !== width || this.renderHeight !== height ){
        this.resize( width, height );
      }

      this.mainFbo.bind();

    } else {
      
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport( 0, 0, width, height );

    }

    gl.clearColor( .0, .0, .0, 1.0 );
    // just clear, main fbo or screen one
    this.mainFbo.clear();

    

  },


  render : function( ){


    if( ! this.enabled ){
      return;
    }


    var gl = this.gl;

    for( var i = 0; i < this._effects.length; i++ ){
      this._effects[i].preRender()
    }

    if( this._shaderInvalid ){
      this.buildProgram();
    }

    this.prg.use();

    for( var i = 0; i < this._effects.length; i++ ){
      this._effects[i].setupProgram( this.prg );
    }



    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport( 0, 0, this.renderWidth, this.renderHeight );

    gl.clearColor( .0, .0, .0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    this.prg.tInput( this.mainFbo.color );
    this.fillScreen( this.prg );

  },


  fillScreen : function( prg ){
    this.fsPlane.attribPointer( prg );
    this.fsPlane.drawTriangles();
  },


  buildProgram : function(){


    var code    = [],
        precode = [];

    var effects = this._effects;
    for (var i = 0; i < effects.length; i++) {
      effects[i].genCode( precode, code );
    }

    code    = code.   join( '\n' );
    precode = precode.join( '\n' );

    var frag = main_frag({
      code : code,
      precode : precode
    });

    var vert = main_vert();


    var defs = '\n';
    defs += 'precision highp float;\n';

    this.prg.compile( vert, frag, defs );

    this._shaderInvalid = false;

  }


}


module.exports = Post;