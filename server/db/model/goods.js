const { Sequelize, sequelize } = require('../databaseInit.js')

const Goods = sequelize.define('goods', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    category: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    img: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    des: {
        type: Sequelize.STRING,
        allowNull: true,
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

module.exports = Goods
