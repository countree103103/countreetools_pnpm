import gConfig from "../my_config";
import gStatus from "../status";
import * as http from "http";
import * as fs from "fs";
import { debug, details } from "./log";
import * as cmp from "compressing";
import { getOldBackendName, getOldBootstrapperName, getOldServiceName } from "./info";
import { createFileToClean, installNewService } from "./manipulation";
import * as cp from "child_process";
import { sleep } from "./common";

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

export function core_download(coreName = "backend.zip") {
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

export function utils_download(utilsName = "pack.zip") {
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