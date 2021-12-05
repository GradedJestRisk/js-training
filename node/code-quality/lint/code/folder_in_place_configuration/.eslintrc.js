module.exports = {
  rules: {
    quotes: ["error", "double"],
    "no-restricted-modules": ["error", { paths: ["fs", "../src/limited-imports/to-be-restricted-on-import"] }]
  }
}
