const { Sequelize, sequelize } = require('../databaseInit.js')

const Music_library_sq = sequelize.define('music_library', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    label: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    fileid: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    lrc: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    state: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    sort: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    duration: {
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

module.exports = Music_library_sq
