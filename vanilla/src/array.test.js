describe('create', () => {

  test('empty literal', () => {

    const myEmptyArray = [];

    expect(typeof myEmptyArray).toBe('object');
    expect(Array.isArray(myEmptyArray)).toBe(true);

    expect(myEmptyArray[0]).toBe(undefined);
    expect(myEmptyArray.size).toBe(undefined);

  });

  test('literal', () => {

    const myArray = ['one', 4];

    expect(Array.isArray(myArray)).toBe(true);

    expect(myArray).toStrictEqual(['one', 4]);

  });


});

describe('modify', () => {

  test('unusual', () => {

    let myArray = [];
    myArray[0] = 0;

    expect(myArray).toStrictEqual([0]);
  });

});

describe('join', () => {

  test('join() concatenate values items with comma', () => {

    const myArray = ['one', 'two'];

    expect(myArray.join()).toBe('one,two');
  });

  test('join() concatenate values items with separator', () => {

    const myArray = ['one', 'two'];

    expect(myArray.join(' ')).toBe('one two');
  });

});

describe('pure actions', () => {
  describe('forEach', () => {

    test('forEach execute a function on each element', () => {

      const myArray = ['one', 'two'];
      const myUpperArray = [];

      myArray.forEach(function (element) {
        myUpperArray.push(element.toUpperCase());
      });

      expect(myUpperArray).toStrictEqual(['ONE', 'TWO']);
    });

    test('forEach get index as additional parameter', () => {

      const myArray = ['one', 'two'];
      const myNewArray = [];

      myArray.forEach(function (element, index) {
        myNewArray.push('@' + index + ': ' + element);
      });

      expect(myNewArray).toStrictEqual(['@0: one', '@1: two']);
    });


  });
  describe('find', () => {
    it('test each value', () => {
      const anArray = [1, 2, 3, 0, 5];
      const anElement = anArray.find((element) => element === 0);
      expect(anElement).toBe(0);
    });
    it('test each object', () => {
      const me = {name: "me", age: 2};
      const you = {name: "you", age: 3};
      const anArray = [me, you];
      const anElement = anArray.find((element) => element.age === 3);
      expect(anElement).toBe(you);
    });
    it('test each object (alternate)', () => {
      const me = {name: "me", age: 2};
      const you = {name: "you", age: 3};
      const anArray = [me, you];
      const anElement = anArray.find(({age}) => age === 3);
      expect(anElement).toBe(you);
    })
  });
});

describe('impure actions', () => {

  describe('sort', () => {

    test('sort lexicographically by default', () => {

      const myArray = ['one', 'two', 'three', 1, 11];
      myArray.sort();

      expect(myArray).toStrictEqual([1, 11, 'one', 'three', 'two']);

    });

    test('use sorting function', () => {

      const myArray = [2, 1, 6];

      myArray.sort(function equals(val1, val2) {
        return -1 * (val1 - val2)
      });

      expect(myArray).toStrictEqual([6, 2, 1]);

    });
  });

});