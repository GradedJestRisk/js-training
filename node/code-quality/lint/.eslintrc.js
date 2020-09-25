module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    // 'standard' // 2 space-indent
    'eslint:recommended', // 4 space indent => doesn't work despite https://github.com/eslint/eslint/blob/master/lib/rules/indent.js#L633
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
        //'eslint:recommended', // 4 space indent
      ],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
      },
    }
  ]
}
