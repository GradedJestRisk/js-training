module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    "standard"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module"
  },
  rules: {
    quotes: ["error", "double"],
    "no-restricted-modules": ["error", { paths: ["fs", "../src/limited-imports/to-be-restricted-on-import"] }]
  }
}
