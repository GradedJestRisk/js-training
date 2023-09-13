const { expect } = require("chai");
const { logger } = require("../../src/pino/pino-file");
const { readFile } = require("fs/promises");

const fs = require("fs");

describe("pino-file", function() {
   describe("#info", function() {
      it("should append message to log file", async function() {
         // given
         fs.truncateSync("/tmp/pino-file.log");

         // when
         logger.info("foo");

         // then
         const content = await readFile("/tmp/pino-file.log", { encoding: "utf8" });
         const lines = content.toString().split("\n");
         const objects = lines.map((line) => {
            if (line !== "") {
               return JSON.parse(line);
            }
         });
         // expect(objects.length).to.equal(2);
         expect(objects[0].msg).to.deep.equal("foo");
      });
   });
});
