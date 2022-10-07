const uuid = require('uuid');

const fizzbuzz = (i) => {
   return 'fizzbuzz' + uuid.v4();
};
module.exports = fizzbuzz;
