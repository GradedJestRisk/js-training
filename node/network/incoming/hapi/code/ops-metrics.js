const Hapi = require('@hapi/hapi');
const Oppsy = require('@hapi/oppsy');

(async () => {
   const server = new Hapi.Server();

   const oppsy = new Oppsy(server);

   oppsy.on('ops', (data) => {
      console.log(data);
   });

   const emitEachSecond = 1 * 1000;
   oppsy.start(emitEachSecond);
   await server.start();
})()

const sampleEvent =
   {
      "event": "ops",
      "timestamp": 1619438362580,
      "host": "OCTO-TOPI",
      "pid": 161995,
      "os": {
         "load": [
            0.72,
            0.85,
            1.02
         ],
         "mem": {
            "total": 16588632064,
            "free": 2831781888
         },
         "uptime": 20848
      },
      "proc": {
         "uptime": 693.681173153,
         "mem": {
            "rss": 127381504,
            "heapTotal": 71745536,
            "heapUsed": 69139328,
            "external": 5677406,
            "arrayBuffers": 4119554
         },
         "delay": 0.3803109973669052
      },
      "load": {
         "requests": {},
         "responseTimes": {},
         "sockets": {
            "http": {
               "total": 0
            },
            "https": {
               "total": 0
            }
         }
      }
   };



