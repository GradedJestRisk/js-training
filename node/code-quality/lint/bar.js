// eslint-disable-next-line no-restricted-modules
const fs = require('fs')
fs.existsSync('../.eslintrc.yaml')

const bar = () => {
  const message = 'a 3 spaces-indented statement'

  return message
  // add empty lien here to get padding-line-between-statements warning
}

// eslint-disable-next-line no-restricted-modules
const bor = require('./src/to-be-restricted-on-import')
bor()

const borfoo = require('./src/to-be-restricted-on-contextual-import')
borfoo()

module.exports = { bar }
