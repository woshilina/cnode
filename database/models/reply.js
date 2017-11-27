const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Reply = sequelize.define('reply', {
  topicId: { type: Sequelize.INTEGER, allowNULL: false },//标题ID
  name: { type: Sequelize.STRING, allownNULL: false },//回复人--
  //replaytime: { type: Sequelize.Date, allowNull: false },//回复时间 
  content: { type: Sequelize.TEXT, allowNULL: false },//回复内容
  likes: { type: Sequelize.INTEGER, allowNULL: false,defaultValue:0},//点赞数

});

module.exports = Reply;