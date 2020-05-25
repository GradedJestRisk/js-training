describe('error', () => {

    test('should throw', () => {

        const myThrowingFunction = function () {
            throw new Error("Message");
        };

        expect(() => {
            myThrowingFunction()
        }).toThrow(Error("Message"));

    });

    describe('try/catch', () => {

        test('return in try exit the function', () => {
            const RETURN_TRY = 0;
            const RETURN_BODY= 1;

            const aFunction = function () {
                try {
                    return RETURN_TRY
                } catch (error) {
                }
                return RETURN_BODY;
            };

            const value = aFunction();

            expect(value).toBe(RETURN_TRY);

        });

        test('return in finally exit the function', () => {
            const RETURN_TRY = 0;
            const RETURN_FINALLY = 1;

            const aFunction = function () {
                try {
                    return RETURN_TRY
                } catch (error) {
                } finally {
                    return RETURN_FINALLY;
                }
            };

            const value = aFunction();

            expect(value).toBe(RETURN_FINALLY);

        });
    });


});