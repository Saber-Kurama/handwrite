/**
 * 版本差异 
 */
 'use strict';
 const chalk = require('chalk');
 const version = require('./version');

 // 美好 版本的差异
 module.exports = (oldVersion, inc) => {
	const newVersion = version(oldVersion).getNewVersionFrom(inc).split('.');
	oldVersion = oldVersion.split('.');
	let firstVersionChange = false;
	const output = [];
  
	for (const [i, element] of newVersion.entries()) {
		if ((element !== oldVersion[i] && !firstVersionChange)) {
			output.push(`${chalk.dim.cyan(element)}`); // 第一次的修改
			firstVersionChange = true;
		} else if (element.indexOf('-') >= 1) { // 预览版
			let preVersion = [];
			preVersion = element.split('-');
			output.push(`${chalk.dim.cyan(`${preVersion[0]}-${preVersion[1]}`)}`);
		} else {
			output.push(chalk.reset.dim(element));
		}
	}
	return output.join(chalk.reset.dim('.'));
};
