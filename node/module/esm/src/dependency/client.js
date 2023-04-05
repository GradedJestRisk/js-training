import { wrappedDependency } from './dependency.js';

const callWrappedTransitive = () => {
    return wrappedDependency.dependency();
};

const callTransitive = () => {
    return wrappedDependency.dependency();
};
export { callWrappedTransitive, callTransitive };
