const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Goods = require('#root/db/model/goods.js')
const { Op } = require("sequelize")

// 获取所有商品
module.exports = {
    path: '/goods/goods/listAll',
    fn: async function (req, res) {
        const { token } = req.headers
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await Goods.findAndCountAll({
            attributes: ['id', 'name'],
            where: {
                state: 1,
            },
        })

        res.send({
            code: 200,
            data: {
                list: sql_1.rows,
            },
            msg: '',
        })
    }
}
