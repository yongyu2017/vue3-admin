const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 商品出入库
module.exports = {
    path: '/goods/warehousing/sale',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, sale } = req['body']
        const tokenInfo = await verifyToken(token)

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        const sql_1 = await db.connect('UPDATE goods_detail SET sale=? WHERE id=?', [sale, id])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }

        const sql_2 = await db.connect('SELECT * FROM goods_detail WHERE state=1 and id=?', [id])
        if (sql_2.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        const originalData = sql_2.res[0]

        let sql_3 = ''
        if (sale == 1) {
            sql_3 = await db.connect('UPDATE goods_stock SET count=count-1,updateTime=? WHERE goodsId=?', [currentTime, originalData.parentId])
        } else {
            sql_3 = await db.connect('UPDATE goods_stock SET count=count+1,updateTime=? WHERE goodsId=?', [currentTime, originalData.parentId])
        }
        if (sql_3.err) {
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
