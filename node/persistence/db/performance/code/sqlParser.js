const {Parser} = require('node-sql-parser');

const parser = new Parser();
const parserOptions = {database: 'postgresql'};

const parseQuery = function (rawQueryText) {

   const {requestId, queryText} = extractQueryAndRequestId(rawQueryText);

   let queryType;

   try {
      const queryAST = parser.astify(queryText, parserOptions);
      queryType = queryAST.type;
   } catch (error) {
      //console.log(`${queryText} cannot be parsed`);
      queryType = 'UNKNOWN';
   }

   return {queryType, requestId, queryText};
}

const extractQueryAndRequestId = (rawQueryText) => {

   const DEFAULT_CORRELATION_ID = 0;

   const markers = {

      // Hints are implemented
      // http://knexjs.org/#Builder-hintComment
      hint: {opening: '/*+', closing: '*/'},

      // Query comments are not implemented yet (but in raw)
      // https://github.com/knex/knex/pull/2815
      comment: {opening: '/*', closing: '*/'}
   }

   let actualMarker;

   if (rawQueryText.indexOf(markers.hint.opening) >= 0) {
      actualMarker = markers.hint;
   } else if (rawQueryText.indexOf(markers.comment.opening) >= 0) {
      actualMarker = markers.comment;
   } else {
      return {requestId: DEFAULT_CORRELATION_ID, queryText: rawQueryText}
   }

   const {requestId, queryText} = appleSauce(rawQueryText, actualMarker);
   return {requestId, queryText}
}

const appleSauce = (sql, marker) => {

   if (!sql)
      return null;

   const startsAt = sql.indexOf(marker.opening);
   const endsAt = sql.indexOf(marker.closing);

   if ((startsAt < 0) || (startsAt > endsAt)) {
      return null;
   }

   const segment = sql.substring(startsAt, endsAt + marker.closing.length);
   const queryText = sql.replace(segment, '');
   const requestId = segment.substring(marker.opening.length, segment.length - marker.closing.length).trim();

   return {requestId, queryText};

}

module.exports = {parseQuery}
