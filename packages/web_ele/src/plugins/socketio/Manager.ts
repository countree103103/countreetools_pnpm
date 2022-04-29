import { io, Socket } from "socket.io-client";
import gConfig from "@countreetools/common/dist/my_config";
import { Store } from "vuex";
import { State, useStore } from "../../store/index";
import { injectable } from "inversify";

function timeout(millsec: number): Promise<null> {
  return new Promise<null>((_rs, rj) => {
    setTimeout(() => {
      rj();
    }, millsec);
  });
}

@injectable()
class SocketioManager {
  private _socket: Socket;
  private _store: Store<State>;

  public constructor() {
    this._socket = io(`${gConfig.SERVER_ADDRESS}:${gConfig.SERVER_PORT}/admin`);
    this._store = useStore();
    this.init();
    setInterval(() => {
      this._socket.emit("apigetallclients");
    }, 1000);
  }

  private init() {
    this._socket.on("connect", () => {
      this._socket.send({ admin: true });
      this._store.state.serverStatus = "已连接";
    });

    this._socket.on("disconnect", () => {
      this._store.state.serverStatus = "已断开";
      this._store.state.clientArr = [];
    });

    this._socket.on("apigetallclients", (carr) => {
      this._store.state.clientArr = carr;
      this._store.state.serverStatus = "已连接";
    });
  }

  public async getScreenshot(): Promise<ArrayBuffer | null> {
    const promise = new Promise<ArrayBuffer>((rs, _rj) => {
      this._socket.once("apiscreenshot", (imgBuffer: ArrayBuffer) => {
        rs(imgBuffer);
      });
      this._socket.emit("apiscreenshot");
    });

    return Promise.race([promise, timeout(10000)]);
  }
}

export { SocketioManager, SocketioManager as default };
