const net = require("net");
class Request {
  constructor(options) {
    this.host = options.host || "127.0.0.1";
    this.port = options.port || "80";
    this.path = options.path || "/";
    this.method = options.method || "GET";
    this.headers = options.headers || {};
  }

  toString() {
    let RequestString = `${this.method} ${this.path} HTTP/1.1\r\n`;
    Object.keys(this.headers).forEach((item) => {
      RequestString = RequestString + item + ":" + this.headers[item] + "\r\n";
    });
    console.log(RequestString);
    return RequestString;
  }

  send(conn) {
    // let string = `${this.method} ${this.path} HTTP/1.1\r\n`;
    // conn.write(this.method);
    let client = net.createConnection({
      host: this.host,
      port: this.port,
    });
    client.on("connect", () => {
      console.log("服务器连接成功");
      //   console.log(this.toString());
      client.write(this.toString());
      client.write("\r\n");
    });

    client.on("data", (data) => {
      console.log(data.toString());
    });
  }
}

class Response {}

module.exports = { Request, Response };
