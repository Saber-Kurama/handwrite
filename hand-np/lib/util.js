'use strict';
const readPkgUp = require('read-pkg-up');
const pkgDir = require('pkg-dir');

// 读取 pkg 文件 返回 packageJson
exports.readPkg = packagePath => {
	packagePath = packagePath ? pkgDir.sync(packagePath) : pkgDir.sync();

	if (!packagePath) {
		throw new Error('No `package.json` found. Make sure the current directory is a valid package.');
	}

	const {packageJson} = readPkgUp.sync({
		cwd: packagePath
	});

	return packageJson;
};