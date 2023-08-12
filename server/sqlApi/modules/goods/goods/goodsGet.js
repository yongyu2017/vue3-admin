const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Goods = require('#root/db/model/goods.js')
const { Op } = require("sequelize")

// 获取商品信息
module.exports = {
    path: '/goods/goods/get',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await Goods.findOne({
            where: {
                state: 1,
                id,
            },
        })
        sql_1.img = setCompleteAddress(sql_1.img)

        res.send({
            code: 200,
            data: sql_1,
            msg: '',
        })
    }
}
