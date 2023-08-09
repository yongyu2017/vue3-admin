const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

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

        const sql_1 = await db.connect("select id,name from goods WHERE state=1", [])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        res.send({
            code: 200,
            data: {
                list: sql_1.res,
            },
            msg: '',
        })
    }
}
