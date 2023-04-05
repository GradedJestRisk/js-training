const bar = () => {
    return 'foobar';
};

// work
// export default {
//     foo
// };

// does work
// export {
//     foo
// };

// does work
// export default {
//     foo: bar
// };

// does not work
// export {
//     foo: bar
// };

// does work
export {
    bar as foo
};

// does not work
// export {
//     bar() as foo
// };



