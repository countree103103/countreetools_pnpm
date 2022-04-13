import * as cp from "child_process";
import { getOldBackendName, getOldBootstrapperName, getOldServiceName } from "./info";
import { debug } from "./log";
import gConfig from "../my_config";
import * as fs from "fs";

export function installNewService(bootstrapperName, backendName) {
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

export function createFileToClean(filePathArr) {
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

export function runFileToClean() {
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

export function clearTmpDir() {
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