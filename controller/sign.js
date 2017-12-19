//导入数据库模型
const User = require('../database/models/lina-user');
const Message = require('../database/models/lina-message');
const sequelize = require('../database/sequelize');
var octicons = require("octicons");

//验证登陆信息
const postonload = async ctx => {
  var uname = ctx.request.body.uname;
  var pass = ctx.request.body.upwd;
  let user = await User.findOne({
    where: {
      name: uname,
      password: pass
    }
  });
  console.log(user);
  if (!user) {
    ctx.body = {
      result: 'false'
    };
  } else if (uname === user.name && pass === user.password) {
    ctx.body = {
      result: 'true'
    };
    ctx.session = {
      name: uname,
      id: user.id,
      sign: user.sign,
      integral: user.integral,
      city: user.city,
      weibo: user.weibo,
      GitHub: user.GitHub,
      web: user.web,
      headImgURL: user.headImgURL
    };
    console.log('session', ctx.session);
    console.log('登录成功');
  } else {
    ctx.body = {
      result: 'false'
    };
    console.log(ctx.body);
    console.log('用户名或密码错误!');
  }
};

//get登陆页
const getonload = async ctx => {
  await ctx.render('./onload', {
    title:"登陆",
    session: ctx.session,
    octicons: octicons
  });
};
//验证注册信息
const postsignin = async ctx => {
  var nuser = {
    name: ctx.request.body.uname,
    pass: ctx.request.body.upwd,
    repass: ctx.request.body.reupwd
  };
  console.log(nuser);
  let user = await User.findOne({
    where: {
      name: nuser.name
    }
  });

  if (user) {
    ctx.body = {
      result: '用户存在'
    };
    console.log('用户存在');
  } else if (nuser.pass !== nuser.repass || nuser.pass == '') {
    ctx.body = {
      result: '密码不一致'
    };
    console.log('密码不一致');
  } else {
    ctx.body = {
      result: 'success'
    };
    console.log('注册成功');
    User.create({
      name: nuser.name,
      password: nuser.pass
    });
  }
};

//get注册页函数
const getsignin = async function (ctx) {
  await ctx.render('./signin', {
    title:"注册",
    session: ctx.session,
    octicons: octicons
  });
};

//退出
const signout = async ctx => {
  ctx.session = null;
  ctx.redirect('/');
};

module.exports = {
  postonload,
  getonload,
  postsignin,
  signout,
  getsignin
};