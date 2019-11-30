# Koa Learn

---

## 0. Koa 概述

**参考**：

[koa2 设计模式-学习笔记](https://github.com/chenshenhai/koajs-design-note)

[koa 官网](https://koa.bootcss.com/#)

[koa2 进阶学习笔记](https://chenshenhai.github.io/koa2-note/)

**Koa2 实现的功能**：

- HTTP 服务
  - 处理 HTTP 请求 request
  - 发送 HTTP 响应 response
- 中间件执行
  - 中间件加载
  - 中间件执行

## 1. 安装 Koa 环境

```bash
npm i koa -s
```

## 2. Koa 的中间件

### 1. 中间件的加载

**加载方法**(app.use):

```javascript
// my-koa-app.js
const Koa = require('koa');
const app = new Koa();

// 利用app.use来添加级联调用的中间件
app.use(async ctx => {
  ctx.body = 'Hello World!';
});

app.listen(3000, () => {
  console.log('App Server listen 3000');
});
```

### 2. Koa 中间件级联调用

**级联调用**(利用 await 调用，等待下一个中间件的执行过程)

```javascript
// my-koa-app.js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  // 当执行到这个await会直接跳到下一个中间件进行执行
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log('set time ');
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async ctx => {
  ctx.body = 'Hello World!';
  console.log('body');
});

app.listen(3000, () => {
  console.log('App Server listen 3000');
});
```

### 3. 中间件的编写和调用

- 利用 async / await 编写 koa 中间件
  - async 异步调用
  - 需要执行的函数体
  - await next()执行完后通过 next 等待后序级联中间件的运行

```javascript
// my-koa-app.js
function logger(ctx, next) {
  console.log('*****************');
  console.log(ctx.method, ctx.header.host, ctx.url);
  console.log('*****************');
  await next();
}

module.exports = {
  logger
}
```

- 调用方法: 导入用 app.use 调用即可

```javascript
const { logger } = require('./middleware/logger.js');
app.use(logger());
```

### 4. 使用中间件处理请求

~~~javascript
// router.js
async function handleReq(ctx, next) {
  //　通过ctx.req.url可以请求的url
  ctx.body = ctx.req.url.replace(/(\/)/gi, ' ');
  await next();
}

module.exports = { handleReq };
~~~

详细request内包含的属性可查看: [Koa2 context.request](https://koa.bootcss.com/#request)

### 5. 简单的页面路由

**思路**:

+ 解析请求的url获得请求页面路径
+ 根据不同的页面路径获得不同的渲染页面模板
+ 将模板内容传给ctx.body

~~~javascript
// my-koa-router.js
const Koa = require('koa');
const app = new Koa();
const { handleRouter } = require('./middleware/router.js');

// 将处理路由函数进行封装成一个中间件
app.use(handleRouter);

app.listen(5000, () => {
  console.log('start at port 5000');
});
~~~

~~~javascript
// router.js
const readFile = path =>
  new Promise((resolve, reject) =>
　　//　这里读的文件格式需要注意，默认读出来的是buffer
    fs.readFile(path, 'utf-8', (err, data) =>
      err ? reject(err) : resolve(data)
    )
  );

async function handleRouter(ctx, next) {
  let { url } = ctx.req;
  url = url.slice(1);
  // 所有模板放在项目目录的view下 index.html, todo.html, 404.html
  const filename = `view/${['index', 'todo'].includes(url) ? url : '404'}.html`;
  const data = await readFile(filename);
  ctx.body = data;

  await next();
}
~~~

### 6. 使用koa-router中间件

#### 1. 简单路由

~~~javascript
// use-koa-router.js
const Koa = require('koa');
const app = new Koa();

// 这里两句可以合并为 index = 
const Router = require('koa-router');
let index = new Router();
let todo = new Router();

// 这里链式添加和单独添加是一样的效果
index
  .get('/user', async ctx => {
    ctx.body = 'user';
  })
  .get('/index', async ctx => {
    ctx.body = 'index';
  })
  .get('/', async ctx => {
    ctx.body = `
    <ul>
      <li><a href="/index">index</a></li>
      <li><a href="/user">user</a></li>
    </ul>
  `;
  });

todo.get('/todo', async ctx => {
  ctx.body = 'todo';
});

// 多个应用的可以直接通过app.use添加多个路由的中间件
app.use(index.routes(), index.allowedMethods());
app.use(todo.routes(), index.allowedMethods());

app.listen(3000, () => {
  console.log('port start in 3000');
});
~~~

#### 2. 分层路由

+ 创建一个根目录的路由Router
+ 创建配置一个子路由Router
+ 调用根目录的use方法，设置prefix和子路由routes
+ 将根目录的router配置到app中

~~~javascript
// use-koa-router.js
const childRouter = new Router();
const child2Router = new Router();
const rootRouter = new Router();

childRouter
  .get('/index', async ctx => {
    ctx.body = 'root index';
  })
  .get('/', async ctx => {
    ctx.body = 'root';
  });

child2Router
  .get('/index', async ctx => {
    ctx.body = 'subRoot index';
  })
  .get('/', async ctx => {
    ctx.body = 'subRoot';
  });

rootRouter.use('/root', childRouter.routes(), childRouter.allowedMethods());
rootRouter.use(
  '/subroot',
  child2Router.routes(),
  child2Router.allowedMethods()
);

app.use(rootRouter.routes(), rootRouter.allowedMethods());
~~~

**结果**

![](/home/cyx/Desktop/Learning/KoaLearning/image/选区_103.png)

![](/home/cyx/Desktop/Learning/KoaLearning/image/选区_104.png)

+ 可以路由到相关的页面

#### 3. 动态获取路由参数

+ 通过:分隔符来隔开变量名
+ 通过ctx.params获得路由的动态参数

~~~javascript
// use-koa-router.js
const dynamicRouter = new Router();
dynamicRouter.get('/table/:id/:category/:position', async ctx => {
  ctx.body = ctx.params;
});
rootRouter.use('/dyn', dynamicRouter.routes(), dynamicRouter.allowedMethods());
~~~

**结果**

![](/home/cyx/Desktop/Learning/KoaLearning/image/选区_105.png)

这里得到的参数名，和我们:之后的变量名是对应的

### 7. 数据接口

#### 1. Get请求

+ 处理Get请求

~~~javascript
// queryRequest.js
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');

const apiRouter = new Router();

apiRouter.get('/getName', async ctx => {
  const { id } = ctx.query;
  const nameList = ['Jack', 'Mike', 'Mary', 'Joe'];

  try {
    ctx.body = {
      name: nameList[+id]
    };
  } catch (error) {
    console.log(error);
    ctx.body = {
      error
    };
  }
});

app.use(apiRouter.routes(), apiRouter.allowedMethods());

app.listen(3000, () => {
  console.log('koa server is running in port 3000');
});
~~~

#### 2. Post请求



