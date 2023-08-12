const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Category = require('#root/db/model/category.js')
const Goods = require('#root/db/model/goods.js')
const { sequelize } = require('#root/db/databaseInit.js')
const { Op } = require("sequelize")

// 删除商品类型
module.exports = {
    path: '/goods/category/delete',
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
            const sql_1 = await Category.update(
                {
                    state: 0,
                },
                {
                    where: {
                        id,
                    },
                    transaction: t
                },
            )

            const sql_2 = await Goods.findAll({
                attributes: ['id'],
                where: {
                    state: 1,
                    category: id,
                },
                transaction: t
            })

            const ids = sql_2.map((value) => value.id)
            const sql_3 = await Goods.update(
                {
                    category: null,
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
            res.send(statusCodeMap['-1'])
        }
    }
}
