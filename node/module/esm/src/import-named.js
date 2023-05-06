import { bar, baz } from './export-named.js';
import * as namespacedImport from './export-named.js';

console.log(bar, baz);
console.log(namespacedImport.bar, namespacedImport.baz);

