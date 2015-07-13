'use strict';

var semver = require( 'semver' );
var exec = require( 'child_process' ).exec;
var merge = require( 'extend' );
var expand = require( 'glob-expand' );
var read = require( 'read-file' ).readFileSync;
var write = require( 'write' ).sync;
var dispatchy = require( 'dispatchy' );
var readJSON = require( 'read-json-sync' );

var spawn = require( './lib/spawn' );

module.exports = merge( dispatchy.create(), {
  bump: function ( options, done ) {
    var me = this;
    //var DESC = 'Increment the version, commit, tag and push.';
    //grunt.registerTask('bump', DESC, function(versionType, incOrCommitOnly) {
    var opts = merge( true, {
      bumpVersion: true,
      commit: true,
      commitFiles: [
        'package.json'
      ], // '-a' for all files
      commitMessage: 'Release v%VERSION%',
      createTag: true,
      dryRun: false,
      files: [
        'package.json'
      ],
      gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
      globalReplace: false,
      prereleaseName: false,
      push: true,
      pushTo: 'origin master',
      regExp: false,
      setVersion: false,
      tagMessage: 'Version %VERSION%',
      tagName: 'v%VERSION%',
      versionType: false,
      verify: []
    }, options );

    done = done || function ( err ) {
        if ( err ) {
          throw err;
        }
    };

    var versionType = opts.versionType;
    var dryRun = opts.dryRun;

    var setVersion = opts.setVersion;
    if ( setVersion && !semver.valid( setVersion ) ) {
      setVersion = false;
    }

    var globalVersion; // when bumping multiple files
    var gitVersion; // when bumping using `git describe`

    var VERSION_REGEXP = opts.regExp || new RegExp(
        '([\'|"]?version[\'|"]?[ ]*:[ ]*[\'|"]?)(\\d+\\.\\d+\\.\\d+(-' +
          opts.prereleaseName +
          '\\.\\d+)?(-\\d+)?)[\\d||A-a|.|-]*([\'|"]?)', 'i'
    );
    if ( opts.globalReplace ) {
      VERSION_REGEXP = new RegExp( VERSION_REGEXP.source, 'gi' );
    }

    var queue = [ ];

    var next = function () {
      if ( !queue.length ) {
        me.fire( 'done' );
        return done( null );
      }
      queue.shift()();
    };

    var runIf = function ( condition, behavior ) {
      if ( condition ) {
        queue.push( behavior );
      }
    };

    //if ( dryRun ) {
    //grunt.log.writeln( 'Running grunt-bump in dry mode!' );
    //}

    //    if ( incOrCommitOnly === 'bump-only' ) {
    //      grunt.verbose.writeln( 'Only incrementing the version.' );
    //
    //      opts.commit = false;
    //      opts.createTag = false;
    //      opts.push = false;
    //    }

    //    if ( incOrCommitOnly === 'commit-only' ) {
    //      grunt.verbose.writeln( 'Only committing/tagging/pushing.' );
    //
    //      opts.bumpVersion = false;
    //    }

    runIf( typeof opts.verify === 'string' && opts.verify.trim() !== '', function () {
      var p = spawn( opts.verify );
      p.then( next );
      p.catch( function () {
        done( new Error( 'Verify step failed!' ) );
      } );
    } );

    // GET VERSION FROM GIT
    runIf( opts.bumpVersion && versionType === 'git', function () {
      exec( 'git describe ' + opts.gitDescribeOptions, function ( err, stdout ) {
        if ( err ) {
          //grunt.fatal( '' );
          done( new Error( 'Cannot get a version number using `git describe`' ) );
          return;
        }
        gitVersion = stdout.trim();
        next();
      } );
    } );

    // BUMP ALL FILES
    runIf( opts.bumpVersion, function () {
      var _files = expand.apply( null, opts.files );
      _files.forEach( function ( file /*, idx */ ) {
        var version = null;
        var content = read( file ).replace(
          VERSION_REGEXP, function ( match, prefix, parsedVersion, namedPre, noNamePre, suffix ) {
            var type = versionType === 'git' ? 'prerelease' : versionType;
            version = setVersion || semver.inc(
                parsedVersion, type || 'patch', gitVersion || opts.prereleaseName
            );
            return prefix + version + suffix;
          }
        );

        if ( !version ) {
          done( new Error( 'Cannot find a version to bump in ' + file ) );
          return;
        }

        var logMsg = 'Version bumped to ' + version + ' (in ' + file + ')';

        if ( !dryRun ) {
          write( file, content );
        } else {
          logMsg = 'bump-dry: ' + logMsg;
        }

        me.fire( 'write-file', {
          dryRun: dryRun,
          file: file,
          logMsg: logMsg
        } );

        if ( !globalVersion ) {
          globalVersion = version;
        }

        //        if ( !globalVersion ) {
        //          globalVersion = version;
        //        } else if ( globalVersion !== version ) {
        //          //grunt.warn( 'Bumping multiple files with different versions!' );
        //          done( new Error('Bumping multiple files with different versions!'));
        //          return;
        //        }
        //
        //        var configProperty = opts.updateConfigs[ idx ];
        //        if ( !configProperty ) {
        //          return;
        //        }
        //
        //        var cfg = grunt.config( configProperty );
        //        if ( !cfg ) {
        //          return grunt.warn(
        //              'Cannot update "' + configProperty + '" config, it does not exist!'
        //          );
        //        }

      //        cfg.version = version;
      //        grunt.config( configProperty, cfg );
      //        grunt.log.ok( configProperty + '\'s version updated' );
      } );
      next();
    } );


    // when only committing, read the version from package.json / pkg config
    runIf( !opts.bumpVersion, function () {
      globalVersion = readJSON( opts.files[ 0 ] ).version;
      next();
    } );


    // COMMIT
    runIf( opts.commit, function () {
      var commitMessage = opts.commitMessage.replace(
        '%VERSION%', globalVersion
      );
      var cmd = 'git commit ' + opts.commitFiles.join( ' ' );
      cmd += ' -m "' + commitMessage + '"';

      if ( dryRun ) {
        //grunt.log.ok( 'bump-dry: ' + cmd );
        me.fire( 'commit', { dryRun: dryRun, cmd: cmd } );
        next();
      } else {
        exec( cmd, function ( err, stdout, stderr ) {
          if ( err ) {
            done( new Error( 'Cannot create the commit:\n\n' + stderr ) );
            return;
          }

          me.fire( 'commit', {
            dryRun: dryRun,
            commitMessage: commitMessage
          } );
          //grunt.log.ok( 'Committed as "' + commitMessage + '"' );
          next();
        } );
      }
    } );


    // CREATE TAG
    runIf( opts.createTag, function () {
      var tagName = opts.tagName.replace( '%VERSION%', globalVersion );
      var tagMessage = opts.tagMessage.replace( '%VERSION%', globalVersion );

      var cmd = 'git tag -a ' + tagName + ' -m "' + tagMessage + '"';
      if ( dryRun ) {
        //grunt.log.ok( 'bump-dry: ' + cmd );
        me.fire( 'tag', { dryRun: dryRun, cmd: cmd } );
        next();
      } else {
        exec( cmd, function ( err, stdout, stderr ) {
          if ( err ) {
            done( new Error( 'Cannot create the tag:\n  ' + stderr ) );
          }
          //grunt.log.ok( 'Tagged as "' + tagName + '"' );
          me.fire( 'tag', { dryRun: dryRun, tagName: tagName } );
          next();
        } );
      }
    } );


    // PUSH CHANGES
    runIf( opts.push, function () {
      var cmd = 'git push ' + opts.pushTo + ' && ';
      cmd += 'git push ' + opts.pushTo + ' --tags --no-verify'; // verification happen in the previous push
      if ( dryRun ) {
        //grunt.log.ok( 'bump-dry: ' + cmd );
        me.fire( 'push', { dryRun: dryRun, cmd: cmd } );
        next();
      } else {
        exec( cmd, function ( err, stdout, stderr ) {
          if ( err ) {
            done( new Error( 'Cannot push to ' + opts.pushTo + ':\n  ' + stderr ) );
            return;
          }
          me.fire( 'push', { dryRun: dryRun, pustTo: opts.pushTo } );
          //grunt.log.ok( 'Pushed to ' + opts.pushTo );
          next();
        } );
      }
    } );

    next();
  }
} );
