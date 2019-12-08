const homeRouter = require('koa-router')();

homeRouter.get('/', async ctx => {
  await ctx.render('home.ejs', {
    title: '主页'
  });
});

module.exports = homeRouter;
