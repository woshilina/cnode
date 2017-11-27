const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Like = sequelize.define('like', {
  replyId: { type: Sequelize.INTEGER, allowNULL: false },//回复ID
  nameId: { type: Sequelize.INTEGER, allownNULL: false },//点赞人id--
});

module.exports = Like;