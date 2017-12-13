const userset = require('../controller/userset');
const userpage = require('../controller/userpage');
const router = require('koa-router')();
const koaBody = require('koa-body');

// 未读消息页
router.get('/my/messages', userpage.mymessage);

// 设置页
router.get('/setting', userset.set);

// 设置个人信息
router.post('/setting', koaBody(), userset.postset);

// 更改密码
router.post('/setting/pass', koaBody(), userset.setpass);

// 个人主页
router.get('/user/:name', userpage.userpage);

// 个人创建话题页
router.get('/user/:name/topics', userpage.createtopic);

// 个人参与话题页
router.get('/user/:name/replies', userpage.replytopic);

//上传个人头像
router.post('/upload', userpage.inputimage);

module.exports = router;
