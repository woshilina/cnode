//引入数据库的模板
const Topic = require('../database/models/topic');
const Reply = require('../database/models/reply');
const User = require('../database/models/user');
const Message = require('../database/models/message');
const moment = require('moment');
const sequelize = require('../database/sequelize');
moment().format();
moment.locale('zh-cn');

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

// 登陆首页函数
const homepage = async ctx => {
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

  // 无人回复的话题
  var noreplytopics = await Topic.findAndCountAll({ where: { replies: 0 } });
  var noreplycount = noreplytopics.count;
  var allnoreplytopics = noreplytopics.rows;
  var noreplytopics = [];
  if (noreplycount > 5) {
    for (var i = 0; i < 5; i++) {
      noreplytopics.push(allnoreplytopics[i]);
    }
  } else {
    noreplytopics = allnoreplytopics;
  }
  await ctx.render('/main', {
    newcount: newcount,
    session: ctx.session,
    tops: tops,
    usercount: usercount,
    topics: AllRow,
    noreplytopics: noreplytopics,
    noreplycount: noreplycount
  });
};

//设置首页分页按钮函数
const homeallpage = async ctx => {
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
};

// 导航栏点击获取函数
const hometabpage = async ctx => {
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
};

//积分榜页函数
const usertop = async ctx => {
  //查询未读消息数量
  if (ctx.session.id) {
    let news = await Message.findAndCountAll({
      where: { targetId: ctx.session.id, hasRead: 0 }
    });
    var newcount = news.count;
  }

  // 积分榜
  let users = await User.findAndCountAll({
    order: [[sequelize.literal('integral DESC')]]
  });
  let rows = users.rows;
  let usercount = users.count;
  let topcount;
  let tops = [];
  if (usercount > 100) {
    for (var i = 0; i < 100; i++) {
      tops.push(rows[i]);
    }
    topcount = 100;
  } else {
    tops = rows;
    topcount = usercount;
  }

  await ctx.render('./top', {
    session: ctx.session,
    newcount: newcount,
    topcount: topcount,
    tops: tops
  });
};

module.exports = {
  homepage,
  homeallpage,
  hometabpage,
  usertop
};
