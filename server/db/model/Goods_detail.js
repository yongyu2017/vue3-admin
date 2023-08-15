const { Sequelize, sequelize } = require('../databaseInit.js')

const Goods_detail = sequelize.define('goods_detail', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    parentId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    sale: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    state: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    costPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
    },
    salePrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
    },
    saleTime: {
        type: Sequelize.DATE,
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

module.exports = Goods_detail
