const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取当前用户信息
module.exports = {
    path: '/user/getUserInfo',
    fn: async function (req, res) {
        const { token } = req.headers;
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await db.connect('SELECT * FROM user WHERE state=1 and id=?', [tokenInfo.id])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        const { id, account, email, role } = sql_1.res[0]

        const sql_2 = await db.connect('SELECT * FROM role WHERE state=1 and id=?', [role])
        if (sql_2.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        const roleInfo = sql_2.res[0]
        const roleIds = roleInfo.permission ? roleInfo.permission.split(',') : []

        const sql_3 = await db.connect(`SELECT * FROM menu WHERE state=1 and type=2`, [])
        if (sql_3.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        const menuList = sql_3.res
        const permission = []
        menuList.forEach((value) => {
            if (roleIds.includes(value.id + '') && value.roleUrl) {
                permission.push(value.roleUrl)
            }
        })

        res.send({
            code: 200,
            data: {
                id,
                account,
                email,
                permission,
            },
            msg: '',
        })
    }
}
