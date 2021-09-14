'use strict';
const inquirer = require('inquirer');
const version = require('./version');
const util = require('./util');
const prettyVersionDiff = require('./pretty-version-diff');
const {prereleaseTags, checkIgnoreStrategy, getRegistryUrl, isExternalRegistry} = require('./npm/util')

const checkNewFiles = async pkg => {
	const newFiles = await util.getNewFiles(pkg);
	if ((!newFiles.unpublished || newFiles.unpublished.length === 0) && (!newFiles.firstTime || newFiles.firstTime.length === 0)) {
		return true;
	}

	const messages = [];
	if (newFiles.unpublished.length > 0) {
		messages.push(`The following new files will not be part of your published package:\n${chalk.reset(newFiles.unpublished.map(path => `- ${path}`).join('\n'))}`);
	}

	if (newFiles.firstTime.length > 0) {
		messages.push(`The following new files will be published the first time:\n${chalk.reset(newFiles.firstTime.map(path => `- ${path}`).join('\n'))}`);
	}

	if (!isInteractive()) {
		console.log(messages.join('\n'));
		return true;
	}

	const answers = await inquirer.prompt([{
		type: 'confirm',
		name: 'confirm',
		message: `${messages.join('\n')}\nContinue?`,
		default: false
	}]);

	return answers.confirm;
};

module.exports = async (options, pkg) => {
  // 旧版本
  const oldVersion = pkg.version;
  const extraBaseUrls = ['gitlab.com'];
  // 仓库地址
	const repoUrl = pkg.repository && githubUrlFromGit(pkg.repository.url, {extraBaseUrls});
  const pkgManager = options.yarn ? 'yarn' : 'npm';
	const registryUrl = await getRegistryUrl(pkgManager, pkg);
	const releaseBranch = options.branch

  if (options.runPublish) {
    checkIgnoreStrategy(pkg)

    const answerIgnoredFiles = await checkNewFiles(pkg);
  }
  /**
   * 问题
   */
  const prompts = [
    {
      type: 'list',
			name: 'version',
			message: 'Select semver increment or specify new version',
      pageSize: version.SEMVER_INCREMENTS.length + 2,
      choices: version.SEMVER_INCREMENTS
				.map(inc => ({
					name: `${inc} 	${prettyVersionDiff(oldVersion, inc)}`,
					value: inc
				}))
				.concat([
					new inquirer.Separator(),
					{
						name: 'Other (specify)',
						value: null
					}
				]),
      filter: input => version.isValidInput(input) ? version(oldVersion).getNewVersionFrom(input) : input
    },
    {
      type: 'input',
      name: 'customVersion',
      message: 'Version',
      when: answer => !answer.version, // 没有版本的才会有这个值
      filter: input => version.isValidInput(input) ? version(pkg.version).getNewVersionFrom(input) : input,
			validate: input => {
				if (!version.isValidInput(input)) {
					return 'Please specify a valid semver, for example, `1.2.3`. See https://semver.org';
				}

				if (version(oldVersion).isLowerThanOrEqualTo(input)) {
					return `Version must be greater than ${oldVersion}`;
				}

				return true;
			}
    },
    // tag 是否 预发布 版本 打 tag

  ]
  // 答案
  const answer = await inquirer.prompt(prompts)
  
  console.log('answer', answer)
  return {
    ...options,
    ...answer
  }
}
