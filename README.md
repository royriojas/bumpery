[![NPM Version](http://img.shields.io/npm/v/bumpery.svg?style=flat)](https://npmjs.org/package/bumpery)
[![Build Status](http://img.shields.io/travis/royriojas/bumpery.svg?style=flat)](https://travis-ci.org/royriojas/bumpery)

# bumpery
> Yet another bump module, but this works exactly like the grunt-bump one, but without grunt

## Motivation

I was used to using to [grunt-bump](https://www.npmjs.com/package/grunt-bump), but for a small 
nodejs module, having to install grunt to just be able to run bump seemed like an overkill. So this is basically
the same code as in `grunt-bump`, but can be run from the command line or used as a library.

## Install

```bash
npm i -g bumpery
```

## Usage
```
Usage: bumpery [options]

Options:
  --versionType One of: git, patch, minor, major, prepatch, preminor, premajor, prerelease  The versionType to use. If defined will override the the one in the config - default: patch
  --no-bumpVersion             Bump the version?. If the value is present will override the one provided in the config file if one found
  --no-commit                  Create a commit? If the value is present will override the one provided in the config file if one found
  --commitFiles [String]       Which files to commit. If the value is present will override the one provided in the config file if one found - default: ["package.json"]
  --commitMessage String       The commit message. If the value is present will override the one provided in the config file if one found - default: BLD: Release v%VERSION%
  --no-createTag               Create a tag? If the value is present will override the one provided in the config file if one found
  -d, --dryRun                 Just show which commands will be executed. If the value is present will override the one provided in the config file if one found - default: false
  -f, --files [String]         The files to bump. If the value is present will override the one provided in the config file if one found - default: ["package.json"]
  --gitDescribeOptions String  The options to get the version from git. when the action is `git`. If the value is present will override the one provided in the config file if one found - default: --tags
                               --always --abbrev=1 --dirty=-d
  --globalReplace              Replace all fields that match the version Regex. If the value is present will override the one provided in the config file if one found - default: false
  --prereleaseName String      The prerelease name. If the value is present will override the one provided in the config file if one found
  -p, --push                   Push the commit/tag? If the value is present will override the one provided in the config file if one found - default: true
  --pushTo String              If the value is present will override the one provided in the config file if one found - default: origin master
  -s, --setVersion String      The version to set. If the value is present will override the one provided in the config file if one found
  --tagMessage String          The tag message. If the value is present will override the one provided in the config file if one found - default: Version %VERSION%
  --tagName String             The tagName. If the value is present will override the one provided in the config file if one found - default: v%VERSION%
  --verify String              The verify command to execute before running bump. For example: `npm test`. If the task fail, the bump will stop.
  -h, --help                   Show this help
  -v, --version                Outputs the version number
  -q, --quiet                  Show only the summary info
  -c, --config String          Path to your `bump.json` config, if not provided will try to use the `bump.json` file in your current working directory, if not found will use the one provided with this
                               package
```

All the options prefixed by `--no` can be used directly for example:

```bash
bumpery --no-commit   
#the previous is equivalent to:
bumpery --commit=true 
```

And the config file, should look like the one below. If you don't provide a config file the one in this 
package `configs/bump.json` file will be used. All the options passed on the cli command will override the defaults ones
in this config file

```javascript
{
  "bumpVersion": true,
  "commit": true,
  "commitFiles": [
    "package.json"
  ],
  "commitMessage": "BLD: Release v%VERSION%",
  "createTag": true,
  "dryRun": false,
  "files": [
    "package.json"
  ],
  "gitDescribeOptions": "--tags --always --abbrev=1 --dirty=-d",
  "globalReplace": false,
  "prereleaseName": false,
  "push": true,
  "pushTo": "origin master",
  "setVersion": true,
  "tagMessage": "Version %VERSION%",
  "tagName": "v%VERSION%",
  "verify" : ''
}
```

## Examples

```bash
# this is the same as run bumpery path
bumpery 

# run a task before bump
bumpery --verify='npm test'

# dry run. This will just show what the command will do
bumpery -d 
```

## Changelog

[Changelog](./changelog.md)
