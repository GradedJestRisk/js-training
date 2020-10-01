module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-restricted-modules': ['error', { paths: ['fs'] }]
  },
  overrides: [
    {
      files: [
        'src/*.js'
      ],
      rules: {
        indent: ['error', 3],
        'no-restricted-imports': ['error', 'fs']
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
