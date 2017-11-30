//引入数据库的模板topic.ejs

const Topic = require('../database/models/topic');
const Reply = require('../database/models/reply');
const User = require('../database/models/user');
const router = require('koa-router')();
const koaBody = require('koa-body');
const moment = require('moment');
const sequelize = require('../database/sequelize');
moment().format();
moment.locale('zh-cn');

// 首页

router.get('/home', async ctx => {
  var tres = await Topic.findAll();
  // 全部

  var result = await Topic.findAndCountAll({
    where: { $or: [{ tabValue: '分享' }, { tabValue: '问答' }] },
    order: [[sequelize.literal('lastreplytime DESC')]]
  });

  var AllRow = result.rows;
  var AllCount = result.count;

  var Atime = [];
  await ctx.render('/main', {
    session: ctx.session,
    topics: AllRow,
    retime: Atime
  });
});

// 导航栏点击获取

router.get('/home/tab/:tab', async ctx => {
  var AllCount;
  var AllRow;
  if (ctx.params.tab == 'all') {
    let result = await Topic.findAndCountAll({
      where: { $or: [{ tabValue: '分享' }, { tabValue: '问答' }] },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRow = result.rows;
    AllCount = result.count;
  } else if (ctx.params.tab == 'essence') {
    let result = await Topic.findAndCountAll({
      where: { clicks: { $gte: 50 } },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRow = result.rows;
    AllCount = result.count;
  } else if (ctx.params.tab == 'share') {
    let result = await Topic.findAndCountAll({
      where: { tabValue: '分享' },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRow = result.rows;
    AllCount = result.count;
  } else if (ctx.params.tab == 'ask') {
    let result = await Topic.findAndCountAll({
      where: { tabValue: '问答' },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRow = result.rows;
    AllCount = result.count;
  } else if (ctx.params.tab == 'job') {
    let result = await Topic.findAndCountAll({
      where: { tabValue: '招聘' },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRow = result.rows;
    AllCount = result.count;
  } else if (ctx.params.tab == 'dev') {
    let result = await Topic.findAndCountAll({
      where: { tabValue: '客户端测试' },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRow = result.rows;
    AllCount = result.count;
  }
  ctx.body = { total: AllCount, topics: AllRow };
});

// 退出

router.get('/signout', async ctx => {
  ctx.session = null;
  ctx.body = { result: 'true' };
});

// 设置页

router.get('/setting', async ctx => {
  await ctx.render('/set', {
    session: ctx.session
  });
});

// 设置个人信息

router.post('/setting', koaBody(), async ctx => {
  console.log(ctx.request.body);
  var set = {
    name: ctx.request.body.name,
    Email: ctx.request.body.Email,
    weibo: ctx.request.body.weibo,
    web: ctx.request.body.web,
    city: ctx.request.body.city,
    sign: ctx.request.body.sign,
    GitHub: ctx.request.body.GitHub
  };
  console.log(set);
  var Id = ctx.session.id;
  var user = await User.findById(Id);
  await user.update(set);
  ctx.session = user;
  ctx.body = { sign: set.sign };
});

// 更改密码

router.post('/setting/pass', koaBody(), async ctx => {
  var pass = {
    oldpass: ctx.request.body.oldpass,
    newpass: ctx.request.body.newpass
  };
  var Id = ctx.session.id;
  await User.findById(Id).then(user => {
    console.log(user.password);
    if (user.password === pass.oldpass) {
      user.update({
        password: pass.newpass
      });
      ctx.body = {
        result: 'right'
      };
      console.log(ctx.body);
    } else if (user.password != pass.oldpass) {
      ctx.body = {
        result: 'error'
      };
      console.log(ctx.body);
    }
  });
});

module.exports = router;
