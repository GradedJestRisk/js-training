# Title

Suppress previous empty line to get

```shell
README.md:1 MD022/blanks-around-headings/blanks-around-headers
Headings should be surrounded by blank lines
[Expected: 1; Actual: 0; Below] [Context: "# Title"]
```

This is a file to test markdown linting.

```js
// This gets linted - indent to check an error is raised
const answer = 6 * 7;
console.log(answer);
```

Some text

```js
// This also gets linted

/* eslint quotes: [2, "double"] */

function hello() {
  console.log("Hello, world!");
}
hello();
```

## Subtitle
