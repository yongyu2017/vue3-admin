// 引入sequelize
const { Sequelize } = require('sequelize')
const { config } = require('./index.js')

/**
 * @param 数据库名称
 * @param 用户名
 * @param 密码
 */
const sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    port: config.port,
    timezone: config.timezone, //东八时区
    dialect: 'mysql',
    define: {
        timestamps: false, // 不要默认时间戳 数据库没有时间戳字段时，设置为false，否则报错  SequelizeDatabaseError: Unknown column 'createdAt' in 'field list'
        freezeTableName: true,
    },
    logging: function(sql) {
        // logger为log4js的Logger实例
        console.log(sql)
    },
})

module.exports = { Sequelize, sequelize } // 导出Sequelize模块和sequelize实例，这是sequelize官方推荐的命名方式
