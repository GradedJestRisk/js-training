const serverFactory = require('./code/server');
let server;

const registerHaltHandler = ()=>{
   const tenSeconds = 10 * 1000;
   process.on('SIGINT', async () => {
      console.info(`Received signal SIGINT`);
      console.info('Stopping HAPI server gracefully (grace period is 10 seconds)');
      await server.stop({timeout: tenSeconds});
      console.info('Server stopped');
   });
}

(async () => {
   registerHaltHandler();
   server = await serverFactory.start();
})()
