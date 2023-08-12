const { Sequelize, sequelize } = require('../databaseInit.js')

const Menu = sequelize.define('menu', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    parentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    menuName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    jumpUrl: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    roleUrl: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    type: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    icon: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    orderNum: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    state: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    keepAlive: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    visible: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

module.exports = Menu
