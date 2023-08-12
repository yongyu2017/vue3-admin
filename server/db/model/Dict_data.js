const { Sequelize, sequelize } = require('../databaseInit.js')

const Dict_data = sequelize.define('Dict_data', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    dictType: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    label: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    value: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    sort: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    des: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    status: {
        type: Sequelize.INTEGER,
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

module.exports = Dict_data
