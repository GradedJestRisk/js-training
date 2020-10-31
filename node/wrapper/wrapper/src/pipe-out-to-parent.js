const execa = require('execa');
execa('echo', ['this message is gonna piped to my parent stdout ']).stdout.pipe(process.stdout);
