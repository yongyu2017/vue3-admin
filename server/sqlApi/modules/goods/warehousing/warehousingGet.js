const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

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

        const sql_1 = await db.connect('SELECT * FROM goods_detail WHERE state=1 and id=?', [id])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        res.send({
            code: 200,
            data: sql_1.res[0],
            msg: '',
        })
    }
}
