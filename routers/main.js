//引入数据库的模板topic.ejs

const Topic = require('../database/models/topic');
const Reply = require('../database/models/reply');
const User = require('../database/models/user');
const Message = require('../database/models/message');
const router = require('koa-router')();
const koaBody = require('koa-body');
const moment = require('moment');
const sequelize = require('../database/sequelize');
moment().format();
moment.locale('zh-cn');

// 首页

router.get('/home', async ctx => {
  var tres = await Topic.findAll();
  // 全部
  for (var i of tres) {
    var time = i.lastreplytime;
    await i.update({
      lastreplyfromnow: moment(time).fromNow()
    });
  }
  var result = await Topic.findAndCountAll({
    where: {
      $or: [
        {
          tabValue: '分享'
        },
        {
          tabValue: '问答'
        }
      ]
    },
    order: [[sequelize.literal('lastreplytime DESC')]]
  });

  //查询未读消息数量
  if (ctx.session.id) {
    let news = await Message.findAndCountAll({
      where: { targetId: ctx.session.id, hasRead: 0 }
    });
    var newcount = news.count;
  }

  // 积分榜
  var users = await User.findAndCountAll({
    order: [[sequelize.literal('integral DESC')]]
  });
  var rows = users.rows;
  var usercount = users.count;
  var tops = [];
  if (usercount > 10) {
    for (var i = 0; i < 10; i++) {
      tops.push(rows[i]);
    }
  } else {
    tops = rows;
  }

  var AllRows = result.rows;
  var AllCount = result.count;
  var AllRow = page(1, AllCount, AllRows);

  await ctx.render('/main', {
    newcount: newcount,
    session: ctx.session,
    tops: tops,
    usercount: usercount,
    topics: AllRow
  });
});

// 每页话题获取函数

function page(page, AllCount, AllRows) {
  var one = 20; //设置每页最多多少条数据
  var AllRow = [];
  if (AllCount >= one * page) {
    for (var j = (page - 1) * one; j < one * page; j++) {
      AllRow.push(AllRows[j]);
    }
  } else {
    for (var j = (page - 1) * one; j < AllCount; j++) {
      AllRow.push(AllRows[j]);
    }
  }
  return AllRow;
}

// 首页分页按钮

router.get('/home/all', async ctx => {
  var tres = await Topic.findAll();
  var one = 20; //设置每页最多多少条数据
  // 全部
  for (var i of tres) {
    var time = i.lastreplytime;
    await i.update({
      lastreplyfromnow: moment(time).fromNow()
    });
  }
  var result = await Topic.findAndCountAll({
    where: {
      $or: [
        {
          tabValue: '分享'
        },
        {
          tabValue: '问答'
        }
      ]
    },
    order: [[sequelize.literal('lastreplytime DESC')]]
  });
  var AllRow = result.rows;
  var AllCount = result.count;
  var totalpage =
    AllCount % one == 0 ? AllCount / one : Math.ceil(AllCount / one);
  ctx.body = {
    total: totalpage
  };
});

// 导航栏点击获取

