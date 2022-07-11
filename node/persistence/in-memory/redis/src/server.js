const wtf = require('wtfnode');
const Hapi = require('@hapi/hapi');
const  RedisClient = require('./RedisClient');
const  AnotherRedisClient = require('./AnotherRedisClient');
let server;
let redisClient;
let anotherRedisClient;

const wait = (seconds) => new Promise((res) => setTimeout(res, seconds * 1000));

const init = async () => {

   redisClient = new RedisClient();
   await redisClient.set({key: 'aKey', value: { foo: 'bar' }});

   anotherRedisClient = new AnotherRedisClient();
   await anotherRedisClient.set({key: 'anotherKey', value: { foo: 'bar' }});

   server = Hapi.server({
      port: 3000,
      host: 'localhost'
   });

   await server.start();
   console.log('Server running on %s', server.info.uri);
   console.info('Allocated resources');
   wtf.dump();
};

process.on('SIGINT', async () => {
   console.info('Stopping HAPI server...');
   server.stop({ timeout: 30000 });
   console.info('Closing connexions to cache...');
   redisClient.quit();
   console.info('Checking for non-freed resources');
   wtf.dump();
});

init();

/////////////////////////////////
// ports open by process
// netstat --all --program | grep <PID>

/////////////////////////////////
// process listening on port
// netstat -nlp | grep :<PORT_NUMBER

// HAPI process
// netstat -nlp | grep :3000

// redis process
// netstat -nlp | grep :6379

/////////////////////////////////
// process with open connection to port
// lsof -nPi tcp:<PORT_ID>

// connected to redis
// lsof -nPi tcp:6379
// COMMAND     PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
// redis-cli 36058 topi    3u  IPv4 677487      0t0  TCP 127.0.0.1:33262->127.0.0.1:6379 (ESTABLISHED)
// node      40470 topi   18u  IPv4 723756      0t0  TCP 127.0.0.1:38734->127.0.0.1:6379 (ESTABLISHED)
// node      41016 topi   19u  IPv4 727869      0t0  TCP 127.0.0.1:60042->127.0.0.1:6379 (ESTABLISHED)



/////////////////////////////////
// executable from process

// ❯  ps -p <PID> -o args
// COMMAND
// .nvm/versions/node/v15.11.0/bin/node js-training/node/persistence/in-memory/redis/src/server.js

/////////////////////////////////
// list opened connexions to redis server
// redis-cli CLIENT LIST
