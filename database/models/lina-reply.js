const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Reply = sequelize.define('reply', {
  topicId: { type: Sequelize.INTEGER, allowNULL: false }, //标题ID
  userId:{ type: Sequelize.INTEGER, allowNULL: false },//回复人的id
  name: { type: Sequelize.STRING, allownNULL: false }, //回复人--
  replytime: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.now
  }, //回复时间
  replyfromnow: { type: Sequelize.STRING, allowNull: true }, //回复距离现在的时间
  content: { type: Sequelize.TEXT, allowNULL: false }, //回复内容
  likes: { type: Sequelize.INTEGER, allowNULL: false, defaultValue: 0 } //点赞数
});

module.exports = Reply;
