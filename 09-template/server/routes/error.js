const errRouter = require('koa-router')();

errRouter.get('*', async ctx => {
  await ctx.render('error.ejs', {
    title: 'Error',
    Content: 'Page is Not Found'
  });
});

module.exports = errRouter;
