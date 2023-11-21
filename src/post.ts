
import Program       from 'nanogl/program'
import Texture       from 'nanogl/texture'
import Fbo           from 'nanogl/fbo'
import GLArrayBuffer from 'nanogl/arraybuffer'
import PixelFormats  from 'nanogl-pf'

import main_frag from './glsl/templates/main.frag'
import main_vert from './glsl/templates/main.vert'

import Effect, { EffectDependency }    from './effects/base-effect'
import { GLContext, isWebgl2 } from 'nanogl/types'
import BaseEffect from './effects/base-effect'

/**
 * This class manages post-processing effects.
 */
export default class Post {
  /** The webgl context this Post belongs to */
  gl: GLContext

  /** The list of post-processing effects */
  _effects: BaseEffect[]
  /**
   * The dependencies the effects need :
   * depth pass, linear filtering
   */
  _flags: EffectDependency;
  /** Whether the program is invalid or not */
  _shaderInvalid: boolean

  /** The width to render */
  renderWidth : number
  /** The height to render */
  renderHeight: number
  /** The width of the buffer */
  bufferWidth : number
  /** The height of the buffer */
  bufferHeight: number

  /** Whether the post-processing is enabled or not */
  enabled: boolean
  /** Whether to generate mipmaps or not */
  mipmap: boolean

  /**
   * The OES_texture_float webgl extension :
   * exposes floating-point pixel types for textures
   */
  float_texture_ext: OES_texture_float | null
  /**
   * The OES_texture_half_float webgl extension :
   * adds texture formats with 16- and 32-bit floating-point components
   */
  halfFloat: OES_texture_half_float | null
  /**
   * The OES_texture_half_float_linear webgl extension :
   * allows linear filtering with half floating-point pixel types for textures
   */
  float_texture_ext_l: OES_texture_half_float_linear | null
  /**
   * The OES_texture_float_linear webgl extension :
   * allows linear filtering with floating-point pixel types for textures
   */
  halfFloat_l: OES_texture_float_linear | null
  /**
   * The EXT_color_buffer_float webgl extension :
   * adds the ability to render a variety of floating point formats
   */
  color_buffer_float: any
  /** Whether a texture with depth pixel format can be created or not */
  hasDepthTexture: boolean

  /** The main framebuffer */
  mainFbo: Fbo
  /** The color texture of the main FBO */
  mainColor: Texture;
  /** The program used to render all effects */
  prg: Program
  /** The full-screen quad used to render all effects */
  fsPlane: GLArrayBuffer

  /**
    * @param {GLContext} gl  The webgl context this Post belongs to
    * @param {boolean} [mipmap=false]  Whether to generate mipmaps or not
    */
  constructor( gl : GLContext, mipmap : boolean = false ){

    this.gl = gl;

    this._effects   = [];
    this._flags     = 0;
    this._shaderInvalid = true;

    this.renderWidth  = 1;
    this.renderHeight = 1;

    this.bufferWidth  = 1;
    this.bufferHeight = 1;

    this.enabled = true;
    this.mipmap  = mipmap;

    this.float_texture_ext   = gl.getExtension('OES_texture_float');
    this.halfFloat           = gl.getExtension("OES_texture_half_float");
    this.float_texture_ext_l = gl.getExtension("OES_texture_half_float_linear");
    this.halfFloat_l         = gl.getExtension("OES_texture_float_linear");
    this.color_buffer_float  = gl.getExtension('EXT_color_buffer_float');


    this.hasDepthTexture = PixelFormats.getInstance(gl).hasDepthTexture();



    this.mainFbo = this.genFbo();
    this.mainColor = this.mainFbo.getColor(0) as Texture;


    // test fbo's mipmaping capability
    if( this.mipmap ){

      this.mainColor.bind()
      gl.generateMipmap( gl.TEXTURE_2D );

      const err = gl.getError();
      if( err ){
        this.mipmap = false;
        // this fbo is now fu*** up, need to create a fresh one
        this.mainFbo.dispose()
        this.mainFbo   = this.genFbo();
        this.mainColor = this.mainFbo.getColor(0) as Texture;
      }
    }

    this.mainColor.setFilter( false, this.mipmap, false )


    this.prg = new Program( gl );


    const fsData = new Float32Array( [0, 0, 1, 0, 0, 1, 1, 1] );
    this.fsPlane = new GLArrayBuffer( gl, fsData );
    this.fsPlane.attrib( 'aTexCoord0', 2, gl.FLOAT );
  }



