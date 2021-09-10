#!/usr/bin/env node
'use strict';

const util = require('./util');

// 异步自执行函数
(async() => {

})().catch(error => {
  console.error(`\n${logSymbols.error} ${error.message}`);
	process.exit(1);
})
