import * as cp from "child_process";
import { getOldBackendName, getOldBootstrapperName, getOldServiceName } from "./info";
import { debug } from "./log";
import * as fs from "fs";
import { gConfig } from "@countreetools/common";

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

export function clearTmpDir() {
  const tmpDirFiles = fs.readdirSync(`${gConfig.INSTALL_PATH}tmpDir`);
  try {
    if (!tmpDirFiles.length) {
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