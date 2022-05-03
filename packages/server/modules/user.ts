import ss from "socket.io-stream";
import * as fs from "fs";
import myUtils from "../utils";
import { IOS } from "../sockerServer";

const cmdResult = {
  data: "",
};

export default function userIoInit(ios: IOS) {
  const { userIo, adminIo } = ios;
  userIo.on("connection", (sk) => {
    sk.on("message", (data) => {
      if (data.admin === true) {
        console.log("i a admin");
        sk.join("admin");
      } else {
        console.log("i not admin");
        sk.join("client");
      }
      console.log(data);
    });
    sk.on("init", (information) => {
      const obj = {
        id: sk.id,
        streaming: false,
        ...information,
      };
      // console.log(obj);
      myUtils.clientArr.push(obj);
    });

    sk.on("updateinfo", (newInfo) => {
      for (const obj of myUtils.clientArr) {
        if (obj["id"] == sk.id) {
          for (const objKey in obj) {
            for (const key in newInfo) {
              if (Object.hasOwnProperty.call(obj, key)) {
                obj[key] = newInfo[key];
              }
            }
          }
        }
      }
    });

    sk.on("dialog", (dialogContent) => {
      adminIo.emit("apidialog", dialogContent);
    });

    sk.on("cmdresult", (result) => {
      cmdResult.data = result;
      console.log(result);
      adminIo.emit("apisendcmd", cmdResult);
    });
    sk.on("disconnect", (reason) => {
      console.log(reason);
      cmdResult.data = reason;
      // 删除数组中刚断开连接的元素
      if (myUtils.IdIndex(sk.id) > -1) {
        myUtils.clientArr.splice(myUtils.IdIndex(sk.id), 1);
      }
    });

    sk.on("screenshot", (imgBuffer) => {
      adminIo.emit(`apigetscreenshot_${sk.id}`, imgBuffer);
    });

    sk.on("debug", (msg) => {
      adminIo.emit("debug", msg);
    });

    ss(sk).on("downloadfile", (stream, fileName) => {
      // ss(sk).to("admin").emit("apidownloadfile", stream);
      // console.log(777);
      // console.log(stream);
      // if (!fs.existsSync("tmpDir")) {
      //   fs.mkdirSync("tmpDir");
      // }
      if (!fs.existsSync("/var/www/tmpDir/tmpDir")) {
        fs.mkdirSync("/var/www/tmpDir/tmpDir", { recursive: true });
      }
      const to = fs.createWriteStream(`/var/www/tmpDir/tmpDir/${fileName}`);
      to.on("finish", () => {
        adminIo.emit("apidownloadfile", fileName);
      });
      stream.pipe(to);
      // let stream2 = ss.createStream();
      // ss(sk).to("admin").emit("apidownloadfile", stream2);
      // stream.pipe(stream2);
    });

    sk.on("listdir", (result, url) => {
      adminIo.emit("apilistdir", result, url);
    });

    sk.on("showfilecontent", (result, url) => {
      adminIo.emit("apishowfilecontent", result, url);
    });

    sk.emit("message", "hello from ser");
  });
}

// module.exports = userIoInit;
