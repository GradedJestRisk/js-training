const xml2js = require('xml2js');

const plainJSON = {
    greatMother: {
        $: {
            isGreatMother: true, specialNode: true
        },
        name : 'Susie',
        mother: {
            $: {
                isGreatMother: false
            },
            name : 'Barbara', daughter : { name : 'Alice', text : "Hey!"  }
        }
    }
};

console.info('plainJSON');
console.dir(plainJSON);

const builder = new xml2js.Builder();
const xmlString = builder.buildObject(plainJSON);

console.info('XML in string');
console.dir(xmlString);
