const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 修改字典数据
module.exports = {
    path: '/system/dict-data/update',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, dictType, label, value, sort, status, remark } = req['body'];
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        const sql_1 = await db.connect('SELECT COUNT(*) as total FROM dict_data WHERE value=? AND dictType=?', [value, dictType])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        if (sql_1.res[0].total > 0) {
            res.send({
                code: -1,
                data: {},
                msg: '已经存在该值的字典数据！',
            })
            return
        }

        let sql_2 = ''
        if (id) {
            sql_2 = await db.connect('UPDATE dict_data SET dictType=?,label=?,value=?,sort=?,status=?,des=?,updateTime=? WHERE id=?', [dictType, label, value, sort, status, remark, currentTime, id])

        } else {
            sql_2 = await db.connect('insert into dict_data (dictType, label, value, sort, status, des, state, createTime, updateTime) values (?,?,?,?,?,?,?,?,?)', [dictType, label, value, sort, status, remark, 1, currentTime, currentTime])
        }
        if (sql_2.err) {
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
