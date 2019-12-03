const Koa = require('koa');
const router = require('koa-router')();
const { setCookie } = require('./middleware/cookie.js');

const app = new Koa();

router.get('/root', async ctx => {
  ctx.body = 'Root';
});
app.use(setCookie);

app.use(router.routes(), router.allowedMethods());

app.listen(3000, () => {
  console.log('server is on port 3000');
});
