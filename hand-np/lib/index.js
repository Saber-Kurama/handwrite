const Listr = require('listr');
const hasYarn = require('has-yarn');
const publish = require('./npm/publish');


module.exports = async (input = 'patch', options) => {

  // 使用了yarn 但是没有安装 yarn
  if (!hasYarn() && options.yarn) {
		throw new Error('Could not use Yarn without yarn.lock file');
	}
  const tasks = new Listr()
}