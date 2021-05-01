describe('function', function () {

    describe('parameters', function () {

        function greet(name) {
            return 'Hello, ' + name + ' !';
        };

        test('missing parameters are undefined', () => {
            expect(greet()).toBe('Hello, undefined !');
        });

        test('excess parameters are ignored', () => {
            expect(greet('calvin', 'hobbes')).toBe('Hello, calvin !');
        });

        test('default value ', () => {

            function greet(name = 'world') {
                return 'Hello, ' + name + ' !';
            };

            expect(greet()).toBe('Hello, world !');
        });

        describe('parameter object', () => {

            test('implicit ', () => {

                function greet(args) {

                    let firstWord, name;

                    firstWord = args.firstWord;
                    name = args.name;

                    return firstWord + ', ' + name + ' !';
                };

                expect(greet({name: 'world', firstWord: 'Hello'})).toBe('Hello, world !');
            });

            test('implicit (destructuring)', () => {

                function greet(args) {

                    let {firstWord, name} = args;

                    return firstWord + ', ' + name + ' !';
                };

                expect(greet({name: 'world', firstWord: 'Hello'})).toBe('Hello, world !');
            });

            test('explicit', () => {

                function greet( { firstWord, name } ) {

                    return firstWord + ', ' + name + ' !';
                };

                expect(greet({name: 'world', firstWord: 'Hello'})).toBe('Hello, world !');
            });

            test('explicit (1 parameter)', () => {

                function greet( { name } ) {

                    return 'Hello, ' + name + ' !';
                };

                expect(greet({name: 'world', firstWord: 'Hello'})).toBe('Hello, world !');
            });
        });

        test('ellipsis in arguments (spread)', () => {

            function greet(...args) {

                let firstWord, name;

                firstWord = args[0];
                name = args[1];

                return firstWord + ', ' + name + ' !';
            };

            // spread occurs on function call
            expect(greet('Hello', 'world')).toBe('Hello, world !');
        });

        test('ellipsis in arguments (manual)', () => {

            function greet(args) {

                let firstWord, name;

                firstWord = args[0];
                name = args[1];

                return firstWord + ', ' + name + ' !';
            };

            expect(greet(['Hello', 'world'])).toBe('Hello, world !');
        });

        test('ellipsis in parameters (rest)', () => {

            function greet(firstWord, name) {

                return firstWord + ', ' + name + ' !';
            };

            // spread occurs on function call
            expect(greet(...['Hello', 'world'])).toBe('Hello, world !');
        });


    });

    describe('return value', function () {

        test('explicit return', () => {


            function bark() {
                return 'woof!';
            };

            expect(bark()).toBe('woof!');

        });

        test('return value should be explicit', () => {


            function bark() {
                const bark = 'woof!';
            };

            expect(bark()).toBe(undefined);

        });

        test('multiple value are discarded', () => {

            const firstValue = 'fido';
            const secondValue = 'woof!';

            function bark() {
                return (firstValue, secondValue);
            };

            expect(bark()).toBe(secondValue);

        });

        test('use object to return multiple values', () => {

            function bark() {
                return {dog: 'fido', sound: 'woof!'};
            };

            let result = bark();
            expect(result.dog).toBe('fido');
            expect(result.sound).toBe('woof!');

        });


        test.skip('use destructuring to return multiple values', () => {

            let dog, sound;

            function bark() {
                return {dog: 'fido', sound: 'woof!'};
            };

            // { dog, sound } = bark();
            expect(dog).toBe('fido');
            expect(sound).toBe('woof!');

        });


    });

});
