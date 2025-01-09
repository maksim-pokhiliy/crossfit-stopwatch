const js = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierConfig = require("eslint-config-prettier");
const importPlugin = require("eslint-plugin-import");
const jsxA11yPlugin = require("eslint-plugin-jsx-a11y");
const noRelativeImportPathsPlugin = require("eslint-plugin-no-relative-import-paths");
const prettierPlugin = require("eslint-plugin-prettier");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactRefreshPlugin = require("eslint-plugin-react-refresh");
const globals = require("globals");

const config = [
  {
    ignores: ["node_modules/**", "dist/**", ".eslint-cache"],
  },
  {
    files: ["*.cjs", ".*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        module: true,
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        React: "readonly",
        JSX: "readonly",
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: true,
        projectService: true,
        allowDefaultProject: true,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {},
        node: {
          extensions: [".ts", ".tsx"],
        },
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
      "jsx-a11y": jsxA11yPlugin,
      import: importPlugin,
      "no-relative-import-paths": noRelativeImportPathsPlugin,
      prettier: prettierPlugin,
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      ...tsPlugin.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],
      "no-console": ["warn", { allow: ["error"] }],
      "react/display-name": ["error", { ignoreTranspilerName: false, checkContextObjects: true }],
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
      "import/no-anonymous-default-export": "warn",
      "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
      "max-lines": ["warn", { max: 750, skipComments: true, skipBlankLines: true }],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: ["return"] },
        { blankLine: "always", prev: ["multiline-block-like"], next: "*" },
        { blankLine: "always", prev: "*", next: ["multiline-block-like"] },
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        { blankLine: "always", prev: "*", next: ["const", "let", "var"] },
        { blankLine: "any", prev: ["const", "let", "var"], next: ["const", "let", "var"] },
        {
          blankLine: "always",
          prev: "*",
          next: ["multiline-const", "multiline-let", "multiline-var"],
        },
        {
          blankLine: "always",
          prev: ["multiline-const", "multiline-let", "multiline-var"],
          next: "*",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@mui/material",
              importNames: ["Grid", "Hidden"],
              message: "Shouldn't use deprecated components",
            },
            {
              name: "@mui/icons-material",
              message: "Import icons directly, named import is buggy in mui icons",
            },
          ],
        },
      ],
      "no-relative-import-paths/no-relative-import-paths": [
        "error",
        {
          allowSameFolder: true,
          rootDir: "src",
          prefix: "@app",
          allowedDepth: 1,
        },
      ],
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: "last",
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      curly: ["error", "all"],
      "@typescript-eslint/no-explicit-any": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];

module.exports = config;
