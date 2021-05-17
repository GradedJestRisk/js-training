describe('hoisting variables', () => {

   test('hoisted var-type variables are initialized to undefined', () => {

      expect(showMessage()).toEqual('Hello world');
      expect(name).toEqual(undefined);

      function showMessage() {
         return('Hello world');
      }

      var name = 'John Doe';
   })

   test('let and const-type variables cannot be hoisted', () => {

      try{
         console.log(name);
      } catch(error){
         expect(error.name).toEqual('ReferenceError')
         expect(error.message).toEqual('Cannot access \'name\' before initialization')
      }

      let name = 'John Doe';

      try{
         console.log(email);
      } catch(error){
         expect(error.name).toEqual('ReferenceError')
         expect(error.message).toEqual('Cannot access \'email\' before initialization')
      }

      const email = 'john.doe@example.net';
   })

})
