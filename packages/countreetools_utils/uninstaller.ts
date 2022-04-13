import * as fs from "fs";
import { execSync } from "child_process";

import gConfig from "./my_config";

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

// let BACKEND_NAME;
// try {
//   BACKEND_NAME = fs
//     .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
//     .toString()
//     .split("%")[1];
// } catch (e) {
//   console.log("获取backend名字失败");
//   console.log(e);
//   sleep(10000);
//   return;
// }

// const BACKEND_PATH = `${gConfig.INSTALL_PATH}${BACKEND_NAME}`;
// const NSSM_PATH = `${gConfig.INSTALL_PATH}nssm.exe`;
// let SERVICE_NAME;

// try {
//   SERVICE_NAME = fs
//     .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
//     .toString()
//     .split("%")[0];
// } catch (e) {
//   console.log("获取服务名失败");
//   console.log(e);
//   sleep(10000);
//   return;
// }

async function uninstall() {
  try {
    execSync(
      `sc.exe sdset ${getOldServiceName()} "D:(A;;CCLCSWRPWPDTLOCRRC;;;SY)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;BA)(A;;CCLCSWLOCRRC;;;IU)(A;;CCLCSWLOCRRC;;;SU)S:(AU;FA;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;WD)"`
    );
  } catch (error) {
    console.log(`服务去隐藏失败或不存在!`);
    await sleep(3000);
    return;
  }
  try {
    try {
      execSync(`${gConfig.NSSM_PATH} status ${getOldServiceName()}`);
    } catch (e) {
      console.log(`服务未安装`);
      await sleep(3000);
      return;
    }
    execSync(`${gConfig.NSSM_PATH} remove ${getOldServiceName()} confirm`);
    execSync(`${gConfig.NSSM_PATH} stop ${getOldServiceName()}`);
    // fs.rmdirSync(`${INSTALL_PATH}`, { recursive: true });
    const fileArr = fs.readdirSync(`${gConfig.INSTALL_PATH}`);
    try {
      for (const file of fileArr) {
        fs.unlinkSync(`${gConfig.INSTALL_PATH}\\${file}`);
      }
    } catch (error) {
      console.log("未完全清理");
    }
    console.log("卸载完毕");
    await sleep(1000);
  } catch (e) {
    console.log("--------ERROR!!-------");
    console.log(e);
    await sleep(100000);
  }
}

function sleep(msec) {
  return new Promise((r) => {
    setTimeout(() => {
      r(null);
    }, msec);
  });
}

uninstall();
