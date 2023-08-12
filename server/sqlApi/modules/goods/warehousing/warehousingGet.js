const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Goods_detail = require('#root/db/model/Goods_detail.js')
const { Op } = require("sequelize")

// 获取商品入库信息
module.exports = {
    path: '/goods/warehousing/get',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await Goods_detail.findOne({
            where: {
                id,
            },
        })

        res.send({
            code: 200,
            data: sql_1,
            msg: '',
        })
    }
}
