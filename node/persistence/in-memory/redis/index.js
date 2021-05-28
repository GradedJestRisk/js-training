const redis = require('redis')
const { promisify } = require('util');
const client = redis.createClient({
   host: "localhost",
   port: 6379
});

client.on('error', function (error) {
   console.error(error)
})

// https://github.com/NodeRedis/node-redis/issues/1000
const expirationInSeconds = 1;
client.set('key1', 'value1', 'EX', expirationInSeconds, redis.print)

// before expiration
setTimeout(() => {
   console.log('before expiration')
   client.get('key1', redis.print)
}, 1)

setTimeout(() => {
   console.log('after expiration')
   client.get('key1', redis.print)
}, 2000)

client.set('key2', 'value2', ()=>{
   console.log('key2 created');
})
client.get('key2', redis.print)
client.del('key2', ()=>{
   console.log('key2 deleted');
})
client.get('key2', redis.print)

client.get('key1', redis.print)
client.ttl('key1', redis.print)
