const { Sequelize, sequelize } = require('../databaseInit.js')

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    account: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    pwd: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    role: {
        type: Sequelize.INTEGER,
        allowNull: true,
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

module.exports = User
