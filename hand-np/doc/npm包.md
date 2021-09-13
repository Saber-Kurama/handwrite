## 关于一些 npm 包的使用规则

### read-pkg-up

作用：
  1. 查找最近的package.json
  2. 抛出更多有用的json错误
  3. 规范化数据

### issue-regex

用于匹配问题引用的正则表达式

```
import issueRegex from 'issue-regex';

'Fixes #143 and avajs/ava#1023'.match(issueRegex());
//=> ['#143', 'avajs/ava#1023']

```

linkify-issues

思考 怎么关联 coding的错误

### terminal-link

Create clickable links in the terminal

### execa

这个包改进了child_process方法：

### p-memoize

记住promise返回和异步函数

通过缓存具有相同输入的调用结果，可用于加速连续函数调用。

默认情况下，只考虑记忆化函数的第一个参数，并且它只适用于基元。如果您需要缓存多个参数或按值缓存objects ，请查看下面的选项。

### ow

函数参数验证

1. 富有表现力的可链接 API
2. 大量内置验证
3. 支持自定义验证
4. Node.js 中的自动标签推断
5. 用typescript写的

### pkg-dir

查找 Node.js 项目或 npm 包的根目录


### util

Node.js 的所有引擎的util模块。

### import-local

如果可用，让全局安装的软件包使用其自身的本地安装版本

对于希望在可用时遵循用户本地安装版本的 CLI 工具很有用，但如果未在本地安装它仍然可以工作。例如，AVA和XO使用这种方法。

### is-installed-globally

检查您的软件包是否已全局安装

### cosmiconfig

Cosmiconfig 为您的程序搜索并加载配置。

它具有基于 JavaScript 生态系统中传统期望的智能默认值。但它也足够灵活，可以搜索您想要搜索的任何地方，并加载您想要加载的任何内容。

默认情况下，Cosmiconfig 将从您告诉它开始的位置开始并在目录树中搜索以下内容：

* 一个package.json属性
* 一个 JSON 或 YAML，无扩展名的“rc 文件”
* 一个“RC文件”与扩展.json，.yaml，.yml，.js，或者.cjs
* a.config.js或.config.cjsCommonJS 模块

### meow

CLI 应用助手

* 解析参数
* 将标志转换为驼峰式
* 使用--no-前缀时否定标志
* 输出版本时 --version
* 输出描述和提供的帮助文本时 --help
* 使未处理的被拒绝的承诺很难失败，而不是默认的静默失败
* 将进程标题设置为 package.json 中定义的二进制名称

### semver
npm 的语义版本器

### npm-name
检查 npm 上是否有包或组织名称可用

### listr

终端任务列表

### async-exit-hook

异步退出的钩子
### hosted-git-info
这将使您能够识别和转换协议之间的各种 git 主机 URL。它还可以告诉您特定文件的原始路径的 URL 是什么，以便在没有 git 的情况下直接访问。

### npm-login-with-param
通过参数 来登录

### onetime
确保函数只调用一次

### log-symbols

各种日志级别的彩色符号