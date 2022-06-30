const doSomeTaskSuccessfully = ()=>{
   console.log('Task achieved done successfully')
}
const throwSomeError = ()=>{
   throw new Error ('Something gone wild');
}

(async () => {
   try {
      doSomeTaskSuccessfully();
      // throwSomeError();
   } catch (error) {
      console.error(error);
      process.exitCode = 1;
   } finally {
      // free resources (database connexions, etc..)
   }
})()
