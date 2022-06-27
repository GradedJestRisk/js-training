// function waitForThatMilliseconds(ms) {
//    return new Promise((resolve) => {
//       setTimeout(resolve, ms);
//    });
// }

const waitForThatMilliseconds = (delay) => new Promise((resolve) => setTimeout(resolve, delay ));

(async () => {
   console.log('waiting 2 seconds');
   await waitForThatMilliseconds(2000);
   console.log('done');
   process.exit(0);
})()
