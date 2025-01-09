/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: "always",
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: "auto",
  jsxSingleQuote: true,
  printWidth: 100,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  plugins: ["prettier-plugin-sort-json", "prettier-plugin-organize-imports"],
  jsonRecursiveSort: true,
  jsonSortOrder: '{"*": "lexical"}',
};
