const dependency = () => {
    return 'foo';
};

const wrappedDependency = {
    dependency
};

export { dependency, wrappedDependency };
