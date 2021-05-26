const Joi = require('joi')
const {expect} = require('chai');

// online tester
// https://joi.dev/tester
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
