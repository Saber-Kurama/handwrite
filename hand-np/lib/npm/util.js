
const fs = require('fs');
const path = require('path');
const execa = require('execa');
const pTimeout = require('p-timeout');
const npmName = require('npm-name');
const chalk = require('chalk');
const pkgDir = require('pkg-dir');
const minimatch = require('minimatch');
const {verifyRequirementSatisfied} = require('../version')

// According to https://docs.npmjs.com/files/package.json#files
// npm's default behavior is to ignore these files.
const filesIgnoredByDefault = [
	'.*.swp',
	'.npmignore',
	'.gitignore',
	'._*',
	'.DS_Store',
	'.hg',
	'.npmrc',
	'.lock-wscript',
	'.svn',
	'.wafpickle-N',
	'*.orig',
	'config.gypi',
	'CVS',
	'node_modules/**/*',
	'npm-debug.log',
	'package-lock.json',
	'.git/**/*',
	'.git'
];

// npm  ping 连接
exports.checkConnection = () => pTimeout(
	(async () => {
		try {
			await execa('npm', ['ping']);
			return true;
		} catch {
			throw new Error('Connection to npm registry failed');
		}
	})(),
	15000,
	'Connection to npm registry timed out'
);

// 检查 包名是否可用
exports.isPackageNameAvailable = async pkg => {
	const args = [pkg.name];
	const availability = {
		isAvailable: false,
		isUnknown: false
	};

  // 是不是外部配置
	if (exports.isExternalRegistry(pkg)) {
    // 发布包的地址
		args.push({
			registryUrl: pkg.publishConfig.registry
		});
	}

	try {
    // 判断是否有效
		availability.isAvailable = await npmName(...args) || false;
	} catch {
		availability.isUnknown = true;
	}

	return availability;
};
// 发布的配置是一个对象并且registry
// package.json 中 publishConfig 有值 代表是外部发包
exports.isExternalRegistry = pkg => typeof pkg.publishConfig === 'object' && typeof pkg.publishConfig.registry === 'string';

// npm 版本
exports.version = async () => {
	const {stdout} = await execa('npm', ['--version']);
	return stdout;
};

exports.verifyRecentNpmVersion = async () => {
	const npmVersion = await exports.version();
	verifyRequirementSatisfied('npm', npmVersion);
};

exports.checkIgnoreStrategy = ({files}) => {
	if (!files && !npmignoreExistsInPackageRootDir()) {
		console.log(`
		\n${chalk.bold.yellow('Warning:')} No ${chalk.bold.cyan('files')} field specified in ${chalk.bold.magenta('package.json')} nor is a ${chalk.bold.magenta('.npmignore')} file present. Having one of those will prevent you from accidentally publishing development-specific files along with your package's source code to npm.
		`);
	}
};

function npmignoreExistsInPackageRootDir() {
	const rootDir = pkgDir.sync();
	return fs.existsSync(path.resolve(rootDir, '.npmignore'));
}

function getFilesNotIncludedInFilesProperty(pkg, fileList) {
	const globArrayForFilesAndDirectories = [...pkg.files];
	const rootDir = pkgDir.sync();
	for (const glob of pkg.files) {
		try {
			if (fs.statSync(path.resolve(rootDir, glob)).isDirectory()) {
				globArrayForFilesAndDirectories.push(`${glob}/**/*`);
			}
		} catch {}
	}

	const result = fileList.filter(minimatch.filter(getIgnoredFilesGlob(globArrayForFilesAndDirectories, pkg.directories), {matchBase: true, dot: true}));
	return result.filter(minimatch.filter(getDefaultIncludedFilesGlob(pkg.main), {nocase: true, matchBase: true}));
}

function getIgnoredFilesGlob(globArrayFromFilesProperty, packageDirectories) {
	// Test files are assumed not to be part of the package
	let testDirectoriesGlob = '';
	if (packageDirectories && Array.isArray(packageDirectories.test)) {
		testDirectoriesGlob = packageDirectories.test.join(',');
	} else if (packageDirectories && typeof packageDirectories.test === 'string') {
		testDirectoriesGlob = packageDirectories.test;
	} else {
		// Fallback to `test` directory
		testDirectoriesGlob = 'test/**/*';
	}

	return `!{${globArrayFromFilesProperty.join(',')},${filesIgnoredByDefault.join(',')},${testDirectoriesGlob}}`;
}

// Get all files which will be ignored by either `.npmignore` or the `files` property in `package.json` (if defined).
exports.getNewAndUnpublishedFiles = async (pkg, newFiles = []) => {
	if (pkg.files) {
		return getFilesNotIncludedInFilesProperty(pkg, newFiles);
	}

	if (npmignoreExistsInPackageRootDir()) {
		return getFilesIgnoredByDotnpmignore(pkg, newFiles);
	}
};

// 获取 npm 地址
exports.getRegistryUrl = async (pkgManager, pkg) => {
  const args = ["config", "get", "registry"];
  // 设置 npm 的registry 地址
  if (exports.isExternalRegistry(pkg)) {
    args.push("--registry");
    args.push(pkg.publishConfig.registry);
  }

  const { stdout } = await execa(pkgManager, args);
  return stdout;
};

