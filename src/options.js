var path = require( 'path' );

module.exports = {
  pkgJSONPath: path.resolve( __dirname, '../package.json' ),
  configFile: {
    defaultName: 'bump.json',
    pathToLocalConfig: path.resolve( __dirname, '../configs/bump.json' ),
    description: 'Path to your `bump.json` config, if not provided will try to use the `bump.json` file in your current working directory, if not found will use the one provided with this package'
  },
  //useDefaultOptions: 'true',
  optionator: {
    prepend: 'Usage: bumpery [options]',
    options: [
      {
        heading: 'Options'
      },
      {
        option: 'versionType',
        type: 'String',
        enum: [
          'git',
          'patch',
          'minor',
          'major',
          'prepatch',
          'preminor',
          'premajor',
          'prerelease'
        ],
        default: 'patch',
        description: 'The versionType to use. If defined will override the the one in the config'
      },
      {
        'option': 'bumpVersion',
        'type': 'Boolean',
        'default': 'true',
        'description': 'Bump the version?. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'commit',
        'type': 'Boolean',
        'default': 'true',
        'description': 'Create a commit? If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'commitFiles',
        'type': '[String]',
        'default': '["package.json"]',
        'description': 'Which files to commit. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'commitMessage',
        'type': 'String',
        'default': 'BLD: Release v%VERSION%',
        'description': 'The commit message. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'createTag',
        'type': 'Boolean',
        'default': 'true',
        'description': 'Create a tag? If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'dryRun',
        'alias': 'd',
        'type': 'Boolean',
        'default': 'false',
        'description': 'Just show which commands will be executed. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'files',
        'alias': 'f',
        'type': '[String]',
        'default': '["package.json"]',
        'description': 'The files to bump. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'gitDescribeOptions',
        'type': 'String',
        'default': '--tags --always --abbrev=1 --dirty=-d',
        'description': 'The options to get the version from git. when the action is `git`. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'globalReplace',
        'type': 'Boolean',
        'default': 'false',
        'description': 'Replace all fields that match the version Regex. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'prereleaseName',
        'type': 'String',
        'description': 'The prerelease name. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'push',
        'alias': 'p',
        'type': 'Boolean',
        'default': 'true',
        'description': 'Push the commit/tag? If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'pushTo',
        'type': 'String',
        'default': 'origin master',
        'description': 'If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'setVersion',
        'alias': 's',
        'type': 'String',
        'description': 'The version to set. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'tagMessage',
        'type': 'String',
        'default': 'Version %VERSION%',
        'description': 'The tag message. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'tagName',
        'type': 'String',
        'default': 'v%VERSION%',
        'description': 'The tagName. If the value is present will override the one provided in the config file if one found'
      },
      {
        'option': 'verify',
        'type': 'String',
        'default': '',
        'description': 'The verify command to execute before running bump. For example: `npm test`'
      }
    ]
  }
};
