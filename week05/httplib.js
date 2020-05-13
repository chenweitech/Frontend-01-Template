const net = require("net");
class Request {
  constructor(options) {
    this.host = options.host || "127.0.0.1";
    this.port = options.port || "80";
    this.path = options.path || "/";
    this.method = options.method || "GET";
    this.headers = options.headers || {};
    this.body = options.body || {};

  }

  generator() {
    let requestString = "";
    /** 
     * process request line 
    */
    requestString = `${this.method}\u0020${this.path}\u0020HTTP/1.1\r\n`;
    /** 
     * process request headers
    */
    Object.keys(this.headers).forEach(h => {
      requestString = requestString + h + ":" + this.headers[h] + '\r\n';
    })

    /** 
     * add blank line (POST|PUT|PATCH)
    */
    if (["POST", "PUT", "PATCH"].includes(this.method)) {
      requestString = requestString + "\r\n";
    }
    /** 
     * process request body
     * @type application/json
     * @type text/html
     * @type application/x-www-form-urlencoded
     * @type multipart/form-data;boundary={boundary}
    */
    if (this.headers && this.headers['Content-Type'] === "application/json") { }
    else if (this.headers && this.headers['Content-Type'] === "application/x-www-form-urlencoded") {
      let bodyStringArr = [];
      Object.keys(this.body).forEach(h => {
        bodyStringArr.push(h + "=" + this.body[h]);
      })
      requestString = requestString + `Content-Length: ${bodyStringArr.length}\r\n`;
      requestString = requestString + encodeURIComponent(bodyStringArr.join('&'));
    }
    else if (this.headers && this.headers['Content-Type'] === "text/html") { }

    return requestString;
  }

  toString() {
    return this.generator();
  }

  send() {
    return new Promise((resolve, reject) => {

      let client = net.createConnection({
        host: this.host,
        port: this.port,
      });
      const parser = new ResponseParser;

      client.on("connect", () => {
        console.log("服务器连接成功");
        client.write(this.generator());
        client.end();
      });

      client.on("data", (data) => {
        parser.receive(data.toString());
        // console.log(parser.response, parser.isFinished, 'headers');
        resolve(parser.response);
      });
    })
  }
}

class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0
    this.WAITING_STATUS_LINE_END = 1
    this.WAITING_HEADER_NAME = 2
    this.WAITING_HEADER_SPACE = 3
    this.WAITING_HEADER_VALUE = 4
    this.WAITING_HEADER_LINE_END = 5
    this.WAITING_HEADER_BLOCK_END = 6
    this.WAITING_BODY = 7
    this.current = this.WAITING_STATUS_LINE
    this.headers = {}
    this.headerName = ''
    this.headerValue = ''
    this.statusLine = ''
    this.bodyParser = {
      content: []
    }
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/)
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i))
    }
  }

  receiveChar(char) {
    // console.log(char);
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END
      } else if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      } else {
        this.statusLine += char
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE
      } else if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new TrunkedBodyParser()
        }
      } else {
        this.headerName += char
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END
        this.headers[this.headerName] = this.headerValue
        this.headerName = this.headerValue = ''
      } else {
        this.headerValue += char
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char)
      if (char === '0') {

      }
    }
  }
}
class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0
    this.WAITING_LENGTH_LINE_END = 1
    this.READING_TRUNK = 2
    this.WAITING_NEW_LINE = 3
    this.WAITING_NEW_LINE_END = 4
    this.length = 0
    this.content = []
    this.isFinished = false
    this.current = this.WAITING_LENGTH
  }
  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === '\r') {
        if (this.length === 0) {
          this.isFinished = true
        }
        this.current = this.WAITING_LENGTH_LINE_END
      } else {
        this.length *= 10
        this.length += char.charCodeAt(0) - '0'.charCodeAt(0)
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.current = this.READING_TRUNK
      }
    } else if (this.current === this.READING_TRUNK) {
      if (/[^\r\n]/.test(char)) {
        this.content.push(char)
      }
      this.length--
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE
      }
    } else if (this.current === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_LENGTH
      }
    }
  }
}
module.exports = { Request };
