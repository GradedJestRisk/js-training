// https://oncletom.io/node.js/chapter-04/#events
const EventEmitter = require('events');
const emitter = new EventEmitter();

// listen to event
emitter.on('date', (date) => {
   console.log('Année : %d', date.getFullYear());
});

// emit event
emitter.emit('date', new Date('2018-03-01'));
emitter.emit('date', new Date('1983-03-24'));

