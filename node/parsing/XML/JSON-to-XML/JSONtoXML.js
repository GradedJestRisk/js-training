const js2xmlparser = require("js2xmlparser");
const faker = require('faker');

const collection = function () {

    const numbersJSON = { numbers : [
                                { number: { value: 1 } },
                                { number :{ value: 2} }
                          ]};

    const rootXMLNode = 'numbers';
    const numbersXML = js2xmlparser.parse(rootXMLNode, numbersJSON);

    console.log(numbersJSON);
    console.log(numbersXML);

}

const basicUse = function () {
    const person = {
        "firstName": "John",
        "lastName": "Smith",
        "dateOfBirth": new Date(1964, 7, 26),
        "address": {
            "@": {"type": "home" },
            "streetAddress": "3212 22nd St",
            "city": "Chicago",
            "state": "Illinois",
            "zip": 10000
        },
        "phone": [
            {  "@": {"type": "home"},
               "#": "123-555-4567"  },
            {  "@": {"type": "cell"},
               "#": "890-555-1234"},
            {  "@": {"type": "work"},
                "#": "567-555-8901"}
        ],
        "email": "john@smith.com"
    };
    const rootXMLNode = 'person';
    const personXML = js2xmlparser.parse(rootXMLNode, person);

    console.log(person);
    console.log(personXML);

}

const useWithFaker = function() {

    const users = [];
    const USER_COUNT = 5;

    for (let i = 0; i < USER_COUNT; i++) {

        const user = {
            name: faker.name.findName(),
            email: faker.internet.email()
        }
        users.push(user);
    }

    const rootXMLNode = 'per' +
        'sons';
    const usersRootNode = { 'user' : users };
    console.log(js2xmlparser.parse(rootXMLNode, usersRootNode));
}

//collection();
//basicUse();
// useWithFaker();
