const Person = require('./Person')

test('encapsulate data', () => {

   const john = Person.createPerson({
      name: 'John',
      age: 12,
   });

   // Attempt to access data
   expect(john.age).toBeUndefined();
   expect(john['Symbol(private data key)']).toBeUndefined()
   expect(Person.isAdult(john)).toBeFalse()

   // Attempt to mutate data
   john.age = 15
   expect(john.age).toBeUndefined()
});
