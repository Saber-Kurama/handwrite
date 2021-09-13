'use strict';
const Listr = require('listr');
const git = require('./git-util');

module.exports = options => {
  /**
   *  任务
   * 1. 检查当前分支
   * 2. 检查本地分支是否有没有提交
   * 3. 检查是否有没有提交到远端的
   */
	const tasks = [
		{
			title: 'Check current branch',
			task: () => git.verifyCurrentBranchIsReleaseBranch(options.branch)
		},
		{
			title: 'Check local working tree',
			task: () => git.verifyWorkingTreeIsClean()
		},
		{
			title: 'Check remote history',
			task: () => git.verifyRemoteHistoryIsClean()
		}
	];

	if (options.anyBranch) {
		tasks.shift();
	}

	return new Listr(tasks);
};
