const Koa = require('koa');
const path = require('path');
const views = require('koa-views');

const app = new Koa();

app.use(views(path.join(__dirname, './views')), {
  extension: 'ejs'
});

app.use(async ctx => {
  let title = 'Hello Koa 2';
  let name = 'Mike';
  let age = 18;
  let friends = ['Jerry', 'Tom', 'Jack'];
  await ctx.render('index.ejs', {
    title,
    name,
    age,
    friends
  });
});

app.listen(3000, () => {
  console.log('server is on port 3000');
});
