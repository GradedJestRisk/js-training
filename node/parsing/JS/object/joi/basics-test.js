const Joi = require('joi')
const { expect } = require('chai')

// online tester
// https://joi.dev/tester
context('basics', () => {

   let schema
   let validObject

   before(() => {
      schema = Joi.object({
         password: Joi.string().max(6).required(),
         shouldChangePassword: Joi.boolean().required(),
         deferred: Joi.boolean().required().messages({
            'any': 'expecting a boolean'
         }),
      })
      validObject = {
         password: '123456',
         shouldChangePassword: true,
         deferred: true
      }
   })

   it('should cascade custom messages rules', ()=>{
      const schema = Joi.object({
         name: Joi.string().max(6).required().messages({
            'string.base': 'name is not a string',
            'string.empty': 'name is empty',
         })});

      const { error : typeError } = schema.validate({ name: null })

      expect(typeError.details[0].message).to.eq('name is not a string')

      const { error : emptyStringError } = schema.validate({ name: '' })

      expect(emptyStringError.details[0].message).to.eq('name is empty')


   })

   it('should not return error on valid object', () => {
      // when
      const response = schema.validate(validObject)
      expect(response.value).to.deep.equal(validObject)
      expect(response.error).to.be.undefined
   })

   it('should return error on incorrect length property', () => {
      // given
      let invalidObject = {
         ...validObject,
         password: '1234567'
      }

      // when
      const { error } = schema.validate(invalidObject)

      // then
      expect(error).not.to.be.undefined

      expect(error.details[0].message).to.eq('"password" length must be less than or equal to 6 characters long')
      expect(error.details[0].type).to.eq('string.max')
      expect(error.details[0].path[0]).to.eq('password')
   })

   it('should return custom error message', () => {
      // given
      let invalidObject = {
         ...validObject,
         deferred: 'obviously not a boolean'
      }

      // when
      const { error } = schema.validate(invalidObject)

      // then
      expect(error).not.to.be.undefined

      expect(error.details[0].message).to.eq('"deferred" must be a boolean')
      expect(error.details[0].type).to.eq('boolean.base')
      expect(error.details[0].path[0]).to.eq('deferred')
   })

   it('should return error on missing required property', () => {
      // given
      let invalidObject = validObject
      delete invalidObject.password

      // when
      const { error } = schema.validate(invalidObject)

      // then
      expect(error).not.to.be.undefined

      expect(error.details[0].message).to.eq('"password" is required')
      expect(error.details[0].type).to.eq('any.required')
      expect(error.details[0].path[0]).to.eq('password')
   })

   it('should return error on incorrect primitive type', () => {
      // given
      let invalidObject = validObject
      invalidObject.password = parseInt(invalidObject.password)

      // when
      const { error } = schema.validate(invalidObject)

      // then
      expect(error).not.to.be.undefined

      expect(error.details[0].message).to.eq('"password" must be a string')
      expect(error.details[0].type).to.eq('string.base')
      expect(error.details[0].path[0]).to.eq('password')
   })

   it('should return error on incorrect boolean primitive type', () => {
      // given
      const schema = Joi.object({
         isValidated: Joi.boolean()
      })

      const invalidObject = { isValidated: 'false ,' }

      // when
      const { error } = schema.validate(invalidObject)

      // then
      expect(error).not.to.be.undefined

      expect(error.details[0].message).to.eq('\"isValidated\" must be a boolean')
      expect(error.details[0].type).to.eq('boolean.base')
      expect(error.details[0].path[0]).to.eq('isValidated')
   })

})
