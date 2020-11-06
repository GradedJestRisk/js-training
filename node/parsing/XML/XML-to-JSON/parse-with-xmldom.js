const fs = require('fs');
const util = require('util');
const { DOMParser } = require('xmldom');

const XMLString = fs.readFileSync('file.xml', 'utf8');
const XMLinJSON = new DOMParser().parseFromString(XMLString);
console.log(util.inspect(XMLinJSON, { depth: 1 }));

console.log('Just 1 level');



