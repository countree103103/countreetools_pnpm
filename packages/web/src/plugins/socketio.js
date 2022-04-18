import sio from "socket.io-client";
import ss from "socket.io-stream";
import {gConfig} from "@countreetools/common"
const { SERVER_ADDRESS, SERVER_PORT } = gConfig;

const io = sio(`${SERVER_ADDRESS}:${SERVER_PORT}/admin`, {
  // withCredentials: true,
});

function IoInit(_this) {
  io.on("connect", () => {
    io.send({ admin: true });
    _this.server_status = "已连接";
  });

  io.on("disconnect", () => {
    _this.server_status = "已断开";
    _this.clientArr = [];
  });

  io.on("apigetallclients", (carr) => {
    _this.clientArr = carr;
    _this.server_status = "已连接";
  });

  io.on("apisendcmd", (cmdresult) => {
    window.cmdResult.data = cmdresult.data;
    console.log(cmdresult);
  });

  io.on("apigetscreenshot", (imgbase64) => {
    _this.screenshot.src = `data:image/jpg;base64,${imgbase64}`;
    _this.screenshot.show = true;
  });

  io.on("apidialog", (dialogContent) => {
    _this.$store.commit("setGlobalStatus", "dx分析完毕");
    console.log(dialogContent);
  });

  io.on("debug", (msg) => {
    console.log(`--DEBUG:\n${msg}`);
  });
}

// ss(io).once("streamtest", (stream) => {
//   let parts = [];
//   stream.on("data", function (chunk) {
//     parts.push(chunk);
//     console.log("data");
//   });
//   stream.on("end", function () {
//     console.log("end");
//   });
//   stream.on("error", function () {
//     console.log("error!!");
//   });
//   stream.on("finish", function () {
//     console.log("finish!!");
//   });
//   console.log(stream);
// });

const mystream = ss.createStream();

let parts = [];
mystream.on("data", function (chunk) {
  parts.push(chunk);
  // console.log("data");
});
mystream.on("end", function () {
  // console.log("end");
  console.log(parts.join(""));
});
mystream.on("error", function () {
  console.log("error!!");
});
mystream.on("finish", function () {
  console.log("finish!!");
});
console.log(mystream);

ss(io).emit("streamtest", mystream);

function FileExplorerInit(_this) {
  io.on("apilistdir", (result, url) => {
    // if (result.length) {
    _this.fileList = result;
    _this.sortedFileList = _this.fileList;
    _this.currentUrl = url;
    _this.sortFileList();
    // }
    _this.fileListLoading = false;
  });
  io.on("apidownloadfile", (fileName) => {
    window.open(`${SERVER_ADDRESS}:7071/tmpDir/${fileName}`);
    _this.fileListLoading = false;
  });
  io.on("apishowfilecontent", (raw) => {});
}

export default io;
export { io, IoInit, FileExplorerInit };
