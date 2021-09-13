/**
 * 先决条件查询
 */
"use strict";
const execa = require('execa');
const Listr = require("listr");
const version = require('./version')
const npm = require("./npm/util");

module.exports = (input, pkg, options) => {
  // TODO: 后续修改 成 是否是本地私服
  const isExternalRegistry = npm.isExternalRegistry(pkg);
  // 子任务
  /**
   * 1. 是否 ping 的通 npm
   * 2. 检查最近的npm版本 检查npm 版本是否满足
   * 3. 检查yarn (如果使用yarn)
   * 4. 检查npm用户
   * 5. 检查 git 版本
   * 6. 检查 git 远端
   * 7. 检查版本
   * 8. 检查预览版本
   * 9. 检查 tag
   */
  const tasks = [
    {
      title: "Ping npm registry",
      enabled: () => !pkg.private && !isExternalRegistry,
      task: async () => npm.checkConnection(),
    },
    {
      title: "Check npm version",
      task: async () => npm.verifyRecentNpmVersion(),
    },
    {
      title: "Check yarn version",
      enabled: () => options.yarn === true,
      task: async () => {
        const { stdout: yarnVersion } = await execa("yarn", ["--version"]);
        version.verifyRequirementSatisfied("yarn", yarnVersion);
      },
    },
    // {
    //   title: "Verify user is authenticated",
    //   enabled: () => process.env.NODE_ENV !== "test" && !pkg.private,
    //   task: async () => {
    //     const username = await npm.username({
    //       externalRegistry: isExternalRegistry
    //         ? pkg.publishConfig.registry
    //         : false,
    //     });

    //     const collaborators = await npm.collaborators(pkg);
    //     if (!collaborators) {
    //       return;
    //     }

    //     const json = JSON.parse(collaborators);
    //     const permissions = json[username];
    //     if (!permissions || !permissions.includes("write")) {
    //       throw new Error(
    //         "You do not have write permissions required to publish this package."
    //       );
    //     }
    //   },
    // },
    // {
		// 	title: 'Check git version',
		// 	task: async () => git.verifyRecentGitVersion()
		// },
		// {
		// 	title: 'Check git remote',
		// 	task: async () => git.verifyRemoteIsValid()
		// },
    // {
		// 	title: 'Validate version',
		// 	task: () => {
		// 		if (!version.isValidInput(input)) {
		// 			throw new Error(`Version should be either ${version.SEMVER_INCREMENTS.join(', ')}, or a valid semver version.`);
		// 		}

		// 		newVersion = version(pkg.version).getNewVersionFrom(input);

		// 		if (version(pkg.version).isLowerThanOrEqualTo(newVersion)) {
		// 			throw new Error(`New version \`${newVersion}\` should be higher than current version \`${pkg.version}\``);
		// 		}
		// 	}
		// },
		// {
		// 	title: 'Check for pre-release version',
		// 	task: () => {
		// 		if (!pkg.private && version(newVersion).isPrerelease() && !options.tag) {
		// 			throw new Error('You must specify a dist-tag using --tag when publishing a pre-release version. This prevents accidentally tagging unstable versions as "latest". https://docs.npmjs.com/cli/dist-tag');
		// 		}
		// 	}
		// },
		// {
		// 	title: 'Check git tag existence',
		// 	task: async () => {
		// 		await git.fetch();

		// 		const tagPrefix = await getTagVersionPrefix(options);

		// 		await git.verifyTagDoesNotExistOnRemote(`${tagPrefix}${newVersion}`);
		// 	}
		// }
  ];
  return new Listr(tasks);
};
