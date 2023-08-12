const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')
const Goods_detail = require('#root/db/model/Goods_detail.js')
const Goods_stock = require('#root/db/model/Goods_stock.js')
const { sequelize } = require('#root/db/databaseInit.js')
const { Op, literal  } = require("sequelize")

// 删除商品入库信息
module.exports = {
    path: '/goods/warehousing/delete',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, parentId } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        // 开启事务
        const t = await sequelize.transaction()
        try {
            await Goods_detail.update(
                {
                    state: 0,
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
                    count: literal('count-1'),
                    updateTime: currentTime,
                },
                {
                    where: {
                        goodsId: parentId,
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
            res.send({
                code: -1,
                data: '',
                msg: err.original.sqlMessage,
            })
        }
    }
}
