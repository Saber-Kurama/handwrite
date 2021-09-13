
const npmName = require('npm-name')

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
exports.isExternalRegistry = pkg => typeof pkg.publishConfig === 'object' && typeof pkg.publishConfig.registry === 'string'