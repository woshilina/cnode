const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Message = sequelize.define('message', {
  targetId: { type: Sequelize.INTEGER, allowNULL: false }, //被回复人的id
  replierId: { type: Sequelize.INTEGER, allowNULL: false }, //回复人的id
  topicId: { type: Sequelize.INTEGER, allowNULL: false }, //话题ID
  replyId: { type: Sequelize.INTEGER, allowNULL: false }, //评论id
  content: { type: Sequelize.TEXT, allowNULL: false }, //回复内容
  hasRead: { type: Sequelize.BOOLEAN, allowNULL: false, defaultValue: false } //是否被读取
});

module.exports = Message;
