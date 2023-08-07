const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 删除字典数据
module.exports = {
    path: '/system/dict-data/delete',
    fn: async function (req, res) {
        const { token } = req.headers
        const { id } = req['body']
        const tokenInfo = await verifyToken(token)

        if(tokenInfo){
            const menuFileData = (await db.connect('UPDATE dict_data SET state=? WHERE id=?', [0, id]))[0]
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
