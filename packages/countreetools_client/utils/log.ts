import io from "../backend";
import gConfig from "../my_config";
import * as fs from "fs";
import * as util from "util";

export function debug(msg) {
  io.emit("debug", msg);
}

export function localDebug(msg) {
  const logFile = `${gConfig.INSTALL_PATH}debug.txt`;
  fs.writeFileSync(logFile, `${new Date().toLocaleString()} - \n${msg}\n`, {
    flag: "w",
  });
}

export function details(error) {
  return util.inspect(error, false, null, true);
}