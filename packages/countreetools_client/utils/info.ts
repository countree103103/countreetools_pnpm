
import gConfig from "../my_config";
import * as fs from "fs";

export function getOldBackendName() {
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

export function getOldServiceName() {
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

export function getOldBootstrapperName() {
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