#!/usr/bin/env node
'use strict';

const meow = require('meow');
const config = require('./config');
const git = require('./git-util');
const {isPackageNameAvailable} = require('./npm/util')
const version = require('./version');
const util = require('./util');
const ui = require('./ui');

const cli = meow(`
	Usage
	  $ np <version>

	  Version can be:
	    ${version.SEMVER_INCREMENTS.join(' | ')} | 1.2.3

	Options
	  --any-branch           Allow publishing from any branch
	  --branch               Name of the release branch (default: main | master)
	  --no-cleanup           Skips cleanup of node_modules
	  --no-tests             Skips tests
	  --yolo                 Skips cleanup and testing
	  --no-publish           Skips publishing
	  --preview              Show tasks without actually executing them
	  --tag                  Publish under a given dist-tag
	  --no-yarn              Don't use Yarn
	  --contents             Subdirectory to publish
	  --no-release-draft     Skips opening a GitHub release draft
	  --release-draft-only   Only opens a GitHub release draft for the latest published version
	  --test-script          Name of npm run script to run tests before publishing (default: test)
	  --no-2fa               Don't enable 2FA on new packages (not recommended)
	  --message              Version bump commit message, '%s' will be replaced with version (default: default: '%s' with npm and 'v%s' with yarn)

	Examples
	  $ np
	  $ np patch
	  $ np 1.0.2
	  $ np 1.0.2-beta.3 --tag=beta
	  $ np 1.0.2-beta.3 --tag=beta --contents=dist
`, {
	booleanDefault: undefined,
	flags: {
		anyBranch: {
			type: 'boolean'
		},
		branch: {
			type: 'string'
		},
		cleanup: {
			type: 'boolean'
		},
		tests: {
			type: 'boolean'
		},
		yolo: {
			type: 'boolean'
		},
		publish: {
			type: 'boolean'
		},
		releaseDraft: {
			type: 'boolean'
		},
		releaseDraftOnly: {
			type: 'boolean'
		},
		tag: {
			type: 'string'
		},
		yarn: {
			type: 'boolean'
		},
		contents: {
			type: 'string'
		},
		preview: {
			type: 'boolean'
		},
		testScript: {
			type: 'string'
		},
		'2fa': {
			type: 'boolean'
		},
		message: {
			type: 'string'
		}
	}
});

// 异步自执行函数
(async() => {
  console.log('??>>>')
  // pkg json
  const pkg = util.readPkg();

  // 默认标志
  const defaultFlags = {

  }
  // 本地配置
  const localConfig = await config();

  // 默认 本地配置 cli 进行合并 
  const flags = {
		...defaultFlags,
		...localConfig,
		...cli.flags
	};
  
  // 解决 meow的问题
  // Workaround for unintended auto-casing behavior from `meow`.
	if ('2Fa' in flags) {
		flags['2fa'] = flags['2Fa'];
	}
  // 不是仅发布草稿 && 发布 && 不是私有包
  const runPublish = !flags.releaseDraftOnly && flags.publish && !pkg.private;

  // 如果是发布的话 判断包名是否可用
  const availability = flags.publish ? await isPackageNameAvailable(pkg) : {
		isAvailable: false,
		isUnknown: false
	};

  // Use current (latest) version when 'releaseDraftOnly', otherwise use the first argument.
  //'releaseDraftOnly' 时使用当前（最新）版本，否则使用第一个参数。
	const version = flags.releaseDraftOnly ? pkg.version : (cli.input.length > 0 ? cli.input[0] : false);

  // 获取分支（git 默认分支）
  const branch = flags.branch || await git.defaultBranch()

  const options = await ui({
		...flags,
		availability,
		version,
		runPublish,
		branch
	}, pkg);

  // console.log(flags)
  // console.log(cli)
})().catch(error => {
  console.error(`\n${logSymbols.error} ${error.message}`);
	process.exit(1);
})
