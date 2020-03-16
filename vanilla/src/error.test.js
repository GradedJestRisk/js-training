describe('throw', () => {

  test('should throw', () => {

    const myThrowingFunction = function(){
      throw new Error("Message");
    };

    expect( () => {myThrowingFunction()}).toThrow(Error("Message"));

  });


});