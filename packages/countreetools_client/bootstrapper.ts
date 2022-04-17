/* eslint-disable @typescript-eslint/no-unused-vars */

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
