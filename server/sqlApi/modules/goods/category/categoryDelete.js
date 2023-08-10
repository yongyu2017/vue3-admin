const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 删除商品类型
module.exports = {
    path: '/goods/category/delete',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = (await db.connect('UPDATE category SET state=? WHERE id=?', [0, id]))
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        const sql_2 = await db.connect('SELECT id FROM goods WHERE category=?', [id])
        if (sql_2.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        const ids = sql_2.res.map((value) => value.id)
        let sql_str = 'UPDATE goods SET category=NULL WHERE id IN ('
        ids.forEach((value, index) => {
            sql_str += (index == 0 ? '' : ',') + value
        })
        sql_str += ')'
        const sql_3 = await db.connect(sql_str, [ids])
        if (sql_3.err) {
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
