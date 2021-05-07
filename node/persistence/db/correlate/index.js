require('dotenv').config();
const {knexMonitoring, knexMonitored} = require('./database/database-client');

(async () => {

   knexMonitored.on('query', (query) => {
      console.log(`Query submitted: ${query.sql} (id: ${query.__knexQueryUid})`);
   })

   await knexMonitored.raw('SELECT now');
   process.exit();
})()
