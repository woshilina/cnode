const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Message = sequelize.define('message', {
  targetId: { type: Sequelize.INTEGER, allowNULL: false }, //被回复人的id
  targetname:{type: Sequelize.STRING, allowNULL: false},//被回复人的名字
  replierId: { type: Sequelize.INTEGER, allowNULL: false }, //回复人的id
  replyname:{type: Sequelize.STRING, allowNULL: false},//回复人的名字
  topicId: { type: Sequelize.INTEGER, allowNULL: false }, //话题ID
  title: { type: Sequelize.STRING, allowNULL: false }, //标题名
  replyId: { type: Sequelize.INTEGER, allowNULL: false }, //评论id
  content: { type: Sequelize.TEXT, allowNULL: false }, //回复内容
  isat:{type: Sequelize.BOOLEAN, allowNULL: false},//是否为对评论的回复
  hasRead: { type: Sequelize.BOOLEAN, allowNULL: false, defaultValue: false } //是否被读取
});

module.exports = Message;
