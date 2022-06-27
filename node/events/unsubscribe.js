// https://oncletom.io/node.js/chapter-04/#events

const EventEmitter = require('events');
const emitter = new EventEmitter();
const tick = () => process.stdout.write('.');
let counter = 0;

// emit 5 'date' events, 1 second each
setInterval(() => {
   counter++;
   emitter.emit('date', new Date());

   if (counter === 5) {
      process.exit(0);
   }
}, 1000);

// at each date event, send dot to console output
emitter.on('date', tick);

// after third event, unsubscribe from listener
emitter.on('date', () => {
   if (counter === 3) {
      emitter.removeListener('date', tick);
   }
});

