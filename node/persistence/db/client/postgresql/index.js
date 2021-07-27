const { Client } = require('pg')

const useCallback = ()=>{

   const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'database',
      port: 5432,
   })

   client.connect()

   const query = 'SELECT current_database()'

   client.query(query, (err, res) => {
      if (err) {
         console.error(err);
         return
      }

      const databaseName = res.rows[0].current_database;
      console.log(`Database name is ${databaseName}`);

      client.end();
   })
}

const useAwait = async () => {
   const client = new Client({
      user: "postgres",
      host: "localhost",
      database: "database",
      port: 5432,
   });

   client.connect();

   const text = "SELECT current_database()";
   const values = [];
   const res = await client.query(text, values);

   const databaseName = res.rows[0].current_database;
   console.log(`Database name is ${databaseName}`);

   client.end();
};


(async () => {
   useCallback();
   await useAwait();
})();


