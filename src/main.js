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
    var pretty = require( 'js-object-pretty-print' ).pretty;
    var merge = require( 'lodash.merge' );

    //var sFormat = require( 'stringformat' );
    //var path = require( 'path' );
    //var process = require( './../lib/process' );
    //var chalk = require( 'chalk' );

    var opts = cli.opts;

    var bumperConfig = merge( {}, cli.getConfig(), opts );
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

    cli.subtle( 'config: ' + pretty( bumperConfig, 2 ) );


    bumpery.bump( bumperConfig, function ( err ) {
      if ( err ) {
        cli.subtle( 'Error: ', err.message );
        throw err;
      }
    } );


    //
    //    if ( files.length === 0 ) {
    //      //console.log( chalk.green( '>> no files to beautify' ) );
    //      cli.ok( 'No files to beautify' );
    //      return;
    //    }
    //
    //    var cfg = cli.getConfig();
    //
    //    var beautifier = require( './../index' );
    //    var checkOnly = !!opts.checkOnly;
    //    var useCache = !!opts.useCache;
    //
    //    if ( !checkOnly ) {
    //      beautifier.on( 'need:beautify.cli', function ( e, _args ) {
    //        cli.subtle( 'beautifying', _args.file );
    //      } );
    //
    //      beautifier.on( 'done.cli', function ( e, _args ) {
    //        var msg = chalk.green( '>> No files needed beautification!' );
    //
    //        if ( _args.count > 0 ) {
    //          msg = sFormat( '{0} {1} file(s) beautified', chalk.yellow( '>> beautifying done!' ), _args.count );
    //        }
    //
    //        console.log( msg );
    //      } );
    //    } else {
    //
    //      var filesToBeautify = [];
    //
    //      beautifier.on( 'need:beautify.cli', function ( e, _args ) {
    //        filesToBeautify.push( _args.file );
    //      } );
    //
    //      beautifier.on( 'done.cli', function () {
    //        if ( filesToBeautify.length > 0 ) {
    //          console.error( chalk.red( '>> the following files need beautification: ' ), chalk.yellow( '\n\n   - ' + filesToBeautify.join( '\n   - ' ) ) + '\n' );
    //          throw new Error( sFormat( '{0} files need beautification', filesToBeautify.length ) );
    //        } else {
    //          cli.success( 'All files are beautified.' );
    //        }
    //      } );
    //    }
    //
    //    cli.subtle( 'cache:', useCache, 'checkOnly:', checkOnly );
    //
    //    beautifier.beautify( files, {
    //      useCache: useCache,
    //      checkOnly: checkOnly,
    //      cfg: cfg
    //    } );
    //
    //    beautifier.off( '.cli' );
  }
};
