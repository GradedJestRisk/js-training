const sum = require('./sum');


describe('Name of the group', () => {

  test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });

});

describe('beforeEach', () => {

  let nine, dog, three;

  beforeEach(() => {
    nine = 9;
    dog = {name: 'Fluffy', breed: 'mixed'};
    three = (()=>3);
  });
  
  test('beforeEach initialize a primitive', () => {
    expect(nine).toBe(9);
  });

  test('beforeEach initialize an object', () => {
    expect(dog.breed).toBe('mixed');
  });

  test('beforeEach initialize a function', () => {
    expect(three()).toBe(3);
  });


  describe('test prefix', () => {

    test.skip('skip prevent test to run ', () => {
      expect(true).toBe(false);
    });

    test.only('only prevent all test but this run ', () => {
      expect(true).toBe(true);
    });
  
  });

});
