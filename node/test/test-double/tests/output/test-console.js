const stdout = require('test-console').stdout;
const { expect } = require('chai');

const sut = () => {
   console.log('foo');
};
describe('inspectSync', () => {
   it('should return console output', () => {
      const output = stdout.inspectSync(() => {
         sut();
      });
      expect(output).to.deep.equal(['foo\n']);
   });
});
