module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'plugin:markdown/recommended',
    'plugin:mocha/recommended',
    'plugin:chai-expect/recommended',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-restricted-modules': ['error', { paths: ['fs', './src/to-be-restricted-on-import'] }],
    'no-restricted-syntax': ['error', {
      selector:
            'CallExpression[callee.name=\'parseInt\']',
      message: 'Use Joi to describe incoming request formats'
    }],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'never',
        prev: '*',
        next: 'block'
      }
    ]
  },
  overrides: [
    {
      files: [
        './src/*.js'
      ],
      rules: {
        indent: ['error', 3],
        'no-restricted-modules': ['error', { paths: ['to-be-restricted-on-contextual-import'] }]
      }
    },
    {
      files: [
        'browser/*.js'
      ],
      parserOptions: {
        ecmaVersion: 5,
        sourceType: 'script'
      },
      env: {
        browser: true
      }
    },
    {
      files: ['*.yaml', '*.yml'],
      plugins: ['yaml'],
      extends: ['plugin:yaml/recommended']
    }
  ]
}
