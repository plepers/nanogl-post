import Post from "../post";
import Program from "nanogl/program";


export enum EffectDependency {
  NONE = 0,
  DEPTH = 1<<1,
  LINEAR= 1<<2,
}


// effect need scene's depth texture
// effect need linear sampler for input color

/**
 * This class is the base for all post-processing effects.
 */
export default abstract class BaseEffect {
  /**
   * The dependencies this effect needs :
   * depth pass, linear filtering
   */
  _flags: EffectDependency;
  /** The post this effect belongs to */
  post: Post | null;



  constructor(){
    this.post         = null;
    this._flags       = 0;
  }



  /**
   * Setup the effect with the given post.
   * @param {Post} post  The Post this effect belongs to
   */
  _init( post : Post ){
    if( this.post !== post ){
      this.post = post;
      this.init();
    }
  }

  /**
   * Initialize the effect.
   */
  abstract init( ):void
  /**
   * Delete all webgl objects related to this effect.
   */
  abstract release():void
  /**
   * Prepare this effect for render.
   */
  abstract preRender():void
  /**
   * Add the shader pre-code (uniforms, attributes, functions, etc.)
   * & code for this effect to the given lists.
   * @param {string[]} precode The list of shader pre-code to add to
   * @param {string[]} code The list of shader code to add to
   */
  abstract genCode( precode:string[], code:string[] ):void
  /**
   * Setup the given program for this effect.
   * @param {Program} prg The program to setup
   */
  abstract setupProgram( prg:Program ):void
  /**
   * Resize this effect.
   * @param {number} w The width to use
   * @param {number} h The height to use
   */
  abstract resize( w:number, h:number ):void

}
