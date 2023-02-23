'use strict';
const { object } = require('./module.js');

module.exports = () => {
    console.log('Object in client 2: ', object.string);
};
