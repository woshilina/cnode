const userset = require('../controller/userset');
const pages = require('../controller/pages');
const router = require('koa-router')();
const koaBody = require('koa-body');

// 未读消息页
router.get('/my/messages', pages.mymessage);

// 设置页
router.get('/setting', userset.set);

// 设置个人信息
router.post('/setting', koaBody(), userset.postset);

// 更改密码
router.post('/setting/pass', koaBody(), userset.setpass);

// 个人主页
router.get('/user/:name', pages.userpage);

// 个人创建话题页
router.get('/user/:name/topics', pages.createtopic);

// 个人参与话题页
router.get('/user/:name/replies', pages.replytopic);

//上传个人头像
router.post('/upload', koaBody({
  multipart: true,
  formLimit: 15,
  formidable: {
    // uploadDir: __dirname + '/public/upload',
    uploadDir: 'public/upload',
    keepExtensions: true
  }
}), pages.inputimage);

module.exports = router;