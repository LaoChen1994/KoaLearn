const Koa = require('koa');
const cors = require('koa2-cors');
const Router = require('koa-router');

const router = new Router();

const app = new Koa();

app.use(
  cors({
    origin: function(ctx) {
      return 'http://localhost:3000';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);

router.get('/getUserInfo', async ctx => {
  ctx.body = [{ name: 'Mike', age: 18 }];
});

app.use(router.routes(), router.allowedMethods());

app.listen(8000, () => {
  console.log('server is on 8000');
});
