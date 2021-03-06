//引入数据库的模板
const Topic = require('../database/models/lina-topic');
const Reply = require('../database/models/lina-reply');
const User = require('../database/models/lina-user');
const Message = require('../database/models/lina-message');
const moment = require('moment');
const sequelize = require('../database/sequelize');
var fs = require('fs');
const uptoqiniu = require('./uptoqiniu')
moment().format();
moment.locale('zh-cn');

//个人主页
const userpage = async ctx => {
  var username = ctx.params.name;

  // 从数据库获取用户信息
  let user = await User.findOne({
    where: {
      name: username
    }
  });
  var signtime = user.createdAt;

  // 更新用户注册时间
  await user.update({
    signfromnow: moment(signtime).fromNow()
  });

  // 从数据库获取用户创建的话题 并按创建时间排序(时间倒序)
  let result = await Topic.findAndCountAll({
    where: {
      username: username
    },
    order: [
      [sequelize.literal('createdAt DESC')]
    ]
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
    where: {
      name: username
    },
    order: [
      [sequelize.literal('createdAt DESC')]
    ]
  });

  // 根据用户评论获取相关话题
  var parttopics = [];
  for (var i of reply) {
    var t = await Topic.findOne({
      where: {
        id: i.topicId
      }
    });
    parttopics.push(t);
  }

  // 数组去重
  var hash = {};
  parttopics = parttopics.reduce(function (item, next) {
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
      where: {
        targetId: ctx.session.id,
        hasRead: 0
      }
    });
    var newcount = news.count;
  }

  await ctx.render('/spage', {
    title: "@" + username + "的个人主页",
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
  let user = await User.findOne({
    where: {
      name: username
    }
  });
  // 从数据库获取用户创建的话题 并按创建时间排序(时间倒序)
  let result = await Topic.findAndCountAll({
    where: {
      username: username
    },
    order: [
      [sequelize.literal('createdAt DESC')]
    ]
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
      where: {
        targetId: ctx.session.id,
        hasRead: 0
      }
    });
    var newcount = news.count;
  }

  await ctx.render('/spagetopics', {
    title: ctx.session.name+"创建的话题",
    session: ctx.session,
    newcount: newcount,
    user: user,
    topics: topics
  });
};

// 个人参与话题页函数
const replytopic = async ctx => {
  var username = ctx.params.name;
  let user = await User.findOne({
    where: {
      name: username
    }
  });
  // 从数据库获得用户的评论,按时间倒序
  let reply = await Reply.findAll({
    where: {
      name: username
    },
    order: [
      [sequelize.literal('createdAt DESC')]
    ]
  });

  // 根据用户评论获取相关话题
  var parttopics = [];
  for (var i of reply) {
    var t = await Topic.findOne({
      where: {
        id: i.topicId
      }
    });
    parttopics.push(t);
  }
  // 数组去重
  var hash = {};
  parttopics = parttopics.reduce(function (item, next) {
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
      where: {
        targetId: ctx.session.id,
        hasRead: 0
      }
    });
    var newcount = news.count;
  }

  await ctx.render('/spagereplies', {
    title: ctx.session.name + "参与的话题",
    session: ctx.session,
    user: user,
    newcount: newcount,
    parttopics: parttopics
  });
};

//未读消息页函数
const mymessage = async ctx => {
  var userid = ctx.session.id;

  // 从数据库查询用户信息
  let user = await User.findById(ctx.session.id);

  //新消息按时间倒序
  let news = await Message.findAndCountAll({
    where: {
      targetId: userid,
      hasRead: 0
    },
    order: [
      [sequelize.literal('createdAt DESC')]
    ]
  });
  var newmsgs = news.rows;
  var newcount = news.count;

  //过往消息按时间倒序
  let olds = await Message.findAndCountAll({
    where: {
      targetId: userid,
      hasRead: 1
    },
    order: [
      [sequelize.literal('createdAt DESC')]
    ]
  });
  var oldmsgs = olds.rows;
  var oldcount = olds.count;

  await ctx.render('./message', {
    title:ctx.session.name+"的未读消息",
    session: ctx.session,
    user: user,
    newmsgs: newmsgs,
    newcount: newcount,
    oldcount: oldcount,
    oldmsgs: oldmsgs
  });
};

// 上传个人头像
const inputimage = async(ctx) => {
  console.log(ctx.request.body);
  var file = ctx.request.body.files.files;//获取上传的图片文件
  console.log(file.path);
  console.log(file.name);

  var displayUrl = file.path;//获取上传的图片文件本地路径
  let message = {};
  message.result = false;
  try {
    let upresult = await uptoqiniu.upload(displayUrl);//将文件上传到七牛云
    fs.unlink(displayUrl, (err) => {
      if (err) {
        console.error(err);
      }
    });//将存到本地的图片文件删除
    console.log(upresult);
    var qiniuUrl = "http://p0zgrt85b.bkt.clouddn.com/" + upresult.key;//图片文件在七牛云的链接
    message.imageUrl = qiniuUrl;
    message.result = true;
    var username = ctx.session.name;
    var user = await User.findOne({
      where: {
        name: username
      }
    });
    user.update({
      headImgURL: qiniuUrl
    });//更新用户的头像链接
    var topics = await Topic.findAll({
      where: {
        username: username
      }
    });
    console.log(topics);
    if (topics != []) {
      topics.forEach(function (t) {
        t.update({
          headImgURL: qiniuUrl
        });
      })
    };//更新用户创建话题的头像链接

    var replies = await Reply.findAll({
      where: {
        name: username
      }
    });
    if (replies != []) {
      replies.forEach(function (r) {
        r.update({
          headImgURL: qiniuUrl
        });
      })
    }//更新用户回复的头像链接

    ctx.session.headImgURL = qiniuUrl;//更新session

  } catch (error) {
    console.log(error);
    message.result = false;
  }
  ctx.body = message;
  console.log(ctx.body)
};
module.exports = {
  userpage,
  createtopic,
  replytopic,
  mymessage,
  inputimage
};