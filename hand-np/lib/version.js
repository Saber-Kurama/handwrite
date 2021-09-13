'use strict';
const semver = require('semver');

class Version {
  constructor(version) {
		this.version = version;
	}
  
  // 是否是预览版  1.2.3-alpha.3
  isPrerelease() {
    return Boolean(semver.prerelease(this.version));
  }

  // 是否满足 一个范围
  satisfies(range) {
    module.exports.validate(this.version);
    return semver.satisfies(this.version, range, {
			includePrerelease: true
		});
  }

  // 获取新的版本
  getNewVersionFrom(input) {
    module.exports.validate(this.version);
    // 校验新版本
    if (!module.exports.isValidInput(input)) {
			throw new Error(`Version should be either ${module.exports.SEMVER_INCREMENTS.join(', ')} or a valid semver version.`);
		}
    // SEMVER_INCREMENTS 自动生成版本 
    return module.exports.SEMVER_INCREMENTS.includes(input) ? semver.inc(this.version, input) : input;
  }
  
  isGreaterThanOrEqualTo(otherVersion) {
    module.exports.validate(this.version);
		module.exports.validate(otherVersion);

		return semver.gte(otherVersion, this.version)
  }

  // 低于或者等于 
  isLowerThanOrEqualTo(otherVersion) {
    module.exports.validate(this.version);
		module.exports.validate(otherVersion);
    return semver.lte(otherVersion, this.version);
  }

}

// 实例化
module.exports = version => new Version(version)

module.exports.SEMVER_INCREMENTS = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
module.exports.PRERELEASE_VERSIONS = ['prepatch', 'preminor', 'premajor', 'prerelease'];
// 是否是预览版本
module.exports.isPrereleaseOrIncrement = input => module.exports(input).isPrerelease() || module.exports.PRERELEASE_VERSIONS.includes(input);
const isValidVersion = input => Boolean(semver.valid(input));

// 校验新的版本
module.exports.isValidInput = input => module.exports.SEMVER_INCREMENTS.includes(input) || isValidVersion(input)

module.exports.validate = version => {
	if (!isValidVersion(version)) {
		throw new Error('Version should be a valid semver version.');
	}
};

// 检查版本 是否满足 依赖的要求（package.json）
module.exports.verifyRequirementSatisfied = (dependency, version) => {
	const depRange = require('../package.json').engines[dependency];
	if (!module.exports(version).satisfies(depRange)) {
		throw new Error(`Please upgrade to ${dependency}${depRange}`);
	}
};

