'use strict';
const execa = require('execa');
const ignoreWalker = require('ignore-walk');
const pkgDir = require('pkg-dir');

// 最后的tag
exports.latestTag = async () => {
	const {stdout} = await execa('git', ['describe', '--abbrev=0', '--tags']);
	return stdout;
};

// 自上次发布以来的新文件
exports.newFilesSinceLastRelease = async () => {
	try {
		const {stdout} = await execa('git', ['diff', '--name-only', '--diff-filter=A', await this.latestTag(), 'HEAD']);
		if (stdout.trim().length === 0) {
			return [];
		}

		const result = stdout.trim().split('\n').map(row => row.trim());
		return result;
	} catch {
		// Get all files under version control
		return ignoreWalker({
			path: pkgDir.sync(),
			ignoreFiles: ['.gitignore']
		});
	}
};

// 获取当前分支
exports.currentBranch = async () => {
	const {stdout} = await execa('git', ['symbolic-ref', '--short', 'HEAD']);
	return stdout;
};


// 检查当前分支 是发不是分支
exports.verifyCurrentBranchIsReleaseBranch = async releaseBranch => {
	const currentBranch = await exports.currentBranch();
	if (currentBranch !== releaseBranch) {
		throw new Error(`Not on \`${releaseBranch}\` branch. Use --any-branch to publish anyway, or set a different release branch using --branch.`);
	}
};

// 当前分支是否是干净
exports.isWorkingTreeClean = async () => {
	try {
		const {stdout: status} = await execa('git', ['status', '--porcelain']);
		if (status !== '') {
			return false;
		}

		return true;
	} catch {
		return false;
	}
};

exports.verifyWorkingTreeIsClean = async () => {
	if (!(await exports.isWorkingTreeClean())) {
		throw new Error('Unclean working tree. Commit or stash changes first.');
	}
};

exports.isRemoteHistoryClean = async () => {
	let history;
	try { // Gracefully handle no remote set up.
		const {stdout} = await execa('git', ['rev-list', '--count', '--left-only', '@{u}...HEAD']);
		history = stdout;
	} catch {}

	if (history && history !== '0') {
		return false;
	}

	return true;
};
// 远端是否是干净的
exports.verifyRemoteHistoryIsClean = async () => {
	if (!(await exports.isRemoteHistoryClean())) {
		throw new Error('Remote history differs. Please pull changes.');
	}
};

// 本地分支是否有
async function hasLocalBranch(branch) {
	try {
		await execa('git', [
			'show-ref',
			'--verify',
			'--quiet',
			`refs/heads/${branch}`
		]);
		return true;
	} catch {
		return false;
	}
}

// 获取默认分支
exports.defaultBranch = async () => {
	for (const branch of ['main', 'master', 'gh-pages']) {
    console.log('branch', branch)
		// eslint-disable-next-line no-await-in-loop
		if (await hasLocalBranch(branch)) {
			return branch;
		}
	}

	throw new Error(
		'Could not infer the default Git branch. Please specify one with the --branch flag or with a np config.'
	);
};