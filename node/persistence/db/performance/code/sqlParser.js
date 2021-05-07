const {Parser} = require('node-sql-parser');

const parser = new Parser();

const parseQuery = function (rawQueryText) {

   let queryType = 'UNKNOWN';
   const {correlationId, queryText} = extractQueryAndCorrelationId(rawQueryText);

   try {
      const queryAST = parser.astify(queryText);
      queryType = queryAST.type;
   } catch (error) {
      //console.log(`${queryText} cannot be parsed`)
   }

   return { queryType, correlationId, queryText};
}

const extractQueryAndCorrelationId = (sql) => {
   // See https://docs.oracle.com/cd/B12037_01/server.101/b10759/sql_elements006.htm
   // for how to detect comments.

   if (!sql)
      return null;

   const indexOpeningSlashComment = sql.indexOf('/*');
   const indexClosingSlashComment = sql.indexOf('*/');

   if ((indexOpeningSlashComment < 0) || (indexOpeningSlashComment > indexClosingSlashComment)) {
      return null;
   }

   const correlationId = sql.substring(indexOpeningSlashComment + 2, indexClosingSlashComment);
   const queryText = sql.substring(indexClosingSlashComment + 2);

   return {correlationId, queryText};

}

module.exports = {parseQuery}
