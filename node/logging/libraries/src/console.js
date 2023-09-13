const logger = {
   info: ({ data }) => {
      console.log(data);
   },
   error: ({ data }) => {
      console.error(data);
   }
};
module.exports = { logger };
