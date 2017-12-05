const router = require('koa-router')();
const koaBody = require('koa-body');

const home = require('../controller/Login');

// 首页

router.get('/home', home.homepage);

// 首页分页按钮

router.get('/home/all', home.homeallpage);

// 导航栏点击获取

router.get('/home/tab/:tab/page/:page', home.hometabpage);

// 退出

router.get('/signout', async ctx => {
  ctx.session = null;
  ctx.redirect('/home');
});

// 设置页

router.get('/setting', home.set);

// 设置个人信息

router.post('/setting', koaBody(), home.postset);

// 更改密码

router.post('/setting/pass', koaBody(), home.setpass);

// 个人主页
router.get('/user/:name', home.userpage);

// 个人创建话题页
router.get('/user/:name/topics', home.createtopic);

// 个人参与话题页

router.get('/user/:name/replies', home.replytopic);

//积分榜页
router.get('/user/top/:top', home.usertop);

module.exports = router;
