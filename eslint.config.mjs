import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "lib/*",
      "node_modules/*",
      "example/*",
      "setupTests.js",
      "babel.config.js",
      "jest.config.js",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-var": "off",
    },
  },
];
