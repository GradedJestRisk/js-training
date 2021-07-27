const serverPort = 3001;
const axios = require('axios');

const removeAll = async (context, events, done) => {

   const request = {
      url: `http://localhost:${serverPort}/foo`,
      method: 'DELETE',
      configuration: {
         headers: {
            'X-correlation-id': 0,
         }
      }
   }
   try {
      await axios.request(request);
   } catch (error) {
      console.error(error.message);
      throw(error);
   }

   return done();
}

const fakeNewVersionDeployment = async (context, events, done) => {

   const request = {
      url: `http://localhost:${serverPort}/version`,
      method: 'PUT',
      data: {version: '1.1.1'},
      configuration: {
         headers: {
            'X-correlation-id': 0,
         }
      }
   }
   try {
      await axios.request(request);
   } catch (error) {
      console.error(error.message);
      throw(error);
   }

   return done();
}

module.exports = {removeAll, fakeNewVersionDeployment};
