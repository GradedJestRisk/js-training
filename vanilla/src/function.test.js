describe('function', () => {

   test('its type is function', () => {
      const foo = function (){}
      expect(typeof foo).toBe('function');
   });

   test('is an instance of Function', () => {
      const foo = function (){}
      expect( foo instanceof Function).toBe(true);
   });

   test('can be serialized', () => {
      const foo = function (){}
      expect( foo.toString()).toBe('function () {}');
   });

   test('can have properties', () => {
      const foo = function (){};
      const anObject = { id: 1};
      foo.bar = anObject;

      expect(foo.bar).toEqual(anObject);
      expect(foo.toString()).toEqual('function () {}');

   });

   test('can have functions', () => {
      const foo = function (){};

      const hello = (you)=>`Hello, ${you} !`;
      foo.hello = hello;
      expect(foo.hello('world')).toEqual(hello('world'));

      expect(foo.toString()).toEqual('function () {}');
      expect(foo.hello.toString()).toEqual('you => `Hello, ${you} !`');
   });

   test('have keys and values', () => {
      const foo = function (){};
      const hello = (you)=>`Hello, ${you} !`;
      const anObject = { id: 1};
      foo.bar = anObject;
      foo.hello = hello;

      expect(Object.keys(foo)).toEqual(["bar", "hello"]);
      expect(Object.values(foo)).toEqual([anObject, hello]);

   });

});
