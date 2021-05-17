const { foo, appleSauce } = require('./hoisting');
describe('hoisting', () => {

   test('foo is calling bar (which is hoisted)  before its definition', () => {
      expect(foo()).toEqual('bar');
   });

   test('appleSauce is calling foobar (which is NOT hoisted) before its definition', () => {
      expect(appleSauce()).toEqual('foobar');
   });

});
