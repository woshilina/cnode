const router = require('koa-router')();
const koaBody = require('koa-body');
const topic = require('../controller/topic');

//发表文章首页
router.get('/topic/creation', topic.createtopic);

//发表文章
router.post('/topic/creation', koaBody(), topic.postcreate);

//单篇文章页
router.get('/topic/:id', topic.singletopic);

//删除单篇文章页
router.get('/topic/:id/deletion', topic.deletetopic);

//编辑单篇文章页面
router.get('/topic/:id/edit', topic.getedit);

//编辑单篇文章
router.post('/topic/:id/edit', koaBody(), topic.postedit);

//发表对文章的回复
router.post('/topic/:id', koaBody(), topic.replytopic);

//发表对评论的回复
router.post('/topic/:id/reply', koaBody(), topic.repler);

//点赞
router.post('/topic/:id/like', koaBody(), topic.like);

//取消赞
router.post('/topic/:id/unlike', koaBody(), topic.unlike);

// 编辑回复页面
router.get('/reply/:id/edit', koaBody(), topic.editreply);

// 编辑回复提交
router.post('/reply/:id/edit', koaBody(), topic.postreply);

// 删除评论
router.get('/reply/:id/deletion', koaBody(), topic.deletereply);

module.exports = router;
