const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

client.on("error", function (err) {
   console.log("Error " + err);
});

const main = async () => {
   await client.set("string key", "string val");
   const value = await client.get("string key");
   console.log(value);
};

(async ()=>{
   await main();
   process.exit(0);
})()
