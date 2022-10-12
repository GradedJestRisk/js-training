module.exports = {
   extends: ['../.eslintrc.js'],
   rules: {
      'no-restricted-modules': [
         'error',
         { paths: ['fs', '../src/limited-imports/to-be-restricted-on-import'] }
      ]
   }
}
