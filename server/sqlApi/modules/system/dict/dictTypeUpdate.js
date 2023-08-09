const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 修改字典类型
module.exports = {
    path: '/system/dict-type/update',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, name, type, status, remark } = req['body'];
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        let sql_1 = ''

        if (id) {
            sql_1 = await db.connect('UPDATE dict_type SET name=?,type=?,status=?,des=?,updateTime=? WHERE id=?', [name, type, status, remark, currentTime, id])
        } else {
            sql_1 = await db.connect('insert into dict_type (name, type, status, des, state, createTime, updateTime) values (?,?,?,?,?,?,?)', [name, type, status, remark, 1, currentTime, currentTime])
        }
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        res.send({
            code: 200,
            data: '',
            msg: '操作成功！',
        })
    }
}
