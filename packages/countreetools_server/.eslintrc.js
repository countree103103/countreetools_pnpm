module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
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
    "semi": [2, "always"],
    "no-trailing-spaces": ["error", { "skipBlankLines": false }]
  },
};
