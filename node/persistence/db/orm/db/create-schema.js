const client = require('./native-client');

const resetSchemaQuery = `
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
`;

client.query(resetSchemaQuery, (err, res) => {
   if (err) {
      console.error(err);
      return;
   }
   console.log('PUBLIC schema successfully reset')
   client.end();
});


