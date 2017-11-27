const router = require('koa-router')();
const User = require('../database/models/user');
const koaBody = require('koa-body');

router.get('/signin', async function(ctx) {
  await ctx.render('./signin');
});

router.post('/signin', koaBody(), async ctx => {
  var nuser = {
    name: ctx.request.body.uname,
    pass: ctx.request.body.upwd,
    repass: ctx.request.body.reupwd
  };
  console.log(nuser);
  await User.findOne({ where: { name: nuser.name } }).then(user => {
    console.log(user);
    if (user) {
      ctx.body = { result: '用户存在' };
      console.log('用户存在');
    } else if (nuser.pass !== nuser.repass || nuser.pass == '') {
      ctx.body = { result: '密码不一致' };
      console.log('密码不一致');
    } else {
      ctx.body = { result: 'success' };
      console.log('注册成功');
      User.create({ name: nuser.name, password: nuser.pass });
    }
  });
});

module.exports = router;
