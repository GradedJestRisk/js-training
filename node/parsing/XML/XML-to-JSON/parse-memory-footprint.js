const fs = require('fs');
const { DOMParser } = require('xmldom');
const {parseString} = require('xml2js');
const util = require('util');
const sizeof = require('sizeof');

console.log('\n --------- no library --------------');
const plainJSON = {
    greatMother: {
        name : 'Susie',
        mother: {
            name : 'Barbara', daughter : { name : 'Alice', text : "Hey!"  }
        }
    }
};

console.log('plain JSON is :');
console.log(util.inspect(plainJSON, { depth: Infinity }));
console.log('its memory size is ' + sizeof.sizeof(plainJSON, true));


console.log('\n ------------ xml2js library -----------');
let XMLBareMapppingToJSON;
const XMLString = fs.readFileSync('file.xml', 'utf8');
parseString(XMLString, function (err, result) {
    XMLBareMapppingToJSON = result;
});

console.log('XML bare mapping to JSON is :')
console.log(util.inspect(XMLBareMapppingToJSON, { depth: Infinity }));
console.log('its memory size is ' + sizeof.sizeof(XMLBareMapppingToJSON, true));


console.log('\n ------------ xmldom library -----------');

const XMLDOMInJSON = new DOMParser().parseFromString(XMLString);
console.log('XML DOM representation in JSON is :');
console.log('(awful, so it has been commented out)');
//console.log(util.inspect(XMLDOMInJSON, { depth: Infinity }));

console.log('its memory size is ' + sizeof.sizeof(XMLDOMInJSON, true));


