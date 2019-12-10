const Koa = require('koa');
const view = require('koa-views');
const path = require('path');
const static = require('koa-static');
const session = require('koa-session2');
const Store = require('./models/redis');
const koaBody = require('koa-body');

const router = require('./routes/index');

const app = new Koa();

app.use(view(path.resolve(__dirname, './views/')), {
  extension: 'ejs'
});

app.use(
  session({
    store: new Store(),
    key: 'SessionId',
    maxAge: 86400000,
    domain: 'localhost',
    path: '/'
  })
);

app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 1000 * 1024 * 1024
    },
    patchKoa: true
  })
);

app.use(static(path.resolve(__dirname, './static/')));

app.use(router.routes(), router.allowedMethods());

app.listen(8080, () => {
  console.log('server is on port 8080');
});
