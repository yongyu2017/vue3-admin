const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, menuToTreeMenu } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 删除菜单
module.exports = {
    path: '/user/deleteNav',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await db.connect(`SELECT * FROM menu WHERE state=1 ORDER BY orderNum ASC`, [])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        const menuList = sql_1.res
        const menuTree = menuToTreeMenu(menuList)
        const childList = findChildNode(id, menuTree)
        if (childList.length > 0) {
            res.send({
                code: -1,
                data: '',
                msg: '该数据下有其他选项，无法删除',
            })
            return
        }

        const sql_2 = await db.connect('UPDATE menu SET state=? WHERE id=?', [0, id])
        if (sql_2.err) {
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
