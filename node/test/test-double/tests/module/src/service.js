const { v4 } = require('uuid');

const doSomethingWithUuid = () => {
   return v4();
};

const doSomething = () => {
   const newUuid = doSomethingWithUuid();
   return newUuid;
};

const doSomethingElse = () => {
   return 'a';
};

const environmentVariables = {
   foo: process.env.FOO,
};

module.exports = { doSomething, doSomethingElse, environmentVariables };
