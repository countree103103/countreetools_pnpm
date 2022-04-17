import * as fs from "fs";
import { execSync } from "child_process";
import { gConfig, getOldServiceName, sleep } from "@countreetools/countreetools_common";

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


uninstall();
