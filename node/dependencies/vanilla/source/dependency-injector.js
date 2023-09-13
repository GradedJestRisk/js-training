import lodash from 'lodash';

const {
   partial,
   mapValues
} = lodash;

import { dependencies } from './dependencies/dependencies.js';
import { components } from './components/components.js';

const injectDefaults = (defaults, targetFn) => {
   return (args) => targetFn(Object.assign(Object.create(defaults), args));
};

function injectDependencies (components) {
   const aFunction = partial(injectDefaults, dependencies);
   return mapValues(components, aFunction);
}

const componentsWithInjectedDependencies = injectDependencies(components);

export { componentsWithInjectedDependencies };
