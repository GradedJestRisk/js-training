'use strict';
const { object } = require('./module.js');

module.exports = () => {
    console.log('Object in client 1 before mutation: ', object.string);
    object.string = 'mutatedState';
    console.log('Object in client 1 after mutation: ', object.string);
};
