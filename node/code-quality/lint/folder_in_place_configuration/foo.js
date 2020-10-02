// eslint-disable-next-line no-restricted-modules
require("../src/limited-imports/to-be-restricted-on-import")()

require("../src/limited-imports/not-to-be-restricted-on-import")()

require("../src/to-be-restricted-on-import")()

// eslint-disable-next-line no-restricted-modules
const fs = require("fs")

fs.existsSync("../.eslintrc.yaml")
