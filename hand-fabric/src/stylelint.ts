module.exports = {
  extends: [
    "stylelint-config-standard", // 最基本的规范
    "stylelint-config-css-modules", // css modules 的规范
    // 'stylelint-config-rational-order',
    "stylelint-config-prettier",
    "stylelint-no-unsupported-browser-features", // 禁止目标浏览器不支持的属性
  ],
  // stylelint-declaration-block-no-ignored-properties 忽略 不起作用的属性
  plugins: [
    "stylelint-order",
    "stylelint-config-rational-order/plugin",
    "stylelint-declaration-block-no-ignored-properties",
  ],
  rules: {
    "order/properties-order": [],
    "at-rule-no-vendor-prefix": true, // 禁止@规则的浏览器引擎前缀。
    "no-descending-specificity": null, // 关掉 禁止低优先级的选择器出现在高优先级的选择器之后。
    //https://github.com/stylelint/stylelint/issues/4114
    "function-calc-no-invalid": null, // 关掉  主要是 less 或者 sass
    "function-url-quotes": "always", // 要求或禁止 URL 的引号。 必须有
    "font-family-no-missing-generic-family-keyword": null, // 主要是为了 iconfont
    "plugin/declaration-block-no-ignored-properties": true,
    "unit-no-unknown": [true, { ignoreUnits: ["rpx"] }], // 主要是 rpx rem 方案的转换
    // webcomponent
    "selector-type-no-unknown": null,
    "plugin/rational-order": [
      true,
      {
        "border-in-box-model": false, // border 放到 盒模型（还是不放到盒模型中了虽然是盒模型的一部分，但是boder的颜色）
        "empty-line-between-groups": false
      }
    ]
  },
  ignoreFiles: ["**/*.js", "**/*.jsx", "**/*.tsx", "**/*.ts"],
};
