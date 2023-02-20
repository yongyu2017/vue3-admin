const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取商品信息
module.exports = {
    path: '/goods/goods/detail',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const menuFileData = (await db.connect('SELECT * FROM goods WHERE state=1 and id=?', [id]))[0]
            if (menuFileData.err || menuFileData.res.length == 0) {
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