  /**
   * Delete all webgl objects related to this Post.
   */
  dispose(){
    this.mainFbo.dispose();
    this.fsPlane.dispose();
    this.prg.dispose();
  }

  /**
   * Know whether the effects need a depth pass or not.
   */
  _needDepth() : boolean {
    return (this._flags & EffectDependency.DEPTH) !== 0;
  }

  /**
   * Know whether the effects need linear filtering or not.
   */
  _needLinear() : boolean {
    return (this._flags & EffectDependency.LINEAR) !== 0;
  }

  /**
   * Generate a framebuffer that can be used to render the effects.
   */
  genFbo() : Fbo {

    const gl = this.gl;
    const pf = PixelFormats.getInstance(gl);

    const ctxAttribs        = gl.getContextAttributes()!;

    const configs = [
      pf.RGB16F ,
      pf.RGBA16F,
      pf.RGB32F ,
      pf.RGBA32F,
      pf.RGB8
    ];


    if( isWebgl2(gl)){
      // webgl2
      // TODO Add option for 16f VS 10fixed
      // configs.push( pf.A2B10G10R10  );
    }

    // conatin RGB8  so cfg can't be null
    const cfg = pf.getRenderableFormat( configs )!;


    const fbo = new Fbo( gl );
    fbo.bind();
    fbo.attachColor( cfg.format, cfg.type, cfg.internal  );


    // depth/stencil

    // if ! ctxAttribs.depth no texture

    fbo.attachDepth( ctxAttribs.depth, ctxAttribs.stencil, this.hasDepthTexture );

    // force attachment allocation
    fbo.resize( 4, 4 );


    const color = fbo.getColor(0) as Texture;
    color.bind();
    color.clamp()


    if( this.hasDepthTexture ){
      const depth = fbo.getDepth() as Texture;
      depth.bind();
      depth.clamp();
      depth.setFilter( false, false, false );
    }

    return fbo;
  }



  /**
   * Add a post-processing effect to the list.
   * @param {BaseEffect} effect The effect to add
   */
  add( effect : BaseEffect ){
    if( this._effects.indexOf( effect ) === -1 ){
      this._effects.push( effect );
      effect._init( this );
      effect.resize( this.renderWidth, this.renderHeight );
      this._flags |= effect._flags;
      this._shaderInvalid = true;
    }
  }

  /**
   * Remove a post-processing effect from the list.
   * @param {BaseEffect} effect The effect to remove
   */
  remove( effect : BaseEffect ){
    const i = this._effects.indexOf( effect );
    if( i > -1 ){
      this._effects.splice( i, 1 );
      effect.release();
      effect.post = null;
      this._shaderInvalid = true;


      if( effect._flags !== 0 ){
        this._flags = 0;
        for (var j = 0; j < this._effects.length; j++) {
          this._flags |= effect._flags;
        }
      }

    }
  }


  /**
   * Resize the buffers and effects.
   * @param {number} w The new width
   * @param {number} h The new height
   */
  resize( w:number, h:number ){

    this.bufferWidth  = w;
    this.bufferHeight = h;

    this.mainFbo.resize( this.bufferWidth, this.bufferHeight );

    for( var i=0; i< this._effects.length; i++ ){
      this._effects[i].resize(w, h)
    }

  }

  /**
   * Prepare this post for render.
   * @param {number} w The width to render
   * @param {number} h The height to render
   */
  preRender( w:number, h:number ){

    this.renderWidth  = w;
    this.renderHeight = h;

    if( this.enabled ){

      const bufferWidth  = this.mipmap ? nextPOT( w ) : w;
      const bufferHeight = this.mipmap ? nextPOT( h ) : h;

      if( this.bufferWidth !== bufferWidth || this.bufferHeight !== bufferHeight ){
        this.resize( bufferWidth, bufferHeight );
      }

    }

  }

