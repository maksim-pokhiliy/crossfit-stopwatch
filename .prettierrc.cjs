/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  jsxSingleQuote: false,
  printWidth: 100,
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  plugins: ['prettier-plugin-sort-json'],
  jsonRecursiveSort: true,
  jsonSortOrder: '{"*": "lexical"}',
};
