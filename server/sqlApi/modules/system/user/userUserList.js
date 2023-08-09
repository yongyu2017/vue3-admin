const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取用户列表
module.exports = {
    path: '/user/userList',
    fn: async function (req, res) {
        const { token } = req.headers
        const { name, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = (pageIndex - 1) * pageSize

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await db.connect("SELECT * FROM user WHERE state=1 AND account like '%"+ name + "%' ORDER BY id DESC limit ?,?", [start, pageSize])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        const sql_2 = await db.connect("SELECT COUNT(*) as total FROM user WHERE state=1 AND account like '%"+ name + "%'", [])
        if (sql_2.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        res.send({
            code: 200,
            data: {
                list: sql_1.res,
                sum: sql_2.res[0].total
            },
            msg: '',
        })
    }
}
