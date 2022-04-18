import userIoInit from "./user";
import adminIoInit from "./admin";
import { IOS } from "../sockerServer";

export default function IoInit(ios: IOS) {
  userIoInit(ios);
  adminIoInit(ios);
}

// module.exports = IoInit;
