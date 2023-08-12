const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Goods_detail = require('#root/db/model/Goods_detail.js')
const Goods_stock = require('#root/db/model/Goods_stock.js')
const { sequelize } = require('#root/db/databaseInit.js')
const { Op, literal  } = require("sequelize")

// 商品出入库
module.exports = {
    path: '/goods/warehousing/sale',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, sale } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        // 开启事务
        const t = await sequelize.transaction()
        try {
            const sql_1 = await Goods_detail.findOne(
                {
                    where: {
                        id,
                    },
                    transaction: t
                }
            )
            await Goods_detail.update(
                {
                    sale,
                    updateTime: currentTime,
                },
                {
                    where: {
                        id,
                    },
                    transaction: t
                }
            )

            await Goods_stock.update(
                {
                    count: literal(sale == 1 ? 'count-1' : 'count+1'),
                    updateTime: currentTime,
                },
                {
                    where: {
                        goodsId: sql_1.parentId,
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