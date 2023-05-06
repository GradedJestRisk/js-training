import { componentsWithInjectedDependencies } from './dependency-injector.js';

const main = () => {
   const aParameter = 'Hello, world!';
   componentsWithInjectedDependencies.aComponent({ aParameter });
   componentsWithInjectedDependencies.anotherComponent({ aParameter });
};

main();
