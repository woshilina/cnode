//导入数据库模型user.js

const User = require('../database/models/user');
const router = require('koa-router')();
const koaBody = require('koa-body');

router.get('/onload', async ctx => {
  await ctx.render('./onload', { session: ctx.session });
});

router.post('/onload', koaBody(), async ctx => {
  var uname = ctx.request.body.uname;
  var pass = ctx.request.body.upwd;
  let user = await User.findOne({ where: { name: uname, password: pass } });

  if (uname === user.name && pass === user.password) {
    ctx.body = { result: 'true' };
    ctx.session = {
      name: uname,
      id: user.id,
      sign: user.sign,
      integral: user.integral,
      city: user.city,
      weibo: user.weibo,
      GitHub: user.GitHub,
      web: user.web
    };
    console.log('session', ctx.session);
    console.log('登录成功');
  } else {
    console.log(ctx.body);
    console.log('用户名或密码错误!');
    ctx.redirect('/onload');
  }
});

module.exports = router;
