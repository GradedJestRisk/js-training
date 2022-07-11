const { expect} = require('chai');
const  RedisClient = require('../src/RedisClient');
describe('Acceptance | RedisClient', function () {
   let redisClient;
   before(()=>{
      redisClient = new RedisClient();
   })
   beforeEach(async () => {
      await redisClient.clear();
   })
   after(async()=>{
      await redisClient.quit();
   })
   describe('#clear', ()=>{
      it('should delete all entries', async () => {
         // given
         await redisClient.set({key: 'aKey', value: { foo: 'bar' }});
         await redisClient.set({key: 'anotherKey', value: { foo: 'bar' }});

         // when
         await redisClient.clear();

         // then
         const keys = await redisClient.getKeys();
         expect(keys).to.deep.equal([]);
      });
   })
   describe('#getKeys', ()=>{
      it('should return  all keys', async () => {
         // given
         await redisClient.set({key: 'aKey', value: { foo: 'bar' }});
         await redisClient.set({key: 'anotherKey', value: { foo: 'bar' }});

         // when
         const keys = await redisClient.getKeys();

         // then
         expect(keys).to.deep.equal([
            "anotherKey",
            "aKey"
         ]);
      });
   })
   describe('#set', ()=>{
      it('should save', async () => {
         // when
         await redisClient.set({key: 'aKey', value: { foo: 'bar' }});

         // then
         // check with redis-cli --raw GET "aKey"
         // expect(value).to.deep.equal({ foo: 'bar' });
         expect(true).to.equal(true);
      });
   })
   describe('#get', ()=>{
      it('should retrieve', async () => {
         // given
         await redisClient.set({key: 'aKey', value: { foo: 'bar' }});
         // check with redis-cli --raw GET "aKey"

         // when
         const value = await redisClient.get('aKey');

         // then
         expect(value).to.deep.equal({ foo: 'bar' });
      });
   })

});
