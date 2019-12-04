const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const views = require('koa-views');
const koaBody = require('koa-body');
const fs = require('fs');

const app = new Koa();

const router = new Router();

app.use(views(path.resolve(__dirname, './views')), {
  extension: 'ejs'
});

app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 1000 * 1024 * 1024
    },
    patchKoa: true
  })
);

router.get('/', async (ctx, next) => {
  ctx.body = 'index';
});

router.get('/index', async ctx => {
  await ctx.render('index.ejs');
});

router.post('/upload', async (ctx, next) => {
  const file = ctx.request.files.file;
  const formData = ctx.request.body;
  const extname = path.extname(file.name);
  const reader = fs.createReadStream(file.path);
  const writer = fs.createWriteStream(
    `static/${Math.random()
      .toString(36)
      .substr(2)}${extname}`
  );
  reader.pipe(writer);
  ctx.body = formData;
});

app.use(router.routes(), router.allowedMethods());

app.listen(3000, () => {
  console.log('server Port on 3000');
});
