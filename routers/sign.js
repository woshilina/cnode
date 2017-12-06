const sign = require('../controller/sign');
const router = require('koa-router')();
const koaBody = require('koa-body');

//注册页
router.get('/signin', sign.getsignin);

//提交注册信息  验证注册信息
router.post('/signin', koaBody(), sign.postsignin);

//登陆界面
router.get('/onload', sign.getonload);

//提交用户名和密码  验证登陆信息
router.post('/onload', koaBody(), sign.postonload);

// 退出
router.get('/signout', sign.signout);

module.exports = router;
