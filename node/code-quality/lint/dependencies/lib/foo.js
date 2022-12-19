// ignore unused exports anotherUnusedExport

const bar = ()=>{
   return 'foobar';
}
const unusedExport = ()=>{
   console.log('foo')
}

const anotherUnusedExport = ()=>{
   console.log('foo')
}

module.exports = {bar, unusedExport, anotherUnusedExport}
