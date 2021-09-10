"use strict";
// 这个主要是指定的 样式风格

module.exports = {
  extends: "stylelint-config-recommended",
  rules: {
    "at-rule-empty-line-before": [ // 要求或禁止在@规则之前的空行（可自动修复）。
      "always",
      {
        except: ["blockless-after-same-name-blockless", "first-nested"],
        ignore: ["after-comment"],
      },
    ],
    "at-rule-name-case": "lower", // 指定@规则名的大小写（可自动修复）。
    "at-rule-name-space-after": "always-single-line", // 要求在@规则名之后必须有一个空格（可自动修复）。
    "at-rule-semicolon-newline-after": "always", // 要求在@规则的分号之后必须有换行符（可自动修复）。
    "block-closing-brace-empty-line-before": "never", // 要求或禁止在块的闭大括号之前空行（可自动修复）。
    "block-closing-brace-newline-after": "always", // 要求在块的闭大括号之后必须有换行符或不能有空白符（可自动修复）。
    "block-closing-brace-newline-before": "always-multi-line", // 要求在块的闭大括号之前必须有换行符或不能有空白符（可自动修复）。
    "block-closing-brace-space-before": "always-single-line", // 要求在块的闭大括号之前必须有一个空格或不能有空白符（可自动修复）。
    "block-opening-brace-newline-after": "always-multi-line", // 要求在块的闭大括号之后必须有一个空格或不能有空白符。
    "block-opening-brace-space-after": "always-single-line", // 要求在块的开大括号之后必须有一个空格或不能有空白符（可自动修复）。
    "block-opening-brace-space-before": "always", // 要求在块的开大括号之前必须有一个空格或不能有空白符（可自动修复）。
    "color-hex-case": "lower", // 指定 16 进制颜色的大小写（可自动修复）。
    "color-hex-length": "short", // 指定 16 进制颜色的简写或扩写（可自动修复）。
    "comment-empty-line-before": [ // 要求或禁止在注释之前的空行（可自动修复）。
      "always",
      {
        except: ["first-nested"],
        ignore: ["stylelint-commands"],
      },
    ],
    "comment-whitespace-inside": "always", // 要求或禁止注释标记内侧的空白符（可自动修复）。
    "custom-property-empty-line-before": [ // 要求或禁止在自定义属性之前的空行（可自动修复）。
      "always",
      {
        except: ["after-custom-property", "first-nested"],
        ignore: ["after-comment", "inside-single-line-block"],
      },
    ],
    // 声明 和 声明块
    "declaration-bang-space-after": "never", // 要求在声明的叹号之后必须有一个空格或不能有空白符（可自动修复）。
    "declaration-bang-space-before": "always",
    "declaration-block-semicolon-newline-after": "always-multi-line",
    "declaration-block-semicolon-space-after": "always-single-line",
    "declaration-block-semicolon-space-before": "never",
    "declaration-block-single-line-max-declarations": 1,
    "declaration-block-trailing-semicolon": "always",
    "declaration-colon-newline-after": "always-multi-line",
    "declaration-colon-space-after": "always-single-line",
    "declaration-colon-space-before": "never",
    "declaration-empty-line-before": [
      "always",
      {
        except: ["after-declaration", "first-nested"],
        ignore: ["after-comment", "inside-single-line-block"],
      },
    ],
    // 函数
    "function-comma-newline-after": "always-multi-line", // 要求在函数的逗号之后必须有换行符或不能有空白符（可自动修复）。
    "function-comma-space-after": "always-single-line",
    "function-comma-space-before": "never",
    "function-max-empty-lines": 0,
    "function-name-case": "lower",
    "function-parentheses-newline-inside": "always-multi-line",
    "function-parentheses-space-inside": "never-single-line",
    "function-whitespace-after": "always",

    indentation: 2, // 指定缩进（可自动修复）。
    "length-zero-no-unit": true, // 禁止零长度的单位（可自动修复）。
    "max-empty-lines": 1, // 限制相邻空行的数量。
    // 媒体功能
    "media-feature-colon-space-after": "always", // 要求在媒体功能的冒号之后必须有一个空格或不能有空白符（可自动修复）。
    "media-feature-colon-space-before": "never",
    "media-feature-name-case": "lower",
    "media-feature-parentheses-space-inside": "never",
    "media-feature-range-operator-space-after": "always",
    "media-feature-range-operator-space-before": "always",
    "media-query-list-comma-newline-after": "always-multi-line",
    "media-query-list-comma-space-after": "always-single-line",
    "media-query-list-comma-space-before": "never",
    "no-eol-whitespace": true, // 禁止行尾空白符（可自动修复）。
    "no-missing-end-of-source-newline": true, // 禁止缺少源码结尾换行符（可自动修复）。
    "number-leading-zero": "always", // 要求或禁止小于 1 的小数有一个前导零（可自动修复）。
    "number-no-trailing-zeros": true, // 禁止数量的尾随零（可自动修复）。
    "property-case": "lower", // 指定属性的大小写（可自动修复）。
    "rule-empty-line-before": [ // 要求或禁止在规则之前的空行（可自动修复）。
      "always-multi-line",
      {
        except: ["first-nested"],
        ignore: ["after-comment"],
      },
    ],
    // 选择器风格
    "selector-attribute-brackets-space-inside": "never",
    "selector-attribute-operator-space-after": "never",
    "selector-attribute-operator-space-before": "never",
    "selector-combinator-space-after": "always",
    "selector-combinator-space-before": "always",
    "selector-descendant-combinator-no-non-space": true,
    "selector-list-comma-newline-after": "always",
    "selector-list-comma-space-before": "never",
    "selector-max-empty-lines": 0,
    "selector-pseudo-class-case": "lower",
    "selector-pseudo-class-parentheses-space-inside": "never",
    "selector-pseudo-element-case": "lower",
    "selector-pseudo-element-colon-notation": "double",
    "selector-type-case": "lower",
    "unit-case": "lower", // 指定单位的大小写（可自动修复）。 （PX 的话 需要修复）
    "value-keyword-case": "lower", // 指定关键字值的大小写（可自动修复）。
    // 值列表
    "value-list-comma-newline-after": "always-multi-line",
    "value-list-comma-space-after": "always-single-line",
    "value-list-comma-space-before": "never",
    "value-list-max-empty-lines": 0,
  },
};
