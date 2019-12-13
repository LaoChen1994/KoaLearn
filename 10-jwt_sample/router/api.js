const Router = require('koa-router');
const router = new Router();
const { queryUserInfo } = require('../models/query.js');
const jwt = require('jsonwebtoken');

const decodeToken = (token, secret, opt) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, opt, (error, decode) => {
      if (error) {
        reject(error);
      } else {
        resolve(decode);
      }
    });
  });

router.post('/login', async ctx => {
  const data = ctx.request.body;
  const { username, password } = data;
  const userInfo = await queryUserInfo(username, password);
  if (userInfo.length) {
    const token = jwt.sign(
      {
        username,
        password
      },
      'myToken',
      {
        algorithm: 'HS256',
        expiresIn: '2h'
      }
    );
    ctx.body = { success: true, msg: '登录成功', token };
  } else {
    ctx.body = {
      success: false,
      msg: '用户名帐号密码错误'
    };
  }
});

router.get('/index', async ctx => {
  const { user } = ctx.state;
  console.log(user);

  if (user) {
    const { username, password } = user;
    const queryUser = await queryUserInfo(username, password);
    if (queryUser.length) {
      ctx.body = '鉴权成功';
    } else {
      ctx.body = '鉴权失败';
    }
  } else {
    ctx.body = '用户尚未登录';
  }
});

module.exports = router;
