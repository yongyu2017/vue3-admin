const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken, setCompleteAddress } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取商品列表
module.exports = {
    path: '/goods/goods/page',
    fn: async function (req, res) {
        const { token } = req.headers
        const { name, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = pageSize ? (pageIndex - 1) * pageSize : 0

        if (!tokenInfo) {
            res.send(statusCodeMap['401'])
            return
        }

        const sql_1 = await db.connect("select goods.id,goods.name,goods.category,goods.img,goods.des,goods_stock.count,goods.createTime,goods.updateTime from goods left join goods_stock on goods_stock.goodsId = goods.id WHERE goods.state=1 AND goods.name like '%"+ name + "%' ORDER BY id DESC limit ?,?", [start, pageSize])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        const sql_2 = await db.connect("SELECT COUNT(*) as total FROM goods WHERE state=1 AND name like '%"+ name + "%'", [])
        if (sql_1.err) {
            res.send(statusCodeMap['-1'])
            return
        }
        sql_1.res.forEach((value) => {
            value.img = setCompleteAddress(value.img)
        })

        res.send({
            code: 200,
            data: {
                list: sql_1.res,
                sum: sql_2.res[0].total,
            },
            msg: '',
        })
    }
}
