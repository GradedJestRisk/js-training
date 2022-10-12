module.exports = {
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: ['fs', './limited-imports'],
        patterns: [
          'fs/*',
          './limited-imports/*',
          '!./limited-imports/not-to-be-restricted-on-import'
        ]
      }
    ]
  }
}
