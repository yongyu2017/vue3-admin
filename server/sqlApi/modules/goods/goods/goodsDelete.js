const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Goods = require('#root/db/model/goods.js')
const Category = require('#root/db/model/category.js')
const Goods_detail = require('#root/db/model/Goods_detail.js')
const Goods_stock = require('#root/db/model/Goods_stock.js')
const { sequelize } = require('#root/db/databaseInit.js')
const { Op } = require("sequelize")

// 删除商品
module.exports = {
    path: '/goods/goods/delete',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        // 开启事务
        const t = await sequelize.transaction()
        try {
            await Goods.update(
                {
                    state: 0,
                },
                {
                    where: {
                        id,
                    },
                    transaction: t
                }
            )

            const sql_1 = await Goods_detail.findAll({
                attributes: ['id'],
                where: {
                    parentId: id,
                },
                transaction: t
            })

            const ids = sql_1.map((value) => value.id)
            await Goods_detail.update(
                {
                    parentId: null,
                },
                {
                    where: {
                        id: {
                            [Op.in]: ids,
                        },
                    },
                    transaction: t
                }
            )

            await Goods_stock.destroy({
                where: {
                    goodsId: id,
                },
                transaction: t
            })
            // 提交事务
            await t.commit()

            res.send({
                code: 200,
                data: '',
                msg: '',
            })
        } catch (err) {
            // 回滚事务
            await t.rollback()
            res.send({
                code: -1,
                data: '',
                msg: err.original.sqlMessage,
            })
        }
    }
}
