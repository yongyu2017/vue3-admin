const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取商品类型列表
module.exports = {
    path: '/goods/category/list',
    fn: async function (req, res) {
        const { token } = req.headers
        const { name, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = pageSize ? (pageIndex - 1) * pageSize : 0

        if(tokenInfo){
            let menuFileData = null
            if (pageSize) {
                menuFileData = (await db.connect("SELECT * FROM category WHERE state=1 AND name like '%"+ name + "%' ORDER BY id DESC limit ?,?", [start, pageSize]))[0]
            } else {
               menuFileData = (await db.connect("SELECT * FROM category WHERE state=1 AND name like '%"+ name + "%' ORDER BY id DESC", []))[0]
            }
            const sum = (await db.connect("SELECT COUNT(*) as total FROM category WHERE state=1 AND name like '%"+ name + "%'", []))[0].res[0].total

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