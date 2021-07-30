require('dotenv').config();

console.log(`string is "${process.env.string}" in node`);

const execSync = require('child_process').execSync;
const code = execSync('echo $string').toString().trim();
console.log(`string is "${code}" in a child process`);

console.log(`setting string to "foo" in child process`);
execSync('string=foo').toString().trim();
console.log(`string is "${process.env.string}" in node`);

console.log(`exporting string to "foo" in child process`);
execSync('export string=foo').toString().trim();
console.log(`string is "${process.env.string}" in node`);
