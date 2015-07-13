'use strict';

var path = require( 'path' );

var prepareToExpand = function ( files ) {
  return files.map( function ( file ) {
    if ( path.isAbsolute( file ) ) {
      return file;
    } else {
      return path.relative( process.cwd(), file );
    }
  } );
};

module.exports = {
  run: function ( cli ) {
    var util = require( 'util' );
    var pretty = function ( arg ) {
      return util.inspect( arg, { depth: 3 } );
    };
    var merge = require( 'extend' );

    var opts = cli.opts;

    var bumperConfig = merge( { }, cli.getConfig(), opts );
    delete bumperConfig._;
    delete bumperConfig.config;

    //console.log( bumperConfig );

    var bumpery = require( '../' );

    bumpery.on( 'write-file commit tag push done', function ( e, args ) {
      if ( typeof args === 'object' && args !== null ) {
        cli.subtle( e.type + ': ' + pretty( args ) );
        return;
      }
      if ( e.type === 'done' ) {
        cli.ok( e.type );
      }
    } );

    if ( bumperConfig.files ) {
      bumperConfig.files = prepareToExpand( bumperConfig.files );
    }

    if ( bumperConfig.commitFiles ) {
      bumperConfig.commitFiles = prepareToExpand( bumperConfig.commitFiles );
    }

    cli.subtle( 'config: ' + pretty( bumperConfig ) );

    bumpery.bump( bumperConfig, function ( err ) {
      if ( err ) {
        cli.error( 'Error: ', err.message );
        throw err;
      }
    } );
  }
};
