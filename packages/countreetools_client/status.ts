import myConfig from "./my_config";
const { NSSM_PATH } = myConfig;
import { execSync } from "child_process";

function sleep(msec) {
  return new Promise((r) => {
    setTimeout(() => {
      r(null);
    }, msec);
  });
}

const obj = {
  getRunningServices() {
    try {
      const str = execSync(`sc query|findstr Micosoft`, {
        encoding: "utf-8",
      }).match(/SERVICE_NAME: (.*)/);
      if (str) {
        const service = str[1];
      }
    } catch (error) {
      null;
    }
  },
  isServiceExists(serviceName) {
    try {
      execSync(`${NSSM_PATH} status ${serviceName}`);
      return true;
    } catch (error) {
      return false;
    }
  },
  isServiceStopped(serviceName) {
    if (obj.isServiceExists(serviceName)) {
      try {
        if (
          execSync(`${NSSM_PATH} status ${serviceName}`).equals(
            Buffer.from(obj.STOPPED)
          )
        ) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return true;
      }
    } else {
      return false;
    }
  },
  async waitForServiceStatus(serviceName, status) {
    if (!obj.isServiceExists(serviceName)) {
      return false;
    }
    try {
      while (
        !execSync(`${NSSM_PATH} status ${serviceName}`).equals(
          Buffer.from(status)
        )
      ) {
        await sleep(300);
      }
      return true;
    } catch (error) {
      return false;
    }
  },
  RUNNING: [
    83,
    0,
    69,
    0,
    82,
    0,
    86,
    0,
    73,
    0,
    67,
    0,
    69,
    0,
    95,
    0,
    82,
    0,
    85,
    0,
    78,
    0,
    78,
    0,
    73,
    0,
    78,
    0,
    71,
    0,
    13,
    0,
    10,
    0,
  ],
  STOPPED: [
    83,
    0,
    69,
    0,
    82,
    0,
    86,
    0,
    73,
    0,
    67,
    0,
    69,
    0,
    95,
    0,
    83,
    0,
    84,
    0,
    79,
    0,
    80,
    0,
    80,
    0,
    69,
    0,
    68,
    0,
    13,
    0,
    10,
    0,
  ],
};

// module.exports = obj;

export default obj;
