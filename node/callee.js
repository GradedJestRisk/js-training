
const where_am_i = function(){	

  console.log();	
  console.log("-----------------------------------------");	 
  console.log("Entering callee.where_am_i");	 
  console.log("-----------------------------------------");

  console.group();	

  console.log('global.process.mainModule.filename => '+ global.process.mainModule.filename);


  console.log('module =>');
  console.dir(module);

  console.log('require.main =>');
  console.dir(require.main);

  console.log();
  if (require.main === module) {
      console.log("=> called by Node.js directly (node callee )");
  } else {
     console.log("=> called from another module");
  }

  console.log();

  console.groupEnd(); 
 
  console.log("-----------------------------------------");
  console.log("Exiting callee.where_am_i");
  console.log("-----------------------------------------");

}

console.log("-----------------------------------------");      
console.log("Invoking where_am_i from within callee");
console.log("-----------------------------------------");

where_am_i();

module.exports = { where_am_i };
