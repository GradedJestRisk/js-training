const { tmpdir } = require('node:os');
const baseDirectory = `${tmpdir()}/dependencies-coverage`;
module.exports = {
   all: true,
   reporter: ['html'],
   include: ['lib/**/*.js'],
   exclude: ['**/.eslintrc.js'],
   'temp-dir': `${baseDirectory}/tmp`,
   'report-dir': `${baseDirectory}/report`
};
