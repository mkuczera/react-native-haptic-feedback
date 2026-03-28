import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: [
      "lib/",
      "coverage/",
      "node_modules/",
      "example/",
      "docs/.vitepress/",
      "setupTests.js",
      "babel.config.js",
      "jest.config.js",
    ],
  },
  { files: ["**/*.{ts,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettier,
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-var": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
