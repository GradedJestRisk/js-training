const bar = 'bar';

const asynchronous = async function() {
    setTimeout(() => {
        console.log('executed on import');
    }, 1000);
};

await asynchronous();

const baz = 2;
export {
    bar,
    baz
};

