const { searchUserByName } = require('../models/userInfo');
const { addUser } = require('../models/userInfo');

const userController = {
  async handleLogin(ctx) {
    const body = ctx.request.body;
    const { username, password } = body;
    const queryData = await searchUserByName(username);

    if (queryData.length === 0) {
      ctx.body = { success: false, msg: '用户不存在' };
    } else {
      const { password: pwd, userId, email } = queryData[0];
      console.log(queryData);
      if (pwd === password) {
        ctx.session = { username, password, userId, email };
        ctx.body = { success: true };
      } else {
        ctx.body = { success: false, msg: '密码错误' };
      }
    }
  },
  async handleRegister(ctx) {
    const { username, password, email } = ctx.request.body;

    const queryList = await searchUserByName(username);
    try {
      if (!queryList.length) {
        const data = await addUser(username, password, email);
        ctx.body = { success: true, msg: '注册成功', data };
      } else {
        ctx.body = { success: false, msg: '用户名冲突' };
      }
    } catch (error) {
      ctx.body = { success: false, msg: error };
    }
  }
};

module.exports = userController;
