const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取商品入库列表
module.exports = {
    path: '/goods/warehousing/page',
    fn: async function (req, res) {
        const { token } = req.headers
        const { name, parentId, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = pageSize ? (pageIndex - 1) * pageSize : 0

        if(tokenInfo){
            let menuFileData = null
            if (pageSize) {
                const sql = "SELECT * FROM goods_detail WHERE state=1" + (parentId ? " AND parentId=" + parentId : "") + " AND name like '%" + name + "%'"
                menuFileData = (await db.connect(sql + " ORDER BY id DESC limit ?,?", [start, pageSize]))
            } else {
               menuFileData = (await db.connect("SELECT * FROM goods_detail WHERE state=1 ORDER BY id DESC", []))
            }
            const sum = (await db.connect("SELECT COUNT(*) as total FROM goods_detail WHERE state=1" + (parentId ? " AND parentId=" + parentId : "") + " AND name like '%" + name + "%'", [])).res[0].total

            if (menuFileData.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            res.send({
                code: 200,
                data: {
                    list: menuFileData.res,
                    sum
                },
                msg: '',
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}