router.get('/home/tab/:tab/page/:page', async ctx => {
  var tres = await Topic.findAll();
  var p = ctx.params.page;
  var AllCount;
  var AllRows;
  var AllRow = [];
  var one = 20; //设置每页最多多少条数据
  // 更新最后回复时间距现在多久

  for (var i of tres) {
    var time = i.lastreplytime;
    await i.update({
      lastreplyfromnow: moment(time).fromNow()
    });
  }

  // 点击全部时的显示

  if (ctx.params.tab == 'all') {
    let result = await Topic.findAndCountAll({
      where: {
        $or: [
          {
            tabValue: '分享'
          },
          {
            tabValue: '问答'
          }
        ]
      },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRows = result.rows;
    AllCount = result.count;
    AllRow = page(p, AllCount, AllRows);
  } else if (ctx.params.tab == 'essence') {
    // 点击精华时的显示

    let result = await Topic.findAndCountAll({
      where: {
        clicks: {
          $gte: 50
        }
      },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRows = result.rows;
    AllCount = result.count;
    AllRow = page(p, AllCount, AllRows);
  } else if (ctx.params.tab == 'share') {
    // 点击分享时的显示

    let result = await Topic.findAndCountAll({
      where: {
        tabValue: '分享'
      },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRows = result.rows;
    AllCount = result.count;
    AllRow = page(p, AllCount, AllRows);
  } else if (ctx.params.tab == 'ask') {
    // 点击问答时的显示

    let result = await Topic.findAndCountAll({
      where: {
        tabValue: '问答'
      },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRows = result.rows;
    AllCount = result.count;
    AllRow = page(p, AllCount, AllRows);
  } else if (ctx.params.tab == 'job') {
    // 点击招聘时的显示

    let result = await Topic.findAndCountAll({
      where: {
        tabValue: '招聘'
      },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRows = result.rows;
    AllCount = result.count;
    AllRow = page(p, AllCount, AllRows);
  } else if (ctx.params.tab == 'dev') {
    // 点击客户端测试时的显示

    let result = await Topic.findAndCountAll({
      where: {
        tabValue: '客户端测试'
      },
      order: [[sequelize.literal('lastreplytime DESC')]]
    });
    AllRows = result.rows;
    AllCount = result.count;
    AllRow = page(p, AllCount, AllRows);
  }
  var totalpage =
    AllCount % one == 0 ? AllCount / one : Math.ceil(AllCount / one);
  ctx.body = {
    total: totalpage,
    topics: AllRow
  };
});

// 退出

router.get('/signout', async ctx => {
  ctx.session = null;
  ctx.redirect('/home');
});

// 设置页

router.get('/setting', async ctx => {
  //查询未读消息数量
  if (ctx.session.id) {
    let news = await Message.findAndCountAll({
      where: { targetId: ctx.session.id, hasRead: 0 }
    });
    var newcount = news.count;
  }
  await ctx.render('/set', {
    newcount: newcount,
    session: ctx.session
  });
});

// 设置个人信息

router.post('/setting', koaBody(), async ctx => {
  console.log(ctx.request.body);
  var set = {
    name: ctx.request.body.name,
    Email: ctx.request.body.Email,
    weibo: ctx.request.body.weibo,
    web: ctx.request.body.web,
    city: ctx.request.body.city,
    sign: ctx.request.body.sign,
    GitHub: ctx.request.body.GitHub
  };
  console.log(set);
  var Id = ctx.session.id;
  var user = await User.findById(Id);
  await user.update(set);

  // 更新session

  ctx.session = {
    id: Id,
    name: user.name,
    Email: user.Email,
    weibo: user.weibo,
    web: user.web,
    city: user.city,
    sign: user.sign,
    GitHub: user.GitHub
  };

  console.log(ctx.session);

  ctx.body = {
    sign: set.sign
  };
});

// 更改密码

router.post('/setting/pass', koaBody(), async ctx => {
  var pass = {
    oldpass: ctx.request.body.oldpass,
    newpass: ctx.request.body.newpass
  };
  var Id = ctx.session.id;
  await User.findById(Id).then(user => {
    console.log(user.password);
    if (user.password === pass.oldpass) {
      user.update({
        password: pass.newpass
      });
      ctx.body = {
        result: 'right'
      };
      console.log(ctx.body);
    } else if (user.password != pass.oldpass) {
      ctx.body = {
        result: 'error'
      };
      console.log(ctx.body);
    }
  });
});

// 个人主页
router.get('/user/:name', async ctx => {
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
});

// 个人创建话题页
router.get('/user/:name/topics', async ctx => {
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
});

// 个人参与话题页

router.get('/user/:name/replies', async ctx => {
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
});

module.exports = router;
