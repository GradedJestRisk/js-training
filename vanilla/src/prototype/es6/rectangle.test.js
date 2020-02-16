const Rectangle = require('./rectangle');

describe('Prototype (ES6)' , function() {

  describe('class', function() {

    test('is a function', () => {

      expect(typeof Rectangle).toBe("function")

    })
  })

  describe('property call', function() {

    test('instance property', () => {

      const rectangle = new Rectangle(2, 4);
      expect(rectangle.area()).toBe(8);

    });
  });
});