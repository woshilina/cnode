const router = require('koa-router')();
const koaBody = require('koa-body');
var cool = require('cool-ascii-faces');

const main = require('../controller/main');

// 首页
router.get('/', main.homepage);

// 首页分页按钮
router.get('/all', main.homeallpage);

// 导航栏点击获取
router.get('/tab/:tab/page/:page', main.hometabpage);

//积分榜页
router.get('/user/top/:top', main.usertop);

router.get('/cool', function(request, response) {
  response.send(cool());
});

module.exports = router;
