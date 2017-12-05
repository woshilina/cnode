const Topic = require('../database/models/topic');
const Reply = require('../database/models/reply');
const User = require('../database/models/user');
const Like = require('../database/models/like');
const Message = require('../database/models/message');
const router = require('koa-router')();
const koaBody = require('koa-body');
const moment = require('moment');
const sequelize = require('../database/sequelize');
moment().format();
moment.locale('zh-cn');

//发表文章首页

router.get('/topic/create', async ctx => {
  //查询未读消息数量
  if (ctx.session.id) {
    let news = await Message.findAndCountAll({
      where: { targetId: ctx.session.id, hasRead: 0 }
    });
    var newcount = news.count;
  }

  await ctx.render('./create', {
    session: ctx.session,
    newcount: newcount
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
  user.topics += 1;
  user.update({
    integral: user.integral,
    topics: user.topics
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

  // 从数据库查询作者创建的其他所有话题,按创建时间倒序
  var others = await Topic.findAndCountAll({
    where: {
      userid: topic.userid,
      id: { $not: Id }
    },
    order: [[sequelize.literal('createdAt DESC')]]
  });

  var othercount = others.count;
  var othertopics = others.rows;
  var someothers = [];
  if (othercount > 5) {
    for (var i = 0; i < 5; i++) {
      someothers.push(othertopics[i]);
    }
  } else {
    someothers = othertopics;
  }
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

    if (like === null) {
      like_res.push(0);
    } else {
      like_res.push(like);
    }
  }

  let msgs = await Message.findAll({
    where: { topicId: Id, targetname: ctx.session.name }
  });

  msgs.forEach(function(msg) {
    msg.update({ hasRead: true });
  });

  //查询未读消息数量
  if (ctx.session.id) {
    let news = await Message.findAndCountAll({
      where: { targetId: ctx.session.id, hasRead: 0 }
    });
    var newcount = news.count;
  }

  await ctx.render('/stopic', {
    session: ctx.session,
    newcount: newcount,
    topics: topic,
    othercount: othercount,
    ttime: [tc_time, tu_time],
    someothers: someothers,
    replys: reply_res,
    likes: like_res
  });
});

//删除单篇文章页

router.get('/topic/:id/delete', async (ctx, next) => {
  var i = ctx.params.id;
  console.log(i);
  let topic = await Topic.findById(i);

  // 删除此话题的数据
  topic.destroy({
    where: {
      id: i
    }
  });

  // 创建的话题数量减一
  var user = await User.findById(ctx.session.id);
  user.topics -= 1;
  user.update({
    topics: user.topics
  });

  ctx.body = {
    result: 'success'
  };
});

//编辑单篇文章页面

router.get('/topic/:id/edit', async (ctx, next) => {
  var Id = ctx.params.id;
  let topic = await Topic.findById(Id);

  //查询未读消息数量
  if (ctx.session.id) {
    let news = await Message.findAndCountAll({
      where: { targetId: ctx.session.id, hasRead: 0 }
    });
    var newcount = news.count;
  }

  await ctx.render('/edit', {
    session: ctx.session,
    newcount: newcount,
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

//发表对文章的回复
router.post('/topic/:id', koaBody(), async (ctx, next) => {
  console.log(ctx.request.body);
  var cont = ctx.request.body.content; //评论的内容

  let date = new Date();
  var res = {
    name: ctx.session.name,
    userId: ctx.session.id,
    content: cont,
    topicId: ctx.params.id,
    replytime: date
  };
  await Reply.create(res);
  let reply = await Reply.findOne({ where: res }); //新评论

  let topic = await Topic.findById(res.topicId); //被回复的话题
  var re = topic.replies + 1;

  //更新被回复话题的回复数和最后回复时间
  await topic.update({
    replies: re,
    lastreplytime: date
  });

  // 更新用户的回复数
  let user = await User.findById(ctx.session.id);
  user.replies++;
  await user.update({ replies: user.replies });

  // 评论他人的文章message模型创建数据
  if (ctx.session.id != topic.userid) {
    var msg = {
      targetId: topic.userid,
      targetname: topic.username,
      topicId: ctx.params.id,
      title: topic.title,
      replyId: reply.id,
      replierId: ctx.session.id,
      replyname: ctx.session.name,
      isat: 0,
      content: cont
    };
    await Message.create(msg);
  }

  ctx.body = {
    result: 'success'
  };
});

//发表对评论的回复
router.post('/topic/:id/reply', koaBody(), async (ctx, next) => {
  console.log(ctx.request.body);
  var cont = ctx.request.body.content; //评论的内容
  var replyId = ctx.request.body.replyId; //被回复的评论的id
  let date = new Date();
  var res = {
    name: ctx.session.name,
    userId: ctx.session.id,
    content: cont,
    topicId: ctx.params.id,
    replytime: date
  };
  await Reply.create(res);
  var reply = await Reply.findOne({ where: res }); //新评论
  var targetreply = await Reply.findById(replyId); //被回复的评论
  console.log(targetreply.userId);

  // 更新话题评论数及最后评论时间
  let topic = await Topic.findById(res.topicId);
  var re = topic.replies + 1;
  await topic.update({
    replies: re,
    lastreplytime: date
  });

  // 更新用户的回复数
  let user = await User.findById(ctx.session.id);
  user.replies++;
  await user.update({ replies: user.replies });

  // 评论他人的回复时创建数据
  if (ctx.session.id != targetreply.userId) {
    var msg = {
      targetId: targetreply.userId,
      targetname: targetreply.name,
      topicId: ctx.params.id,
      title: topic.title,
      replyId: reply.id,
      replierId: ctx.session.id,
      replyname: ctx.session.name,
      isat: 1,
      content: cont
    };
    await Message.create(msg);
  }

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

  // 更新用户的回复数
  let user = await User.findById(ctx.session.id);
  user.replies--;
  await user.update({ replies: user.replies });

  await Like.destroy({
    where: {
      replyId: id
    }
  });
});

module.exports = router;
