var Promise = require( 'es6-promise' ).Promise;

module.exports = function spawn( cmd ) {

  var _spawn = require( 'child_process' ).spawn;
  var args = cmd.split( ' ' );
  var command = args.shift();

  var p = new Promise( function ( resolve, reject ) {
    var cp = _spawn( command, args, { stdio: 'inherit' } );

    cp.on( 'exit', function ( exitCode ) {
      if ( exitCode !== 0 ) {
        reject( exitCode );
      } else {
        resolve();
      }
    } );
  } );

  return p;
};
