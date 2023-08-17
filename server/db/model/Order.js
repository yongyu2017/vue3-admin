const { Sequelize, sequelize } = require('../databaseInit.js')

const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    orderNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    goodsId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    orderAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    payStatus: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    payTime: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    cancelTime: {
        type: Sequelize.DATE,
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

module.exports = Order
