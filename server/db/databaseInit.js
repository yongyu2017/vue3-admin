// 引入sequelize
const { Sequelize } = require('sequelize')
const { config } = require('./index.js')
const { sqlLogger } = require('#root/utils/logger.js')

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
        console.log('logging=', sql)
        // return sqlLogger.debug(sql)
    },
    /** node.js - SequlizeJS 连接频繁超时 **/
    pool: {
        max: 20, // 指定池的最大连接数
        min: 0, // 指定池的最小连接数
        acquire: 60 * 1000, // 指定请求连接的最长等待时间（毫秒）
        idle: 10 * 1000, // 指定连接空闲的最长时间（毫秒）
        evict: 0,
    }
    /** node.js - SequlizeJS 连接频繁超时 **/
})

module.exports = { Sequelize, sequelize } // 导出Sequelize模块和sequelize实例，这是sequelize官方推荐的命名方式
