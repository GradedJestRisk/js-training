const bar = 'bar';
const baz = 2;
const object = {
    name: 'mary',
    age: 80
};
const string = 'mary';

const asynchronous = async function() {
    setTimeout(() => {
        console.log('executed on import');
    }, 1000);
};

await asynchronous();

export {
    bar,
    baz,
    object,
    string
};

