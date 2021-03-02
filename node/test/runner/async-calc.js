const addPromise = function (i, j) {
   return new Promise((resolve)=>{
      resolve(i + j);
   })
 };

const addAsync = async function (i, j) {
   const result = await new Promise((resolve)=>{
      resolve(i + j);
   })
   return(result);
};

module.exports = { addPromise, addAsync };
