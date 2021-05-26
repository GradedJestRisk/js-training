const defaultShell = require('default-shell');
const shellEnv = require('shell-env');

console.log('default shell is' + defaultShell);
console.log('env variable are ');

const unordered = shellEnv.sync();
const ordered = Object.keys(unordered).sort().reduce(
   (obj, key) => {
      obj[key] = unordered[key];
      return obj;
   },
   {}
);

console.dir(ordered);
