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
  var q = {
    tabValue: ctx.request.body.tabValue,
    title: ctx.request.body.title,
    text: ctx.request.body.text,
    userid: ctx.session.id,
    username: ctx.session.name
  };
  await User.findById(ctx.session.id).then(user => {
    user.integral += 5;
    user.update({ integral: user.integral });
  });
  await Topic.create(q);

  await Topic.max('id').then(max => {
    ctx.body = max;
  });
});

//单篇文章页
router.get('/topic/:id', async (ctx, next) => {
  var Id = ctx.params.id;
  await Topic.findById(Id).then(topic => {
    res = topic;
    tc_time = moment(topic.createdAt).fromNow();
    tu_time = moment(topic.updatedAt).fromNow();
    res_clicks = topic.clicks;
    res_clicks++;
    topic.update({
      clicks: res_clicks
    });
  });

  await Topic.findAll({
    where: {
      userid: res.userid
    }
  }).then(topic => {
    top = topic;
  });

  await Reply.findAll({
    where: {
      topicId: Id
    }
  }).then(reply => {
    if (reply) {
      reply_res = reply;
      like_res = [];
      rtime = []; //回复时间数组
      reply_res.forEach(function(res, index) {
        var res_id = res['id'];
        rtime[index] = moment(res.createdAt).fromNow();
        Like.findOne({
          where: { nameId: ctx.session.id, replyId: res_id }
        }).then(like => {
          if (like == null) {
            like_res[index] = 0;
          } else {
            like_res[index] = like;
          }
        });
      });
    } else if (reply == null) {
      reply_res = 0;
    }
  });

  await ctx.render('/stopic', {
    session: ctx.session,
    topics: res,
    ttime: [tc_time, tu_time],
    stopics: top,
    replys: reply_res,
    rtime: rtime,
    likes: like_res
  });
});

//删除单篇文章页
router.get('/topic/:id/delete', async (ctx, next) => {
  var i = ctx.params.id;
  console.log(i);
  await Topic.findById(i).then(topic => {
    topic.destroy({
      where: {
        id: i
      }
    });
    ctx.body = {
      result: 'success'
    };
  });
});

//编辑单篇文章页面
router.get('/topic/:id/edit', async (ctx, next) => {
  var Id = ctx.params.id;
  await Topic.findById(Id).then(topic => {
    res = topic;
  });
  await ctx.render('/edit', {
    session: ctx.session,
    topics: res
  });
});

//编辑单篇文章
router.post('/topic/:id/edit', koaBody(), async ctx => {
  var Id = ctx.params.id;
  var q = {
    tabValue: ctx.request.body.tabValue,
    title: ctx.request.body.title,
    text: ctx.request.body.text
  };
  await Topic.findById(Id).then(topic => {
    topic.update(q);
    ctx.body = Id;
  });
});

//发表回复
router.post('/topic/:id', koaBody(), async (ctx, next) => {
  console.log(ctx.request.body);
  var cont = ctx.request.body.content;
  var re = {
    name: ctx.session.name,
    content: cont,
    topicId: ctx.params.id
  };
  await Reply.create(re);
  await Reply.findAll().then(rep => {
    lastid = rep[rep.length - 1].id;
  });

  await Topic.findById(re.topicId).then(topic => {
    var re = topic.replies + 1;
    topic.update({
      replies: re,
      lastId: lastid
    });
    ctx.body = {
      result: 'success'
    };
  });
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
    where: { replyId: Id, nameId: ctx.session.id }
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
  await Reply.findById(id).then(reply => {
    reply.update({ content: text });
    ctx.body = reply.topicId;
  });
});

// 删除评论
router.get('/reply/:id/delete', koaBody(), async ctx => {
  var id = ctx.params.id;
  console.log(ctx.params);
  await Reply.findById(id).then(reply => {
    reply.destroy();
    ctx.body = reply.topicId;
  });
  await Like.destroy({ where: { replyId: id } });
});
module.exports = router;
