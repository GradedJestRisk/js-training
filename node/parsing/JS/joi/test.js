const Joi = require('joi')
const {expect} = require('chai');

context('#validate', () => {

   // online tester
   // https://joi.dev/tester

   context('basics', () => {

      let schema;
      let validObject;

      before(() => {
         schema = Joi.object({
            password: Joi.string().max(6).required(),
            shouldChangePassword: Joi.boolean().required(),
         });
         validObject = {password: '123456', shouldChangePassword: true}
      })


      it('should not return error on valid object', () => {
         // when
         const response = schema.validate(validObject);
         expect(response.value).to.deep.equal(validObject);
         expect(response.error).to.be.undefined;
      });

      it('should return error on incorrect length property', () => {
         // given
         let invalidObject = {...validObject, password: '1234567'};

         // when
         const {error} = schema.validate(invalidObject);

         // then
         expect(error).not.to.be.undefined

         expect(error.details[0].message).to.eq('"password" length must be less than or equal to 6 characters long')
         expect(error.details[0].type).to.eq('string.max')
         expect(error.details[0].path[0]).to.eq('password')
      });

      it('should return error on missing required property', () => {
         // given
         let invalidObject = validObject;
         delete invalidObject.password;

         // when
         const {error} = schema.validate(invalidObject);

         // then
         expect(error).not.to.be.undefined

         expect(error.details[0].message).to.eq('"password" is required')
         expect(error.details[0].type).to.eq('any.required')
         expect(error.details[0].path[0]).to.eq('password')
      });

      it('should return error on incorrect primitive type', () => {
         // given
         let invalidObject = validObject;
         invalidObject.password = parseInt(invalidObject.password);

         // when
         const {error} = schema.validate(invalidObject);

         // then
         expect(error).not.to.be.undefined

         expect(error.details[0].message).to.eq('"password" must be a string')
         expect(error.details[0].type).to.eq('string.base')
         expect(error.details[0].path[0]).to.eq('password')
      });

      it('should return error on incorrect boolean primitive type', () => {
         // given
         const schema = Joi.object({
            isValidated: Joi.boolean()
         });

         const invalidObject = {isValidated: "false ,"}

         // when
         const {error} = schema.validate(invalidObject);

         // then
         expect(error).not.to.be.undefined

         expect(error.details[0].message).to.eq('\"isValidated\" must be a boolean');
         expect(error.details[0].type).to.eq('boolean.base')
         expect(error.details[0].path[0]).to.eq('isValidated')
      });

   });

   context('email', () => {

      it('should not return error on correct email', () => {
         // given
         const validEmail = {email: 'foo@bar.com'};
         const emailSchema = Joi.object({email: Joi.string().email().required()});

         // when
         const {error} = emailSchema.validate(validEmail);

         // then
         expect(error).to.be.undefined

      });

      it('should return error on email with no username', () => {
         // given
         const validEmail = {email: '@bar.com'};
         const emailSchema = Joi.object({email: Joi.string().email().required()});

         // when
         const {error} = emailSchema.validate(validEmail);

         // then
         expect(error).not.to.be.undefined
         //console.log(error);
         expect(error.details[0].message).to.eq('"email" must be a valid email')
         expect(error.details[0].type).to.eq('string.email')
         expect(error.details[0].path[0]).to.eq('email')

      });

      it('should return error on email with no arobase', () => {
         // given
         const validEmail = {email: 'foobar.com'};
         const emailSchema = Joi.object({email: Joi.string().email().required()});

         // when
         const {error} = emailSchema.validate(validEmail);

         // then
         expect(error).not.to.be.undefined
         //console.log(error);
         expect(error.details[0].message).to.eq('"email" must be a valid email')
         expect(error.details[0].type).to.eq('string.email')
         expect(error.details[0].path[0]).to.eq('email')

      });

      it('should return error on email with no server', () => {
         // given
         const validEmail = {email: 'foo@.com'};
         const emailSchema = Joi.object({email: Joi.string().email().required()});

         // when
         const {error} = emailSchema.validate(validEmail);

         // then
         expect(error).not.to.be.undefined
         //console.log(error);
         expect(error.details[0].message).to.eq('"email" must be a valid email')
         expect(error.details[0].type).to.eq('string.email')
         expect(error.details[0].path[0]).to.eq('email')

      });

      // Top-Level Domain list => https://www.iana.org/domains/root/db

      it('should return error on email with no TLD', () => {
         // given
         const validEmail = {email: 'foo@bar.'};
         const emailSchema = Joi.object({email: Joi.string().email().required()});

         // when
         const {error} = emailSchema.validate(validEmail);

         // then
         expect(error).not.to.be.undefined
         //console.log(error);
         expect(error.details[0].message).to.eq('"email" must be a valid email')
         expect(error.details[0].type).to.eq('string.email')
         expect(error.details[0].path[0]).to.eq('email')

      });


      it('should return error on email with non-existing TLD', () => {
         // given
         const validEmail = {email: 'foo@bar.zzz'};
         const emailSchema = Joi.object({email: Joi.string().email().required()});

         // when
         const {error} = emailSchema.validate(validEmail);

         // then
         expect(error).not.to.be.undefined
         //console.log(error);
         expect(error.details[0].message).to.eq('"email" must be a valid email')
         expect(error.details[0].type).to.eq('string.email')
         expect(error.details[0].path[0]).to.eq('email')

      });

      it('should not return error on email with non-existing TLD if specified', () => {
         // given
         const validEmail = {email: 'foo@bar.zzz'};
         const emailOptions = {tlds: {allow: false}};
         const emailSchema = Joi.object({email: Joi.string().email(emailOptions).required()});

         // when
         const {error} = emailSchema.validate(validEmail);

         // then
         expect(error).to.be.undefined

      });

   });

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

   context('conditional', () => {
      // https://stackoverflow.com/questions/56423558/joi-validation-how-to-require-or-optional-field-based-on-another-key-exists-in

      context('when', () => {

         context('as an if on another property presence', () => {

            const schema = Joi.object({
               a: Joi.optional(),
               b: Joi.when('a', {is: Joi.exist(), then: Joi.required()}),
               c: Joi.required()
            });

            it('if optional in context, should be valid when not present', () => {
               const objectWithoutB = {c: 1};
               const {error} = schema.validate(objectWithoutB);
               expect(error).to.be.undefined
            });

            it('if is mandatory in context, should be invalid when nor present', () => {
               const objectWithoutB = {a: 'foo', c: 1};
               const {error} = schema.validate(objectWithoutB);
               expect(error).not.to.be.undefined;
               expect(error.message).to.equal('"b" is required');
            });

         })


         context('as a case', () => {

            // given
            const schema = Joi.object({
               time: Joi.string().required().allow('dawn', 'morning', 'noon', 'afternoon', 'dusk', 'night'),
               introduce: Joi.string().required().when('time', [
                  {is: 'morning', then: 'good morning'},
                  {is: 'night', then: 'good night', otherwise: 'hello'}
               ])
            });

            it('mapped value should be valid', () => {
               const object = {time: 'morning', introduce: 'good morning'};
               const {error} = schema.validate(object);
               expect(error).to.be.undefined
            })

            it('allowed unmapped value should be valid', () => {
               const object = {time: 'dawn', introduce: 'hello'};
               const {error} = schema.validate(object);
               expect(error).to.be.undefined
            });

            it('unallowed mapped value should be invalid', () => {
               const object = {time: 'night', introduce: 'good morning'};
               const {error} = schema.validate(object);
               expect(error).not.to.be.undefined;
               expect(error.message).to.equal('"introduce" must be [good night]');
            });

            it('unallowed unmapped value should be invalid', () => {
               const object = {time: 'dawn', introduce: 'good morning'};
               const {error} = schema.validate(object);
               expect(error).not.to.be.undefined;
               expect(error.message).to.equal('"introduce" must be [hello]');
            });
         });


      })

      context('xor', () => {

         const schema = Joi.object()
            .keys({
               a: Joi.string().required(),
               b: Joi.string(),
               c: Joi.string(),
            })
            .xor('b', 'c')

         it('if only one of exclusive key, should be valid', () => {
            const object = {a: 'foo', b: 'bar'};
            const {error} = schema.validate(object);
            expect(error).to.be.undefined
         });

         it('if more than one exclusive key, should be invalid', () => {
            const object = {a: 'foo', b: 'bar', c: 'bar'};
            const {error} = schema.validate(object);
            expect(error).not.to.be.undefined;
            expect(error.message).to.equal('"value" contains a conflict between exclusive peers [b, c]');
         });

      })

      context('and', () => {

         const schema = Joi.object().keys({
            a: Joi.any(),
            b: Joi.any(),
            c: Joi.any(),
         }).and('a', 'b');

         it('if all keys are present, should be valid', () => {
            const object = {a: 'foo', b: 'bar'};
            const {error} = schema.validate(object);
            expect(error).to.be.undefined
         });

         it('if any of the key is not present, should be invalid', () => {
            const object = {a: 'foo'};
            const {error} = schema.validate(object);
            expect(error).not.to.be.undefined;
            expect(error.message).to.equal('"value" contains [a] without its required peers [b]');
         });

      })

      context('with', () => {

         const schema = Joi.object().keys({
            a: Joi.any(),
            b: Joi.any(),
            c: Joi.any(),
            d: Joi.any(),
         }).with('a', ['b', 'c']);

         it('if the the keys is present, and peers present, should be valid', () => {
            const object = {a: 'foo', b: 'bar', c: 'foobar'};
            const {error} = schema.validate(object);
            expect(error).to.be.undefined
         });

         it('if the the keys is present, and one of the peers absent, should be invalid', () => {
            const object = {a: 'foo', c: 'foobar'};
            const {error} = schema.validate(object);
            expect(error).not.to.be.undefined;
            expect(error.message).to.equal('"a" missing required peer "b"');
         });

      })

   });

});
