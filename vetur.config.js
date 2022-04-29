module.exports = {
  // **optional** default: `{}`
  // override vscode settings
  // Notice: It only affects the settings used by Vetur.
  settings: {
    // "vetur.useWorkspaceDependencies": true,
    // "vetur.experimental.templateInterpolationService": true,
    "vetur.validation.template": false,
  },
  // **optional** default: `[{ root: './' }]`
  // support monorepos
  projects: [
    {
      root: "./packages/web_ele",
      package: "./package.json",
      tsconfig: "./tsconfig.json",
    },
  ],
};
