// Person.js
const _dataKey = Symbol('private data key');

function createPerson({name, age}) {
   const instance = {
      [_dataKey]: {
         name,
         age,
      }
   }
   return Object.freeze(instance);
}

function isAdult(person) {
   return 18 <= person[_dataKey].age;
}

module.exports = {
   createPerson,
   isAdult,
}
