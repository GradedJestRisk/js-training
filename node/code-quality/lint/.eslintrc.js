module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'standard',
    'plugin:node/recommended'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    //   "indent": ["error", 3] // 3 space indent (override rules defined by extends)
  },
  overrides: [
    // node files
    {
      files: [
        'bar.js',
        'folder/*.js'
      ],
      env: {
        node: true,
        es2021: true
      },
      extends: [
        'standard' // 2 space-indent
      ],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
      }
    }
  ]
}
