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
