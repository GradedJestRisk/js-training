const logQueryAboutToBeExecuted = (knex) => {
   knex.on('query', function (data) {
      const query = `${data.sql} (with bindings ${data.bindings} and id ${data.__knexQueryUid})`
      console.log(`About to be executed: ${query}`);
   });
}

module.exports = {logQueryAboutToBeExecuted};
