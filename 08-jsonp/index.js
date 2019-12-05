const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const path = require('path');

const app = new Koa();
const router = new Router();

app.use(
  views(path.join(__dirname, './views'), {
    extension: 'ejs'
  })
);

router.get('/', async ctx => {
  await ctx.render('index.ejs', { title: 'Index' });
});

router.get('/getData', async ctx => {
  const data = {
    success: true,
    data: {
      text: 'this is jsonp api',
      add: [1, 2, 3]
    }
  };

  const jsonpStr = `callback(${JSON.stringify(data)})`;
  ctx.type = 'text/javascript';
  ctx.body = jsonpStr;
});

app.use(router.routes(), router.allowedMethods());

app.listen(3000, () => console.log('server is on port 3000'));
