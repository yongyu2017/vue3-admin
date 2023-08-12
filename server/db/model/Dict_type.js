const { Sequelize, sequelize } = require('../databaseInit.js')

const Dict_type = sequelize.define('dict_type', {
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
    type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    des: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.INTEGER,
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

module.exports = Dict_type
