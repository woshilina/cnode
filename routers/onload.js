//导入数据库模型user.js

const User = require('../database/models/user');
const router = require('koa-router')();
const Message = require('../database/models/message');
const koaBody = require('koa-body');
const sequelize = require('../database/sequelize');

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

// 未读消息页
router.get('/my/messages', async ctx => {
  var userid = ctx.session.id;

  //新消息按时间倒序
  let news = await Message.findAndCountAll({
    where: { targetId: userid, hasRead: 0 },
    order: [[sequelize.literal('createdAt DESC')]]
  });
  var newmsgs = news.rows;
  var newcount = news.count;
  //过往消息按时间倒序
  let olds = await Message.findAndCountAll({
    where: { targetId: userid, hasRead: 1 },
    order: [[sequelize.literal('createdAt DESC')]]
  });
  var oldmsgs = olds.rows;
  var oldcount = olds.count;
  await ctx.render('./message', {
    session: ctx.session,
    newmsgs: newmsgs,
    newcount: newcount,
    oldcount: oldcount,
    oldmsgs: oldmsgs
  });
});

module.exports = router;
