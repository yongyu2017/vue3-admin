const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 新增或修改商品类型
module.exports = {
    path: '/goods/warehousing/update',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, code, name, parentId } = req['body'];
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        let sql_1 = ''
        if (id) {
            sql_1 = await db.connect('UPDATE goods_detail SET code=?,name=?,parentId=?,updateTime=? WHERE id=?', [code, name, parentId, currentTime, id])
        } else {
            sql_1 = await db.connect('insert into goods_detail (code, name, parentId, sale, state, createTime, updateTime) values (?,?,?,?,?,?,?)', [code, name, parentId, 0, 1, currentTime, currentTime])
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
