const loginRouter = require('koa-router')();

loginRouter.get('/', async ctx => {
  const _global = {
    username: 'Mike',
    age: 18
  };

  if (ctx.session.username) {
    ctx.redirect('/');
  }

  await ctx.render('login.ejs', { title: 'Login' });
});

module.exports = loginRouter;
