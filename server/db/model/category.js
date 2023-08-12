const { Sequelize, sequelize } = require('../databaseInit.js')

const Category = sequelize.define('category', {
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

module.exports = Category
