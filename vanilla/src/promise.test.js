describe('promise', () => {

  it('Promise is a class', () => {

    const myOutputValue = "A value";

    const twoSecond = 2 * 1000;

    const handlePromise = function (resolve, reject) {
      setTimeout(function () {
        resolve(myOutputValue);
      }, twoSecond);
    };

    const promise = new Promise(handlePromise);

    expect(promise instanceof Promise).toBe(true);

  });

  describe('its *then* method handle the promise return value', () => {

    it('success', () => {

      const expectedReturnValue = "A value";

      const oneSecond = 1 * 1000;

      const myAsynchronousFunction = function (resolve, reject) {
        setTimeout(function () {
          resolve(expectedReturnValue);
        }, oneSecond);
      };

      const promise = new Promise(myAsynchronousFunction);

      expect.assertions(1);
      return promise.then(
          returnValue => expect(returnValue).toBe(expectedReturnValue),
          undefined);

    });

    it('failure', () => {

      const expectedReturnValue = "A value";

      const oneSecond = 1 * 1000;

      const myAsynchronousFunction = function (resolve, reject) {
        setTimeout(function () {
          reject(expectedReturnValue);
        }, oneSecond);
      };

      const promise = new Promise(myAsynchronousFunction);

      expect.assertions(1);
      return promise.then(
          undefined,
          returnValue => expect(returnValue).toBe(expectedReturnValue)
      );

    });

  });

});