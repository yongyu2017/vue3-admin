const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 删除角色信息
module.exports = {
    path: '/user/deleteRole',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        try {
            const sql_1 = await db.connect('UPDATE role SET state=? WHERE id=?', [0, id])
            if (sql_1.err) {
                res.send(statusCodeMap['-1'])
                return
            }

            const sql_2 = await db.connect('SELECT id FROM user WHERE role=?', [id])
            if (sql_2.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            const ids = sql_2.res.map((value) => value.id).join(',')

            const sql_3 = await db.connect('UPDATE user SET role=NULL WHERE id IN (?)', [ids])
            if (sql_3.err) {
                res.send(statusCodeMap['-1'])
                return
            }

            res.send({
                code: 200,
                data: '',
                msg: '',
            })
        } catch (e) {
            res.send(statusCodeMap['-1'])
        }
    }
}
