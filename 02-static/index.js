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
