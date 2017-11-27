//引入数据库的模板topic.ejs
const Topic = require('../database/models/topic');
const Reply = require('../database/models/reply');
const User = require('../database/models/user');
const router = require('koa-router')();
const koaBody = require('koa-body');
const moment = require('moment');
const sequelize = require('../database/sequelize');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
moment().format();
moment.locale('zh-cn');

// 首页
router.get('/home', async ctx => {
 var tres=await Topic.findAll();
  // 全部
  await Topic.findAndCountAll({
    where: { $or: [{ tabValue: '分享' }, { tabValue: '问答' }] },
    order: [[sequelize.literal('createdAt DESC')]]
  }).then(result => {
    (AllRow = result.rows), (AllCount = result.count);
  });

  console.log(AllRow);
  var Atime = [];

  await AllRow.forEach(function(res, index) {
    Reply.findById(res['lastid']).then(re => {
      if (re) {
        Atime[index] = moment(re.createdAt).fromNow();
      } else {
        Atime[index] = moment(res['createdAt']).fromNow();
      }
    });
  });

  //精华
  // 分享
  // 问答
  // 客户端测试

  await ctx.render('./main', {
    session: ctx.session,
    AllRows: AllRow,
    topics: tres,
    retime: Atime
  });
});

// 分页
router.post('/home/all',async ctx => {
  await Topic.findAndCountAll({
    where: { $or: [{ tabValue: '分享' }, { tabValue: '问答' }] },
    order: [[sequelize.literal('createdAt DESC')]]
  }).then(result => {
    (AllRow = result.rows), (AllCount = result.count);
  });
  ctx.body={all:AllRow,total:AllCount}
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
  var set = {
    name: ctx.request.body.name,
    Email: ctx.request.body.Email,
    weibo: ctx.request.body.weibo,
    web: ctx.request.body.web,
    city: ctx.request.body.city,
    sign: ctx.request.body.sign,
    GitHub: ctx.request.body.GitHub
  };
  var Id = ctx.session.id;
  await User.findById(Id).then(user => {
    user.update(set);
    ctx.body = 'success';
  });
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
