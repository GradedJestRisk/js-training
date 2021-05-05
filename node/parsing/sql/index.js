const removeNewline = require('newline-remove');
const {Parser} = require('node-sql-parser');

const parser = new Parser();
const queries = [
   'SELECT * FROM foo',
   'SELECT t.id FROM (SELECT id FROM foo)',
   'INSERT INTO foo (id) SELECT * FROM bar',
   'INSERT INTO foo (id)      \n             SELECT * FROM bar',
   'SELECT pg_sleep(5)',
   'INSERT INTO foo (id) SELECT 1 FROM bar(1)'
];

const normalizedQueries = queries.map((query) => {
   return removeNewline(query)
})

normalizedQueries.map((query) => {
   try {
      const queryAST = parser.astify(query);
      console.log(`Query type is ${queryAST.type}`)
      console.dir(queryAST);
   } catch (error) {
      console.log('Query type is unknown');
      console.log(query);
   }
});




