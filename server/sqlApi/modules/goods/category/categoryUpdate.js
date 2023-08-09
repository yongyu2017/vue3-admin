const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 新增或修改商品类型
module.exports = {
    path: '/goods/category/update',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, name, des } = req['body'];
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        let sql_1 = ''
        if (id) {
            sql_1 = (await db.connect('UPDATE category SET name=?,des=?,updateTime=? WHERE id=?', [name, des, currentTime, id]))
        } else {
            sql_1 = (await db.connect('insert into category (name, des, state, createTime, updateTime) values (?,?,?,?,?)', [name, des, 1, currentTime, currentTime]))
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
