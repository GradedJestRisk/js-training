// Here, we use 4 implementation for typing:
// - manual (object literal)
// - ES5 syntax
// - ES6 syntax (class)

// There is much more implementation possibilities
// https://programmer.group/javascript-object-oriented.html

const Dog = function (name) {
   this.name = name;
   this.hasFeathers = false;
   this.makeNoise = () => {
      return 'woof!'
   };
}

const Duck = function (name) {
   this.name = name;
   this.hasFeathers = true;
   this.makeNoise = () => {
      return 'quack'
   };
}

class DuckClass {
   constructor(name)
   {
      this.name = name;
      this.hasFeathers = true;

   }
   makeNoise (){
      return 'quack'
   };
   static [Symbol.hasInstance](obj) {
      if (obj.hasFeathers) return true;
   }
}

const makeDuckLiteral = function (name) {
   return {
      name,
      hasFeathers: true,
      makeNoise: () => {
         return 'quack'
      }
   };
}


// https://stackoverflow.com/questions/5876332/how-can-i-differentiate-between-an-object-literal-other-javascript-objects
const makeFakeDuckFromLiteral = function (name) {
   const aDogLiteralPretendingToBeADuck = {
      name,
      hasFeathers: false,
      makeNoise: () => {
         return 'woof!'
      }
   };

   aDogLiteralPretendingToBeADuck.__proto__ = {constructor: Duck};

   return aDogLiteralPretendingToBeADuck;
}

const makeFakeDuckFromInstance = function (name) {
   const aDogInstancePretendingToBeADuck = new Dog(name);
   aDogInstancePretendingToBeADuck.__proto__ = {constructor: Duck};
   return aDogInstancePretendingToBeADuck;
}

const makeHiddenDuckInstance = function (name) {
   const aDuck = new Duck(name);
   aDuck.protoype = Dog;
   return aDuck;
}

describe('duck-typing', () => {

   describe('type test', () => {

      let objectOne;
      let objectTwo;
      let objectThree;
      let objectFour;
      let objectFive;
      let objectSix;
      let objectSeven;

      beforeAll(() => {
         objectOne = new Duck('donald');
         objectTwo = makeDuckLiteral('riri');
         objectThree = makeFakeDuckFromLiteral('lassie');
         objectFour = new Dog('ranTanPlan');
         objectFive = makeFakeDuckFromInstance('oddie');
         objectSix = new DuckClass('fifi');
         objectSeven = new DuckClass('loulou');
      });

      // See https://javascript.info/instanceof
      // Especially Symbol.hasInstance
      describe('is it an instance of Duck ?', () => {

         test('yes', () => {
            expect(objectOne instanceof Duck).toBe(true);
            expect(objectTwo instanceof DuckClass).toBe(true);
            expect(objectSix instanceof DuckClass).toBe(true);
         });

         test('no', () => {
            expect(objectTwo instanceof Duck).toBe(false);
            expect(objectThree instanceof Duck).toBe(false);
            expect(objectFour instanceof Duck).toBe(false);
            expect(objectFive instanceof Duck).toBe(false);
            expect(objectSeven instanceof Duck).toBe(false);
         });

      });

      describe('is its constructor Duck ?', () => {

         test('yes', () => {
            expect(objectOne.constructor).toBe(Duck);
            expect(objectThree.constructor).toBe(Duck);
            expect(objectFive.constructor).toBe(Duck);
            expect(objectSix.constructor).toBe(DuckClass);
            expect(objectSeven.constructor).toBe(DuckClass);
         });

         test('no', () => {
            expect(objectTwo.constructor).toBe(Object);
            expect(objectFour.constructor).toBe(Dog);
         });

      });

      describe('is its prototype\'s constructor Duck ?', () => {

         test('yes', () => {
            expect(Object.getPrototypeOf(objectOne).constructor).toBe(Duck);
            expect(Object.getPrototypeOf(objectThree).constructor).toBe(Duck);
            expect(Object.getPrototypeOf(objectFive).constructor).toBe(Duck);
            expect(Object.getPrototypeOf(objectSix).constructor).toBe(DuckClass);
            expect(Object.getPrototypeOf(objectSeven).constructor).toBe(DuckClass);
         });

         test('no', () => {
            expect(Object.getPrototypeOf(objectTwo).constructor).toBe(Object);
            expect(Object.getPrototypeOf(objectFour).constructor).toBe(Dog);
         });

      });

   });

// https://en.wikipedia.org/wiki/Duck_test
// I can't prove you are a Communist.
// But when I see a bird that quacks like a duck, walks like a duck, has feathers and webbed feet and associates with ducks
// I'm certainly going to assume that he is a duck.
   describe('duck test', () => {
      let objectOne;
      let objectTwo;
      let objectThree;
      let objectFour;
      let objectFive;
      let objectSix;

      beforeAll(() => {
         objectOne = new Duck('objectOne');
         objectTwo = makeDuckLiteral('objectTwo');
         objectThree = makeFakeDuckFromLiteral('lassie');
         objectFour = makeFakeDuckFromInstance('ran-tan-plan');
         objectFive = new DuckClass('fifi');
         objectSix = makeHiddenDuckInstance('loulou');
      });

      describe('does it have feathers ?', () => {
         const aDuckHaveFeathers = true;
         test('yes', () => {
            expect(objectOne.hasFeathers).toBe(aDuckHaveFeathers);
            expect(objectTwo.hasFeathers).toBe(aDuckHaveFeathers);
            expect(objectFive.hasFeathers).toBe(aDuckHaveFeathers);
            expect(objectSix.hasFeathers).toBe(aDuckHaveFeathers);
         })

         test('no', () => {
            expect(objectThree.hasFeathers).not.toBe(aDuckHaveFeathers);
            expect(objectFour.hasFeathers).not.toBe(aDuckHaveFeathers);
         });
      });

      describe('does it quacks ?', () => {
         const theNoiseADuckMake = 'quack';
         test('yes', () => {
            expect(objectOne.makeNoise()).toBe(theNoiseADuckMake);
            expect(objectTwo.makeNoise()).toBe(theNoiseADuckMake);
            expect(objectFive.makeNoise()).toBe(theNoiseADuckMake);
            expect(objectSix.makeNoise()).toBe(theNoiseADuckMake);
         });
         test('no', () => {
            expect(objectThree.makeNoise()).not.toBe(theNoiseADuckMake);
            expect(objectFour.makeNoise()).not.toBe(theNoiseADuckMake);
         });
      });

   });

});
