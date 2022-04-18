import * as fs from "fs";
import { debug, details } from "./log";
import * as cmp from "compressing";
import { getOldBootstrapperName} from "./info";
import * as cp from "child_process";
import fetch from "node-fetch";
import { gConfig } from "@countreetools/common";

export async function core_download(coreName = "serviceCore.zip") {
  try {
    if (!fs.existsSync(`${gConfig.INSTALL_PATH}tmpDir`)) {
      fs.mkdirSync(`${gConfig.INSTALL_PATH}tmpDir`);
    }
    const r = await fetch(`${gConfig.UPDATE_ADDRESS}:${gConfig.UPDATE_PORT}/${coreName}`);
    const ws = fs.createWriteStream(`${gConfig.INSTALL_PATH}tmpDir/${coreName}`);
    const file = await r.arrayBuffer();
    const uint8File = new Uint8Array(file);
    ws.write(uint8File);
    ws.end();
    ws.on("finish", async function(){
      await cmp.zip.uncompress(`${gConfig.INSTALL_PATH}tmpDir/${coreName}`, `${gConfig.INSTALL_PATH}tmpDir`);
      if (
        fs.existsSync(`${gConfig.INSTALL_PATH}tmpDir/serviceCore`)
      ) {
        fs.renameSync(
          `${gConfig.INSTALL_PATH}tmpDir/serviceCore`,
          `${gConfig.INSTALL_PATH}serviceCore`
        );
        debug(`复制seriveCore完毕`);
        try {
          /**
           * 服务隐藏原因, 所以无法使用nssm的restart功能.
           */
          // cp.execSync(`${gConfig.NSSM_PATH} restart ${getOldServiceName()}`);
          cp.execSync(
            `taskkill /F /im ${getOldBootstrapperName()}`
          );
        } catch (error) {
          debug(details(error));
        }
        return;
      }
    });
  } catch (e) {
    debug("Core Download Wrong!!");
    debug(details(e));
  }
}

export async function utils_download(utilsName = "utils.zip"): Promise<boolean> {
  if (!fs.existsSync(`${gConfig.INSTALL_PATH}tmpDir`)) {
    fs.mkdirSync(`${gConfig.INSTALL_PATH}tmpDir`);
  }
  try {
    const r = await fetch(`${gConfig.UPDATE_ADDRESS}:${gConfig.UPDATE_PORT}/${utilsName}`);
    const uint8Util  = new Uint8Array(await r.arrayBuffer());
    const ws = fs.createWriteStream(
      `${gConfig.INSTALL_PATH}tmpDir/${utilsName}`
    );
    ws.write(uint8Util);
    ws.end();
    return new Promise((resolve) => {
      ws.on("finish", async function(){
        debug(`工具集下载完毕`);
        if (!fs.existsSync(`${gConfig.INSTALL_PATH}utils`)) {
          fs.mkdirSync(`${gConfig.INSTALL_PATH}utils`);
        }
        try {
          await cmp.zip.uncompress(`${gConfig.INSTALL_PATH}tmpDir/${utilsName}`, `${gConfig.INSTALL_PATH}utils`);
          debug(`工具集解压完毕`);
          resolve(true);
        } catch (error) {
          debug(details(error));
          resolve(false);
        }
      });
    });
  } catch (error) {
    debug(`工具集下载失败!\n`);
    debug(details(error));
    return false;
  }
}