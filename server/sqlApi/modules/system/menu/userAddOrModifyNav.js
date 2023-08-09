const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 新增或修改菜单
module.exports = {
    path: '/user/addOrModifyNav',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum, status, visible, keepAlive } = req['body'];
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        let sql_1 = ''

        if (id) {
            sql_1 = await db.connect('UPDATE menu SET menuName=?,parentId=?,jumpUrl=?,roleUrl=?,type=?,icon=?,orderNum=?,status=?,visible=?,keepAlive=?,updateTime=? WHERE id=?', [menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum, status, visible, keepAlive, currentTime, id])

        } else {
            sql_1 = await db.connect('insert into menu (menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum, status, visible, keepAlive, state, createTime, updateTime) values (?,?,?,?,?,?,?,?,?,?,?,?,?)', [menuName, parentId, jumpUrl, roleUrl, type, icon, orderNum, status, visible, keepAlive, 1, currentTime, currentTime])
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
