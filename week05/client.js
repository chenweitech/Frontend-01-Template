const { Request } = require("./httplib");
const rq = new Request({
  port: 8080,
  method: "POST",
  path: "/",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: {
    "name": "chenwei",
    "age": 24,
  }
});
// console.log(rq.toString());
rq.send().then(res => {
  console.log(res);
});