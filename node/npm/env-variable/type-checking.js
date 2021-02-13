const chai = require('chai');
const expect = chai.expect;
const {collect, ensure} = require('ensurism');

describe('ensure type', () => {

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

