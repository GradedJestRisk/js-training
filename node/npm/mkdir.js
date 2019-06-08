const mkdirp = require("mkdirp");
mkdirp("foo", function(err) {
  if (err) console.error(err);
  else console.log("Directory created!");
});