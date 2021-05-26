const Joi = require('joi')
const {expect} = require('chai');

// online tester
// https://joi.dev/tester
context('regular expression', () => {

   context('one class', () => {

      const pattern = new RegExp('[0-9]+', 'i');
      const schema = Joi.object({code: Joi.string().regex(pattern).required()});

      it('should not return error on correct object', () => {

         // given
         const validObject = {code: '1234567'};
         // when
         const {error} = schema.validate(validObject);
         // then
         expect(error).to.be.undefined

      });

      it('should return error on incorrect object', () => {

         // given
         const invalidObject = {code: 'A'};
         // when
         const {error} = schema.validate(invalidObject);

         // then
         expect(error).not.to.be.undefined
         //console.log(error);
         expect(error.details[0].message).to.eq('"code" with value "A" fails to match the required pattern: /[0-9]+/i')
         expect(error.details[0].type).to.eq('string.pattern.base')
         expect(error.details[0].path[0]).to.eq('code')

      });

   })


   context('several class', () => {
      const pattern = '[a-z]+[.]{1}[a-z]+[0-9]{4}';
      const regExp = new RegExp(pattern, 'i');
      let schema;

      before(() => {
         schema = Joi.string().regex(regExp).required();
      })


      it('should not return error on correct object', () => {

         // given
         const validString = 'george.decambridge2510';

         // when
         const {error} = schema.validate(validString);
         // then
         expect(error).to.be.undefined

      });

      it('should return error on incorrect object', () => {

         // given
         const invalidString = 'A';
         // when
         const {error} = schema.validate(invalidString);

         // then
         expect(error).not.to.be.undefined
         //console.log(error);
         expect(error.details[0].message).to.eq('"value" with value "A" fails to match the required pattern: ' + '/' + pattern + '/i')

      });

      it('should return error on string without dot ', () => {

         // given
         const invalidString = 'georgedecambridge2510';
         // when
         const {error} = schema.validate(invalidString);

         // then
         expect(error).not.to.be.undefined
         expect(error.details[0].type).to.eq('string.pattern.base')

      });

      it('should return error on string without firstName ', () => {

         // given
         const invalidString = '.decambridge2510';
         // when
         const {error} = schema.validate(invalidString);

         // then
         expect(error).not.to.be.undefined
         expect(error.details[0].type).to.eq('string.pattern.base')

      });

      it('should return error on string without number', () => {

         // given
         const invalidString = 'george.decambridgeAAAA';
         // when
         const {error} = schema.validate(invalidString);

         // then
         expect(error).not.to.be.undefined
         expect(error.details[0].type).to.eq('string.pattern.base')

      });


   });
});
