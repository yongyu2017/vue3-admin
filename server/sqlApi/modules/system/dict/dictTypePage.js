const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获得字典类型的分页列表
module.exports = {
    path: '/system/dict-type/page',
    fn: async function (req, res) {
        const { token } = req.headers
        const { name, type, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = (pageIndex - 1) * pageSize

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await db.connect("SELECT * FROM dict_type WHERE state=1 AND name like '%"+ name + "%' AND type like '%"+ type + "%' ORDER BY id DESC limit ?,?", [start, pageSize])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        const sql_2 = await db.connect("SELECT COUNT(*) as total FROM dict_type WHERE state=1 AND name like '%"+ name + "%' AND type like '%"+ type + "%'", [])
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
