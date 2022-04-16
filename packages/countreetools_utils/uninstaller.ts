import * as fs from "fs";
import { execSync } from "child_process";

import gConfig from "./my_config";

function getOldBackendName() {
  const OLD_BACKEND_NAME = fs
    .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
    .toString()
    .split("%")[1];
  return OLD_BACKEND_NAME;
}

function getOldServiceName() {
  const OLD_SERVICE_NAME = fs
    .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
    .toString()
    .split("%")[0];
  return OLD_SERVICE_NAME;
}

function getOldBootstrapperName() {
  const OLD_BOOTRAPPER_NAME = fs
    .readFileSync(`${gConfig.INSTALL_PATH}serviceName`)
    .toString()
    .split("%")[2];
  return OLD_BOOTRAPPER_NAME;
}

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
