function exitOnSignal(signal) {
   console.warn('----------------------------------');
   console.warn(`Received signal ${signal}. Exiting...`);
   process.exit(0);
}

process.on('SIGTERM', () => { exitOnSignal('SIGTERM'); });
process.on('SIGINT', () => { exitOnSignal('SIGINT'); });

console.log('Listening for signals');
console.log('To send SIGINT: press Ctrl-C');
console.log('To send SIGTERM: pkill -TERM node');

setInterval(()=>{
   console.log('Alive')
}, 2000)
