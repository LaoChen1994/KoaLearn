const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');

let index = new Router();
let todo = new Router();

/*Koa 基础路由用法 */
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
      <li><a href="/todo">todo</a></li>
    </ul>
  `;
  });

todo.get('/todo', async ctx => {
  ctx.body = 'todo';
});

app.use(index.routes(), index.allowedMethods());
app.use(todo.routes(), index.allowedMethods());

/*Koa分层路由 */
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

/*　动态路由参数 */
const dynamicRouter = new Router();
dynamicRouter.get('/table/:id/:category/:position', async ctx => {
  ctx.body = ctx.params;
});

rootRouter.use('/dyn', dynamicRouter.routes(), dynamicRouter.allowedMethods());

app.use(rootRouter.routes(), rootRouter.allowedMethods());

app.listen(3000, () => {
  console.log('port start in 3000');
});
