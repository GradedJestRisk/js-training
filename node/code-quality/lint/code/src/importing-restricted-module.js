const bar = require('./to-be-restricted-on-import');
bar();

const barfoo = require('./to-be-restricted-on-contextual-import');
barfoo();

const barfoofoo = require('./limited-imports/to-be-restricted-on-import');
barfoofoo();
