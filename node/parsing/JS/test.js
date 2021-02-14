const Joi = require('@hapi/joi')
const { expect }  = require('chai');

context('#validate', () => {

    const schema = Joi.object({
        password: Joi.string().max(6).required(),
        shouldChangePassword: Joi.boolean().required(),
    });

    const validObject = { password: '123456', shouldChangePassword: true }

    it('should not return error on valid object', () => {
        // when
        const { error } = schema.validate(validObject);
        expect(error).to.be.undefined
    });

    it('should return error on incorrect length property', () => {
        // given
        let invalidObject = { ...validObject, password: '1234567' };

        // when
        const { error } = schema.validate(invalidObject);

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
        const { error } = schema.validate(invalidObject);

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
        const { error } = schema.validate(invalidObject);

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

        const invalidObject = { isValidated: "false ,"}

        // when
        const { error } = schema.validate(invalidObject);

        // then
        expect(error).not.to.be.undefined

        expect(error.details[0].message).to.eq('\"isValidated\" must be a boolean');
        expect(error.details[0].type).to.eq('boolean.base')
        expect(error.details[0].path[0]).to.eq('isValidated')
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
            const emailOptions = { tlds: { allow: false } };
            const emailSchema = Joi.object({email: Joi.string().email(emailOptions).required()});

            // when
            const { error } = emailSchema.validate(validEmail);

            // then
            expect(error).to.be.undefined

        });

    });

    context('regular expressions', () => {

        const pattern = new RegExp('[0-9]+', 'i');
        const schema = Joi.object({ code: Joi.string().regex(pattern).required() });

        it('should not return error on correct object', () => {

            // given
            const validObject = { code: '1234567' };
            // when
            const {error} = schema.validate(validObject);
            // then
            expect(error).to.be.undefined

        });

        it('should return error on incorrect object', () => {

            // given
            const invalidObject = { code: 'A' };
            // when
            const { error } = schema.validate(invalidObject);

            // then
            expect(error).not.to.be.undefined
            //console.log(error);
            expect(error.details[0].message).to.eq('"code" with value "A" fails to match the required pattern: /[0-9]+/i')
            expect(error.details[0].type).to.eq('string.pattern.base')
            expect(error.details[0].path[0]).to.eq('code')

        });


    });

    context('regular expression', () => {

        const pattern = '[a-z]+[.]{1}[a-z]+[0-9]{4}';
        const regExp = new RegExp(pattern, 'i');
        const schema = Joi.string().regex(regExp).required();

        it('should not return error on correct object', () => {

            // given
            const validString = 'george.decambridge2510';

            // when
            const {error} = schema.validate(validString);
            // then
            expect(error).to.be.undefined

        });

        it('should return error on string without dot ', () => {

            // given
            const invalidString = 'georgedecambridge2510';
            // when
            const { error } = schema.validate(invalidString);

            // then
            expect(error).not.to.be.undefined
            expect(error.details[0].type).to.eq('string.pattern.base')

        });

        it('should return error on string without firstName ', () => {

            // given
            const invalidString = '.decambridge2510';
            // when
            const { error } = schema.validate(invalidString);

            // then
            expect(error).not.to.be.undefined
            expect(error.details[0].type).to.eq('string.pattern.base')

        });

        it('should return error on string without number', () => {

            // given
            const invalidString = 'george.decambridgeAAAA';
            // when
            const { error } = schema.validate(invalidString);

            // then
            expect(error).not.to.be.undefined
            expect(error.details[0].type).to.eq('string.pattern.base')

        });


    });



});
