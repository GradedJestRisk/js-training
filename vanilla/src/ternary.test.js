describe('ternary', () => {

   test('ternary acts as if/then/else ', () => {

      let aResult = ((1 + 1) === 2)
         ? 'yes'
         : 'no';

      expect(aResult).toBe('yes');
   });

   test('general form ', () => {

      const predicate = function (result) {
         return result
      };
      const value_if_true = function () {
         return 1
      };
      const value_if_false = function () {
         return 2
      };


      const aResult = predicate(true)
         ? value_if_true()
         : value_if_false();

      expect(aResult).toBe(1);

      let anotherResult;

      if (predicate(true)) {
         anotherResult = value_if_true();
      } else {
         anotherResult = value_if_false();
      }

      expect(anotherResult).toBe(1);


   });

   test('is a functional operator ', () => {

      const predicate = function () {
         return true
      };
      const value_if_true = function () {
         return 1
      };
      const value_if_false = function () {
         return 2
      };

      const if_then_else = function (predicate, value_if_true, value_if_false) {
         return predicate()
            ? value_if_true()
            : value_if_false();
      };

      const aResult = if_then_else(predicate, value_if_true, value_if_false);
      expect(aResult).toBe(1);

   });

   test('nested form (smell)', () => {

      const aResult = ((3 * 2) === 6)
         ? ((8 - 5) === 2)
            ? 7
            : 9
         : 8;

      expect(aResult).toBe(9);

      let anotherResult;

      if ((3 * 2) === 6) {

         if ((8 - 5) === 2) {
            anotherResult = 7;
         } else {
            anotherResult = 9;
         }

      } else {
         anotherResult = 8;
      }

      expect(anotherResult).toBe(9);

   });

   test('side effect (smell)', () => {

      const check_state = function (result) {
         someState = 'modified';
         return (result === 88);
      };
      const make_side_effect = function () {
         someOtherState = 'modified too';
         return 1
      };

      let someState = 'initial';
      let someOtherState = 'initial';

      let aResult = check_state(88)
         ? make_side_effect()
         : 33;

      expect(aResult).toBe(1);
      expect(someState).toBe('modified');
      expect(someOtherState).toBe('modified too');

   });

});
