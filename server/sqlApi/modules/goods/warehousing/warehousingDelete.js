const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 删除商品入库信息
module.exports = {
    path: '/goods/goodsWarehousing/delete',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const menuFileData = (await db.connect('UPDATE goods_detail SET state=? WHERE id=?', [0, id]))
            if (menuFileData.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            res.send({
                code: 200,
                data: menuFileData.res[0],
                msg: '',
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}
