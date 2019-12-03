const Koa = require('koa');
const session = require('koa-session2');
const Store = require('./store/redis.js');
const router = require('koa-router')();

const app = new Koa();

app.use(
  session({
    store: new Store(),
    key: 'SessionId',
    maxAge: 3600
  })
);

router.get('/index', async ctx => {
  const userId =
    ctx.session.userId ||
    Math.random()
      .toString(36)
      .substr(2);
  const count = ctx.session.count || 0;
  ctx.session = { userId, count };
  ctx.body = ctx.session;
});

app.use(router.routes(), router.allowedMethods());

app.use(ctx => {
  // refresh session if set maxAge
  ctx.session.refresh();
});

app.listen(3000, () => {
  console.log('port open on 3000');
});
