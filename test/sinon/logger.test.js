const chai = require('chai');
const sinon = require('sinon');
const Logger = require('./logger');

const sinonChai = require('sinon-chai');
chai.use(sinonChai);

chai.should();
let expect = chai.expect;

describe('spy ', () => {

  describe('log function call', () => {
    let logger;
    let loggerSpy;
    const message = 'Message';
    beforeEach(() => {
      logger = new Logger();
      loggerSpy = sinon.spy(logger, 'log');
      logger.log(message);
    });
    afterEach(() => {
      loggerSpy.restore();
    })
    it('firstCall contains arguments', () => {
      loggerSpy.firstCall.args[0].should.be.eq(message);
    });
    it('callCount increments', () => {
      loggerSpy.callCount.should.be.eq(1);
    });
    it('calledOnce return true if called once', () => {
      sinon.assert.calledOnce(loggerSpy);
    });
    describe('using sinon-chai plugin', () => {
      describe('call count', () => {
        it('fluent style', () => {
          loggerSpy.should.be.calledOnce;
        });
        it('fluent style', () => {
          loggerSpy.should.have.been.calledOnce;
        });
      });
      describe('value', () => {
        it('fail if called with unspecified args ', () => {
          // 2 call (i1 in beforeEach)
          logger.log(message);
          loggerSpy.callCount.should.be.eq(2);
          // then
          loggerSpy.should.always.have.been.calledWithExactly(message);
        });
      });
      describe('call count and value', () => {
        it('fail if called more than once, and not with specified args ', () => {
          // when - second call
          // uncomment to fail
          //logger.log(message);

          // then
          loggerSpy.should.always.have.been.calledOnceWithExactly(message);
        });
      });
    });

  });

});
describe('stub', () => {

  describe('partial stub', () => {
    describe('should return a value', () => {
      let logger;
      let loggerStub;
      beforeEach(() => {
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
        //expect(loggerStub.log).calledWith("First message").to.equal(true);
        //expect(loggerStub.log).to.have.been.calledWith("First message");
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

      it('using withArgs(), return different values based on argument', () => {
        // Given
        const firstMessage = "First message";
        const secondMessage = "Second message";

        const loggerStub = sinon.stub(logger, "log");
        loggerStub.withArgs(firstMessage).returns("black");
        loggerStub.withArgs(secondMessage).returns("white");

        // When Then
        logger.log(firstMessage).should.eq("black");
        logger.log(secondMessage).should.eq("white");
      });

      afterEach(() => {
        loggerStub.restore();
      });
    });
    describe('should throw an error', () => {
      let logger;
      let loggerStub;
      beforeEach(() => {
        logger = new Logger();
        loggerStub = sinon.stub(logger, "log").throws("Error", "empty message cannot be logged");
      });
      it('when using throws()', () => {
        // Given
        const emptyMessage = undefined;
        // When Then
        expect(logger.log.bind(emptyMessage)).to.throw("empty message cannot be logged");
      });
      afterEach(() => {
        loggerStub.restore();
      });
    });
  });


  describe('full stub', () => {
    const expected = 'Hello, world !';
    const myGreeter = {greet: sinon.stub().withArgs('world').returns(expected)};
    it('should ', () => {
      const name = 'world';
      const actual = myGreeter.greet(name);
      expect(actual).to.eq(expected);
    });

  });


});
describe('mock', () => {
  describe('mock a function of a object', () => {
    it('should check one assertion', () => {
      const logger = new Logger();
      const loggerMock = sinon.mock(logger);
      loggerMock.expects("log").once;
      // When
      logger.log("message");
      // Then
      loggerMock.verify();
      // Expected messageCount([...]) once (never called)
    });
    it('should check several assertions (test smell ?)', () => {
      const logger = new Logger();
      const loggerMock = sinon.mock(logger);
      loggerMock.expects("log").atLeast(1);
      loggerMock.expects("messageCount").once;
      // When
      logger.log("message");
      logger.messageCount();
      // Then
      loggerMock.verify();
      // Expected messageCount([...]) once (never called)
    });
  });

});
