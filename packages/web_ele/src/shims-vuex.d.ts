import { Store } from "vuex";
import { State as myState } from "./store/index";

declare module "@vue/runtime-core" {
  // 为 `this.$store` 提供类型声明
  interface ComponentCustomProperties {
    $store: Store<myState>;
  }
}
