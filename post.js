
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

  this.bufferWidth  = 1;
  this.bufferHeight = 1;

  this.enabled = true;
  this.mipmap  = true;

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



  this.mainFbo = this.genFbo();

  
  // test fbo's mipmaping capability
  if( this.mipmap ){

    this.mainFbo.resize( 4, 4 );
    gl.generateMipmap( gl.TEXTURE_2D );

    var err = gl.getError();
    if( err ){
      this.mipmap = false;
      // this fbo is now fu*** up, need to create a fresh one
      this.mainFbo.dispose()
      this.mainFbo = this.genFbo();
    }
  }

  this.mainFbo.color.setFilter( false, this.mipmap, false )


  this.prg = new Program( gl );


  var fsData = new Float32Array( [0, 0, 1, 0, 0, 1, 1, 1] );
  this.fsPlane = new GLArrayBuffer( gl, fsData );
  this.fsPlane.attrib( 'aTexCoord0', 2, gl.FLOAT );
}


Post.prototype = {


  genFbo : function(){
    var gl = this.gl;
    var ctxAttribs        = gl.getContextAttributes();

    var fbo = new Fbo( gl, {
      depth   : ctxAttribs.depth,
      stencil : ctxAttribs.stencil,
      type    : types,
      format  : ctxAttribs.alpha ? gl.RGBA : gl.RGB
    });

    fbo.color.bind();
    fbo.color.clamp()

    return fbo;
  },


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

    this.renderWidth  = w;
    this.renderHeight = h;

    this.bufferWidth  = this.mipmap ? nextPOT( w ) : w;
    this.bufferHeight = this.mipmap ? nextPOT( h ) : h;
    
    this.mainFbo.resize( this.bufferWidth, this.bufferHeight );

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

    }

    gl.viewport( 0, 0, width, height );
    gl.clearColor( .0, .0, .0, 1.0 );
    // just clear, main fbo or screen one
    this.mainFbo.clear();

    

  },


  render : function( toFbo ){


    if( ! this.enabled ){
      return;
    }


    var gl = this.gl;

    // mipmap mainFbo here
    this.mainFbo.color.bind();
    if( this.mipmap ){
      gl.generateMipmap( gl.TEXTURE_2D );
    }



    for( var i = 0; i < this._effects.length; i++ ){
      this._effects[i].preRender()
    }


    if( toFbo !== undefined ){
      toFbo.resize( this.renderWidth, this.renderHeight );
      toFbo.bind();
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport( 0, 0, this.renderWidth, this.renderHeight );
    }

    gl.clearColor( .0, .0, .0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );


    

    if( this._shaderInvalid ){
      this.buildProgram();
    }

    this.prg.use();

    for( var i = 0; i < this._effects.length; i++ ){
      this._effects[i].setupProgram( this.prg );
    }




    this.prg.tInput( this.mainFbo.color );


    this.fillScreen( this.prg );

  },


  fillScreen : function( prg, fullframe ){
    if( fullframe === true ){
      prg.uViewportScale( 1, 1 );  
    } else {
      prg.uViewportScale(
        this.renderWidth  / this.bufferWidth ,
        this.renderHeight / this.bufferHeight 
      );
    }

    this.fsPlane.attribPointer( prg );
    this.fsPlane.drawTriangleStrip();
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


// ----------------
// utilities
// ----------------

var MAX_POT = 4096;

function nextPOT( n ){
  var p = 1;
      
  while (p < n)
    p <<= 1;
  
  if (p > MAX_POT)
    p = MAX_POT;
  
  return p;
}



module.exports = Post;