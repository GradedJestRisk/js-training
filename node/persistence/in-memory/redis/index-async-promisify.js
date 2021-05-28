const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();
client.on('error', function (error) {
   console.error(error);
});

const ttl = promisify(client.ttl).bind(client);
const set = promisify(client.set).bind(client);
const get = promisify(client.get).bind(client);

const main = async () => {
   const key = 'akey';
   const value = 'aValue';
   const expirationDelaySeconds = 10;
   await set(key, value, 'EX', expirationDelaySeconds);

   const retrievedValue = await get(key);
   console.log(`Retrieved value for ${key}: ${retrievedValue}`);

   let remainingTime = 1;
   while (remainingTime > 0){
      remainingTime = await ttl(key);
      console.log(`${key} whose value is ${value} will expire in ${remainingTime} seconds`);
      await new Promise((resolve) => {
         setTimeout(function () {
            resolve()
         }, 1000)
      })
   }
}

(async()=>{
   await main();
   process.exit(0);
})()
