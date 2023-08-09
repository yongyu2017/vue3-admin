const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取菜单列表
module.exports = {
    path: '/user/nav',
    fn: async function (req, res) {
        const { token } = req.headers
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await db.connect('SELECT * FROM menu WHERE state=1 ORDER BY orderNum ASC', [])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        res.send({
            code: 200,
            data: {
                menuList: sql_1.res
            },
            msg: '',
        })
    }
}
