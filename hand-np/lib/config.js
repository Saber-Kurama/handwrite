// 读取配置文件
'use strict';
const os = require('os');
const isInstalledGlobally = require('is-installed-globally');
const pkgDir = require('pkg-dir');
const {cosmiconfig} = require('cosmiconfig');

module.exports = async () => {
	const searchDir = isInstalledGlobally ? os.homedir() : await pkgDir();
  // 查找范围
	const searchPlaces = ['.np-config.json', '.np-config.js', '.np-config.cjs'];
	if (!isInstalledGlobally) {
		searchPlaces.push('package.json');
	}

	const explorer = cosmiconfig('np', {
		searchPlaces,
		stopDir: searchDir
	});
	const {config} = (await explorer.search(searchDir)) || {};

	return config;
};
