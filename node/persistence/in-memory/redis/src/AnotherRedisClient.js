const redis = require('async-redis');

const AnotherRedisClient = class {
   constructor() {
         this._client = redis.createClient('redis://localhost:6379');
   }

   quit() {
      this._client.quit();
   }

   async set({ key, value }) {
      const objectAsString = JSON.stringify(value);
      await this._client.set( key, objectAsString);
   }

   async get(key) {
      const value = await this._client.get(key);
      return JSON.parse(value);
   }

   async clear() {
    await this._client.flushdb();
   }

   async getKeys() {
      return this._client.keys('*');
   }

};

module.exports =  AnotherRedisClient;
