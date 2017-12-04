const Topic = require('../database/models/topic');
const Reply = require('../database/models/reply');
const User = require('../database/models/user');
const Like = require('../database/models/like');
const router = require('koa-router')();
const koaBody = require('koa-body');
const moment = require('moment');

moment().format();
moment.locale('zh-cn');

//发表文章首页

router.get('/topic/create', async ctx => {
  await ctx.render('./create', {
    session: ctx.session
  });
});

//发表文章

router.post('/topic/create', koaBody(), async ctx => {
  let date = new Date();
  var q = {
    tabValue: ctx.request.body.tabValue,
    title: ctx.request.body.title,
    text: ctx.request.body.text,
    userid: ctx.session.id,
    username: ctx.session.name,
    lastreplytime: date
  };
  let user = await User.findById(ctx.session.id);
  user.integral += 5;
  user.update({
    integral: user.integral
  });
  ctx.session.integral = user.integral;
  await Topic.create(q);
  let max = await Topic.max('id');
  ctx.body = max;
});

//单篇文章页
router.get('/topic/:id', async (ctx, next) => {
  var Id = ctx.params.id;
  //从数据库查询到当前话题
  var topic = await Topic.findById(Id);
  var tc_time = moment(topic.createdAt).fromNow(); //话题创建时间
  var tu_time = moment(topic.updatedAt).fromNow(); //话题更新时间
  var res_clicks = topic.clicks;
  res_clicks++; //话题浏览数+1
  await topic.update({
    clicks: res_clicks
  });

  // 从数据库查询作者创建的的所有话题
  var alltopics = await Topic.findAll({
    where: {
      userid: topic.userid
    }
  });

  // 从数据库查询到当前话题所有的评论
  var replies = await Reply.findAll({
    where: {
      topicId: Id
    }
  });

  // 更新回复距现在的时间
  for (var i of replies) {
    var time = i.replytime;
    await i.update({
      replyfromnow: moment(time).fromNow()
    });
  }

  var reply_res = replies;
  var like_res = [];
  for (var i of reply_res) {
    var res_id = i['id'];
    let like = await Like.findOne({
      where: {
        nameId: ctx.session.id,
        replyId: res_id
      }
    });
    like_res.push(like);
  }

  await ctx.render('/stopic', {
    session: ctx.session,
    topics: topic,
    ttime: [tc_time, tu_time],
    stopics: alltopics,
    replys: reply_res,
    likes: like_res
  });
});

//删除单篇文章页

router.get('/topic/:id/delete', async (ctx, next) => {
  var i = ctx.params.id;
  console.log(i);
  let topic = await Topic.findById(i);

  topic.destroy({
    where: {
      id: i
    }
  });
  ctx.body = {
    result: 'success'
  };
});

//编辑单篇文章页面

router.get('/topic/:id/edit', async (ctx, next) => {
  var Id = ctx.params.id;
  let topic = await Topic.findById(Id);

  await ctx.render('/edit', {
    session: ctx.session,
    topics: topic
  });
});

//编辑单篇文章

router.post('/topic/:id/edit', koaBody(), async ctx => {
  var Id = ctx.params.id;
  let date = new Date();
  var q = {
    tabValue: ctx.request.body.tabValue,
    title: ctx.request.body.title,
    text: ctx.request.body.text,
    lastreplytime: date
  };
  let topic = await Topic.findById(Id);
  topic.update(q);
  ctx.body = Id;
});

//发表回复
router.post('/topic/:id', koaBody(), async (ctx, next) => {
  console.log(ctx.request.body);
  var cont = ctx.request.body.content;
  let date = new Date();
  var res = {
    name: ctx.session.name,
    content: cont,
    topicId: ctx.params.id,
    replytime: date
  };
  await Reply.create(res);

  let topic = await Topic.findById(res.topicId);

  var re = topic.replies + 1;

  await topic.update({
    replies: re,
    lastreplytime: date
  });
  ctx.body = {
    result: 'success'
  };
});

//点赞

router.post('/topic/:id/like', koaBody(), async ctx => {
  var id = ctx.params.id;
  var Id = ctx.request.body.att;
  var li = {
    replyId: Id,
    nameId: ctx.session.id
  };
  await Like.create(li);
  let reply = await Reply.findById(Id);

  reply.likes++;
  reply.update({
    likes: reply.likes
  });
  ctx.body = {
    result: id
  };
});

//取消赞

router.post('/topic/:id/unlike', koaBody(), async ctx => {
  var id = ctx.params.id;
  var Id = ctx.request.body.att;

  let like = await Like.findOne({
    where: {
      replyId: Id,
      nameId: ctx.session.id
    }
  });

  like.destroy();
  let reply = await Reply.findById(Id);
  reply.likes--;
  reply.update({
    likes: reply.likes
  });
  ctx.body = {
    result: id
  };
});

// 编辑回复页面

router.get('/reply/:id/edit', koaBody(), async ctx => {
  var Id = ctx.params.id;
  let reply = await Reply.findById(Id);

  await ctx.render('/replyedit', {
    session: ctx.session,
    replies: reply
  });
});

// 编辑回复提交

router.post('/reply/:id/edit', koaBody(), async ctx => {
  var id = ctx.params.id;
  var text = ctx.request.body.text;
  let reply = await Reply.findById(id);
  reply.update({
    content: text
  });
  let topic = await Topic.findById(id);
  let date = new Date();
  topic.update({
    lastreplytime: date
  });
  ctx.body = reply.topicId;
});

// 删除评论

router.get('/reply/:id/delete', koaBody(), async ctx => {
  var id = ctx.params.id;
  console.log(ctx.params);
  let reply = await Reply.findById(id);
  reply.destroy();
  ctx.body = reply.topicId;
  await Like.destroy({
    where: {
      replyId: id
    }
  });
});

module.exports = router;
