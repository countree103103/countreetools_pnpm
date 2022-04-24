/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ["dist/", "node_modules/"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off",
    "no-unused-labels": "off",
    "no-undef": "off",
    "no-v-for-template-key-on-child": "off",
    endOfLine: "off",
    semi: [2, "always"],
    "no-trailing-spaces": ["error", { skipBlankLines: false }],
    "comma-spacing": ["error", { before: false, after: true }],
    "prettier/prettier": ["warn", { endOfLine: "auto" }],
  },
  // overrides: [
  //   {
  //     files:["packages/web/**/*"],

  //     env: {
  //       node: true,
  //     },

  //     extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],

  //     parserOptions: {
  //       parser: 'babel-eslint',
  //     },

  //     rules: {
  //       'no-console': 'off',
  //       'no-debugger': 'off',
  //       //
  //       "no-unused-vars": "off",
  //       "no-unused-labels": "off",
  //       "no-v-for-template-key-on-child": "off",
  //       "endOfLine": "off"
  //     },
  //   },
  // ]
};
