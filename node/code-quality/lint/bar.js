// eslint-disable-next-line no-restricted-modules
const fs = require('fs')
fs.existsSync('../.eslintrc.yaml')

const bar = () => {
  return 'a 3 spaces-indented statement'
}

export { bar }
