const expectedReturnValue = 'foo'
const oneSecond = 1 * 1000
const delay = oneSecond

const aNonBlockingFunction = function (resolve, reject) {
   const resolveAString = () => resolve(expectedReturnValue)
   setTimeout(resolveAString, delay)
}

const aFailingNonBlockingFunction = function (resolve, reject) {
   const rejectAString = () => reject(expectedReturnValue)
   setTimeout(rejectAString, delay)
}

describe('promise', () => {

   describe('Promise', () => {

      it('Promise is a class', () => {

         const myOutputValue = 'A value'

         const twoSecond = 2 * 1000

         const handlePromise = function (resolve, reject) {
            setTimeout(function () {
               resolve(myOutputValue)
            }, twoSecond)
         }

         const promise = new Promise(handlePromise)

         expect(promise instanceof Promise).toBe(true)

      })

      describe('its *then*', () => {

         it('on success, call its first argument (resolve) with the resolved value', () => {

            const promise = new Promise(aNonBlockingFunction)

            const resolve = returnValue => expect(returnValue).toBe(expectedReturnValue)
            const reject = undefined

            expect.assertions(1)
            return promise.then(resolve, reject)

         })

         it('on failure, call its second argument (reject) with the rejected value', () => {

            const promise = new Promise(aFailingNonBlockingFunction)

            const resolve = undefined
            const reject = returnValue => expect(returnValue).toBe(expectedReturnValue)

            expect.assertions(1)
            return promise.then(
               resolve,
               reject
            )

         })

      })

      describe('its *catch* method', () => {

         it('on failure, call its single argument (reason) with the failure return value', () => {

            const promise = new Promise(aFailingNonBlockingFunction)
            const reject = returnValue => expect(returnValue).toBe(expectedReturnValue)

            expect.assertions(1)
            return promise.catch(
               reject
            )

         })

         it('on success, does not call its single argument (reason)', () => {

            const promise = new Promise(aNonBlockingFunction)
            const reject = returnValue => expect(returnValue).toBe(expectedReturnValue)

            expect.assertions(0)
            return promise.catch(
               reject
            )

         })

      })

      // what about an error throwned in reject ?

      it('its all method wait for an array of promises to be resolved', async () => {

         // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

         const promise1 = Promise.resolve(3);
         // same as
         // const promise1 = new Promise((resolve)=>resolve(3));

         const promise2 = 42;
         const promise3 = new Promise((resolve) => {
            setTimeout(resolve, 100, 'foo');
         });

         await Promise.all([promise1, promise2, promise3]).then((values) => {
            expect(values).toEqual([3,42,'foo']);
         });

         //
         // let i = 'bar';
         // const handlePromise = function (secondsToWait) {
         //    return new Promise( (resolve) => {
         //       setTimeout(()=>{
         //             // i = 'foo';
         //             // console.log(`${secondsToWait} seconds have been waited for`);
         //          resolve;
         //       }, secondsToWait * 1000);
         //    });
         // };
         //
         // await Promise.all[handlePromise(2), handlePromise(1)];
         // expect(i).toEqual('foo')

      })

   })

   describe('async/await', () => {

      describe('await', () => {

         // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#Description

         it('on success, return the resolved value', async () => {

            const aPromise = () => new Promise(aNonBlockingFunction)

            const value = await aPromise()
            expect(value).toEqual(expectedReturnValue)

         })

         it('on success, return the resolved value', async () => {

            const foo = async(argument)=>{
               return `foo ${argument}`;
            };

            const value = await foo('bar')
            expect(value).toEqual('foo bar')

         })

         it('on failure, throws the resolved value', async () => {

            const aPromise = () => new Promise(aFailingNonBlockingFunction)

            let value
            try {
               value = await aPromise()
            } catch (error) {
               expect(error).toEqual(expectedReturnValue)
            }

         })

      })

   })

})
