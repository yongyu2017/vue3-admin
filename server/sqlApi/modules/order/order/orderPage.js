const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Order = require('#root/db/model/Order.js')
const { Op } = require("sequelize")

// 获取商品列表
module.exports = {
    path: '/order/order/page',
    fn: async function (req, res) {
        const { token } = req.headers
        const { pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = pageSize ? (pageIndex - 1) * pageSize : 0

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await Order.findAndCountAll({
                where: {
                    state: 1,
                },
                order: [
                    ['id', 'DESC'],
                ],
                offset: start,
                limit: pageSize,
            })

            res.send({
                code: 200,
                data: {
                    list: sql_1.rows,
                    sum: sql_1.count,
                },
                msg: '',
            })
        } catch (err) {
            res.send({
                code: -1,
                data: '',
                msg: JSON.stringify(err),
            })
        }
    }
}
