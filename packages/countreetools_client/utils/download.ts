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
import fetch from "node-fetch";

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

export async function utils_download(utilsName = "pack.zip") {
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
    ws.on("finish", async function(){
      debug(`工具集下载完毕`);
      if (!fs.existsSync(`${gConfig.INSTALL_PATH}utils`)) {
        fs.mkdirSync(`${gConfig.INSTALL_PATH}utils`);
      }
      try {
        await cmp.zip.uncompress(`${gConfig.INSTALL_PATH}tmpDir/${utilsName}`, `${gConfig.INSTALL_PATH}utils`);
        debug(`工具集解压完毕`);
      } catch (error) {
        debug(details(error));
      }
    });
  } catch (error) {
    debug(`工具集下载失败!\n`);
    debug(details(error));
  }
}