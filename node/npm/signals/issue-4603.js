process.on('SIGINT',  function(){ console.log("SIGINT");  shutDown() });
process.on('SIGTERM', function(){ console.log("SIGTERM"); shutDown() });

var string = ".";

var shutDown = function(){
   console.log("shutdown in 2 seconds...");
   string = "x";

   setTimeout(function(){
      console.log("bye!");
      process.exit(0);
   }, 2 * 1000);
}

setInterval(function(){
   console.log(string);
}, 500)
