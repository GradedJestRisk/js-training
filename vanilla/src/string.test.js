describe('string', () => {

  test('empty string is not undefined', () => {
    const emptyString = '';
    let undefinedString = undefined;
    expect(emptyString).not.toStrictEqual(undefinedString);
  });

  test('type coercion convert undefined to string', () => {
    let string;
    string += 'a';
    expect(string).toStrictEqual('undefined' + 'a');
  });

  test('parsing labels', () => {

    const SPACING_CHARACTER = ' ';
    const messages = {
      prop1: {
        message: 'message-1',
      },
      prop2: {
        message: 'message-2'
      },
      default: {
        message: 'message-default'
      }
    };

    let message = '';
    const props = ['prop1', 'prop2'];

    const object = {prop1: "data1", prop2: "data2"};

    // ---------------------------------
    props.forEach((prop) => {
      if (object[prop]) {
        message = message.concat(messages[prop].message, SPACING_CHARACTER);
      }
    });

    if (!message) {
      return (messages['default'].message);
    }

    message = message.trim();

    expect(message).toStrictEqual('message-1 message-2');

  });
});