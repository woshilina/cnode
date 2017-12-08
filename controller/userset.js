//引入数据库的模板
const Topic = require('../database/models/lina-topic');
const Reply = require('../database/models/lina-reply');
const User = require('../database/models/lina-user');
const Message = require('../database/models/lina-message');
const moment = require('moment');
const sequelize = require('../database/sequelize');
moment().format();
moment.locale('zh-cn');

// get设置页函数
const set = async ctx => {

  //从数据库获取用户信息
let user=await User.findById(ctx.session.id);

  //查询未读消息数量

  let news = await Message.findAndCountAll({
    where: { targetId: ctx.session.id, hasRead: 0 }
  });
  var newcount = news.count;

  await ctx.render('/set', {
    newcount: newcount,
    session: ctx.session,
    user:user
  });
};

//post设置个人信息函数
const postset = async ctx => {
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

  // 更新session

  ctx.session = {
    id: Id,
    name: user.name,
    Email: user.Email,
    weibo: user.weibo,
    web: user.web,
    city: user.city,
    sign: user.sign,
    GitHub: user.GitHub
  };

  console.log(ctx.session);

  ctx.body = {
    sign: set.sign
  };
};

// 更改密码
const setpass = async ctx => {
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
};

module.exports = { set, postset, setpass };
