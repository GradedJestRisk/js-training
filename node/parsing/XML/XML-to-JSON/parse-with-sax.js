const fs = require('fs');
const {parseString} = require('xml2js');
const util = require('util');
const sizeof = require('sizeof');

const xmlString = '<?xml version="1.0" encoding="UTF-8"?> \
    <xml>\
        <great-mother name="Susie">\
           <mother name="Barbara">\
               <daughter name="Alice">Hey!</daughter>\
           </mother>\
        </great-mother>\
    </xml>';

parseString(xmlString, function (err, result) {
    console.log('XML is :')
    console.log(util.inspect(result, { depth: Infinity }));
});


const sax = require('sax');

const strictMode = true;
const parser = sax.parser(strictMode);

parser.onerror = function (e) {
    // an error happened.
};
parser.ontext = function (t) {
    // got some text.  t is the string of text.
    console.info('onText: ' + t)
};
parser.onopentag = function (node) {
    // opened a tag.  node has "name" and "attributes"
    console.info('onOpenTag: node=');
    console.dir(node);
    console.log('its memory size is ' + sizeof.sizeof(node));
};
parser.onattribute = function (attr) {
    // an attribute.  attr has "name" and "value"
    console.info('onAttribute: attr=');
    console.dir(attr);
};
parser.onend = function () {
    // parser stream is done, and ready to have more stuff written to it.
    console.info('onEnd')
};


console.log('\n -------- Option 1 - Parse an in-memory string --------------');
parser.write(xmlString).close();

// stream usage
// takes the same options as the parser
const saxStream = sax.createStream(strictMode);

saxStream.on("error", function (e) {
    // unhandled errors will throw, since this is a proper node
    // event emitter.
    console.error("error!", e)
    // clear the error
    this._parser.error = null
    this._parser.resume()
})
saxStream.on("opentag", function (node) {
    // same object as above
    console.info('onOpenTag: node=');
    console.dir(node);
})

console.log('\n -------- Option 2 - Parse a file using stream --------------');

// pipe is supported, and it's readable/writable
// same chunks coming in also go out.
fs.createReadStream("file.xml")
    .pipe(saxStream)
    .pipe(fs.createWriteStream("file-copy.xml"))
