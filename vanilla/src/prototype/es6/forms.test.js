const {Rectangle, Circle} = require('./forms');

describe('Prototype (ES6)', function () {

    describe('class', function () {

        test('is a function', () => {

            expect(typeof Rectangle).toBe("function")

        })
    })

    describe('methods', function () {

        test('can be called', () => {

            const rectangle = new Rectangle(2, 4);
            expect(rectangle.area()).toBe(8);

        });
    });


    describe('properties', function () {

        test('can be accessed', () => {

            const rectangle = new Rectangle(2, 4);
            expect(rectangle.height).toBe(2);

        });
    });

    describe('module', function () {

        test('allow to store many classes in the same module', () => {

            expect(typeof Rectangle).toBe("function")
            expect(typeof Circle).toBe("function")

        })
    })
});