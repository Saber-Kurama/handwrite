require('any-observable/register/rxjs-all');
const fs = require('fs');
const path = require('path');
const execa = require('execa')
const Listr = require('listr');
const split = require('split');
const {merge, throwError} = require('rxjs');
const {catchError, filter, finalize} = require('rxjs/operators');
const streamToObservable = require('@samverschueren/stream-to-observable');
const hasYarn = require('has-yarn');
const pkgDir = require('pkg-dir');
const hostedGitInfo = require('hosted-git-info');
const onetime = require('onetime');
const logSymbols = require('log-symbols');
const prerequisiteTasks = require('./prerequisite-tasks');
const gitTasks = require('./git-tasks')
const publish = require('./npm/publish');
const util = require('./util')

// TODO: 这个代码 后续好好理解
const exec = (cmd, args) => {
	// Use `Observable` support if merged https://github.com/sindresorhus/execa/pull/26
	const cp = execa(cmd, args);

	return merge(
		streamToObservable(cp.stdout.pipe(split())),
		streamToObservable(cp.stderr.pipe(split())),
		cp
	).pipe(filter(Boolean));
};

module.exports = async (input = 'patch', options) => {

  // 使用了yarn 但是没有安装 yarn
  if (!hasYarn() && options.yarn) {
		throw new Error('Could not use Yarn without yarn.lock file');
	}
  console.log('options', options)
  const pkg = util.readPkg(options.contents);
  // 是否执行测试
  const runTests = options.tests && !options.yolo;
  // 是否清除 重装
  const runCleanup = options.cleanup && !options.yolo;
  const pkgManager = options.yarn === true ? 'yarn' : 'npm';
	const pkgManagerName = options.yarn === true ? 'Yarn' : 'npm';
  // 项目根目录
  const rootDir = pkgDir.sync();
  // 是否有锁定版本
  const hasLockFile = fs.existsSync(path.resolve(rootDir, options.yarn ? 'yarn.lock' : 'package-lock.json')) || fs.existsSync(path.resolve(rootDir, 'npm-shrinkwrap.json'));
  const isOnGitHub = options.repoUrl && (hostedGitInfo.fromUrl(options.repoUrl) || {}).type === 'github';
  // 测试
  const testScript = options.testScript || 'test';
	const testCommand = options.testScript ? ['run', testScript] : [testScript]
  
  // 是否仅发布草稿
  // if (options.releaseDraftOnly) {
	// 	await releaseTaskHelper(options, pkg);
	// 	return pkg;
	// }
  
  // 发布状态
  let publishStatus = 'UNKNOWN';
	let pushedObjects;
  // 回滚
	const rollback = onetime(async () => {
		console.log('\nPublish failed. Rolling back to the previous state…');

		const tagVersionPrefix = await util.getTagVersionPrefix(options);

		const latestTag = await git.latestTag();
		const versionInLatestTag = latestTag.slice(tagVersionPrefix.length);

		try {
			if (versionInLatestTag === util.readPkg().version &&
				versionInLatestTag !== pkg.version) { // Verify that the package's version has been bumped before deleting the last tag and commit.
				await git.deleteTag(latestTag);
				await git.removeLastCommit();
			}

			console.log('Successfully rolled back the project to its previous state.');
		} catch (error) {
			console.log(`Couldn't roll back because of the following error:\n${error}`);
		}
	});
  console.log('pkg', pkg);
  /**
   * 任务
   * 1. 先决条件
   * 2. git 任务
   * 3. (需要)清除
   * 4. (需要)测试
   * 5. 更改版本
   * 6. (需要)发布
   * 7. (需要)2fa 校验
   * 8. 推送tag
   * 9. 发布草稿 github
   */
  const tasks = new Listr([
    {
      title: 'Prerequisite check',
      enabled: () => options.runPublish,
      task: () => prerequisiteTasks(input, pkg, options)
    },
    // {
		// 	title: 'Git',
		// 	task: () => gitTasks(options)
		// }
  ], {
    showSubtasks: false
  })
  
  // 清理
  if(runCleanup){

  }
  
  // 测试
  if(runTests) {

  }
  // 更改版本 (commit 版本更新信息)
  tasks.add([
		{
			title: 'Bumping version using Yarn',
			enabled: () => options.yarn === true,
			skip: () => {
        // 如果是预览就跳过
				if (options.preview) {
					let previewText = `[Preview] Command not executed: yarn version --new-version ${input}`;

					if (options.message) {
						previewText += ` --message '${options.message.replace(/%s/g, input)}'`;
					}

					return `${previewText}.`;
				}
			},
			task: () => {
				const args = ['version', '--new-version', input];

				if (options.message) {
					args.push('--message', options.message);
				}

				return exec('yarn', args);
			}
		},
		{
			title: 'Bumping version using npm',
			enabled: () => options.yarn === false,
			skip: () => {
        // 如果是预览就跳过
				if (options.preview) {
					let previewText = `[Preview] Command not executed: npm version ${input}`;

					if (options.message) {
						previewText += ` --message '${options.message.replace(/%s/g, input)}'`;
					}

					return `${previewText}.`;
				}
			},
			task: () => {
				const args = ['version', input];

				if (options.message) {
					args.push('--message', options.message);
				}

				return exec('npm', args);
			}
		}
	]);
  
  // 发布
  if (options.runPublish) {
    tasks.add([
      {
        title: `Publishing package using ${pkgManagerName}`,
				skip: () => {
          // 如果是预览就跳过
					if (options.preview) {
						const args = publish.getPackagePublishArguments(options);
						return `[Preview] Command not executed: ${pkgManager} ${args.join(' ')}.`;
					}
				},
        task: (context, task) => {
          let hasError = false;
          return publish(context, pkgManager, task, options)
						.pipe(
							catchError(async error => {
								hasError = true;
                // 回滚
								// await rollback();
								throw new Error(`Error publishing package:\n${error.message}\n\nThe project was rolled back to its previous state.`);
							}),
							finalize(() => {
								publishStatus = hasError ? 'FAILED' : 'SUCCESS';
							})
						);
        }
      }
    ])
  }

  tasks.add({
		title: 'Pushing tags',
		skip: async () => {
      // 没有上游
			if (!(await git.hasUpstream())) {
				return 'Upstream branch not found; not pushing.';
			}
      // 预览跳过
			if (options.preview) {
				return '[Preview] Command not executed: git push --follow-tags.';
			}
      // 推送失败
			if (publishStatus === 'FAILED' && options.runPublish) {
				return 'Couldn\'t publish package to npm; not pushing.';
			}
		},
		task: async () => {
			pushedObjects = await git.pushGraceful(isOnGitHub);
		}
	});

  await tasks.run();
  // ? 这个有值为啥报错呢？
  if (pushedObjects) {
		console.error(`\n${logSymbols.error} ${pushedObjects.reason}`);
	}

	const {packageJson: newPkg} = await readPkgUp();
	return newPkg;
}