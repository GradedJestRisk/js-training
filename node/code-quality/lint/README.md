# Title
This is a file to test markdown linting.

```js
// This gets linted - indent to check an error is raised
var answer = 6 * 7
console.log(answer)
```

Some text

```js
// This also gets linted

/* eslint quotes: [2, "double"] */

function hello () {
  console.log("Hello, world!")
}
hello()
```

##Subtitle
