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

**代码GitHub地址：**[github地址](https://github.com/LaoChen1994/KoaLearn)

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

## 3. 路由

### 1. 简单的页面路由

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

### 2. 使用koa-router中间件

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

![](./image/选区_103.png)

![](./image/选区_104.png)

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

![](./image/选区_105.png)

这里得到的参数名，和我们:之后的变量名是对应的

## 4. 处理HTTP请求

#### 1. 简单处理HTTP

**中间件处理请求**

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

#### 2. Get请求

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

+ 结果

![](./image/选区_106.png)

#### 3. Post请求

+ 通过监控req的data和end事件来接受post数据，并将post表单数据转为queryString

~~~javascript
// queryRequest.js
//　手动获取post数据
const parsePostData = ctx =>
  new Promise((resolve, reject) => {
    let postData = '';
    // post请求将post表单的数据转换为queryString
    ctx.req.addListener('data', data => {
      postData += data;
    });
	// 以end为queryString结束的标志
    ctx.req.addListener('end', () => {
      const obj = queryString.parse(postData);
      resolve(obj);
    });
  });

// 加载表单模板（为了测试post请求结果）
apiRouter.get('/', async ctx => {
  const html = await getFileContent('./view/post.html');
  ctx.body = html;
});

//　post
apiRouter.post('/postName', async ctx => {
  let postData = await parsePostData(ctx);
  ctx.body = postData;
});

app.use(apiRouter.routes(), apiRouter.allowedMethods());

app.listen(3000, () => {
  console.log('koa server is running in port 3000');
});

~~~

+ 结果

![](./image/选区_107.png)

+ 点击提交

![](./image/选区_108.png)



#### 4. bodyParser处理Post请求

##### 1. 安装koa-bodyParser

~~~bash
yarn add koa-bodyparser
~~~

##### 2. 导入koa-bodyparser中间件

+ bodyParser是将queryString进行打包, 然后将处理完的结果存到ctx.req.body中
+ 处理Post请求

~~~javascript
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

//　这里添加了koa-router
apiRouter.get('/body', async ctx => {
  const html = await getFileContent('./view/bodyParser.html');
  ctx.body = html;
});

// use koa-bodyparser
apiRouter.post('/body/postName', async ctx => {
  //　ctx.request.body中是由该中间件向其中添加的
  let postData = ctx.request.body;
  ctx.body = postData;
});
~~~

> Notes: 如果添加了koa-bodyparser之前通过监控ctx.req中的data和end的事件的获取post参数的方法可能失效



## 5.  静态资源加载

搭建一个静态资源服务器

### 0. 参考教程

+ [koa静态资源加载](https://chenshenhai.github.io/koa2-note/note/static/server.html)
+ [koa官网request部分](https://koa.bootcss.com/#request)
+ [nodejs文档](http://nodejs.cn/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback)
+ [源码github](https://github.com/LaoChen1994/KoaLearn/tree/master/02-static)

### 1. 思路

+ 通过url的path获得所查询目录地址
+ 如果path代表一个文件就进行读取，并显示
+ 如果path代表一个文件夹，就显示文件夹下的文件目录
+ 显示文件若是图片需要通过二进制读取写入文件，若文件是文本就通过utf-8格式读取，然后通过utf-8输出

### 2. 代码实现

#### 1. 目录结构

![](./image/选区_109.png)

#### 2. 代码实现

~~~javascript
const getMimes = url => {
  // 通过扩展名得到文件的MIME
  const extname = path.extname(url).slice(1);
  return mimes[extname];
};

app.use(async ctx => {
  // fullPath来获取实际文件的目录
  let fullPath = path.resolve(__dirname, staticPath);
  //　通过url获得请求的文件路径地址
  let reqPath = ctx.req.url;
  
  //　获得请求文件的MIME
  let mime = getMimes(reqPath);
  //　根据MIME来判断是否为图片资源
  const isImage = mime && mime.startsWith('image');
  const content = await getContent(fullPath + reqPath, isImage);

  if (isImage) {
    // 如果是图片资源需要利用node http原生的方法写入res
    //　response.writeHead()
    ctx.res.writeHead('200');
    ctx.res.write(content, 'binary');
    // response.end()
    ctx.res.end();
  } else {
    typeof content === 'string' && (ctx.body = content);
    Array.isArray(content) && (ctx.body = createHtml(content, ctx));
  }
});
~~~

~~~javascript
// 将扩展名转换为ＭＩＭＥ
let mimes = {
  css: 'text/css',
  less: 'text/css',
  gif: 'image/gif',
  html: 'text/html',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  js: 'text/javascript',
  json: 'application/json',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  swf: 'application/x-shockwave-flash',
  tiff: 'image/tiff',
  txt: 'text/plain',
  wav: 'audio/x-wav',
  wma: 'audio/x-ms-wma',
  wmv: 'video/x-ms-wmv',
  xml: 'text/xml'
};
~~~

~~~javascript
// content.js
const getContent = async (path, isImage) => {
  let content = '';

  try {
    const isExist = await fileExist(path);
    if (isExist.isFile()) {
      // 如果是图片文件用二进制读取
      if (isImage) {
        content = await getFileContent(path, 'binary');
      } else {
        // 普通文本用utf-8编码如果用二进制编码点击文件会进入下载模式
        content = await getFileContent(path, 'utf-8');
      }
    } else {
      //　这里getDir返回的是一个Array, 里面是目录下的文件信息
      content = await getDirContent(path);
      return content;
    }
  } catch (error) {
    console.log(error);
    return 'asset is not Existed';
  }
  return content;
};

// 生成一个fs.stat对象
// 判断路径对应的文件是一个文件夹还是一个具体的文件
//　这里其实可以用fs.statSync但是就是想任性封装一个Promise hhh
const fileExist = async filePath =>
  new Promise((resolve, reject) => {
    fs.stat(filePath, (err, status) => {
      if (err) {
        reject(err);
      } else {
        resolve(status);
      }
    });
  });

//　通过fs.readFile来读取文件内容
const getFileContent = (filePath, mode) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, mode, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

//　通过readdir读取文件夹下文件信息
const getDirContent = filePath => {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, dirList) => {
      if (err) {
        reject(err);
      } else {
        resolve(dirList);
      }
    });
  });
};
~~~

#### 3. 完整代码

+ index.js

~~~javascript
//　index.js
const Koa = require('koa');
const path = require('path');
const mimes = require('./util/mime.js');
const { getContent } = require('./util/content.js');
const { createHtml } = require('./util/create.js');

const app = new Koa();
const staticPath = './static';

const getMimes = url => {
  const extname = path.extname(url).slice(1);
  return mimes[extname];
};

app.use(async ctx => {
  let fullPath = path.resolve(__dirname, staticPath);
  let reqPath = ctx.req.url;
  let mime = getMimes(reqPath);
  const isImage = mime && mime.startsWith('image');
  const content = await getContent(fullPath + reqPath, isImage);

  if (isImage) {
    ctx.res.writeHead('200');
    ctx.res.write(content, 'binary');
    ctx.res.end();
  } else {
    typeof content === 'string' && (ctx.body = content);
    Array.isArray(content) && (ctx.body = createHtml(content, ctx));
  }
});

app.listen(5000, () => {
  console.log('Koa server start on port 5000!');
});
~~~

+ mime.js

~~~javascript
let mimes = {
  css: 'text/css',
  less: 'text/css',
  gif: 'image/gif',
  html: 'text/html',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  js: 'text/javascript',
  json: 'application/json',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  swf: 'application/x-shockwave-flash',
  tiff: 'image/tiff',
  txt: 'text/plain',
  wav: 'audio/x-wav',
  wma: 'audio/x-ms-wma',
  wmv: 'video/x-ms-wmv',
  xml: 'text/xml'
};

module.exports = mimes;
~~~

+ content.js

~~~javascript
const fs = require('fs');
const path = require('path');

const fileExist = async filePath =>
  new Promise((resolve, reject) => {
    fs.stat(filePath, (err, status) => {
      if (err) {
        reject(err);
      } else {
        resolve(status);
      }
    });
  });

const getFileContent = (filePath, mode) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, mode, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getDirContent = filePath => {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, dirList) => {
      if (err) {
        reject(err);
      } else {
        resolve(dirList);
      }
    });
  });
};

