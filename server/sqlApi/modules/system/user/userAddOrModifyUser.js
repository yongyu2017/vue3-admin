const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 新增或修改菜单
module.exports = {
    path: '/user/addOrModifyUser',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, account, des, role, email, pwd, username } = req['body'];
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }


        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        let sql_1 = ''

        if (id) {
            sql_1 = await db.connect('UPDATE user SET account=?,des=?,role=?,email=?,pwd=?,username=?,updateTime=? WHERE id=?', [account, des, role, email, pwd, username, currentTime, id])

        } else {
            sql_1 = await db.connect('insert into user (account, des, role, email, pwd, username, state, createTime, updateTime) values (?,?,?,?,?,?,?,?,?)', [account, des, role, email, pwd, username, 1, currentTime, currentTime])
        }
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        res.send({
            code: 200,
            data: {},
            msg: '操作成功！',
        })
    }
}
