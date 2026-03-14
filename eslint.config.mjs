import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "lib/",
      "coverage/",
      "node_modules/",
      "example/",
      "setupTests.js",
      "babel.config.js",
      "jest.config.js",
    ],
  },
  { files: ["**/*.{ts,tsx}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-var": "off",
    },
  },
];
