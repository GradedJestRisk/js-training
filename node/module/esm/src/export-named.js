const bar = 'bar';
const baz = 2;

const asynchronous = async function() {
    setTimeout(() => {
        console.log('executed on import');
    }, 1000);
};

await asynchronous();

export {
    bar,
    baz
};

