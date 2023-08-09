const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

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

        const sql_1 = await db.connect('UPDATE goods SET state=? WHERE id=?', [0, id])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        res.send({
            code: 200,
            data: '',
            msg: '',
        })
    }
}
