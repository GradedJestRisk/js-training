const { expect } = require('chai');
const mock = require('mock-fs');
const uniqueFilename = require('unique-filename');
const os = require('os');
const fs = require('fs');

describe('filesystem', () => {
   describe('#mock-fs', () => {
      afterEach(() => {
         mock.restore();
      });
      it('mocked file should be read by readFileSync', () => {
         // given
         mock({
            'path/to/fake/dir': {
               'some-file.txt': 'file content here',
               'empty-dir': {
                  /** empty directory */
               },
            },
         });

         // when
         const string = fs.readFileSync(
            'path/to/fake/dir/some-file.txt',
            'utf8'
         );

         // then
         expect(string).to.equal('file content here');
      });
      context('write', () => {
         const filePath ='/tmp/mock-fs-test.log';
         context('when fs is mocked', () => {
            it('file should not be created on actual filesystem', () => {
               // given
               mock({
                  'tmp': {},
               });

               // when
               fs.writeFileSync(filePath, 'file content here', { flag: 'w'});

               // then
               const string = fs.readFileSync(filePath, 'utf8');
               expect(string).to.equal('file content here');
               // manual check
               // cat /tmp/mock-fs-test.log
               // cat: /tmp/mock-fs-test.log: No such file or directory
            });
         });
         context('when fs is unmocked', () => {
            it('file should be created on actual filesystem', () => {
                // when
               fs.writeFileSync(filePath, 'file content here', { flag: 'w'});

               // then
               const string = fs.readFileSync(filePath, 'utf8');
               expect(string).to.equal('file content here');
               // manual check
               // cat /tmp/mock-fs-test.log
               // file content here%
            });
         });
      });
   });
   describe('#unique-filename', () => {
      it('generate a file path in OS temporary directory (Windows and Linux)', () => {
         const prefix = 'INSEE-test';
         const extension = 'csv';
         // returns something like: /tmp/INSEE-test-912ec803b2ce49e4a541068d495ab570.csv
         const filePath = uniqueFilename(os.tmpdir(), prefix) + '.csv';
         console.log(filePath);
         expect(filePath).to.be.a('string');
      });
   });
});
