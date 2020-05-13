const http = require("http");

const server = http.createServer(function (req, res) {
  console.log(req.method);
  console.log(req.headers);
  console.log(req.httpVersion);
  let str = "";
  req.on('data', function (chunk) {
    console.log("开始接收数据");
    console.log(chunk);
    str += chunk;
  })
  req.on('end', function () {
    console.log(str.toString());
  })
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Foo", "bar");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
});

server.listen(8080, () => {
  console.log("服务器已启动");
});
