const { Sequelize, sequelize } = require('../databaseInit.js')

const Role = sequelize.define('role', {
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
    permission: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    state: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    des: {
        type: Sequelize.STRING,
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

module.exports = Role
