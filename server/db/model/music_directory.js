const { Sequelize, sequelize } = require('../databaseInit.js')

const music_directory = sequelize.define('music_directory', {
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
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    sort: {
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

module.exports = music_directory