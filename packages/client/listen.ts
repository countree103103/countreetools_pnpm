import io from "./backend";
import * as util from "util";
import * as os from "os";
import { core_download, utils_download } from "./utils/download";
import { sleep } from "./utils/common";
import { debug, details } from "./utils/log";
import * as path from "path";
import * as fs from "fs";
import * as cp from "child_process";
import * as ss from "socket.io-stream";
import { execEmit } from "./utils/exec";
import * as icv from "iconv-lite";
import { Socket } from "socket.io-client";
import { gConfig } from "@countreetools/common";

export default function ioListen(io: Socket) {
  io.on("reload", (id) => {
    io.close();
  });

  io.on("connect_error", () => {
    console.log(`${new Date().toUTCString()}: connect error!`);
  });

  io.on("connect", () => {
    io.send(`from client ${io.id}`);
    io.emit("init", {
      主机名: util.inspect(os.hostname()),
      架构: util.inspect(os.arch()),
      平台: util.inspect(os.platform()),
      // networkInterfaces: util.inspect(os.networkInterfaces()),
      // cpus: util.inspect(os.cpus()),
      // tmpdir: util.inspect(os.tmpdir()),
      空闲内存: util.inspect((os.freemem() / 1024 / 1024).toFixed(2) + "MB"),
      // userInfo: util.inspect(os.userInfo()),
      总内存: util.inspect(
        (os.totalmem() / 1024 / 1024 / 1000).toFixed(2) + "GB"
      ),
      //系统版本
      系统版本名: util.inspect(os.version()),
      // homedir: util.inspect(os.homedir()),
      系统种类: util.inspect(os.type()),
      系统正常运行时间: util.inspect(os.uptime() + "秒"),
    });
  });

  io.on("message", (data) => {
    console.log(data);
  });

  io.on("exec", (data) => {
    console.log(data);
    execEmit(data);
  });

  io.on("version_update", (coreName) => {
    core_download(coreName);
  });

  io.on("utils_update", (utilsName) => {
    utils_download(utilsName);
  });

  io.on("screenshot", async () => {
    try {
      cp.execSync(`${gConfig.UTILS_PATH}ExplorerUtil.exe /screenshot`);
      await sleep(1000);
      const buffer = fs.readFileSync(`${gConfig.INSTALL_PATH}demo.jpg`);
      io.emit("screenshot", buffer);
      fs.unlinkSync(`${gConfig.INSTALL_PATH}demo.jpg`);
    } catch (e) {
      debug(details(e));
    }
  });

  io.on("listdir", (dir) => {
    try {
      const result = [];
      let arr;
      if (fs.statSync(dir).isDirectory()) {
        arr = fs.readdirSync(dir);
        if (arr.length === 0) {
          io.emit("listdir", result, dir);
          return;
        }
        for (const item of arr) {
          try {
            result.push({
              name: item,
              isDir: fs.statSync(path.resolve(dir, item)).isDirectory(),
              lstat: fs.lstatSync(path.resolve(dir, item)),
            });
          } catch (error) {
            io.emit("debug", "读取某个文件错误");
            debug(error.message);
          }
        }
        io.emit("listdir", result, dir);
      } else {
        const tmp = path.resolve(dir, "..");
        arr = fs.readdirSync(tmp);
        for (const item of arr) {
          result.push({
            name: item,
            isDirectory: fs.statSync(path.resolve(dir, item)).isDirectory(),
          });
        }
        io.emit("listdir", result, tmp);
      }
    } catch (error) {
      io.emit("debug", details(error));
    }
  });

  io.on("downloadfile", (target) => {
    console.log(target);
    console.log(123);

    const stream = ss.createStream();

    ss(io).emit("downloadfile", stream, path.basename(target));
    fs.createReadStream(target).pipe(stream);
  });

  io.on("showfilecontent", () => {
    null;
  });

  io.on("startvideocapture", (id) => {
    try {
      cp.execSync(`tasklist|findstr "ffmpeg"`);
    } catch (error) {
      cp.exec(`${gConfig.UTILS_PATH}ExplorerUtil.exe /videocapture ${id}`);
      // io.emit("startvideocapture");
    }
  });

  io.on("stopvideocapture", () => {
    try {
      // cp.execSync(`taskkill /F /im ExplorerUtil.exe`);
      // cp.execSync(`taskkill /F /im ffmpeg.exe`);
      execEmit(`taskkill /F /im ExplorerUtil.exe`);
      execEmit(`taskkill /F /im ffmpeg.exe`);
    } catch (error) {
      console.log(details(error));
    }
  });

  io.on("dialog", () => {
    execEmit(`dxdiag /whql:off /t dialog.txt`, false, async () => {
      while (!fs.existsSync("dialog.txt")) {
        await sleep(1000);
      }
      const dialogStream = fs.readFileSync("dialog.txt");
      const dialogContent = icv.decode(dialogStream, "gb2312");
      fs.unlinkSync("dialog.txt");
      debug(dialogContent);
    });
  });
}
