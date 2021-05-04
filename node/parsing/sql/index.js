const {Parser} = require('node-sql-parser');

const parser = new Parser();
let query;

const insertSelectQuery = 'INSERT INTO foo (id) SELECT * FROM bar'
query = insertSelectQuery;
try {
   const queryAST = parser.astify(query);
   console.dir(queryAST);
} catch (error) {
   console.log(`error while parsing ${query}`)
}

const spacedQuery = 'INSERT INTO foo (id)                   SELECT * FROM bar';
const trimmed = spacedQuery.replace(/ +(?= )/g,'');
query = trimmed;
try {
   const queryAST = parser.astify(query);
   console.dir(queryAST);
} catch (error) {
   console.log(`error while parsing ${query}`)
}
