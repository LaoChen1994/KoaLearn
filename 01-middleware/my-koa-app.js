const Koa = require('koa');
const app = new Koa();
const { logger } = require('./middleware/logger.js');
const { handleReq } = require('./middleware/router.js');

app.env = 'development';

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} ${rt}`);
});

app.use(logger);

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log('set time ');
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(handleReq);

app.listen(3000, () => {
  console.log('App Server listen 3000');
});
