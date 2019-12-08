const loginRouter = require('koa-router')();

loginRouter.get('/', async ctx => {
  const _global = {
    username: 'Mike',
    age: 18
  };

  await ctx.render('login.ejs', { title: 'Login', _global });
});

module.exports = loginRouter;
