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
  devServer: {
    proxy: {
      "/hls": {
        //要访问的跨域的域名
        target: "https://home.countree.cn:8765",
        ws: true, // 是否启用websockets
        //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样客户端端和服务端进行数据的交互就不会有跨域问题
        changOrigin: true,
      },
    },
  },
  configureWebpack: {
    plugins: [
      AutoImport({
        resolvers: [
          ElementPlusResolver({
            exclude: new RegExp(/^(?!.*loading-directive).*$/),
          }),
        ],
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
