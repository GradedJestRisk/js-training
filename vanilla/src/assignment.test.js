describe('assignment', () => {

    describe('corner cases', function () {

        test('corner cases', () => {

            // [] is the empty array. you access the first element with [0]
            const elementOfEmptyArray = [][0];

            expect(elementOfEmptyArray).toBe(undefined);

            const propertyOfEmptyObject = {}.name;

            expect(propertyOfEmptyObject).toBe(undefined);

        });

    });

    describe('destructuring', function () {

        describe('array', function () {

            test('simplest', () => {

                let firstElement;

                [firstElement] = [1, 2];

                expect(firstElement).toBe(1);

            });

            test('shortest', () => {

                const [firstElement] = [1, 2];

                expect(firstElement).toBe(1);

            });

            test('several elements', () => {

                let firstElement, secondElement;

                [firstElement, secondElement] = [1, 2];

                expect(secondElement).toBe(2);

            });

            test('skip some elements', () => {

                let secondElement;

                [, secondElement] = [1, 2];

                expect(secondElement).toBe(2);

            });

            test('nest arrays', () => {

                let nestedElement;

                [ [nestedElement, ], ] = [ [1, 2], 6 ];

                expect(nestedElement).toBe(1);

            });


        });

        describe('object', function () {

            test('simplest', () => {

                const { one } = { one: 1 };

                expect(one).toBe(1);

            });

            test('beware of shortcut', () => {

                const aNumber = { one: 1 };

                // expect(aNumber).toBe(1); => aNumber is an object, not a value
                expect(aNumber).toStrictEqual({ one: 1 });

            });

            test('match by property name, not by order', () => {

                const { two, one } = { one: 1, two: 2 };

                expect(one).toBe(1);
                expect(two).toBe(2);

            });

            test('non matching left property get undefined', () => {

                const { four } = { one: 1, two: 2, three: 3 };

                expect(four).toBe(undefined);

            });

            test('non matching right property is ignored', () => {

                const { two } = { one: 1, two: 2 };

                expect(two).toBe(2);

            });

            test('also preserve functions', () => {

               const someone = {

                  name: "calvin",
                  greet: function() {
                    return "hello, my name is " + this.name;
                  }

               }

               expect(someone.greet()).toBe("hello, my name is calvin");

               const someoneElse = { ...someone, isHuman: true}

               expect(someoneElse.greet()).toBe("hello, my name is calvin");

            })

            
        });

    });

});
