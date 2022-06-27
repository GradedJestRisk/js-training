const { expect } = require('chai');
const mock = require('mock-fs');
const uniqueFilename = require('unique-filename')
const os = require('os');

describe('filesystem', () => {
   describe('#mock-fs', ()=>{
      beforeEach(()=>{
         mock({
            'path/to/fake/dir': {
               'some-file.txt': 'file content here',
               'empty-dir': {/** empty directory */}
            },
            'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
            'some/other/path': {/** another empty directory */}
         });
      })
      afterEach(()=>{
         mock.restore();
      })
      it('should return mock content', ()=>{
         expect(1).to.equal(1);
      })
   })
   describe('#unique-filename', ()=>{

      it('generate a file path in OS temporary directory (Windows and Linux)',()=>{
         const prefix = 'INSEE-test'
         const extension = 'csv';
         // returns something like: /tmp/INSEE-test-912ec803b2ce49e4a541068d495ab570.csv
         const filePath = uniqueFilename(os.tmpdir(), prefix) + '.csv'
         console.log(filePath)
         expect(filePath).to.be.a('string');
      });
   });

});
