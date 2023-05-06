import lodash from 'lodash';

const {
   partial,
   mapValues
} = lodash;

import * as aDependency from './dependencies/a-dependency.js';
import * as anotherDependency from './dependencies/another-dependency.js';

const dependencies = {
   aDependency,
   anotherDependency
};

import { aComponent } from './components/a-component.js';
import { anotherComponent } from './components/another-component.js';

const components = {
   aComponent,
   anotherComponent
};

const injectDefaults = (defaults, targetFn) => {
   return (args) => targetFn(Object.assign(Object.create(defaults), args));
};

function injectDependencies (components) {
   return mapValues(components, partial(injectDefaults, dependencies));
}

const componentsWithInjectedDependencies = injectDependencies(components);

export { componentsWithInjectedDependencies };
