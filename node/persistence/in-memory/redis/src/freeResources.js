const  RedisClient = require('./RedisClient');

const main = async()=>{
   const redisClient = new RedisClient();
   await redisClient.set({key: 'aKey', value: { foo: 'bar' }});
   // process will not exit unless
   //  - redis server is stopped (docker-compose down)
   //  - quit is invoked on the client
   // redisClient.quit();
   console.log('Trying to exit..');
   process.exitCode = 0;
}

(async () => {
   await main();
})()



