'use strict';
const inquirer = require('inquirer');
const version = require('./version');
const prettyVersionDiff = require('./pretty-version-diff');

module.exports = async (options, pkg) => {
  // 旧版本
  const oldVersion = pkg.version;
  const extraBaseUrls = ['gitlab.com'];
  // 仓库地址
	const repoUrl = pkg.repository && githubUrlFromGit(pkg.repository.url, {extraBaseUrls});
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
