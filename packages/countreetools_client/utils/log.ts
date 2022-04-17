import io from "../backend";
import * as fs from "fs";
import * as util from "util";
import { gConfig } from "@countreetools/countreetools_common";

export function debug(msg) {
  io.emit("debug", msg);
  console.log(msg);
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