const { defineConfig } = require("@vue/cli-service");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const {
  ElementPlusResolver,
  NaiveUiResolver,
  VantResolver,
} = require("unplugin-vue-components/resolvers");
const Icons = require("unplugin-icons/webpack");
const IconsResolver = require("unplugin-icons/resolver");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [
          IconsResolver({
            prefix: "Icon",
            enabledCollections: ["ep", "fa6-regular", "ic"],
          }),
          ElementPlusResolver(),
          NaiveUiResolver(),
          VantResolver(),
        ],
      }),
      Icons({
        compiler: "vue3",
      }),
    ],
  },
});
