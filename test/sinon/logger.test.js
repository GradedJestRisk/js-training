const chai = require('chai');
const sinon = require('sinon');
const Logger = require('./logger');

chai.should();

describe('spy', () => {
  it('firstCall contains arguments', () => {
    const message = 'Message';
    const logger = new Logger();
    const loggerSpy = sinon.spy(logger, 'log');
    logger.log(message);

    loggerSpy.firstCall.args[0].should.be.eq(message);
    loggerSpy.restore();
  });
  it('callCount increments', () => {
    const message = 'Message';
    const logger = new Logger();
    const loggerSpy = sinon.spy(logger, 'log');
    logger.log(message);

    loggerSpy.callCount.should.be.eq(1);

    loggerSpy.restore();
  });
});
