const { Sequelize, sequelize } = require('../databaseInit.js')

const Goods_stock = sequelize.define('goods_stock', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    goodsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    count: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    state: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    createTime: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    updateTime: {
        type: Sequelize.DATE,
        allowNull: false,
    },
})

module.exports = Goods_stock
