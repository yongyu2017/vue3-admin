const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 删除商品入库信息
module.exports = {
    path: '/goods/warehousing/delete',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, parentId } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        const sql_1 = (await db.connect('UPDATE goods_detail SET state=? WHERE id=?', [0, id]))
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        const sql_2 = await db.connect('UPDATE goods_stock SET count=count-1,updateTime=? WHERE goodsId=?', [currentTime, parentId])
        if (sql_2.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        res.send({
            code: 200,
            data: sql_1.res[0],
            msg: '',
        })
    }
}
