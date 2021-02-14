const chai = require('chai');
const expect = chai.expect;
const {collect, ensure} = require('ensurism');
const Joi = require('joi')

describe('ensure type with ensure', () => {

   describe('on variable', () => {

      it('should reject invalid number type', () => {

         const checkType = function () {
            ensure('a', 'number');
         };

         expect(checkType).to.throw('data is not valid: data should be number');

      });

      it('should not reject valid URL type, but does', () => {

         expect(() => {
            ensure('http://example.net', {
               type: 'string',
               format: 'uri'
            }).to.throw('unknown format "uri" ignored in schema at path "#/properties/data"');
         });

      });

      it('should reject if not in list', () => {

         process.env.NODE_ENV = 'fancy';

         const checkType = function () {
            ensure(process.env.NODE_ENV, {
               type: 'string',
               enum: ['development', 'production', 'test']
            });

         }

         expect(checkType).to.throw('data is not valid: data should be equal to one of the allowed values');

      });

   });

   describe('on object', () => {

      it('should throw if one of the values are invalid', () => {

         const NotANumber = 'a'

         process.env.FOO = 'bar';
         process.env.URI = 'http://example.net';
         process.env.PORT = NotANumber;
         process.env.NODE_ENV = 'development';

         const checkType = function () {
            collect(process.env, ({assert, ensure, coerce}) => ({
               FOO: assert(),
               URI: ensure({type: 'string'}),
               PORT: coerce('number'),
               NODE_ENV: ensure({
                  type: 'string',
                  enum: ['development', 'production', 'test'],
                  default: 'development'
               })
            }));
         };

         expect(checkType).to.throw('the following errors where found:\n\tPORT: data cannot be coerced to number: a');

      });
   })

});

describe('ensure type with joi', () => {

   const schema = Joi.object({
      FOO: Joi.string().required().valid('bar', 'BAR'),
      BASE_URL: Joi.string().uri().required(),
      PORT: Joi.number().required(),
      CHANGE_PASSWORD: Joi.string().required().valid('enabled', 'disabled'),
   }).options({ allowUnknown: true });

      it('should not throw if all values are valid', () => {

         process.env.FOO = 'bar';
         process.env.BASE_URL = 'http://example.net';
         process.env.PORT = 80;
         process.env.CHANGE_PASSWORD = 'enabled';

         const {error} = schema.validate(process.env);
         expect(error).to.be.undefined

      });

      it('should throw if one of the values is invalid', () => {

         process.env.FOO = 'bar';
         process.env.BASE_URL = 'http://example.net';
         process.env.PORT = 80;
         process.env.CHANGE_PASSWORD = 'true';

         const {error} = schema.validate(process.env);
         expect(error.message).to.equal('"CHANGE_PASSWORD" must be one of [enabled, disabled]')

      });

});

