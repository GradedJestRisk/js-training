const axios = require('axios');

const removeAll = async (context, events, done) => {
   await axios.delete('http://localhost:3000/foo');
   return done();
}

module.exports = {removeAll};
