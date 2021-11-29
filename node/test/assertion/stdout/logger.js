const buildLogger = ({ tag, disableLogs }) => {
   return {
      log: (message) => {
         if(disableLogs) {
            return
         }
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