  /**
   * Know whether this Post needs a depth pass or not.
   */
  needDepthPass(){
    return this.enabled && this._needDepth() && !this.hasDepthTexture;
  }


  // bindDepth(){
  //   if( ! this.needDepthPass() ){
  //     return false;
  //   }

  //   var gl = this.gl;
  //   this.depthFbo.bind();
  //   gl.viewport( 0, 0, this.renderWidth, this.renderHeight );
  //   gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  //   gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
  //   return true;
  // }


  /**
   * Bind the main framebuffer (or the default FBO if
   * post-processing is not enabled) and prepare the viewport.
   *
   * Call this method before rendering the scene.
   */
  bindColor( ){


    const gl = this.gl;

    if( this.enabled ){
      this.mainFbo.bind();
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    gl.viewport( 0, 0, this.renderWidth, this.renderHeight );
    // gl.clearColor( .0, .0, .0, 1.0 );
    // just clear, main fbo or screen one
    this.mainFbo.clear();



  }

  /**
   * Render the effects.
   *
   * **Important :** The scene should be rendered to the main FBO before calling this method.
   * You can use {@link Post#bindColor} before rendering the scene to do so.
   *
   * @param {Fbo} [toFbo]  The framebuffer to render to. If not specified, render to the screen.
   */
  render( toFbo? : Fbo ){


    if( ! this.enabled ){
      return;
    }


    const gl = this.gl;

    // mipmap mainFbo here
    this.mainColor.bind();
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
    }

    gl.viewport( 0, 0, this.renderWidth, this.renderHeight );

    gl.clearColor( .0, .0, .0, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );




    if( this._shaderInvalid ){
      this.buildProgram();
    }

    this.prg.use();

    for( var i = 0; i < this._effects.length; i++ ){
      this._effects[i].setupProgram( this.prg );
    }



    this.prg.tInput( this.mainColor );


    if( this._needDepth() ){
      if( this.hasDepthTexture )
        this.prg.tDepth( this.mainFbo.getDepth() );
      else
        throw "no depth texture"
        //this.prg.tDepth( this.depthFbo.color );
    }


    this.fillScreen( this.prg );

  }

  /**
   * Draw the full-screen quad with the given program.
   * @param {Program} prg  The program to use
   * @param {boolean} [fullframe=false]  Whether to render the full frame or not
   */
  fillScreen( prg : Program, fullframe : boolean = false ){
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
  }

  /**
   * Build the program used to render all the effects.
   */
  buildProgram(){


    var codeList    : string[] = [],
        precodeList : string[] = [];

    var effects = this._effects;
    for (var i = 0; i < effects.length; i++) {
      effects[i].genCode( precodeList, codeList );
    }

    const code    = codeList.   join( '\n' );
    const precode = precodeList.join( '\n' );

    var frag = main_frag({
      code : code,
      precode : precode
    });

    var vert = main_vert();


    var depthTex = this._needDepth() && this.hasDepthTexture;
    var defs = '';

    if( isWebgl2( this.gl ) ) {// webgl2
      defs += '#version 300 es\n';
    }

    defs += 'precision highp float;\n';
    defs += '#define NEED_DEPTH '    +(+this._needDepth())+'\n';
    defs += '#define TEXTURE_DEPTH ' +(+depthTex)       +'\n';

    this.prg.compile( vert, frag, defs );

    this._shaderInvalid = false;


    this.mainColor.bind()
    this.mainColor.setFilter( this._needLinear(), this.mipmap, false );

  }


}


// ----------------
// utilities
// ----------------

const MAX_POT = 4096;

function nextPOT( n : number ) : number {
  var p = 1;

  while (p < n)
    p <<= 1;

  if (p > MAX_POT)
    p = MAX_POT;

  return p;
}
