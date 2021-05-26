const Parser = require('acorn').Parser;
const fs = require('fs').promises;

const sourceFromString = ()=>{
   const data = `
class Car {
  constructor(param1, param2) {
    this.prop1 = param1;
    this.prop2 = param2;
  }
  getName() {
    console.log('color', this.prop1, this.prop2);
    return this.prop1 + " " + this.prop2;
  }
}`;

   return data;
}

const sourceFromFile = async ()=>{
   const data = await fs.readFile('./code.js');
   return data.toString()
}

const parse = async () => {

   // const source = sourceFromString();
   const source = await sourceFromFile();

   // see https://astexplorer.net/
   const parsed = Parser.parse(source, {ecmaVersion: 2020});

   const classDecl = parsed.body[0];
   const ctrDef = classDecl.body.body.find(node => node.kind === 'constructor');
   const ctrParams = ctrDef.value.params.map(el => el.name);
   const ctrStmts = ctrDef.value.body;
   const methodDef = classDecl.body.body.find(
      node => (node.kind === 'method') && (node.key.name === 'getName')
   );
   const methodParams = methodDef.value.params.map(el => el.name);
   const methodStmts = methodDef.value.body;

   console.log({ctrParams, ctrStmts, methodParams, methodStmts});
};

(async() =>{
   await parse()
})()

