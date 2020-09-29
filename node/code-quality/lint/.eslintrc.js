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
  overrides: [
    {
      files: [
        'src/*.js'
      ],
      rules: {
        indent: ['error', 3],
        'no-restricted-imports': ['error', { paths: ['to-be-restricted-on-import'] }]
      }
    }
  ]
}
