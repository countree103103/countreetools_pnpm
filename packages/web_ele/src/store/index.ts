import { createStore } from "vuex";

const store = createStore({
  state: {
    globalStatus: "测试状态",
    clientArr: window.clientArr,
    cmdResult: window.cmdResult,
    selectedClientId: null,
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

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
});
