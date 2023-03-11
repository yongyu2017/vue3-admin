const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')
const moment = require('moment')

// 新增或修改商品类型
module.exports = {
    path: '/goods/goodsWarehousing/addOrModify',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id, code, name, parentId } = req['body'];
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const currentTime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
            let menuFileData = null
            if (id) {
                menuFileData = (await db.connect('UPDATE goods_detail SET code=?,name=?,parentId=?,updateTime=? WHERE id=?', [code, name, parentId, currentTime, id]))[0]
            } else {
                menuFileData = (await db.connect('insert into goods_detail (code, name, parentId, sale, state, createTime, updateTime) values (?,?,?,?,?,?,?)', [code, name, parentId, 0, 1, currentTime, currentTime]))[0]
            }

            if (menuFileData.err) {
                res.send(statusCodeMap['-1'])
                return
            }
            res.send({
                code: 200,
                data: {},
                msg: '操作成功！',
            })
        }else{
            res.send(statusCodeMap['401'])
        }
    }
}