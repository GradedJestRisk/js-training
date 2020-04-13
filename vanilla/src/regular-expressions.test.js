describe('regular expressions', () => {

  describe('specify', () => {

    describe('using literal', () => {

      test('slash (common)', () => {
        const helloWordPattern = /\bhello\b/
        const input = 'I said hello to him'
        const result = helloWordPattern.test(input)

        expect(result).toStrictEqual(true);
      })

    })

    test('using constructor', () => {
      const helloWordPattern = new RegExp('\\bhello\\b')
      const input = 'I said hello to him'
      const result = helloWordPattern.test(input)

      expect(result).toStrictEqual(true);
    })

  })

  describe('pattern', () => {

    describe('single character', () => {

      test('a digit (using a range)', () => {
        expect(/[0-9]/.test('Time is 1 am')).toStrictEqual(true);
        expect(/[0-9]/.test('Time is one am')).toStrictEqual(false);
      })

      test('a digit (using d class)', () => {
        expect(/\d/.test('Time is 1 am')).toStrictEqual(true);
      })

      test('an alphanumeric character (using a range)', () => {
        expect(/\w/.test('hello!')).toStrictEqual(true);
        expect(/\w/.test('!')).toStrictEqual(false);
      })

      test('an alphanumeric character (using w class, aka word)', () => {
        expect(/\w/.test('hello!')).toStrictEqual(true);
        expect(/\w/.test('!')).toStrictEqual(false);
      })

      test('a space (using s class)', () => {
        expect(/\s/.test('Hello, world!')).toStrictEqual(true);
        expect(/\s/.test('Hello,\nworld!')).toStrictEqual(true);
        expect(/\s/.test('Hello,\tworld!')).toStrictEqual(true);
        expect(/\s/.test('Hello,world!')).toStrictEqual(false);
      })

      test('a whitespace (bug for \n and \t ?)', () => {
        expect(/[ ]/.test('Hello, world!')).toStrictEqual(true);
        expect(/[ ]/.test('Hello,world!')).toStrictEqual(false);
        expect(/[ ]/.test('Hello,\nworld!')).toStrictEqual(false);
        expect(/[ ]/.test('Hello,\tworld!')).toStrictEqual(false);
      })

      test('any but newline', () => {
        expect(/./.test('Hello, world !')).toStrictEqual(true);
        expect(/./.test('\n')).toStrictEqual(false);
      })
    });

    describe('character sequence', () => {

      test('case-sensitive', ()=> {
        expect(/hello/.test('hello, world !')).toStrictEqual(true);
        expect(/(hello)/.test('hello, world !')).toStrictEqual(true);
      })

      test('case insensitive', ()=> {
        expect(/(hello)/i.test('Hello, world !')).toStrictEqual(true);
        expect(/(hello)/.test('Hello, world !')).toStrictEqual(false);
      })

      test('full extent', ()=> {
        expect(/(hello)/.test('hello, 123 !')).toStrictEqual(true);
        expect(/^(hello)$/.test('hello, 123 !')).toStrictEqual(false);
        expect(/^(hello)$/.test('hello')).toStrictEqual(true);
      })


    })

    test('implicit or in range', () => {
      expect(/[d.]/.test('12.34')).toStrictEqual(true);
      expect(/[d.]/.test('12,34')).toStrictEqual(false);
    })

    describe('pattern', () => {

      describe('basics', () => {

        test('repetition: + ', () => {
          expect(/abc\d+def/.test('abc123def')).toStrictEqual(true);
          expect(/abc\d+def/.test('abcdef')).toStrictEqual(false);
        })

        test('optional: ? ', () => {
          expect(/abc?def/.test('abcdef')).toStrictEqual(true);
          expect(/abc?def/.test('abdef')).toStrictEqual(true);
        })

        test('repetition count: {} ', () => {
          expect(/(abc){2}/.test('abcabcabc')).toStrictEqual(true);
          expect(/(abc){2}/.test('abcabc')).toStrictEqual(true);
          expect(/(abc){2}/.test('abc')).toStrictEqual(false);
        })

      });

      describe('groups', () => {

        test('implicit or in range', () => {
          const aBAndOneOrMoreO = 'bo+';
          const aHAndOneOrMoreO = '(ho+)';
          const hoSeveralTimes = '+';
          const caseInsensitive = 'i'
          const cartoonCryingPattern = new RegExp(aBAndOneOrMoreO + aHAndOneOrMoreO + hoSeveralTimes, caseInsensitive);
          // const cartoonCryingPattern = /bo+(ho+)+/i;
          expect(cartoonCryingPattern.test('Boo')).toStrictEqual(false);
          expect(cartoonCryingPattern.test('Boohoooo')).toStrictEqual(true);
          expect(cartoonCryingPattern.test('Boohoooohoohooo')).toStrictEqual(true);
        })

      });

      describe('a full test', () => {

        let pattern;

        beforeEach( () => {
          const strictMatch = function (pattern){
            return '^' + pattern + '$'
          }
          const changeType = '(feature|bugfix|refactor|doc)';
          const scope = '(\\([a-z]+\\))';
          const description = '_([a-z-]+)';
          const stringPattern = strictMatch(changeType + scope + description)
          pattern = new RegExp (stringPattern);
          console.log(pattern);
        })

        test('happy path', () => {

          const matching = 'feature(admin)_add-a-perpetual-token'
          expect(pattern.test(matching)).toStrictEqual(true);
        })

        test('exception path', () => {

          const atLeastOneCapital = 'Feature(admin)_add-perpetual-token'
          const missingChangeType = '(admin)_add-perpetual-token'
          const missingScope = 'feature_add-perpetual-token'
          const wrongSeparatorsForScope = 'feature[admin]_add-perpetual-token'
          const wrongSeparatorsForDescription = 'feature(admin)-add-perpetual-token'
          const spaceInDescription = 'feature(admin)_add perpetual token'

          expect(pattern.test(atLeastOneCapital)).toStrictEqual(false);
          expect(pattern.test(missingChangeType)).toStrictEqual(false);
          expect(pattern.test(missingScope)).toStrictEqual(false);
          expect(pattern.test(wrongSeparatorsForScope)).toStrictEqual(false);
          expect(pattern.test(wrongSeparatorsForDescription)).toStrictEqual(false);
          expect(pattern.test(spaceInDescription)).toStrictEqual(false);

        });

      });

    });

  })

  test('replace', () => {
    const pattern = /(\w+)\s(\w+)/
    const input = 'John Smith'
    const result = input.replace(pattern, '$2, $1')

    expect(result).toStrictEqual('Smith, John');
  });

  describe('test', () => {

    test('return true if match', () => {
      const pattern = /(\w+)\s(\w+)/;
      const input = 'Hello World'
      const result = pattern.test(input)

      expect(result).toStrictEqual(true);
    })

    test('return false if does not match', () => {
      const pattern = /(\w+)-(\w+)/;
      const input = 'Hello World'
      const result = pattern.test(input)

      expect(result).toStrictEqual(false);
    })

  })

})