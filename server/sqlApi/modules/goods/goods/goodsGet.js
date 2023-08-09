const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

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

        const sql_1 = await db.connect('SELECT * FROM goods WHERE state=1 and id=?', [id])
        if (sql_1.err || sql_1.res.length == 0) {
            res.send(statusCodeMap['-1'])
            return
        }
        sql_1.res[0].img = setCompleteAddress(sql_1.res[0].img)

        res.send({
            code: 200,
            data: sql_1.res[0],
            msg: '',
        })
    }
}