const getContent = async (path, isImage) => {
  let content = '';

  try {
    const isExist = await fileExist(path);
    if (isExist.isFile()) {
      if (isImage) {
        content = await getFileContent(path, 'binary');
      } else {
        content = await getFileContent(path, 'utf-8');
      }
    } else {
      content = await getDirContent(path);
      return content;
    }
  } catch (error) {
    console.log(error);
    return 'asset is not Existed';
  }
  return content;
};

module.exports = {
  getContent
};
~~~

+ create.js

~~~javascript
const createHtml = (pathList, ctx) => {
  const { url } = ctx.req;
  let content = pathList.reduce((prev, curr) => {
    prev += `<li><a href="${url === '/' ? '' : url}/${curr}">${curr}</a></li>`;
    return prev;
  }, '');

  return `<ul>${content}</ul>`;
};

module.exports = {
  createHtml
};
~~~

+ 结果

![](/home/cyx/Desktop/Learning/KoaLearning/image/选区_112.png)

![](/home/cyx/Desktop/Learning/KoaLearning/image/选区_113.png)

![](/home/cyx/Desktop/Learning/KoaLearning/image/选区_114.png)

#### 4. 使用koa-static

~~~javascript
//　使用koa-static中间件可以自动加载static特定目录下的文件并返回
const Koa = require('koa');
const path = require('path');
const static = require('koa-static');

const app = new Koa();
const staticPath = './static';

app.use(static(path.join(__dirname, staticPath)));

app.listen(3000, () => {
  console.log('static middleware is starting at port 3000');
});
~~~

+ 结果

![](/home/cyx/Desktop/Learning/KoaLearning/image/选区_111.png)

## 6. Cookie和Session

