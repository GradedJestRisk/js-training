module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'plugin:markdown/recommended',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-restricted-modules': ['error', { paths: ['fs', './src/to-be-restricted-on-import'] }]
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
    }
  ]
}
