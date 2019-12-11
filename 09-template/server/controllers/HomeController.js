const HomeController = {
  async getHomeIndex(ctx) {
    let userInfo = null;

    if (ctx.session.username) {
      userInfo = {};
      userInfo.username = ctx.session.username;
      userInfo.userId = ctx.session.userId;
      userInfo.email = ctx.session.email;
      ctx.session.userInfo = userInfo;
    }

    await ctx.render('home.ejs', {
      title: '主页',
      userInfo
    });
  }
};

module.exports = HomeController;
