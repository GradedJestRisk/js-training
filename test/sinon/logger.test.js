const chai = require('chai');
const sinon = require('sinon');
const Logger = require('./logger');

chai.should();
let expect = chai.expect;

describe('spy', () => {
  let loggerSpy;
  const message = 'Message';
  beforeEach( () => {
    const logger = new Logger();
    loggerSpy = sinon.spy(logger, 'log');
    logger.log(message);
  });
  afterEach( () => {
    loggerSpy.restore();
  })
  it('firstCall contains arguments', () => {
    loggerSpy.firstCall.args[0].should.be.eq(message);
  });
  it('callCount increments', () => {
    loggerSpy.callCount.should.be.eq(1);
  });
});

describe('stub', () => {

  describe('should return a value', () => {
    let logger;
    let loggerStub;
    beforeEach( () => {
      logger = new Logger();
      loggerStub = sinon.stub(logger, "messageCount");
    });
    it('using returns(), same value', () => {
      // Given
      const messageCount = 1;
      loggerStub.returns(messageCount);
      logger.log("First message");
      // Then
      logger.messageCount().should.eq(messageCount);
      logger.log("Second message");
      // Then
      logger.messageCount().should.eq(messageCount);
    });

    it('using on<N>Call(), different value', () => {
      // Given
      const firstMessageCount = 1;
      const secondMessageCount = 2;
      loggerStub.onFirstCall().returns(firstMessageCount);
      loggerStub.onSecondCall().returns(secondMessageCount);
      // When
      logger.log("First message");
      // Then
      logger.messageCount().should.eq(firstMessageCount);
      // When
      logger.log("Second message");
      // Then
      logger.messageCount().should.eq(secondMessageCount);
    });
    afterEach( () => {
      loggerStub.restore();
    });
  });

});
