import * as icv from "iconv-lite";
import * as cp from "child_process";
import { debug, details } from "./log";
import io from "../backend";

export function cmdDecode(data) {
  return icv.decode(data, "gbk");
}

export function execEmit(
  data,
  emitCmdResult = true,
  callback = () => {
    null;
  }
) {
  let result;
  cp.exec(data, {encoding: "buffer"}, (error, stdout, stderr) => {
    console.log(stdout);
    try {
      if (error) throw error;
      callback();
      result = cmdDecode(stdout);
    } catch (error) {
      debug(`Exec error occured!\n`);
      debug(details(error));
      debug(cmdDecode(stderr));
      result = cmdDecode(stderr);
    }
    if (emitCmdResult) {
      io.emit("cmdresult", result);
    }
  });
}