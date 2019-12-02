import Post from "../post";
import Program from "nanogl/program";


export enum EffectDependency {
  NONE = 0,
  DEPTH = 1<<1,
  LINEAR= 1<<2,
}


// effect need scene's depth texture
// effect need linear sampler for input color


export default abstract class BaseEffect {

  _flags: EffectDependency;
  post: Post | null;



  constructor(){
    this.post         = null;
    this._flags       = 0;
  }




  _init( post : Post ){
    if( this.post !== post ){
      this.post = post;
      this.init();
    }
  }


  abstract init( ):void
  abstract release():void
  abstract preRender():void
  abstract genCode( precode:string[], code:string[] ):void
  abstract setupProgram( prg:Program ):void
  abstract resize( w:number, h:number ):void
  
}


