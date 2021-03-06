const sequelize = require('../sequelize');
const Sequelize = require('sequelize');

const Topic = sequelize.define('topic', {
  //  id: { type: Sequelize.INTEGER, allowNULL: false,primaryKey: true, },//标题ID
  title: {
    type: Sequelize.STRING,
    allowNULL: false
  }, //标题
  userid: {
    type: Sequelize.STRING,
    allownNULL: false
  }, //作者ID
  username: {
    type: Sequelize.STRING,
    allowNull: false
  }, //作者用户名
  headImgURL: {
    type: Sequelize.STRING,
    allowNULL: false,
    defaultValue: "/images/2081487.jpg"
  }, //头像
  //releasetime: { type: Sequelize.DateONLY, allowNull: false },//发布时间
  lastreplyURL:{
    type: Sequelize.STRING,
    allowNULL: true,
  },//最后回复人的头像url
  lastreplytime: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.now
  }, //最后回复时间
  lastreplyfromnow: {
    type: Sequelize.STRING,
    allowNULL: true
  }, //最后回复距现在的时间
  tabValue: {
    type: Sequelize.STRING,
    allowNULL: false
  }, //标签（置顶？精华？问答？...）
  text: {
    type: Sequelize.TEXT,
    allowNULL: false
  }, //正文
  clicks: {
    type: Sequelize.INTEGER,
    allowNULL: false,
    defaultValue: 0
  }, //点击数
  replies: {
    type: Sequelize.INTEGER,
    allowNULL: false,
    defaultValue: 0
  }, //回复数

});

module.exports = Topic;