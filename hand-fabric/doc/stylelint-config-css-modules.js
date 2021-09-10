module.exports = {
  rules: {
    'selector-pseudo-class-no-unknown': [ // 禁止未知的伪类选择器。 忽略一些类 来支持 css module
      true,
      {
        ignorePseudoClasses: [
          'export',
          'import',
          'global',
          'local',
          'external',
        ],
      },
    ],
    'selector-type-no-unknown': [ // 禁止未知的类型选择器。
      true,
      {
        ignoreTypes: ['from'], // 忽略了from （是否添加上custom-elements）
      },
    ],
    'property-no-unknown': [ // 禁止未知属性 增加一些 忽略
      true,
      {
        ignoreProperties: ['composes', 'compose-with'],
        ignoreSelectors: [':export', /^:import/],
      },
    ],
    'at-rule-no-unknown': [ //禁止未知的@规则。 忽略一些
      true,
      {
        ignoreAtRules: ['value'],
      },
    ],
  },
};