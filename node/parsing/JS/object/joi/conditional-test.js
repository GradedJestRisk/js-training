const Joi = require('joi')
const { expect } = require('chai')

// online tester
// https://joi.dev/tester
context('conditional', () => {
   // https://stackoverflow.com/questions/56423558/joi-validation-how-to-require-or-optional-field-based-on-another-key-exists-in

   context('when', () => {

      context('as an if on another property presence', () => {

         const schema = Joi.object({
            a: Joi.optional(),
            b: Joi.when('a', {
               is: Joi.exist(),
               then: Joi.required()
            }),
            c: Joi.required()
         })

         it('if optional in context, should be valid when not present', () => {
            const objectWithoutB = { c: 1 }
            const { error } = schema.validate(objectWithoutB)
            expect(error).to.be.undefined
         })

         it('if is mandatory in context, should be invalid when nor present', () => {
            const objectWithoutB = {
               a: 'foo',
               c: 1
            }
            const { error } = schema.validate(objectWithoutB)
            expect(error).not.to.be.undefined
            expect(error.message).to.equal('"b" is required')
         })

      })

      context('as a case', () => {

         // given
         const schema = Joi.object({
            time: Joi.string().required().allow('dawn', 'morning', 'noon', 'afternoon', 'dusk', 'night'),
            introduce: Joi.string().required().when('time', [
               {
                  is: 'morning',
                  then: 'good morning'
               },
               {
                  is: 'night',
                  then: 'good night',
                  otherwise: 'hello'
               }
            ])
         })

         it('mapped value should be valid', () => {
            const object = {
               time: 'morning',
               introduce: 'good morning'
            }
            const { error } = schema.validate(object)
            expect(error).to.be.undefined
         })

         it('allowed unmapped value should be valid', () => {
            const object = {
               time: 'dawn',
               introduce: 'hello'
            }
            const { error } = schema.validate(object)
            expect(error).to.be.undefined
         })

         it('unallowed mapped value should be invalid', () => {
            const object = {
               time: 'night',
               introduce: 'good morning'
            }
            const { error } = schema.validate(object)
            expect(error).not.to.be.undefined
            expect(error.message).to.equal('"introduce" must be [good night]')
         })

         it('unallowed unmapped value should be invalid', () => {
            const object = {
               time: 'dawn',
               introduce: 'good morning'
            }
            const { error } = schema.validate(object)
            expect(error).not.to.be.undefined
            expect(error.message).to.equal('"introduce" must be [hello]')
         })
      })

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
         const object = {
            a: 'foo',
            b: 'bar'
         }
         const { error } = schema.validate(object)
         expect(error).to.be.undefined
      })

      it('if more than one exclusive key, should be invalid', () => {
         const object = {
            a: 'foo',
            b: 'bar',
            c: 'bar'
         }
         const { error } = schema.validate(object)
         expect(error).not.to.be.undefined
         expect(error.message).to.equal('"value" contains a conflict between exclusive peers [b, c]')
      })

   })

   // https://github.com/sideway/joi/issues/1100
   context('alternatives', () => {
      const firstPattern = new RegExp('^[0-9]{9}[a-zA-Z]{2}$', 'i')
      const secondPattern = new RegExp('^[0-9]{10}[a-zA-Z]{1}$', 'i')
      let schema

      before(() => {
         schema = Joi.object({
            identifier: Joi.alternatives().try(
               Joi.string().regex(firstPattern).required(),
               Joi.string().regex(secondPattern).required()
            )
         })
      })

      context('should not return error on correct object', () => {

         it('first pattern', () => {

            // given
            const validFirstPattern = { identifier: '123456789AB' }

            // when
            const { error } = schema.validate(validFirstPattern)
            // then
            expect(error).to.be.undefined

         })

         it('second pattern', () => {

            // given
            const validSecondPattern = { identifier: '1234567890A' }

            // when
            const { error } = schema.validate(validSecondPattern)
            // then
            expect(error).to.be.undefined

         })

      })

      context('should not return error on invalid object', () => {

         it('should return error on empty object', () => {

            // given
            const invalidString = { identifier: '' }
            // when
            const { error } = schema.validate(invalidString)

            // then
            expect(error).not.to.be.undefined
            //console.log(error);
            expect(error.details[0].message).to.eq('"identifier" does not match any of the allowed types')

         })

         it('should return error if starts with a letter', () => {

            // given
            const invalidString = { identifier: 'A1234567890A' }
            // when
            const { error } = schema.validate(invalidString)

            // then
            expect(error).not.to.be.undefined
            //console.log(error);
            expect(error.details[0].message).to.eq('"identifier" does not match any of the allowed types')

         })

         it('should return error if too many letters', () => {

            // given
            const invalidString = { identifier: '1234567890AB' }
            // when
            const { error } = schema.validate(invalidString)

            // then
            expect(error).not.to.be.undefined
            //console.log(error);
            expect(error.details[0].message).to.eq('"identifier" does not match any of the allowed types')

         })

      })
   })

   context('and', () => {

      const schema = Joi.object().keys({
         a: Joi.any(),
         b: Joi.any(),
         c: Joi.any(),
      }).and('a', 'b')

      it('if all keys are present, should be valid', () => {
         const object = {
            a: 'foo',
            b: 'bar'
         }
         const { error } = schema.validate(object)
         expect(error).to.be.undefined
      })

      it('if any of the key is not present, should be invalid', () => {
         const object = { a: 'foo' }
         const { error } = schema.validate(object)
         expect(error).not.to.be.undefined
         expect(error.message).to.equal('"value" contains [a] without its required peers [b]')
      })

   })

   context('with', () => {

      const schema = Joi.object().keys({
         a: Joi.any(),
         b: Joi.any(),
         c: Joi.any(),
         d: Joi.any(),
      }).with('a', ['b', 'c'])

      it('if the the keys is present, and peers present, should be valid', () => {
         const object = {
            a: 'foo',
            b: 'bar',
            c: 'foobar'
         }
         const { error } = schema.validate(object)
         expect(error).to.be.undefined
      })

      it('if the the keys is present, and one of the peers absent, should be invalid', () => {
         const object = {
            a: 'foo',
            c: 'foobar'
         }
         const { error } = schema.validate(object)
         expect(error).not.to.be.undefined
         expect(error.message).to.equal('"a" missing required peer "b"')
      })

   })

   context('in context', () => {

      it('should work', () => {
         // given
         const isActive = true;
         const object = { configuration: 'someValue' }

         // when
         const schema = Joi.object({
            configuration: Joi.when('a', {
               is: Joi.exist(),
               then: Joi.required()
            })
         })
         const { error } = schema.validate(object)

         // then
         expect(error).to.be.undefined
      })

})
