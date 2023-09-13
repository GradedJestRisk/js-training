const { expect } = require("chai");
const { logger } = require("../../src/pino/pino-to-stdout");

describe("pino-to-stdout", function() {
   describe("#info", function() {
      it("should send message to standard output with custom format", async function() {

         // when
         logger.info("foo");

         // then
         // {"level":"INFO","on":"15:59:42","osProcessId":13911,"serverName":"OCTO-TOPI","msg":"foo"}
      });
   });
   describe("#error", function() {
      it("should include stacktrace", async function() {

         // when
         logger.error(new Error("OMG"), "en error occured");

         // then
         //{"level":"ERROR","on":"15:59:22","osProcessId":13881,"serverName":"OCTO-TOPI","err":{"type":"Error","message":"OMG","stack":"Error: OMG\n    at Context.<anonymous> (/home/topi/Documents/IT/js/js-training/node/logging/libraries/tests/pino/pino-stdout_test.js:19:23)\n    at callFn (/home/topi/Documents/IT/js/js-training/node/logging/libraries/node_modules/mocha/lib/runnable.js:366:21)\n    at Test.Runnable.run (/home/topi/Documents/IT/js/js-training/node/logging/libraries/node_modules/mocha/lib/runnable.js:354:5)\n    at Runner.runTest (/home/topi/Documents/IT/js/js-training/node/logging/libraries/node_modules/mocha/lib/runner.js:666:10)\n    at /home/topi/Documents/IT/js/js-training/node/logging/libraries/node_modules/mocha/lib/runner.js:789:12\n    at next (/home/topi/Documents/IT/js/js-training/node/logging/libraries/node_modules/mocha/lib/runner.js:581:14)\n    at /home/topi/Documents/IT/js/js-training/node/logging/libraries/node_modules/mocha/lib/runner.js:591:7\n    at next (/home/topi/Documents/IT/js/js-training/node/logging/libraries/node_modules/mocha/lib/runner.js:474:14)\n    at Immediate._onImmediate (/home/topi/Documents/IT/js/js-training/node/logging/libraries/node_modules/mocha/lib/runner.js:559:5)\n    at processImmediate (node:internal/timers:464:21)"},"msg":"en error occured"}
      });
   });
});
