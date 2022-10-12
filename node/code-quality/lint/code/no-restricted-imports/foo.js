// eslint-disable-next-line no-restricted-imports
import { foo } from './limited-imports/to-be-restricted-on-import';

import { bar } from './limited-imports/not-to-be-restricted-on-import';

// eslint-disable-next-line no-restricted-imports
import { fs } from 'fs';

foo();
bar();

fs.existsSync('../.eslintrc.yaml');
