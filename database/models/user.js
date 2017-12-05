//引入数据库连接
const sequelize = require('../sequelize');
//引入orm框架，即数据库操作模块
const Sequelize = require('sequelize');
//创建数据库模块
const User = sequelize.define('user', {
  name: { type: Sequelize.STRING, allowNULL: false }, //用户名
  password: { type: Sequelize.STRING, allowNULL: true }, //密码
  //noreadmsgcount:{type: Sequelize.INTEGER, allowNULL: false, defaultValue: 0},//未读消息数
  // HeadPortriait: { type: Sequelize.BLOB, allowNULL: true },//头像
  integral: { type: Sequelize.INTEGER, allowNULL: false, defaultValue: 0 }, //积分
  TopicCloNum: { type: Sequelize.INTEGER, allowNULL: false, defaultValue: 0 }, //话题收藏个数
  Email: { type: Sequelize.STRING, allowNULL: true },
  city: { type: Sequelize.STRING, allowNULL: true },
  sign: { type: Sequelize.STRING, allowNULL: true },
  web: { type: Sequelize.STRING, allowNULL: true },
  weibo: { type: Sequelize.STRING, allowNULL: true },
  GitHub: { type: Sequelize.STRING, allowNULL: true }, //GitHub 链接
  signfromnow: { type: Sequelize.STRING, allowNULL: false,defaultValue:Sequelize.now} //注册时间距现在的时间
});

module.exports = User;
