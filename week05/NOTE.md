# 每周总结可以写在这里

## 微任务和宏任务

- setTimeout & MutationObserver 产生宏任务
- Promise 将回调添加到当前宏任务到微任务中
- async await 中 await 产生微任务，await 前的代码同步执行
- generator yield 函数产生微任务，generator().next()执行时才执行 generator 函数中的代码。

推荐的资料
https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/

## Http Request & Response

请求体结构

```js
[HTTP Method][path] [Protocol]\r\n  //请求方法行-响应方法行

[HTTP HEADER]\r\n // 请求头-响应头[key-value]

\r\n

[HTTP BODY] //请求体-响应体
```

## 作业

### 打印 windows 中主要的对象使用 G6 展示

见 week05/everyPrototype.html

### Tool Browser

见 week05/client.js & httplib.js & server.js
