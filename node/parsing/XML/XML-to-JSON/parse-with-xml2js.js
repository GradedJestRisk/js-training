const fs = require('fs');
const util = require('util');
const {parseString} = require('xml2js');

let XMLinJSON;
const XMLString = fs.readFileSync('file.xml', 'utf8');

parseString(XMLString, function (err, result) {
    XMLinJSON = result;
});

console.log(util.inspect(XMLinJSON, { depth: Infinity }));
