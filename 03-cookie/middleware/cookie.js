const setCookie = async (ctx, next) => {
  if (ctx.url === '/index') {
    ctx.cookies.set('name', 'HelloWorld', {
      domain: 'localhost',
      path: '/index',
      expires: new Date('2019-12-3'),
      secure: false
    });
    ctx.body = 'set Cookie';
  }
  await next();
};

module.exports = {
  setCookie
};
