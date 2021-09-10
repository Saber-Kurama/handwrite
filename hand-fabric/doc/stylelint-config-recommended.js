'use strict';

module.exports = {
	rules: {
		'at-rule-no-unknown': true, // 禁止未知的@规则。
		'block-no-empty': true, // 禁止空块。
		'color-no-invalid-hex': true, // 禁止无效的 16 进制颜色。
		'comment-no-empty': true, // 禁止空注释。
		'declaration-block-no-duplicate-custom-properties': true, // 在声明的块中中禁止出现自定义重复的属性。
		'declaration-block-no-duplicate-properties': [ // 在声明的块中中禁止出现重复的属性。
			true,
			{
        // 忽略具有不同值的连续重复属性。
        /*
         * p {
            font-size: 16px;
            font-size: 1rem;
            font-weight: 400;
          }
         */
				ignore: ['consecutive-duplicates-with-different-values'], 
			},
		],
		'declaration-block-no-shorthand-property-overrides': true, //禁止简写属性覆盖相关的扩写属性。
		'font-family-no-duplicate-names': true, // 禁止重复的字体族名称。
		'font-family-no-missing-generic-family-keyword': true, // 禁止在字体族名称列表中缺少通用字体族关键字。
		'function-calc-no-invalid': true, // 禁止在 calc 函数中使用无效表达式。
		'function-calc-no-unspaced-operator': true, // 禁止在 calc 函数中使用没有间隔的运算符。
		'function-linear-gradient-no-nonstandard-direction': true, // 禁止在 linear-gradient() 中调用不符合标准语法的无效方向值。
		'keyframe-declaration-no-important': true, // 禁止关键帧声明的 !important。
		'media-feature-name-no-unknown': true, // 禁止未知的媒体功能名。
		'named-grid-areas-no-invalid': true, // 禁止使用无效的命名网格区域。
		'no-descending-specificity': true, // 禁止低优先级的选择器出现在高优先级的选择器之后。
		'no-duplicate-at-import-rules': true, // 禁止在样式表中使用重复的 @import 规则。
		'no-duplicate-selectors': true, // 禁止样式表中的重复选择器。
		'no-empty-source': true, // 禁止空源码。
		'no-extra-semicolons': true, // 禁止额外的分号（可自动修复）。
		'no-invalid-double-slash-comments': true, // 禁止 CSS 不支持并可能导致意外结果的双斜杠注释（//...）。
		'no-invalid-position-at-import-rule': true, // 禁止@import样式表中的无效位置规则。
		'no-irregular-whitespace': true, //禁止不规则空格。
		'property-no-unknown': true, // 禁止未知属性。
		'selector-pseudo-class-no-unknown': true, // 禁止未知的伪类选择器。
		'selector-pseudo-element-no-unknown': true, // 禁止未知的伪元素选择器。
		'selector-type-no-unknown': [ // 禁止未知的类型选择器。
			true,
			{
				ignore: ['custom-elements'],
			},
		],
		'string-no-newline': true, // 禁止字符串中的(未转义)换行符。
		'unit-no-unknown': true, // 禁止未知的单位。
	},
};