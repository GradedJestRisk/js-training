const {Parser} = require('node-sql-parser');

const parser = new Parser();

const getQueryType = function(queryText) {

   let queryType = 'UNKNOWN';
   try {
      const queryAST = parser.astify(queryText);
      queryType = queryAST.type;
   } catch (error) {
      //console.log(`${queryText} cannot be parsed`)
   }

   return queryType;
}

module.exports = { getQueryType }
