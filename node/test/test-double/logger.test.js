const chai = require('chai');
const sinon = require('sinon');
const Logger = require('./logger');

const sinonChai = require('sinon-chai');
chai.use(sinonChai);

chai.should();
let expect = chai.expect;

describe('spy logs calls', () => {

   describe('on a wrapped actual object', () => {
      // https://sinonjs.org/releases/latest/spies/
      describe('one call, one argument', () => {
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

         it('getCall contains all calls arguments', () => {
            loggerSpy.getCall(0).args[0].should.be.equal(message);
         });

         it('firstCall contains the first call arguments', () => {
            loggerSpy.firstCall.args[0].should.be.equal(message);
         });

         it('callCount contains the number of invocation', () => {
            loggerSpy.callCount.should.be.equal(1);
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
                  loggerSpy.callCount.should.be.equal(2);
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
      describe('several call, several arguments', () => {
         let logger;
         let loggerSpy;
         messages = [
            {text: 'message 1', level: 'info'},
            {text: 'message 2', level: 'fatal'},
         ]

         beforeEach(() => {
            logger = new Logger();
            loggerSpy = sinon.spy(logger, 'log');
            messages.map((message) => {
               logger.log(message.text, message.level);
            })

         });

         afterEach(() => {
            loggerSpy.restore();
         })

         it('getCall(N) contains the N-th call arguments', () => {
            loggerSpy.getCall(0).args.should.be.deep.equal([messages[0].text, messages[0].level]);
         });

         it('firstCall.args contains the first call arguments', () => {
            loggerSpy.firstCall.args.should.be.deep.equal([messages[0].text, messages[0].level]);
         });

         it('callCount contains the number of invocation', () => {
            loggerSpy.callCount.should.be.equal(2);
         });

         it('calledTwice return true if called 2 times', () => {
            sinon.assert.calledTwice(loggerSpy);
         });

      });
   });

   describe('on a fake object', () => {
      // TODO
   });
});

describe('stub log calls and return values', () => {

   //https://sinonjs.org/releases/latest/stubs/

   describe('on a function of the object', () => {
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
            logger.messageCount().should.equal(messageCount);
            //expect(loggerStub.log).calledWith("First message").to.equalual(true);
            //expect(loggerStub.log).to.have.been.calledWith("First message");
            logger.log("Second message");
            // Then
            logger.messageCount().should.equal(messageCount);
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
            logger.messageCount().should.equal(firstMessageCount);
            // When
            logger.log("Second message");
            // Then
            logger.messageCount().should.equal(secondMessageCount);
         });

         it('using withArgs(), return different values based on argument', () => {
            // Given
            const firstMessage = "First message";
            const secondMessage = "Second message";

            const loggerStub = sinon.stub(logger, "log");
            loggerStub.withArgs(firstMessage).returns("black");
            loggerStub.withArgs(secondMessage).returns("white");

            // When Then
            logger.log(firstMessage).should.equal("black");
            logger.log(secondMessage).should.equal("white");
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

   describe('on the object itself', () => {

      const expected = 'Hello, world !';
      const myStub = sinon.stub().withArgs('world').returns(expected);
      const myGreeter = {greet: myStub};
      const name = 'world';
      let actual;

      it('should return the expected value', () => {
         const name = 'world';
         actual = myGreeter.greet(name);
         expect(actual).to.equal(expected);
         expect(myStub.getCall(0).args[0]).to.equal(name);
      });

      describe('assertions (sinon-chai)', ()=>{
         // https://www.chaijs.com/plugins/sinon-chai/
         it('calledWith', () => {
            const name = 'world';
            myGreeter.greet(name);
            expect(myStub).to.have.been.calledWith(name);
         });
         it('calledWithExactly', () => {
            const name = { name: 'world' };
            myGreeter.greet(name);
            expect(myStub).to.have.been.calledWithExactly(name);
         });
         it('alwaysCalledWith', () => {
            myGreeter.greet('world');
            myGreeter.greet('world');
            sinon.assert.alwaysCalledWith(myStub, 'world');
         });
      })



      it('should spy call', () => {
         expect(myStub.getCall(0).args[0]).to.equal(name);
      });


   });

});

describe('mock log call, return values, check assertions', () => {
   // https://sinonjs.org/releases/latest/mocks/
   describe('on a function of a object', () => {

      it('should return value', () => {
         // can't find syntax in docs
      });

      it('should log call and check one assertion', () => {

         const logger = new Logger();
         const loggerMock = sinon.mock(logger);

         // Then
         loggerMock.expects("log").once;

         // When
         logger.log("message");

         // Then
         loggerMock.verify();
         //  Same as
         //  loggerSpy.callCount.should.be.equal(1);

      });

      it('should log call and check several assertions (test smell ?)', () => {
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

   describe('on a object', () => {

      it('should return value', () => {

         // given
         const expectedResponse ='foo';
         const loggerMock = sinon.mock();
         loggerMock.returns(expectedResponse)
         const logger = { log: loggerMock}

         // when
         const response = logger.log('message');

         // Then
         response.should.equal(expectedResponse);
      });

   });

});
