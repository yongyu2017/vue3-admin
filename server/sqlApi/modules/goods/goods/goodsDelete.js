const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const Goods = require('#root/db/model/goods.js')
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

        await Goods.update(
            {
                state: 0,
            },
            {
                where: {
                    id,
                },
            }
        )

        res.send({
            code: 200,
            data: '',
            msg: '',
        })
    }
}
