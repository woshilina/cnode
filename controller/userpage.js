//引入数据库的模板
const Topic = require('../database/models/topic');
const Reply = require('../database/models/reply');
const User = require('../database/models/user');
const Message = require('../database/models/message');
const moment = require('moment');
const sequelize = require('../database/sequelize');
moment().format();
moment.locale('zh-cn');

//个人主页
const userpage = async ctx => {
  var username = ctx.params.name;

  // 从数据库获取用户信息
  let user = await User.findOne({ where: { name: username } });
  var signtime = user.createdAt;

  // 更新用户注册时间
  await user.update({ signfromnow: moment(signtime).fromNow() });

  // 从数据库获取用户创建的话题 并按创建时间排序(时间倒序)
  let result = await Topic.findAndCountAll({
    where: { username: username },
    order: [[sequelize.literal('createdAt DESC')]]
  });
  var count = result.count; //用户创建的话题数量
  var topics = result.rows;

  var pretopics = [];
  if (count > 5) {
    for (var i = 0; i < 5; i++) {
      pretopics.push(topics[i]);
    }
  } else {
    for (var i = 0; i < count; i++) {
      pretopics.push(topics[i]);
    }
  }

  // 更新最后回复时间
  for (var i of topics) {
    var time = i.lastreplytime;
    await i.update({
      lastreplyfromnow: moment(time).fromNow()
    });
  }

  // 从数据库获得用户的评论,按时间倒序
  let reply = await Reply.findAll({
    where: { name: username },
    order: [[sequelize.literal('createdAt DESC')]]
  });

  // 根据用户评论获取相关话题
  var parttopics = [];
  for (var i of reply) {
    var t = await Topic.findOne({ where: { id: i.topicId } });
    parttopics.push(t);
  }

  // 数组去重
  var hash = {};
  parttopics = parttopics.reduce(function(item, next) {
    hash[next.id] ? '' : (hash[next.id] = true && item.push(next));
    return item;
  }, []);

  console.log(parttopics);
  var partcount = parttopics.length;

  var preparttopics = [];

  if (partcount > 5) {
    for (var i = 0; i < 5; i++) {
      preparttopics.push(parttopics[i]);
    }
  } else {
    for (var i = 0; i < partcount; i++) {
      preparttopics.push(parttopics[i]);
    }
  }
  console.log(preparttopics);

  //查询未读消息数量
  if (ctx.session.id) {
    let news = await Message.findAndCountAll({
      where: { targetId: ctx.session.id, hasRead: 0 }
    });
    var newcount = news.count;
  }

  await ctx.render('/spage', {
    session: ctx.session,
    user: user,
    newcount: newcount,
    pretopics: pretopics,
    topics: topics,
    count: count,
    partcount: partcount,
    preparttopics: preparttopics,
    parttopics: parttopics
  });
};

// 个人创建话题页函数
const createtopic = async ctx => {
  var username = ctx.params.name;
  let user = await User.findOne({ where: { name: username } });
  // 从数据库获取用户创建的话题 并按创建时间排序(时间倒序)
  let result = await Topic.findAndCountAll({
    where: { username: username },
    order: [[sequelize.literal('createdAt DESC')]]
  });
  var count = result.count;
  var topics = result.rows;

  // 更新最后回复时间
  for (var i of topics) {
    var time = i.lastreplytime;
    await i.update({
      lastreplyfromnow: moment(time).fromNow()
    });
  }

  //查询未读消息数量
  if (ctx.session.id) {
    let news = await Message.findAndCountAll({
      where: { targetId: ctx.session.id, hasRead: 0 }
    });
    var newcount = news.count;
  }

  await ctx.render('/spagetopics', {
    session: ctx.session,
    newcount: newcount,
    user: user,
    topics: topics
  });
};

// 个人参与话题页函数
const replytopic = async ctx => {
  var username = ctx.params.name;
  let user = await User.findOne({ where: { name: username } });
  // 从数据库获得用户的评论,按时间倒序
  let reply = await Reply.findAll({
    where: { name: username },
    order: [[sequelize.literal('createdAt DESC')]]
  });

  // 根据用户评论获取相关话题
  var parttopics = [];
  for (var i of reply) {
    var t = await Topic.findOne({ where: { id: i.topicId } });
    parttopics.push(t);
  }
  // 数组去重
  var hash = {};
  parttopics = parttopics.reduce(function(item, next) {
    hash[next.id] ? '' : (hash[next.id] = true && item.push(next));
    return item;
  }, []);

  // 更新最后回复时间
  for (var i of parttopics) {
    var time = i.lastreplytime;
    await i.update({
      lastreplyfromnow: moment(time).fromNow()
    });
  }

  //查询未读消息数量
  if (ctx.session.id) {
    let news = await Message.findAndCountAll({
      where: { targetId: ctx.session.id, hasRead: 0 }
    });
    var newcount = news.count;
  }

  await ctx.render('/spagereplies', {
    session: ctx.session,
    user: user,
    newcount: newcount,
    parttopics: parttopics
  });
};

module.exports={userpage,createtopic,replytopic}