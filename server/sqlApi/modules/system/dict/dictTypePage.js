const { getFileData, setFileData, findParentNode, findChildNode, getMax, generateToken, verifyToken } = require('#root/utils/index.js')
const statusCodeMap = require('#root/utils/statusCodeMap.js')
const db = require('#root/db/index.js')

// 获取用户列表
module.exports = {
    path: '/system/dict-type/page',
    fn: async function (req, res) {
        const { token } = req.headers
        const { name, type, pageIndex, pageSize } = req['body'];
        const tokenInfo = await verifyToken(token)
        const start = (pageIndex - 1) * pageSize

        if(tokenInfo){
            const menuFileData = (await db.connect("SELECT * FROM dict_type WHERE state=1 AND name like '%"+ name + "%' ORDER BY id DESC limit ?,?", [start, pageSize]))[0]
            const sum = (await db.connect("SELECT COUNT(*) as total FROM dict_type WHERE state=1 AND name like '%"+ name + "%'", []))[0].res[0].total

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
