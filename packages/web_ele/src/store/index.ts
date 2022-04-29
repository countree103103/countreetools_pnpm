import { createStore, useStore as baseUseStore, Store } from "vuex";
import { InjectionKey } from "vue";

export const store = createStore({
  state: {
    serverStatus: "未连接",
    globalStatus: "测试状态",
    clientArr: window.clientArr,
    cmdResult: window.cmdResult,
    selectedClientId: "",
    clients: {
      verify: {
        show: false,
        // show: true,
      },
    },
    contextMenu: {
      // id: "",
      show: false,
      mousePos: {
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
      },
    },
  },
  getters: {
    status(state) {
      return state.globalStatus;
    },
    getSelectedClientId(state) {
      return state.selectedClientId;
    },
    getClientArr(state) {
      return state.clientArr;
    },
    getCmdResult(state) {
      return state.cmdResult.data;
    },
  },
  mutations: {
    clearResult(state) {
      state.cmdResult.data = "";
    },
    setGlobalStatus(state, status) {
      state.globalStatus = status;
    },
  },
  actions: {},
  modules: {},
});

export type State = typeof store.state;

export const key: InjectionKey<Store<State>> = Symbol();

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key);
}
