//导入ORM框架sequelize，即数据库操作模块
const Sequelize = require('sequelize');
//导入数据库配置文件
const config = require('./config');
//创建数据库连接
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.sync();

console.warn('87687');
 
module.exports = sequelize;
