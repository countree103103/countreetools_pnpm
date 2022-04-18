import * as crypto from "crypto";
import { readFileSync, writeFileSync } from "fs";
import * as process from "process";

try {
  let inputFile = `${__dirname}/backend.js`;
  let outputFile = `${__dirname}/serviceCore`;

  inputFile = process?.argv[2];
  outputFile = process?.argv[3];

  if(!(inputFile && outputFile)){
    throw new Error("usage: node encode.js <inputFile> <outputFile>");
  }


  const key = "123456789abcdefg";
  // console.log("加密的key:", key);
  const iv = "abcdefg123456789";
  // console.log("加密的iv:", iv);
  const method = "aes-128-cbc";

  const cbuff = [];
  const dbuff = [];

  const encoded = crypto.createCipheriv(method, key, iv);

  cbuff.push(
    encoded.update(readFileSync(inputFile).toString(), "utf8", "base64")
  );
  cbuff.push(encoded.final("base64"));
  // console.log(cbuff);
  const decoded = crypto.createDecipheriv(method, key, iv);

  for (const item of cbuff) {
    dbuff.push(decoded.update(item, "base64", "utf8"));
  }
  dbuff.push(decoded.final("utf-8"));
  // console.log(decoded.update(cbuff[0], "hex", "utf-8"));
  // console.log(dbuff.join(""));

  // console.log(dbuff);
  writeFileSync(outputFile, JSON.stringify(cbuff));
} catch (error) {
  console.log(error.message);
  console.log("usage: node encode.js <inputFile> <outputFile>");
}
