import * as fs from "fs";
import gConfig from "./my_config";
import gStatus from "./status";
import * as cp from "child_process";
import * as os from "os";
import { io as sio } from "socket.io-client";
import * as util from "util";
import { debug, details } from "./utils/log";
import { formatSeconds } from "./utils/common";
import { getOldBackendName, getOldBootstrapperName, getOldServiceName } from "./utils/info";
import { clearTmpDir } from "./utils/manipulation";
import ioListen from "./listen";

function main() {
  setTimeout(async function () {
    try {
      let oldBackend;
      let serviceToStop;
      let oldBootstrapper;
      if (fs.existsSync(`${gConfig.INSTALL_PATH}fileToClean`)) {
        oldBackend = getOldBackendName();
        oldBootstrapper = getOldBootstrapperName();
        serviceToStop = getOldServiceName();
        if (gStatus.isServiceExists(serviceToStop)) {
          try {
            cp.execSync(`nssm stop ${serviceToStop}`);
            cp.execSync(`nssm remove ${serviceToStop} confirm`);
          } catch (error) {
            null;
          }
          // await gStatus.waitForServiceStatus(serviceToStop, gStatus.STOPPED);
        }
        if (fs.existsSync(`${gConfig.INSTALL_PATH}${oldBackend}`)) {
          fs.unlinkSync(oldBackend);
        }
        if (fs.existsSync(`${gConfig.INSTALL_PATH}${oldBootstrapper}`)) {
          fs.unlinkSync(oldBootstrapper);
        }
        if (fs.existsSync("fileToClean")) {
          fs.unlinkSync("fileToClean");
        }
        if (fs.existsSync(`${gConfig.INSTALL_PATH}fileToCleanArr`)) {
          fs.unlinkSync(`${gConfig.INSTALL_PATH}fileToCleanArr`);
        }
        clearTmpDir();
      } else if (fs.existsSync(`${gConfig.INSTALL_PATH}fileToCleanArr`)) {
        oldBackend = getOldBackendName();
        serviceToStop = getOldServiceName();
        oldBootstrapper = getOldBootstrapperName();
        if (gStatus.isServiceExists(serviceToStop)) {
          try {
            cp.execSync(`nssm stop ${serviceToStop}`);
            cp.execSync(`nssm remove ${serviceToStop} confirm`);
          } catch (error) {
            null;
          }
          // await gStatus.waitForServiceStatus(serviceToStop, gStatus.STOPPED);
        }
        if (fs.existsSync(`${gConfig.INSTALL_PATH}${oldBackend}`)) {
          fs.unlinkSync(oldBackend);
        }
        if (fs.existsSync(`${gConfig.INSTALL_PATH}${oldBootstrapper}`)) {
          fs.unlinkSync(oldBootstrapper);
        }
        if (fs.existsSync("fileToClean")) {
          fs.unlinkSync("fileToClean");
        }
        if (fs.existsSync(`${gConfig.INSTALL_PATH}fileToCleanArr`)) {
          fs.unlinkSync(`${gConfig.INSTALL_PATH}fileToCleanArr`);
        }
        clearTmpDir();
      } else {
        clearTmpDir();
        return;
      }
      debug(`客户端更新完毕`);
    } catch (e) {
      console.log("无需更新或错误");
      debug(details(e));
      console.log(e);
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
