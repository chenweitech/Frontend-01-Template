const http = require("http");

const server = http.createServer((req, res) => {
    console.log("request received")
    res.setHeader('Content-Type', 'text/html')
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    })
    res.end(
        `
    <html maaa=a>
    <head>
      <style>
        body div #id1 {
          width: 100px;
          background-color: #ff5000;
        }
        body div img {
          width: 30px;
          background-color: #ff1111;
        }
      </style>
    </head>
    <body>
      <div>
        <img id="id1" />
        <img />
      </div>
    </body>
    </html>
    `
    )
})

server.listen(80)