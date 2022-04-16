import gConfig from "./my_config";
import * as os from "os";
import { io as sio } from "socket.io-client";
import * as util from "util";
import { debug, details } from "./utils/log";
import { formatSeconds } from "./utils/common";
import { clearTmpDir } from "./utils/manipulation";
import ioListen from "./listen";

function main() {
  setTimeout(async function () {
    try {
      clearTmpDir();
      return;
    } catch (e) {
      debug("发生了一些错误");
      debug(details(e));
    }
  }, 500);
  setInterval(() => {
    io.emit("updateinfo", {
      系统正常运行时间: util.inspect(formatSeconds(os.uptime())),
      空闲内存: util.inspect((os.freemem() / 1024 / 1024).toFixed(2) + "MB"),
    });
  }, 5000);
}

const io = sio(`${gConfig.SERVER_ADDRESS}:${gConfig.SERVER_PORT}`);
ioListen(io);
main();

export default io;
