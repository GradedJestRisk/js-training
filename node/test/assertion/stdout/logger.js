const buildLogger = (tag) => {
   return {
      log: (message) => {
         if (tag) {
            console.log(`[${tag}] ${message}`)
         } else {
            console.log(`${message}`)
         }
      },
      error: (message) => {
         console.error(`${message}`)
      }
   }
}
module.exports = buildLogger
