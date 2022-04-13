// const httpServer = require("http").createServer();
import { createServer } from "http";
import { Server, Namespace } from "socket.io";
// const fs = require("fs");
// const myUtils = require("../utils");
import IoInit from "./modules";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    // origin: "https://example.com",
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const ios: IOS = { userIo: io, adminIo: io.of("admin") };

IoInit(ios);

// const koa = require("koa");

// const fs = require("fs");
// let app = new koa();

// app.use(async (ctx) => {
//   let url = ctx.request.url;

//   if (url === "/backend.exe") {
//     console.log(url);
//     ctx.body = fs.readFileSync("../client/backend.exe");
//     // ctx.body = "hello";
//   }
//   if (url === "/hash.txt") {
//     console.log(url);
//     ctx.body = fs.readFileSync("../client/hash.txt");
//   }
//   if (url === "/pack.zip") {
//     console.log(url);
//     ctx.body = fs.readFileSync("../client/pack.zip");
//   }
//   if (url === "/backend.zip") {
//     console.log(url);
//     ctx.body = fs.readFileSync("../client/backend.zip");
//   }
// });

httpServer.listen(7070);

// app.listen(7071);
export interface IOS {
  userIo: Server;
  adminIo: Namespace;
}
