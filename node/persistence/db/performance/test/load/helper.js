const axios = require('axios');

const removeAll = async (context, events, done) => {

   const request = {
      url: 'http://localhost:3000/foo',
      method: 'DELETE',
      configuration: {
         headers: {
            'X-correlation-id': 0,
         }
      }
   }
   try {
      await axios.request(request);
   } catch(error){
      console.error(error.message);
      throw(error);
   }

   return done();
}

module.exports = {removeAll};
