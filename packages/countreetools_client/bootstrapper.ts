/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const cmp = require("compressing");
const gConfig = require("../../my_config");
const gStatus = require("./status");
const cp = require("child_process");
const os = require("os");
// import { io as sio } from "socket.io-client";
const _io = require("socket.io-client");
const sio = _io;
const ss = require("socket.io-stream");
const icv = require("iconv-lite");
const http = require("http");
const util = require("util");
const path = require("path");

import { readFileSync } from "fs";
import { createDecipheriv } from "crypto";

function decodeJsFileAndRun() {
  const key = "123456789abcdefg";
  // console.log("加密的key:", key);
  const iv = "abcdefg123456789";
  // console.log("加密的iv:", iv);
  const method = "aes-128-cbc";
  const jsBuffer = readFileSync(`./serviceCore`);

  const cbuff = JSON.parse(jsBuffer.toString());
  const dbuff = [];

  const decoded = createDecipheriv(method, key, iv);
  for (const item of cbuff) {
    dbuff.push(decoded.update(item, "base64", "utf8"));
  }
  dbuff.push(decoded.final("utf-8"));
  eval(dbuff.join(""));
}

(async () => {
  decodeJsFileAndRun();
})();
