// Uncle bob Glossary
// A class is the specification of a set of similar objects.
// An Object is a set of functions that operate upon implied data elements.
// A Data Structure is a set of data elements operated upon by implied functions
// DTOs are data structures
// Databases contain data structures, not objects
// ORM transfer data between data structures
// There is no such thing as an Object Relational Mapper; because there is no mapping between database tables and objects.
// => https://blog.cleancoder.com/uncle-bob/2019/06/16/ObjectsAndDataStructures.html

// WARNING - JS glossary / Uncle bob Glossary
// JS objects, without functions => Uncle Bob: data structure, "cohesive set of data elements, operated upon by implied functions"
// JS objects, with functions operating on data  => Uncle Bob: objects, "a set of functions that operate on implied data elements"

// WARNING - Wikipedia JSON glossary / Uncle bob Glossary
// "JSON produce data objects consisting of key/value pairs"
// For Uncle bob, JSON produce data structure, not objects
// => https://en.wikipedia.org/wiki/JSON


// Consequences
// TODO:
// 1: Split this "object" file in 2 files
// - a file for data structure (using JS object type, with data only)
// - a file for object (using JS object type, with function)
// 2: rename (or add description) to prototype folder, to include class

describe('object', function () {

    describe('create objects', function () {

                
        test('void - pure creation', () => {

            const aVoidObject = {};
            
            expect(aVoidObject.constructor.name).toBe('Object'); 

        });

        test('pure creation', () => {

            const someObject = Object.create(null);
            someObject.name = "calvin";
            
            expect(someObject.name).toBe("calvin");

        });

        test('from literal', () => {

            const someObject = { name: "calvin" };
            
            expect(someObject.name).toBe("calvin");

        });

        test('from literal (alternate)', () => {

            const name = "calvin";
            const someObject = { name };
            
            expect(someObject.name).toBe("calvin");

        });

        test('copying', () => {

            const someSourceObject = { name: "calvin" };
            const someTargetObject = Object.assign( {}, someSourceObject);
            
            expect(someTargetObject.name).toBe("calvin");

        });

        test('copying, stripping of properties', () => {

             const stripFunction = function(object) {

               const newObject = Object.assign( {}, object);

               for( key in newObject ){
                   if(typeof newObject[key] === 'function')
                   {
                       delete newObject[key];
                   }
               }

               return newObject;

             };

             const someSourceObject = {

                 name: "calvin",

                 greet: function(name){
                     return ('Hello, ' + this.name + ' !')
                 }

             };

             // When
             const someTargetObject = stripFunction(someSourceObject);

             // Then
             expect(someTargetObject.name).toBe("calvin");
             expect(someTargetObject.greet).toBe(undefined);

         });

        test('copying, only data', () => {

             const createFromDataOnly = function(object) {

               const newObject = {};

               for( key in object ){
                   if(typeof object[key] !== 'function')
                   {
                       newObject[key] = object [key];
                   }
               }

               return newObject;

             };

             const someSourceObject = {

                 name: "calvin",

                 greet: function(name){
                     return ('Hello, ' + this.name + ' !')
                 }

             };

             // When
             const someTargetObject = createFromDataOnly(someSourceObject);

             // Then
             expect(someTargetObject.name).toBe("calvin");
             expect(someTargetObject.greet).toBe(undefined);

         });
        test('copying, only data, using JSON', () => {

             // create a DS (data structure),
             // used as a DTO ( data transfer object)
             // from an object/Entity

             const createFromDataOnly = function(object) {
              return JSON.parse(JSON.stringify(object));
             };

             const someSourceObject = {

                 name: "calvin",

                 greet: function(name){
                     return ('Hello, ' + this.name + ' !')
                 }

             };

             // When
             const someTargetObject = createFromDataOnly(someSourceObject);

             // Then
             expect(someTargetObject.name).toBe("calvin");
             expect(someTargetObject.greet).toBe(undefined);

         });

        test('partial copy', () => {

            const someSourceObject = { name: "calvin" };
            const someTargetObject = { surname : "hyperMan"};
                
            Object.assign( someTargetObject, someSourceObject);
            
            expect(someTargetObject.name).toBe("calvin");

        });

        test('with inheritance: property ', () => {

            const someSourceObject = { name: "calvin" };
            const someTargetObject = Object.create(someSourceObject);

            expect(someTargetObject.name).toBe("calvin");
            someTargetObject.name = "hobbes";

            expect(someSourceObject.name).toBe("calvin");

            // SomeSourceObject is a prototype for Target through Object.create
            // Although no constructor has been provided
            expect(someTargetObject.constructor.name).toBe('Object'); 

        });


        test('with inheritance: method ', () => {

            const someSourceObject = {
                name: "calvin",
                greet: function () {
                    return 'Hello, ' + this.name + ' !';
                }
            };

            const someTargetObject = Object.create(someSourceObject);

            someTargetObject.name = "hobbes";

            expect(someTargetObject.greet()).toBe('Hello, hobbes !');

        });

        test('from Crockford - get encapsulation (create private properties)', () => {

            // this is not on object, it is a function returning an object
            function counter_constructor(initialValue=0) {

                // private property, hidden in closure
                let count = initialValue;

                //private functions

                function increment() {
                    // access through closure, not through this
                    count += 1;
                }

                function decrement() {
                    count -= 1;
                }

                // public functions

                // Query    
                function getCount() {
                    return count;
                }
                
                // Command
                function up() {
                    increment();
                }

                function down() {
                    decrement();
                }

                // build up object, with public functions only
                return Object.freeze({
                    getCount,
                    up,
                    down
                })
                
            };
            
            const initialValue = 4;
            const aCounter = counter_constructor(initialValue);

            aCounter.up();
            expect(aCounter.getCount()).toBe(5);

            aCounter.down();
            expect(aCounter.getCount()).toBe(4);

            // cannot modify property
            aCounter.count = 10;

            // cannot read property
            expect(aCounter.count).toBe(undefined);

            expect(aCounter.getCount()).toBe(4);

            // Nevertheless, I can check if this is a function
            expect(aCounter.getCount.constructor.name).toBe('Function');

            // cannot access to private methods
            // aCounter.increment(); => TypeError: aCounter.increment is not a function
            expect(aCounter.getCount()).toBe(4);
        
        });

        test('from Crockford  - get composition (reuse) without this', () => {
           
            function other_constructor(spec) {

                let { member_reuse } = spec;

                const goodness = function () {
                    return 'Hello, ' + member_reuse + ' !';
                };

                return Object.freeze({
                  goodness
                });

            };

            function composition_constructor(spec) {

                let { member_reuse, member_supply } = spec;
                
                const reuse = other_constructor({ member_reuse });

                const method = function () {
                    return 'Goodbye, ' + member_supply + ' !';
                };

                return Object.freeze({
                    method,
                    goodness: reuse.goodness
                });
            };

            anObject = composition_constructor({ member_supply:'world', member_reuse: 'you' }); 
            expect(anObject.goodness()).toBe('Hello, you !');
            expect(anObject.method()).toBe('Goodbye, world !');

        });

        test.skip('message passing to remove brittleness of inheritance', () => {
            // TODO: create 2 objects that implements a function with the same name, with different body
            // shows that polymorphism works this way, types AND inheritance is not mandatory
        });

        test('immutability (Object.freeze)', () => {
           
            function constant(value) {

                return Object.freeze({
                    value
                });

            };
        
            const greeting = 'Hello, world !';
            const greetingObject = constant(greeting);

            expect(greetingObject.value).toBe('Hello, world !');

            // You didn't get an exception..
            greetingObject.value = 'Hello, calvin !';
            
            expect(greetingObject.value).toBe('Hello, world !');

            // You get some here: assignment to constant variable
            // greeting = 'Hello, calvin !';

        });

        test('immutability (closure)', () => {
           
            function constant(value) {

                // You don't need const here
                let innerValue = value;
                
                function getValue() {
                    return innerValue;
                }

                return getValue;

            };
        
            const greeting = 'Hello, world !';
            const greetingObject = constant(greeting);

            // Cannot read property 'value' of undefined
            expect(greetingObject.innerValue).toBe(undefined);

            expect(greetingObject()).toBe('Hello, world !');

        });

    });


    describe('compare objects', function () {

      
        test('=== test object identity', () => {

            // Arrange
            const emptyObjectLiteral = {};
            const sameEmptyObjectLiteral = emptyObjectLiteral;

            // Act
            // Assert

            let testResult;
            if (emptyObjectLiteral === sameEmptyObjectLiteral) {
                testResult = true;
            }
            else {
                testResult = false;
            }

            expect(testResult).toBe(true);

        });

    });   

    describe('mutating objects', function () {    

        test('const forbid the reference to mutate, not the object', () => {

            // Arrange
            const someObject = { name : "calvin"};
            someObject.name = "hobbes";

            // Act
            // Assert
            expect(someObject.name).toBe("hobbes");

            //But this is not allowed
            // someObject = {};


        });

        test('freeze prevent the object from mutating', () => {

            // Arrange
            const someObject = { name: "calvin" };
            Object.freeze(someObject);
            someObject.name = "hobbes";

            // Act
            // Assert
            expect(someObject.name).toBe("calvin");

        });


    });

    describe('access to object content', function () {
      

        test('access to properties', () => {

            // Arrange
            const objectLiteral = {
                name: "calvin",
                surname : "hyperMan"
            };

            // Act
            // Assert
            expect(objectLiteral.name).toBe("calvin");

        });

        test('alternate access to properties with brackets', () => {

            // Arrange
            const objectLiteral = {
                name: "calvin"
            };

            // Act
            // Assert
            expect(objectLiteral["name"]).toBe("calvin");

            // Useful to compute property name
            let propertyName = 'na';
            propertyName += 'me';

            expect(objectLiteral[propertyName]).toBe("calvin");


            // Can even access properties being invalid identifiers
            
            invalidIdentifier = "1/0";

//          objectLiteral."1/0" = "crazy stuff";
            objectLiteral[invalidIdentifier] = "crazy stuff";
            expect(objectLiteral[invalidIdentifier]).toBe("crazy stuff");

        });


        test('access to methods', () => {

            // Arrange
            const objectLiteral = {
                introduce : function (){
                    return "hi!";
                }
            };

            // Act
            // Assert
            expect(objectLiteral.introduce()).toBe("hi!");

        });

        test('access to non-existing methods', () => {

            // Arrange
            const objectLiteral = {                
            };

            // Act
            // Assert
            // TODO: find Jest assertion throw not a function
            //expect(objectLiteral.introduce()).toThrowError();

            let testResult;
            if (objectLiteral.introduce !== undefined) {
                testResult = false;       
            }
            else {
                testResult = true;
            }

            expect(testResult).toBe(true);

        });

        test('correctly handling access (check for non-existing methods)', () => {

            // Arrange
            const objectLiteral = {
                introduce : function (){ return ("hello"); }
            };

            // Act
            // Assert
            // TODO: find Jest assertion throw not a function
            //expect(objectLiteral.introduce()).toThrowError();

            let testResult;
            if (objectLiteral.introduce !== undefined && objectLiteral.introduce() === "hello") {
                testResult = true;       
            }
            else {
                testResult = false;
            }

            expect(testResult).toBe(true);

        });

    });


    describe('method call', function () {

        test('simple', () => {

            const anObject = {

                name : 'world',
                greet : function(name){
                    return ('Hello, ' + this.name + ' !')
                }
            }

            expect(anObject.greet()).toBe('Hello, world !');

        });    

        test('this is also an object', () => {

            const anObject = {

                name : 'world',
                getName: function () {
                    return this.name;
                },
                greet : function(name){
                    return ('Hello, ' + this.getName() + ' !')
                }
            }

            expect(anObject.greet()).toBe('Hello, world !');

        });    

        test('but inner function are not bound', () => {

            const anObject = {

                name : 'world',
                greet: function (name) {

                    function getName() {
                        return this.name;
                    };
    
                    return ('Hello, ' + getName() + ' !')
                }
            }

            expect(anObject.greet()).toBe('Hello, undefined !');

        });    

        test('and only method call are bound', () => {

            const anObject = {

                name : 'world',
                greet: function () {            
                    return ('Hello, ' + this.name + ' !')
                }
            }

            const aGreet = anObject.greet; // there is no direct call

            expect(aGreet()).toBe('Hello, undefined !');

        });    

        test('this is dynamically bound (caller, not maker)', () => {

            const anObject = {

                do_what_you_want_with_me: function () {

                    const firstElement = this[0];
                    this[0] = 'ah ah !';

                    return firstElement;
                }
            }

            anArray = ['super secret password', anObject.do_what_you_want_with_me];
            
            const output = anArray[1]();
            //expect(anArray[1].do_what_you_want_with_me()).toBe('super secret password');

            expect(output).toBe('super secret password');
            expect(anArray[0]).toBe('ah ah !');

        });
        

        test('this is dynamically bound (following)', () => {

            const anObject = {

                name: 'calvin',
                surname : 'hyper man',

                getName: function () {

                    return this.name;
                },

                getSurname: function () {
                    // this.getWord is not a function => static checking
                    // this.getWord();
                    return this.surname;
                }
                
            }

            const anotherObject = {
                name: 'hobbes'
            }

            anotherObject.aFunction = anObject.getName;

            // no such property as surname in anotherObject, but creating a function is allowed
            // => no dynamic checking
            anotherObject.anotherFunction = anObject.getSurname;
            
            expect(anotherObject.aFunction()).toBe('hobbes');

            // no exception thrown
            expect(anotherObject.anotherFunction()).toBe(undefined);
            
        });    
        
    });    

    describe('new and this', function () {

        test('simple', () => {

            const GreetingConstructor = function (name) {

                this.name = name;

                this.greet = function(name){
                    return ('Hello, ' + this.name + ' !')
                }

                return this;

            }

            const aGreet = new GreetingConstructor('world');


            expect(aGreet.greet()).toBe('Hello, world !');

            expect(aGreet).toBeInstanceOf(GreetingConstructor);
            expect(aGreet.constructor.name).toBe('GreetingConstructor');


        });    

        test('but risky without new', () => {

            const GreetingConstructor = function (name) {

                // this is a global, Jest execution object..
                this.name = name;

                this.greet = function(name){
                    return ('Hello, ' + this.name + ' !')
                }

                return this;

            }

            // new is missing
            const aGreet = GreetingConstructor('world');

            expect(aGreet.greet()).toBe('Hello, world !');

            // Not an instance of GreetingConstructor.. (duplicated code)
            expect(aGreet).toBeInstanceOf(Object);
            expect(aGreet.constructor.name).toBe('Object');
            expect({}.constructor.name).toBe('Object');            

            // that would work, too, but is rejected by linter
            // expect(this.greet()).toBe('Hello, world !');


        });    

        test('but risky without return', () => {

            const GreetingConstructor = function (name) {

                this.name = name;

                this.greet = function(name){
                    return ('Hello, ' + this.name + ' !')
                }

                // return (this);
            }

            // new is missing
            const aGreet = GreetingConstructor('world');

            // Cannot read property greet of undefined
            //expect(aGreet.greet()).toBe('Hello, world !');

        });    

    });    


});
