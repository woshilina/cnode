//引入数据库的模板
 
const Message = require('../database/models/message');
const sequelize = require('../database/sequelize');
 
//未读消息页函数
const mymessage=async ctx => {
  var userid = ctx.session.id;

  //新消息按时间倒序
  let news = await Message.findAndCountAll({
    where: { targetId: userid, hasRead: 0 },
    order: [[sequelize.literal('createdAt DESC')]]
  });
  var newmsgs = news.rows;
  var newcount = news.count;

  //过往消息按时间倒序
  let olds = await Message.findAndCountAll({
    where: { targetId: userid, hasRead: 1 },
    order: [[sequelize.literal('createdAt DESC')]]
  });
  var oldmsgs = olds.rows;
  var oldcount = olds.count;

  await ctx.render('./message', {
    session: ctx.session,
    newmsgs: newmsgs,
    newcount: newcount,
    oldcount: oldcount,
    oldmsgs: oldmsgs
  });
};

module.exports=mymessage;