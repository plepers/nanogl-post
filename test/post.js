var expect  = require( 'expect.js' );

var Post     = require( '../post' );
var Fetch    = require( '../effects/fetch' );

var testContext = require( './utils/TestContext' );
var gl = testContext.getContext();


describe( "Post", function(){

  it( "should be exported", function(){
    expect( Post ).to.be.ok( );
  });

  it( "constructor should return instance", function(){

    var p = new Post( gl );
    expect( p ).to.be.ok( );
    expect( p.gl ).to.be.ok( );

  });

  it( "ctor should leave clean state", function(){
    var p = new Post( gl );
    testContext.assertNoError();
  });


  it( "dispose should leave clean state", function(){
    var p = new Post( gl );
    p.dispose();
    testContext.assertNoError();
  });

  it( "prerender should leave clean state", function(){
    var p = new Post( gl );
    p.preRender( 64, 64 );
    testContext.assertNoError();
  });


  it( "render should leave clean state", function(){
    var p = new Post( gl );
    p.add( new Fetch() )
    p.preRender( 64, 64 );
    p.render();
    testContext.assertNoError();
  });


  it( "render mipmap should leave clean state", function(){
    var p = new Post( gl, true );
    p.add( new Fetch() )
    p.preRender( 50, 50 );
    p.render();
    testContext.assertNoError();
  });


});
