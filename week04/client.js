const net = require("net");
const { Request } = require("./httplib");
const rq = new Request({
  port: 8080,
  method: "POST",
  path: "/",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

rq.send();
// rq.toString();

// const client = net.createConnection(
//   {
//     host: "127.0.0.1",
//     port: 8080,
//   },
//   () => {
//     console.log("已连接到服务器");
//     // client.write("POST / HTTP/1.1\r\n");
//     // client.write("Content-Type: application/x-www-form-urlencoded\r\n");
//     // client.write("\r\n");
//     // client.write("name=chenwei&age=12");
//   }
// );

// client.on("data", (data) => {
//   console.log(data.toString());
//   client.end();
// });

// client.on("end", () => {
//   console.log("已断开");
// });
