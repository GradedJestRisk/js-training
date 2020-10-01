// eslint-disable-next-line no-restricted-modules
const fs = require('fs')
fs.existsSync('../.eslintrc.yaml')

const bar = () => {
  return 'a 3 spaces-indented statement'
}

// eslint-disable-next-line no-restricted-modules
const bor = require('./src/to-be-restricted-on-import')
bor()

const borfoo = require('./src/to-be-restricted-on-contextual-import')
borfoo()

module.exports = { bar }
